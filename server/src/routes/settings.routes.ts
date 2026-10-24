import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

const UpdateSettingsSchema = z.object({
  groomName: z.string().optional(),
  brideName: z.string().optional(),
  weddingDate: z.string().datetime().optional(),
  venueName: z.string().optional(),
  venueAddress: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  totalBudget: z.number().nonnegative().optional(),
  currency: z.string().optional(),
  isRsvpOpen: z.boolean().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  welcomeText: z.string().optional(),
});

// GET /api/settings (Público / Admin)
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const settings = await prisma.weddingSettings.findUnique({
      where: { id: 'singleton' },
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener configuración de la boda' });
  }
});

// PUT /api/settings (Protegido Admin)
router.put('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const data = UpdateSettingsSchema.parse(req.body);

    const updated = await prisma.weddingSettings.upsert({
      where: { id: 'singleton' },
      update: {
        ...data,
        weddingDate: data.weddingDate ? new Date(data.weddingDate) : undefined,
      },
      create: {
        id: 'singleton',
        groomName: data.groomName || 'Julián',
        brideName: data.brideName || 'Yanet',
        weddingDate: data.weddingDate ? new Date(data.weddingDate) : new Date('2027-10-09T18:00:00.000Z'),
        venueName: data.venueName || 'Palacio San Souci / Jardines de la Reina',
        venueAddress: data.venueAddress || 'Av. Libertador 2450, San Fernando',
        totalBudget: data.totalBudget ?? 25000,
        currency: data.currency || 'USD',
      },
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten() });
      return;
    }
    res.status(500).json({ error: 'Error al actualizar configuración' });
  }
});

export default router;
