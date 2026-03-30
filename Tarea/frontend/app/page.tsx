'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import { getTasks, updateTaskStatus, createTask, getProjects, Task, Project } from '@/lib/api';
import toast from 'react-hot-toast';

const priorityColors: Record<string, 'default' | 'primary' | 'error'> = {
  low: 'default',
  medium: 'primary',
  high: 'error',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pending' as const,
    priority: 'medium' as const,
    due_date: '',
    project_id: '',
  });
  const router = useRouter();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTasks({
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
      });
      setTasks(res.data);
    } catch {
      toast.error('Error al cargar tareas');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleStatusChange = async (taskId: number, status: string) => {
    try {
      await updateTaskStatus(taskId, status);
      toast.success('Status actualizado');
      fetchTasks();
    } catch {
      toast.error('Error al actualizar');
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data);
    } catch {
      toast.error('Error al cargar proyectos');
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim() || !newTask.project_id) {
      toast.error('Título y proyecto son requeridos');
      return;
    }

    try {
      await createTask(parseInt(newTask.project_id), {
        title: newTask.title,
        description: newTask.description || undefined,
        status: newTask.status,
        priority: newTask.priority,
        due_date: newTask.due_date || undefined,
      });
      toast.success('Tarea creada exitosamente');
      setOpenAddDialog(false);
      setNewTask({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        due_date: '',
        project_id: '',
      });
      fetchTasks();
    } catch {
      toast.error('Error al crear tarea');
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/projects')}>
          Proyectos
        </Button>
        <Typography variant="h4" fontWeight="bold">
          Todas las Tareas
        </Typography>
        <Box flex={1} />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setOpenAddDialog(true);
            fetchProjects();
          }}
        >
          Agregar Tarea
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Prioridad</InputLabel>
          <Select
            value={priorityFilter}
            label="Prioridad"
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <MenuItem value="">Todas</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={8}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Título</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Prioridad</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Vencimiento</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Proyecto</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="text.secondary" py={4}>
                      No hay tareas.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                sortedTasks.map((task) => (
                  <TableRow key={task.id} hover>
                    <TableCell>{task.title}</TableCell>

                    <TableCell>
                      <Chip
                        label={task.priority}
                        size="small"
                        color={priorityColors[task.priority] ?? 'default'}
                      />
                    </TableCell>

                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 130 }}>
                        <Select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="in_progress">In Progress</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>

                    <TableCell>
                      {task.due_date
                        ? new Date(task.due_date).toLocaleDateString('es-AR')
                        : '—'}
                    </TableCell>

                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => router.push(`/projects/${task.project_id}`)}
                      >
                        #{task.project_id}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Agregar Nueva Tarea</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <FormControl fullWidth>
              <InputLabel>Proyecto *</InputLabel>
              <Select
                value={newTask.project_id}
                label="Proyecto *"
                onChange={(e) => setNewTask({ ...newTask, project_id: e.target.value })}
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id.toString()}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Título *"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />

            <TextField
              fullWidth
              label="Descripción"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              multiline
              rows={3}
            />

            <FormControl fullWidth>
              <InputLabel>Prioridad</InputLabel>
              <Select
                value={newTask.priority}
                label="Prioridad"
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as typeof newTask.priority })}
              >
                <MenuItem value="low">Baja</MenuItem>
                <MenuItem value="medium">Media</MenuItem>
                <MenuItem value="high">Alta</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newTask.status}
                label="Status"
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value as typeof newTask.status })}
              >
                <MenuItem value="pending">Pendiente</MenuItem>
                <MenuItem value="in_progress">En Progreso</MenuItem>
                <MenuItem value="completed">Completada</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Fecha de Vencimiento"
              type="date"
              value={newTask.due_date}
              onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancelar</Button>
          <Button onClick={handleAddTask} variant="contained">
            Crear Tarea
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}