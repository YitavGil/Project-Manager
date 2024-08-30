import { Request, Response } from "express";
import { Task } from "../models/Task";

export class TaskController {
  async getAllTasks(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const tasks = await Task.findAll({ where: { userId } });
      res.json(tasks);
    } catch (error) {
      console.error('Error in getAllTasks:', error);
      res.status(500).json({ message: 'Error fetching tasks', error: (error as Error).message });
    }
  }

  async getTaskById(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const task = await Task.findOne({ where: { id: req.params.id, userId } });
      if (task) {
        res.json(task);
      } else {
        res.status(404).json({ message: "Task not found" });
      }
    } catch (error) {
      console.error('Error in getTaskById:', error);
      res.status(500).json({ message: "Error fetching task", error: (error as Error).message });
    }
  }

  async createTask(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const task = await Task.create({ ...req.body, userId });
      res.status(201).json(task);
    } catch (error) {
      console.error('Error in createTask:', error);
      res.status(500).json({ message: "Error creating task", error: (error as Error).message });
    }
  }

  async updateTask(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const task = await Task.findOne({ where: { id: req.params.id, userId } });
      if (task) {
        await task.update(req.body);
        res.json(task);
      } else {
        res.status(404).json({ message: "Task not found" });
      }
    } catch (error) {
      console.error('Error in updateTask:', error);
      res.status(500).json({ message: "Error updating task", error: (error as Error).message });
    }
  }

  async deleteTask(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const task = await Task.findOne({ where: { id: req.params.id, userId } });
      if (task) {
        await task.destroy();
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Task not found" });
      }
    } catch (error) {
      console.error('Error in deleteTask:', error);
      res.status(500).json({ message: "Error deleting task", error: (error as Error).message });
    }
  }
}