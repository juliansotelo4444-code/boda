import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

const TableSchema = z.object({
  number: z.number().int().min(0),
  name: z.string().min(1),
  capacity: z.number().int().min(1).default(10),
  shape: z.string().default('round'),
  color: z.string().optional().default('#67001A'),
  posX: z.number().default(0),
  posY: z.number().default(0),
});

// GET /api/tables (con invitados asignados)
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const tables = await prisma.table.findMany({
      include: {
        guests: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            rsvpStatus: true,
            plusOnesConfirmed: true,
            dietaryRestrictions: true,
          },
        },
      },
      orderBy: { number: 'asc' },
    });

    const formatted = tables.map((t) => {
      const occupiedSeats = t.guests.reduce((sum, g) => sum + 1 + g.plusOnesConfirmed, 0);
      return {
        ...t,
        occupiedSeats,
        isFull: occupiedSeats >= t.capacity,
      };
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar mesas' });
  }
});

// POST /api/tables
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = TableSchema.parse(req.body);
    const table = await prisma.table.create({ data });
    res.status(201).json(table);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten() });
      return;
    }
    res.status(500).json({ error: 'Error al crear mesa' });
  }
});

// PUT /api/tables/:id
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = TableSchema.partial().parse(req.body);

    const updated = await prisma.table.update({
      where: { id },
      data,
    });
    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten() });
      return;
    }
    res.status(500).json({ error: 'Error al actualizar mesa' });
  }
});

// PUT /api/tables/:id/position (Mover mesa en el plano 2D)
router.put('/:id/position', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { posX, posY } = z.object({ posX: z.number(), posY: z.number() }).parse(req.body);

    const updated = await prisma.table.update({
      where: { id },
      data: { posX, posY },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error al mover mesa' });
  }
});

// DELETE /api/tables/:id
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    // Desvincular invitados antes de borrar
    await prisma.guest.updateMany({
      where: { tableId: id },
      data: { tableId: null },
    });

    await prisma.table.delete({ where: { id } });
    res.json({ success: true, message: 'Mesa eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar mesa' });
  }
});

export default router;
