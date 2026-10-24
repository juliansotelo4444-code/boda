import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

const TimelineEventSchema = z.object({
  title: z.string().min(1, 'El título del evento es requerido'),
  startTime: z.string().min(1, 'La hora de inicio es requerida'),
  endTime: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  iconName: z.string().optional().default('Clock'),
  orderIndex: z.number().int().min(0).default(0),
  isPublic: z.boolean().default(true),
  description: z.string().optional().nullable(),
});

const ReorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
      orderIndex: z.number().int().min(0),
    })
  ),
});

// GET /api/timeline (Acceso público para los invitados y admin)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const isAdmin = req.headers.authorization?.startsWith('Bearer ');
    const events = await prisma.timelineEvent.findMany({
      where: isAdmin ? {} : { isPublic: true },
      orderBy: { orderIndex: 'asc' },
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cronograma' });
  }
});

// A partir de aquí, rutas protegidas de administración
router.use(authMiddleware);

// POST /api/timeline
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = TimelineEventSchema.parse(req.body);

    // Si no se pasó orderIndex, calcular el siguiente
    if (data.orderIndex === undefined || data.orderIndex === 0) {
      const last = await prisma.timelineEvent.findFirst({
        orderBy: { orderIndex: 'desc' },
      });
      data.orderIndex = (last?.orderIndex ?? -1) + 1;
    }

    const event = await prisma.timelineEvent.create({ data });
    res.status(201).json(event);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten() });
      return;
    }
    res.status(500).json({ error: 'Error al crear evento del cronograma' });
  }
});

// PUT /api/timeline/reorder (Manejo de Drag & Drop por lotes)
router.put('/reorder', async (req: Request, res: Response): Promise<void> => {
  try {
    const { items } = ReorderSchema.parse(req.body);

    await prisma.$transaction(
      items.map((item) =>
        prisma.timelineEvent.update({
          where: { id: item.id },
          data: { orderIndex: item.orderIndex },
        })
      )
    );

    res.json({ success: true, message: 'Cronograma reordenado exitosamente' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten() });
      return;
    }
    res.status(500).json({ error: 'Error al reordenar el cronograma' });
  }
});

// PUT /api/timeline/:id
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = TimelineEventSchema.partial().parse(req.body);

    const updated = await prisma.timelineEvent.update({
      where: { id },
      data,
    });
    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten() });
      return;
    }
    res.status(500).json({ error: 'Error al actualizar evento' });
  }
});

// DELETE /api/timeline/:id
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.timelineEvent.delete({ where: { id } });
    res.json({ success: true, message: 'Evento eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar evento' });
  }
});

export default router;
