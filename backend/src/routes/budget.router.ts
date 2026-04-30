import { Router, Request, Response } from 'express';
import { BudgetService } from '../domain/budget/budget.service';

const router = Router();

// Registrar un gasto
router.post('/expenses', async (req: Request, res: Response) => {
  try {
    const expense = await BudgetService.createExpense(req.body);
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar el gasto' });
  }
});

// Ver saldos netos del grupo
router.get('/balances/:groupId', async (req: Request, res: Response) => {
  try {
    const balances = await BudgetService.getBalances(req.params.groupId);
    res.json(balances);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener saldos' });
  }
});

// Ver liquidación mínima del grupo
router.get('/settlements/:groupId', async (req: Request, res: Response) => {
  try {
    const settlements = await BudgetService.getMinimumSettlements(req.params.groupId);
    res.json(settlements);
  } catch (err) {
    res.status(500).json({ error: 'Error al calcular liquidaciones' });
  }
});

export default router;