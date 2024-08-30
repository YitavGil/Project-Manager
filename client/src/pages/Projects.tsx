// src/pages/Projects.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  CircularProgress, 
  Alert, 
  Snackbar,
  Modal,
  TextField
} from '@mui/material';
import Header from '../components/Header';
import ProjectAccordion from '../components/ProjectAccordion';
import { projectApi, taskApi } from '../services/api';
import { getAuthToken } from '../services/auth';
import { Project, Task } from '../utils/types';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate('/login');
    } else {
      fetchProjects();
      fetchTasks();
      // In a real application, you would fetch the username from the user's profile or the JWT token
      setUsername('Yitav Gil-ad');
    }
  }, [navigate]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await projectApi.getAll();
      setProjects(response.data);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      handleError('Error fetching projects', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await taskApi.getAll();
      setTasks(response.data);
    } catch (error: any) {
      console.error('Error fetching tasks:', error.response?.data || error.message);
      handleError('Error fetching tasks', error);
    }
  };

  const handleCreateProject = async () => {
    try {
      console.log('Creating new project...');
      const newProjectData = {
        name: newProjectName,
        description: newProjectDescription,
      };
      console.log('New project data:', newProjectData);
      const newProject = await projectApi.create(newProjectData);
      console.log('New project created:', newProject.data);
      setProjects([...projects, newProject.data]);
      setIsCreateModalOpen(false);
      setNewProjectName('');
      setNewProjectDescription('');
    } catch (error: any) {
      console.error('Error creating project:', error.response?.data || error.message);
      handleError('Error creating project', error);
    }
  };

  const handleUpdateProject = async (id: number, data: Partial<Project>) => {
    try {
      await projectApi.update(id, data);
      setProjects(projects.map(p => p.id === id ? { ...p, ...data } : p));
    } catch (error: any) {
      console.error('Error updating project:', error);
      handleError('Error updating project', error);
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await projectApi.delete(id);
      setProjects(projects.filter(p => p.id !== id));
      setTasks(tasks.filter(t => t.projectId !== id));
    } catch (error: any) {
      console.error('Error deleting project:', error);
      handleError('Error deleting project', error);
    }
  };

  const handleCreateTask = async (task: Omit<Task, 'id'>) => {
    try {
      const newTask = await taskApi.create(task);
      setTasks([...tasks, newTask.data]);
    } catch (error: any) {
      console.error('Error creating task:', error);
      handleError('Error creating task', error);
    }
  };

  const handleUpdateTask = async (id: number, data: Partial<Task>) => {
    try {
      await taskApi.update(id, data);
      setTasks(tasks.map(t => t.id === id ? { ...t, ...data } : t));
    } catch (error: any) {
      console.error('Error updating task:', error);
      handleError('Error updating task', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await taskApi.delete(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error: any) {
      console.error('Error deleting task:', error);
      handleError('Error deleting task', error);
    }
  };

  const handleError = (message: string, error: any) => {
    console.error(`${message}:`, error);
    if (error.response) {
      setError(`${message}: ${error.response.data.message || error.response.statusText}`);
    } else if (error.request) {
      setError(`${message}: No response from server`);
    } else {
      setError(`${message}: ${error.message}`);
    }
  };

  return (
    <>
      <Header username={username} />
      <Container maxWidth="lg" sx={{ mt: 4, px: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" className="gradient-text">
            Projects
          </Typography>
          <Button variant="contained" onClick={() => setIsCreateModalOpen(true)}>
            Add Project
          </Button>
        </Box>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          projects.map(project => (
            <ProjectAccordion
              key={project.id}
              project={project}
              tasks={tasks.filter(t => t.projectId === project.id)}
              onUpdateProject={handleUpdateProject}
              onDeleteProject={handleDeleteProject}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onCreateTask={handleCreateTask}
            />
          ))
        )}
      </Container>
      <Modal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        aria-labelledby="create-project-modal"
        aria-describedby="modal-to-create-new-project"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Typography id="create-project-modal" variant="h6" component="h2" gutterBottom>
            Create New Project
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="project-name"
            label="Project Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="project-description"
            label="Project Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={newProjectDescription}
            onChange={(e) => setNewProjectDescription(e.target.value)}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setIsCreateModalOpen(false)} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject} variant="contained">
              Create Project
            </Button>
          </Box>
        </Box>
      </Modal>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Projects;