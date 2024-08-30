import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Chip,
  TextField,
  Button,
  Box,
  Modal,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Task } from '../utils/types';

interface TaskListProps {
  tasks: Task[];
  projectId: number;
  onUpdateTask: (id: number, data: Partial<Task>) => void;
  onDeleteTask: (id: number) => void;
  onCreateTask: (task: Omit<Task, 'id'>) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  projectId,
  onUpdateTask,
  onDeleteTask,
  onCreateTask,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const handleAddTask = () => {
    onCreateTask({
      title: newTaskTitle,
      description: newTaskDescription,
      status: 'todo',
      projectId,
      userId: '', // This should be set on the backend
    });
    setNewTaskTitle('');
    setNewTaskDescription('');
    setIsAddModalOpen(false);
  };

  const handleEditTask = () => {
    if (editingTask) {
      onUpdateTask(editingTask.id, {
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status,
      });
      setIsEditModalOpen(false);
      setEditingTask(null);
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'default';
      case 'in-progress':
        return 'primary';
      case 'done':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <>
      <List>
        {tasks.map((task) => (
          <ListItem
            key={task.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pr: 0,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mr: 2 }}>
              <Checkbox
                checked={task.status === 'done'}
                onChange={() => onUpdateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' })}
              />
              <ListItemText
                primary={task.title}
                secondary={task.description}
                sx={{ mr: 2 }}
              />
              <Chip
                label={task.status}
                color={getStatusColor(task.status)}
                size="small"
              />
            </Box>
            <Box>
              <IconButton aria-label="edit" onClick={() => {
                setEditingTask(task);
                setIsEditModalOpen(true);
              }}>
                <EditIcon />
              </IconButton>
              <IconButton aria-label="delete" onClick={() => onDeleteTask(task.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
      <Button variant="contained" onClick={() => setIsAddModalOpen(true)}>
        Add Task
      </Button>
  
      <Modal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
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
          <Typography variant="h6" component="h2" gutterBottom>
            Add New Task
          </Typography>
          <TextField
            fullWidth
            label="Task Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Task Description"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setIsAddModalOpen(false)} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button onClick={handleAddTask} variant="contained">
              Add Task
            </Button>
          </Box>
        </Box>
      </Modal>
  
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
          borderRadius: 2,
        }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Edit Task
          </Typography>
          {editingTask && (
            <>
              <TextField
                fullWidth
                label="Task Title"
                value={editingTask.title}
                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Task Description"
                value={editingTask.description}
                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                margin="normal"
                multiline
                rows={3}
              />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => setIsEditModalOpen(false)} sx={{ mr: 1 }}>
                  Cancel
                </Button>
                <Button onClick={handleEditTask} variant="contained">
                  Save Changes
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default TaskList;