import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Expense } from '../entities/Expense';
import { ValidationError } from 'class-validator';

export class ExpenseController {
  static async create(req: Request, res: Response) {
    const { title, amount, category, date } = req.body;

    // Input validation
    if (!title || !amount || !category || !date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      const expense = new Expense();
      expense.title = title;
      expense.amount = amount;
      expense.category = category;
      expense.date = date;

      await AppDataSource.manager.save(expense);
      return res.status(201).json(expense);
    } catch (error) {
      return res.status(500).json({ message: 'Error creating expense', error });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const expenses = await AppDataSource.manager.find(Expense);
      return res.status(200).json(expenses);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching expenses', error });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, amount, category, date } = req.body;

    try {
      const expense = await AppDataSource.manager.findOneBy(Expense, { id: Number(id) });
      if (!expense) return res.status(404).json({ message: 'Expense not found' });

      expense.title = title || expense.title;
      expense.amount = amount || expense.amount;
      expense.category = category || expense.category;
      expense.date = date || expense.date;

      await AppDataSource.manager.save(expense);
      return res.status(200).json(expense);
    } catch (error) {
      return res.status(500).json({ message: 'Error updating expense', error });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const expense = await AppDataSource.manager.findOneBy(Expense, { id: Number(id) });
      if (!expense) return res.status(404).json({ message: 'Expense not found' });

      await AppDataSource.manager.remove(expense);
      return res.status(200).json({ message: 'Expense deleted' });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting expense', error });
    }
  }
}
