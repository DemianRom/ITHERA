import { AppDataSource } from '../../config/db';
import { Expense, ExpenseSplit } from './budget.entity';

export const BudgetService = {

  async createExpense(data: {
    groupId: string;
    paidByUserId: string;
    amount: number;
    description: string;
    category: string;
    memberIds: string[];
  }) {
    return await AppDataSource.transaction(async (manager) => {
      const expense = manager.create(Expense, {
        groupId: data.groupId,
        paidByUserId: data.paidByUserId,
        amount: data.amount,
        description: data.description,
        category: data.category,
      });
      await manager.save(expense);

      const share = data.amount / data.memberIds.length;
      const splits = data.memberIds.map(userId =>
        manager.create(ExpenseSplit, {
          expenseId: expense.id,
          userId,
          share,
          settled: false,
        })
      );
      await manager.save(splits);

      return expense;
    });
  },

  async getBalances(groupId: string): Promise<Record<string, number>> {
    const expenses = await AppDataSource.getRepository(Expense)
      .find({ where: { groupId } });

    const balances: Record<string, number> = {};

    for (const expense of expenses) {
      const splits = await AppDataSource.getRepository(ExpenseSplit)
        .find({ where: { expenseId: expense.id } });

      balances[expense.paidByUserId] =
        (balances[expense.paidByUserId] || 0) + Number(expense.amount);

      for (const split of splits) {
        balances[split.userId] =
          (balances[split.userId] || 0) - Number(split.share);
      }
    }

    return balances;
  },

  async getMinimumSettlements(groupId: string) {
    const balances = await this.getBalances(groupId);

    const creditors: { id: string; amount: number }[] = [];
    const debtors: { id: string; amount: number }[] = [];

    for (const [userId, balance] of Object.entries(balances)) {
      if (balance > 0) creditors.push({ id: userId, amount: balance });
      if (balance < 0) debtors.push({ id: userId, amount: -balance });
    }

    const settlements: { from: string; to: string; amount: number }[] = [];

    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const payment = Math.min(debtors[i].amount, creditors[j].amount);
      settlements.push({
        from: debtors[i].id,
        to: creditors[j].id,
        amount: Math.round(payment * 100) / 100,
      });
      debtors[i].amount -= payment;
      creditors[j].amount -= payment;
      if (debtors[i].amount === 0) i++;
      if (creditors[j].amount === 0) j++;
    }

    return settlements;
  }
};