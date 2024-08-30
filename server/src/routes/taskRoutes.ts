import express from 'express';
import { TaskController } from '../controllers/TaskController';
import { authenticateToken } from '../middleware/auth';

const taskRouter = express.Router();
const taskController = new TaskController();

taskRouter.use(authenticateToken);

taskRouter.get('/', taskController.getAllTasks);
taskRouter.get('/:id', taskController.getTaskById);
taskRouter.post('/', taskController.createTask);
taskRouter.put('/:id', taskController.updateTask);
taskRouter.delete('/:id', taskController.deleteTask);

export default taskRouter;