import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Budget } from '../entities/Budget';

export class BudgetController {
  static async create(req: Request, res: Response) {
    const { category, limit } = req.body;

    // Input validation
    if (!category || !limit) {
      return res.status(400).json({ message: 'Category and limit are required' });
    }

    try {
      const budget = new Budget();
      budget.category = category;
      budget.limit = limit;

      await AppDataSource.manager.save(budget);
      return res.status(201).json(budget);
    } catch (error) {
      return res.status(500).json({ message: 'Error creating budget', error });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const budgets = await AppDataSource.manager.find(Budget);
      return res.status(200).json(budgets);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching budgets', error });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { category, limit } = req.body;

    try {
      const budget = await AppDataSource.manager.findOneBy(Budget, { id: Number(id) });
      if (!budget) return res.status(404).json({ message: 'Budget not found' });

      budget.category = category || budget.category;
      budget.limit = limit || budget.limit;

      await AppDataSource.manager.save(budget);
      return res.status(200).json(budget);
    } catch (error) {
      return res.status(500).json({ message: 'Error updating budget', error });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const budget = await AppDataSource.manager.findOneBy(Budget, { id: Number(id) });
      if (!budget) return res.status(404).json({ message: 'Budget not found' });

      await AppDataSource.manager.remove(budget);
      return res.status(200).json({ message: 'Budget deleted' });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting budget', error });
    }
  }
}
