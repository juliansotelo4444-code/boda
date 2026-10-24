import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';
import { RsvpStatus, InvitationDeliveryStatus } from '@prisma/client';

const router = Router();

// Todas las rutas de invitados requieren autenticación admin
router.use(authMiddleware);

const GuestSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  groupName: z.string().optional().nullable(),
  rsvpStatus: z.nativeEnum(RsvpStatus).optional(),
  plusOnesAllowed: z.number().int().min(0).default(0),
  plusOnesConfirmed: z.number().int().min(0).default(0),
  plusOnesNames: z.array(z.string()).default([]),
  dietaryRestrictions: z.array(z.string()).default([]),
  dietaryNotes: z.string().optional().nullable(),
  tableId: z.string().uuid().optional().nullable(),
  notes: z.string().optional().nullable(),
});

// GET /api/guests (con filtros y estadísticas)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, group, tableId, search } = req.query;

    const where: any = {};
    if (status && typeof status === 'string') {
      where.rsvpStatus = status as RsvpStatus;
    }
    if (group && typeof group === 'string') {
      where.groupName = group;
    }
    if (tableId && typeof tableId === 'string') {
      where.tableId = tableId === 'unassigned' ? null : tableId;
    }
    if (search && typeof search === 'string') {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { groupName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [guests, total, confirmed, pending, declined] = await Promise.all([
      prisma.guest.findMany({
        where,
        include: {
          table: { select: { id: true, number: true, name: true } },
        },
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      }),
      prisma.guest.count(),
      prisma.guest.count({ where: { rsvpStatus: 'CONFIRMED' } }),
      prisma.guest.count({ where: { rsvpStatus: 'PENDING' } }),
      prisma.guest.count({ where: { rsvpStatus: 'DECLINED' } }),
    ]);

    // Calcular acompañantes confirmados
    const confirmedWithPluses = await prisma.guest.aggregate({
      where: { rsvpStatus: 'CONFIRMED' },
      _sum: { plusOnesConfirmed: true },
    });

    const totalSeatsConfirmed = confirmed + (confirmedWithPluses._sum.plusOnesConfirmed || 0);

    res.json({
      metrics: {
        totalGuests: total,
        confirmed,
        pending,
        declined,
        totalSeatsConfirmed,
      },
      guests,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al listar invitados' });
  }
});

// POST /api/guests (Crear invitado)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = GuestSchema.parse(req.body);
    const guest = await prisma.guest.create({
      data: {
        ...data,
        email: data.email || null,
        phone: data.phone || null,
      },
      include: { table: true },
    });
    res.status(201).json(guest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten() });
      return;
    }
    res.status(500).json({ error: 'Error al crear invitado' });
  }
});

// PUT /api/guests/:id (Actualizar invitado)
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = GuestSchema.partial().parse(req.body);

    const updated = await prisma.guest.update({
      where: { id },
      data,
      include: { table: true },
    });
    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten() });
      return;
    }
    res.status(500).json({ error: 'Error al actualizar invitado' });
  }
});

// DELETE /api/guests/:id (Eliminar invitado)
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.guest.delete({ where: { id } });
    res.json({ success: true, message: 'Invitado eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar invitado' });
  }
});

// POST /api/guests/:id/invitation-status (Marcar invitación enviada)
router.post('/:id/invitation-status', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const guest = await prisma.guest.update({
      where: { id },
      data: {
        invitationStatus: status as InvitationDeliveryStatus,
        invitationSentAt: status === 'SENT' ? new Date() : undefined,
      },
    });

    res.json(guest);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado de invitación' });
  }
});

export default router;
