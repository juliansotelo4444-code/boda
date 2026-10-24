import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';
import { PaymentStatus } from '@prisma/client';

const router = Router();
router.use(authMiddleware);

// -------------------------------------------------------------
// RESUMEN FINANCIERO Y ALERTAS DE VENCIMIENTO
// -------------------------------------------------------------
router.get('/summary', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [settings, expenses, vendors] = await Promise.all([
      prisma.weddingSettings.findUnique({ where: { id: 'singleton' } }),
      prisma.expense.findMany({
        include: {
          vendor: { select: { id: true, name: true, category: true } },
          payments: { orderBy: { paidAt: 'desc' } },
        },
        orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
      }),
      prisma.vendor.findMany({
        include: { _count: { select: { expenses: true } } },
      }),
    ]);

    const totalBudget = Number(settings?.totalBudget || 25000);
    let totalEstimated = 0;
    let totalActual = 0;
    let totalPaid = 0;

    const today = new Date();
    const alerts: any[] = [];
    const categoryBreakdown: Record<string, { estimated: number; actual: number; paid: number }> = {};

    expenses.forEach((exp) => {
      const est = Number(exp.estimatedCost);
      const act = Number(exp.actualCost);
      const paid = Number(exp.amountPaid);

      totalEstimated += est;
      totalActual += act;
      totalPaid += paid;

      // Desglose por categoría
      if (!categoryBreakdown[exp.category]) {
        categoryBreakdown[exp.category] = { estimated: 0, actual: 0, paid: 0 };
      }
      categoryBreakdown[exp.category].estimated += est;
      categoryBreakdown[exp.category].actual += act;
      categoryBreakdown[exp.category].paid += paid;

      // Alertas de vencimientos en próximos 15 días o atrasados
      if (exp.dueDate && exp.status !== 'PAID') {
        const diffDays = Math.ceil((new Date(exp.dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays <= 15) {
          alerts.push({
            expenseId: exp.id,
            concept: exp.concept,
            vendorName: exp.vendor?.name || 'Sin proveedor asignado',
            pendingAmount: act - paid,
            dueDate: exp.dueDate,
            isOverdue: diffDays < 0,
            daysRemaining: diffDays,
          });
        }
      }
    });

    res.json({
      currency: settings?.currency || 'USD',
      totalBudget,
      totalEstimated,
      totalActual,
      totalPaid,
      remainingBudget: totalBudget - totalActual,
      balanceToPay: totalActual - totalPaid,
      alerts,
      categoryBreakdown,
      expenses,
      vendors,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al calcular resumen financiero' });
  }
});

// -------------------------------------------------------------
// CRUD GASTOS
// -------------------------------------------------------------
const ExpenseSchema = z.object({
  concept: z.string().min(1, 'El concepto es requerido'),
  category: z.string().min(1, 'La categoría es requerida'),
  estimatedCost: z.number().nonnegative(),
  actualCost: z.number().nonnegative(),
  dueDate: z.string().datetime().optional().nullable(),
  status: z.nativeEnum(PaymentStatus).optional(),
  vendorId: z.string().uuid().optional().nullable(),
  notes: z.string().optional().nullable(),
});

router.post('/expenses', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = ExpenseSchema.parse(req.body);
    const expense = await prisma.expense.create({
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
      include: { vendor: true },
    });
    res.status(201).json(expense);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten() });
      return;
    }
    res.status(500).json({ error: 'Error al registrar gasto' });
  }
});

router.put('/expenses/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = ExpenseSchema.partial().parse(req.body);

    const updated = await prisma.expense.update({
      where: { id },
      data: {
        ...data,
        dueDate: data.dueDate !== undefined ? (data.dueDate ? new Date(data.dueDate) : null) : undefined,
      },
      include: { vendor: true, payments: true },
    });
    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten() });
      return;
    }
    res.status(500).json({ error: 'Error al actualizar gasto' });
  }
});

router.delete('/expenses/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.expense.delete({ where: { id } });
    res.json({ success: true, message: 'Gasto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar gasto' });
  }
});

// Registrar un Pago para un Gasto
router.post('/expenses/:id/payments', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { amount, method, receiptUrl, notes } = z
      .object({
        amount: z.number().positive(),
        method: z.string().default('Transferencia'),
        receiptUrl: z.string().optional().nullable(),
        notes: z.string().optional().nullable(),
      })
      .parse(req.body);

    const expense = await prisma.expense.findUnique({ where: { id } });
    if (!expense) {
      res.status(404).json({ error: 'Gasto no encontrado' });
      return;
    }

    const newAmountPaid = Number(expense.amountPaid) + amount;
    const actualCost = Number(expense.actualCost);
    const newStatus: PaymentStatus =
      newAmountPaid >= actualCost ? 'PAID' : newAmountPaid > 0 ? 'PARTIAL' : 'PENDING';

    const [payment, updatedExpense] = await prisma.$transaction([
      prisma.paymentRecord.create({
        data: {
          expenseId: id,
          amount,
          method,
          receiptUrl,
          notes,
        },
      }),
      prisma.expense.update({
        where: { id },
        data: {
          amountPaid: newAmountPaid,
          status: newStatus,
        },
        include: { payments: true, vendor: true },
      }),
    ]);

    res.status(201).json({ payment, expense: updatedExpense });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten() });
      return;
    }
    res.status(500).json({ error: 'Error al registrar pago' });
  }
});

// -------------------------------------------------------------
// CRUD PROVEEDORES
// -------------------------------------------------------------
const VendorSchema = z.object({
  name: z.string().min(1, 'El nombre del proveedor es requerido'),
  category: z.string().min(1, 'La categoría es requerida'),
  contactName: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  contractUrl: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

router.post('/vendors', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = VendorSchema.parse(req.body);
    const vendor = await prisma.vendor.create({ data });
    res.status(201).json(vendor);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.flatten() });
      return;
    }
    res.status(500).json({ error: 'Error al crear proveedor' });
  }
});

router.put('/vendors/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = VendorSchema.partial().parse(req.body);
    const updated = await prisma.vendor.update({
      where: { id },
      data,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar proveedor' });
  }
});

router.delete('/vendors/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.vendor.delete({ where: { id } });
    res.json({ success: true, message: 'Proveedor eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar proveedor' });
  }
});

export default router;
