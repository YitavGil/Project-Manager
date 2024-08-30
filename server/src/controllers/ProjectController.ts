import { Request, Response } from 'express';
import { Project } from '../models/Project';

export class ProjectController {
  async getAllProjects(req: Request, res: Response) {
    try {
      console.log("Fetching projects for user:", (req as any).user.sub);
      const userId = (req as any).user.sub;
      const projects = await Project.findAll({ where: { userId } });
      res.json(projects);
    } catch (error) {
      console.error('Error in getAllProjects:', error);
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        if ('parent' in error) {
          console.error('Parent error:', (error as any).parent);
        }
        if ('sql' in error) {
          console.error('SQL query:', (error as any).sql);
        }
      }
      res.status(500).json({ message: 'Error fetching projects', error: (error as Error).message });
    }
  }
  

  async getProjectById(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const project = await Project.findOne({ where: { id: req.params.id, userId } });
      if (project) {
        res.json(project);
      } else {
        res.status(404).json({ message: 'Project not found' });
      }
    } catch (error) {
      console.error('Error in getProjectById:', error);
      res.status(500).json({ message: 'Error fetching project', error: (error as Error).message });
    }
  }

  async createProject(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const project = await Project.create({ ...req.body, userId });
      console.log('Project created successfully:', project.toJSON());
      res.status(201).json(project);
    } catch (error) {
      console.error('Error in createProject:', error);
      res.status(500).json({ message: 'Error creating project', error: (error as Error).message });
    }
  }

  async updateProject(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const project = await Project.findOne({ where: { id: req.params.id, userId } });
      if (project) {
        await project.update(req.body);
        res.json(project);
      } else {
        res.status(404).json({ message: 'Project not found' });
      }
    } catch (error) {
      console.error('Error in updateProject:', error);
      res.status(500).json({ message: 'Error updating project', error: (error as Error).message });
    }
  }

  async deleteProject(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const project = await Project.findOne({ where: { id: req.params.id, userId } });
      if (project) {
        await project.destroy();
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Project not found' });
      }
    } catch (error) {
      console.error('Error in deleteProject:', error);
      res.status(500).json({ message: 'Error deleting project', error: (error as Error).message });
    }
  }
}