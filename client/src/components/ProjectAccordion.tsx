import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  LinearProgress,
  IconButton,
  Box,
  Modal,
  TextField,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Project, Task } from '../utils/types';
import { calculateProjectProgress } from '../utils/helpers';
import TaskList from './TaskList';

interface ProjectAccordionProps {
  project: Project;
  tasks: Task[];
  onUpdateProject: (id: number, data: Partial<Project>) => void;
  onDeleteProject: (id: number) => void;
  onUpdateTask: (id: number, data: Partial<Task>) => void;
  onDeleteTask: (id: number) => void;
  onCreateTask: (task: Omit<Task, 'id'>) => void;
}

const ProjectAccordion: React.FC<ProjectAccordionProps> = ({
  project,
  tasks,
  onUpdateProject,
  onDeleteProject,
  onUpdateTask,
  onDeleteTask,
  onCreateTask,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editedName, setEditedName] = useState(project.name);
  const [editedDescription, setEditedDescription] = useState(project.description);

  const progress = calculateProjectProgress(tasks);

  const handleEditProject = () => {
    onUpdateProject(project.id, { name: editedName, description: editedDescription });
    setIsEditModalOpen(false);
  };

  const handleDeleteProject = () => {
    onDeleteProject(project.id);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel${project.id}-content`}
          id={`panel${project.id}-header`}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ flexGrow: 1 }}>{project.name}</Typography>
            <Box sx={{ width: '30%', mr: 2 }}>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
            <IconButton onClick={() => setIsEditModalOpen(true)} size="small">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => setIsDeleteModalOpen(true)} size="small">
              <DeleteIcon />
            </IconButton>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" gutterBottom>
            {project.description}
          </Typography>
          <TaskList
            tasks={tasks}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            onCreateTask={onCreateTask}
            projectId={project.id}
          />
        </AccordionDetails>
      </Accordion>

      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Edit Project
          </Typography>
          <TextField
            fullWidth
            label="Project Name"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Project Description"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setIsEditModalOpen(false)} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button onClick={handleEditProject} variant="contained">
              Save Changes
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Delete Project
          </Typography>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete this project? This action cannot be undone.
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setIsDeleteModalOpen(false)} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button onClick={handleDeleteProject} variant="contained" color="error">
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ProjectAccordion;
