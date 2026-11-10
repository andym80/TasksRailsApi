'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import toast from 'react-hot-toast';
import {
  apiErrors,
  createTask,
  deleteTask,
  updateTask,
  type Project,
  type Task,
  type TaskPriority,
  type TaskStatus,
  type User,
} from '@/lib/api';
import { PRIORITY_LABEL, STATUS_LABEL } from '@/lib/tasks';

interface FormValues {
  title: string;
  description: string;
  project_id: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
  assigned_to_id: string;
}

const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];
const STATUSES: TaskStatus[] = ['pending', 'in_progress', 'completed'];

function valuesFor(task: Task | null, projectId?: number): FormValues {
  return {
    title: task?.title ?? '',
    description: task?.description ?? '',
    project_id: String(task?.project_id ?? projectId ?? ''),
    priority: task?.priority ?? 'medium',
    status: task?.status ?? 'pending',
    due_date: task?.due_date?.slice(0, 10) ?? '',
    assigned_to_id: task?.assigned_to_id ? String(task.assigned_to_id) : '',
  };
}

interface TaskDialogProps {
  open: boolean;
  /** The task being edited, or null to create one. */
  task: Task | null;
  projects: Project[];
  users: User[];
  /** Fixes the project when the dialog is opened from a project page. */
  projectId?: number;
  onClose: () => void;
  onSaved: (task: Task) => void;
  onDeleted: (task: Task) => void;
}

function TaskForm({
  task,
  projects,
  users,
  projectId,
  onClose,
  onSaved,
  onDeleted,
}: TaskDialogProps) {
  const { control, register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: valuesFor(task, projectId),
  });
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const { errors, isSubmitting } = formState;

  const save = handleSubmit(async (values) => {
    const data = {
      title: values.title.trim(),
      description: values.description.trim() || null,
      priority: values.priority,
      status: values.status,
      due_date: values.due_date || null,
      assigned_to_id: values.assigned_to_id ? Number(values.assigned_to_id) : null,
    };
    try {
      const response = task ? await updateTask(task.id, data) : await createTask(Number(values.project_id), data);
      toast.success(task ? 'Tarea guardada' : 'Tarea creada');
      onSaved(response.data);
    } catch (error) {
      const reasons = apiErrors(error);
      setServerErrors(reasons.length ? reasons : ['No se pudo guardar la tarea. Revisá que la API esté en línea y probá de nuevo.']);
    }
  });

  const remove = async () => {
    if (!task) return;
    try {
      await deleteTask(task.id);
      toast.success('Tarea eliminada');
      onDeleted(task);
    } catch {
      setServerErrors(['No se pudo eliminar la tarea. Probá de nuevo.']);
      setConfirmingDelete(false);
    }
  };

  const noProjects = !task && projects.length === 0;

  return (
      <form onSubmit={save} noValidate>
        <DialogTitle>{task ? 'Editar tarea' : 'Nueva tarea'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2.5, pt: 1 }}>
            {serverErrors.length > 0 && (
              <Alert severity="error">
                {serverErrors.map((message) => (
                  <div key={message}>{message}</div>
                ))}
              </Alert>
            )}
            {noProjects && (
              <Alert severity="info">Las tareas viven dentro de un proyecto. Creá un proyecto primero, en la sección Proyectos.</Alert>
            )}

            <TextField
              label="Título"
              autoFocus
              required
              error={Boolean(errors.title)}
              helperText={errors.title?.message}
              {...register('title', { validate: (value) => value.trim().length > 0 || 'Escribí un título para la tarea.' })}
            />

            {!task && !projectId && (
              <Controller
                name="project_id"
                control={control}
                rules={{ required: 'Elegí el proyecto al que pertenece.' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Proyecto"
                    required
                    disabled={noProjects}
                    error={Boolean(errors.project_id)}
                    helperText={errors.project_id?.message}
                  >
                    {projects.map((project) => (
                      <MenuItem key={project.id} value={String(project.id)}>
                        {project.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            )}

            <TextField label="Descripción" multiline minRows={2} maxRows={6} {...register('description')} />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
              <TextField
                label="Vence el"
                type="date"
                slotProps={{ inputLabel: { shrink: true } }}
                {...register('due_date')}
              />
              <Controller
                name="assigned_to_id"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Asignada a">
                    <MenuItem value="">Nadie</MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user.id} value={String(user.id)}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Box>

            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Box>
                  <Typography id="priority-label" variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
                    Prioridad
                  </Typography>
                  <ToggleButtonGroup
                    exclusive
                    fullWidth
                    size="small"
                    aria-labelledby="priority-label"
                    value={field.value}
                    onChange={(_, value) => value && field.onChange(value)}
                  >
                    {PRIORITIES.map((priority) => (
                      <ToggleButton key={priority} value={priority}>
                        {PRIORITY_LABEL[priority]}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Box>
              )}
            />

            {task && (
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Box>
                    <Typography id="status-label" variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
                      Estado
                    </Typography>
                    <ToggleButtonGroup
                      exclusive
                      fullWidth
                      size="small"
                      aria-labelledby="status-label"
                      value={field.value}
                      onChange={(_, value) => value && field.onChange(value)}
                    >
                      {STATUSES.map((status) => (
                        <ToggleButton key={status} value={status}>
                          {STATUS_LABEL[status]}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </Box>
                )}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          {task &&
            (confirmingDelete ? (
              <>
                <Typography variant="body2" sx={{ mr: 'auto' }}>
                  ¿Eliminar esta tarea?
                </Typography>
                <Button onClick={() => setConfirmingDelete(false)}>Conservar</Button>
                <Button color="error" variant="contained" onClick={remove}>
                  Eliminar tarea
                </Button>
              </>
            ) : (
              <Button color="error" onClick={() => setConfirmingDelete(true)} sx={{ mr: 'auto' }}>
                Eliminar
              </Button>
            ))}
          {!confirmingDelete && (
            <>
              <Button onClick={onClose}>Cancelar</Button>
              <Button type="submit" variant="contained" disabled={isSubmitting || noProjects}>
                {task ? 'Guardar cambios' : 'Crear tarea'}
              </Button>
            </>
          )}
        </DialogActions>
      </form>
  );
}

// The form mounts each time the dialog opens, so it always starts from the task it was given.
export default function TaskDialog(props: TaskDialogProps) {
  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="sm" fullWidth>
      <TaskForm {...props} />
    </Dialog>
  );
}
