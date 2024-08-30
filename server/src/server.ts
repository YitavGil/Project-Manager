import express from 'express';
import dotenv from 'dotenv';
import { sequelize } from './data/service';
import { errorHandler } from './middleware/errorHandler';
import { authRouter } from './routes/authRouts';
import projectRouter from './routes/projectRoutes';
import taskRouter from './routes/taskRoutes';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_PORT, 
  credentials: true, 
}));

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);
app.use('/api/tasks', taskRouter);

// Error handling middleware
app.use(errorHandler);

// Start the server
sequelize.sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Exit the process if we can't connect to the database
  });