import express from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { authenticateToken } from '../middleware/auth';

const projectRouter = express.Router();
const projectController = new ProjectController();

projectRouter.use(authenticateToken);

projectRouter.get('/', projectController.getAllProjects);
projectRouter.get('/:id', projectController.getProjectById);
projectRouter.post('/', projectController.createProject);
projectRouter.put('/:id', projectController.updateProject);
projectRouter.delete('/:id', projectController.deleteProject);

export default projectRouter;