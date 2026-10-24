import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET /api/story/milestones (Público)
router.get('/milestones', async (_req: Request, res: Response): Promise<void> => {
  try {
    const milestones = await prisma.storyMilestone.findMany({
      orderBy: { orderIndex: 'asc' },
    });
    res.json(milestones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la historia' });
  }
});

// GET /api/story/gallery (Público)
router.get('/gallery', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    const items = await prisma.galleryItem.findMany({
      where: category && typeof category === 'string' ? { category } : {},
      orderBy: { orderIndex: 'asc' },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener galería' });
  }
});

// -------------------------------------------------------------
// RUTAS ADMINISTRADOR PROTEGIDAS
// -------------------------------------------------------------
router.use(authMiddleware);

const MilestoneSchema = z.object({
  dateOrYear: z.string().min(1),
  title: z.string().min(1),
  narrative: z.string().min(1),
  imageUrl: z.string().optional().nullable(),
  orderIndex: z.number().int().min(0).default(0),
});

router.post('/milestones', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = MilestoneSchema.parse(req.body);
    const milestone = await prisma.storyMilestone.create({ data });
    res.status(201).json(milestone);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten() });
      return;
    }
    res.status(500).json({ error: 'Error al crear hito de la historia' });
  }
});

router.put('/milestones/reorder', async (req: Request, res: Response): Promise<void> => {
  try {
    const { items } = z
      .object({
        items: z.array(z.object({ id: z.string().uuid(), orderIndex: z.number().int().min(0) })),
      })
      .parse(req.body);

    await prisma.$transaction(
      items.map((item) =>
        prisma.storyMilestone.update({
          where: { id: item.id },
          data: { orderIndex: item.orderIndex },
        })
      )
    );

    res.json({ success: true, message: 'Historia reordenada con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al reordenar la historia' });
  }
});

router.put('/milestones/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = MilestoneSchema.partial().parse(req.body);
    const updated = await prisma.storyMilestone.update({
      where: { id },
      data,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar hito' });
  }
});

router.delete('/milestones/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.storyMilestone.delete({ where: { id } });
    res.json({ success: true, message: 'Hito eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar hito' });
  }
});

// CRUD Galería
const GallerySchema = z.object({
  title: z.string().optional().nullable(),
  imageUrl: z.string().min(1, 'La URL de imagen es requerida'),
  caption: z.string().optional().nullable(),
  category: z.string().default('general'),
  orderIndex: z.number().int().min(0).default(0),
  isFeatured: z.boolean().default(false),
});

router.post('/gallery', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = GallerySchema.parse(req.body);
    const item = await prisma.galleryItem.create({ data });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar elemento a la galería' });
  }
});

router.delete('/gallery/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.galleryItem.delete({ where: { id } });
    res.json({ success: true, message: 'Foto eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar foto de galería' });
  }
});

export default router;
