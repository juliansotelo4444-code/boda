import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET /api/public/wedding-info (Datos para la web pública de la boda)
router.get('/wedding-info', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [settings, timeline, story, gallery] = await Promise.all([
      prisma.weddingSettings.findUnique({ where: { id: 'singleton' } }),
      prisma.timelineEvent.findMany({
        where: { isPublic: true },
        orderBy: { orderIndex: 'asc' },
      }),
      prisma.storyMilestone.findMany({
        orderBy: { orderIndex: 'asc' },
      }),
      prisma.galleryItem.findMany({
        where: { isFeatured: true },
        orderBy: { orderIndex: 'asc' },
      }),
    ]);

    res.json({
      settings: settings || {
        groomName: 'Julián',
        brideName: 'Yanet',
        weddingDate: '2027-10-09T18:00:00.000Z',
        venueName: 'Palacio San Souci / Jardines de la Reina',
        venueAddress: 'Av. Libertador 2450, San Fernando',
        primaryColor: '#67001A',
        secondaryColor: '#D4AF37',
        isRsvpOpen: true,
      },
      timeline,
      story,
      gallery,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar información pública de la boda' });
  }
});

// GET /api/public/rsvp/token/:token (Buscar invitación personalizada por token)
router.get('/rsvp/token/:token', async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const guest = await prisma.guest.findUnique({
      where: { invitationToken: token },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        rsvpStatus: true,
        plusOnesAllowed: true,
        plusOnesConfirmed: true,
        plusOnesNames: true,
        dietaryRestrictions: true,
        dietaryNotes: true,
        notes: true,
      },
    });

    if (!guest) {
      res.status(404).json({ error: 'Invitación no encontrada' });
      return;
    }

    res.json(guest);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar invitación' });
  }
});

// POST /api/public/rsvp/submit (Confirmar o declinar asistencia)
const PublicRsvpSchema = z.object({
  invitationToken: z.string().optional(),
  guestId: z.string().optional(),
  rsvpStatus: z.enum(['CONFIRMED', 'DECLINED']),
  plusOnesConfirmed: z.number().int().min(0).default(0),
  plusOnesNames: z.array(z.string()).default([]),
  dietaryRestrictions: z.array(z.string()).default([]),
  dietaryNotes: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

router.post('/rsvp/submit', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = PublicRsvpSchema.parse(req.body);

    const where = data.invitationToken
      ? { invitationToken: data.invitationToken }
      : data.guestId
      ? { id: data.guestId }
      : null;

    if (!where) {
      res.status(400).json({ error: 'Se requiere token o id de invitado' });
      return;
    }

    const currentGuest = await prisma.guest.findUnique({ where });
    if (!currentGuest) {
      res.status(404).json({ error: 'Invitado no encontrado' });
      return;
    }

    // Validar que no confirme más acompañantes de los permitidos
    const plusCount = Math.min(data.plusOnesConfirmed, currentGuest.plusOnesAllowed);

    const updated = await prisma.guest.update({
      where,
      data: {
        rsvpStatus: data.rsvpStatus,
        plusOnesConfirmed: data.rsvpStatus === 'CONFIRMED' ? plusCount : 0,
        plusOnesNames: data.rsvpStatus === 'CONFIRMED' ? data.plusOnesNames : [],
        dietaryRestrictions: data.dietaryRestrictions,
        dietaryNotes: data.dietaryNotes || null,
        notes: data.notes || null,
      },
    });

    res.json({
      success: true,
      message: data.rsvpStatus === 'CONFIRMED' ? '¡Asistencia confirmada!' : 'Respuesta registrada',
      guest: updated,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten() });
      return;
    }
    res.status(500).json({ error: 'Error al enviar RSVP' });
  }
});

export default router;
