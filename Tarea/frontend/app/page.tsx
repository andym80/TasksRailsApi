'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import { getProjects, getTasks, getUsers, type Task } from '@/lib/api';
import { useLoad } from '@/lib/useLoad';
import { groupOf } from '@/lib/tasks';
import { useTaskStatus } from '@/lib/useTaskStatus';
import TaskList from '@/components/TaskList';
import TaskDialog from '@/components/TaskDialog';
import { ListSkeleton, LoadError } from '@/components/LoadState';

const fetchProjects = () => getProjects().then((response) => response.data);
const fetchUsers = () => getUsers().then((response) => response.data);

function summary(tasks: Task[]): string {
  const open = tasks.filter((task) => task.status !== 'completed').length;
  const overdue = tasks.filter((task) => groupOf(task) === 'overdue').length;
  if (tasks.length === 0) return '';
  if (open === 0) return 'Todo completado.';
  const openText = open === 1 ? '1 tarea abierta' : `${open} tareas abiertas`;
  if (overdue === 0) return `${openText}, ninguna vencida.`;
  return `${openText}, ${overdue === 1 ? '1 vencida' : `${overdue} vencidas`}.`;
}

export default function AgendaPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [dialog, setDialog] = useState<{ open: boolean; task: Task | null }>({ open: false, task: null });

  const filtered = Boolean(statusFilter || priorityFilter);

  const fetchTasks = useCallback(
    () =>
      getTasks({ status: statusFilter || undefined, priority: priorityFilter || undefined }).then(
        (response) => response.data,
      ),
    [statusFilter, priorityFilter],
  );
  const { state, data, reload: load, setData: setTasks } = useLoad(fetchTasks);
  const tasks = data ?? [];

  // Projects and users only feed the task form, so a failure there must not hide the agenda.
  const { data: projectData } = useLoad(fetchProjects);
  const { data: userData } = useLoad(fetchUsers);
  const projects = projectData ?? [];
  const users = userData ?? [];

  // With a filter on, a change can move a task out of the current view: ask the API again.
  const changeStatus = useTaskStatus(setTasks, filtered ? load : undefined);

  const closeDialog = () => setDialog((current) => ({ ...current, open: false }));

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box sx={{ flex: 1, minWidth: 220 }}>
          <Typography variant="h1">Agenda</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75, minHeight: 24 }} aria-live="polite">
            {state === 'ready' ? summary(tasks) : ''}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialog({ open: true, task: null })}>
          Nueva tarea
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 4 }}>
        <ToggleButtonGroup
          exclusive
          size="small"
          aria-label="Filtrar por estado"
          value={statusFilter}
          onChange={(_, value) => value !== null && setStatusFilter(value)}
          sx={{
            bgcolor: 'background.paper',
            width: { xs: '100%', sm: 'auto' },
            '& .MuiToggleButton-root': { flex: { xs: 1, sm: 'none' }, px: { xs: 0.5, sm: 1.75 }, fontSize: { xs: 13, sm: 14 } },
          }}
        >
          <ToggleButton value="">Todas</ToggleButton>
          <ToggleButton value="pending">Pendientes</ToggleButton>
          <ToggleButton value="in_progress">En curso</ToggleButton>
          <ToggleButton value="completed">Completadas</ToggleButton>
        </ToggleButtonGroup>
        <TextField
          select
          fullWidth={false}
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value)}
          slotProps={{
            htmlInput: { 'aria-label': 'Filtrar por prioridad' },
            select: { displayEmpty: true },
          }}
          sx={{ minWidth: 190, bgcolor: 'background.paper', borderRadius: 1 }}
        >
          <MenuItem value="">Cualquier prioridad</MenuItem>
          <MenuItem value="high">Prioridad alta</MenuItem>
          <MenuItem value="medium">Prioridad media</MenuItem>
          <MenuItem value="low">Prioridad baja</MenuItem>
        </TextField>
      </Box>

      {state === 'loading' && <ListSkeleton />}
      {state === 'error' && <LoadError what="las tareas" onRetry={load} />}
      {state === 'ready' && tasks.length > 0 && (
        <TaskList tasks={tasks} onStatusChange={changeStatus} onOpen={(task) => setDialog({ open: true, task })} />
      )}
      {state === 'ready' && tasks.length === 0 && (
        <Box sx={{ py: 6, maxWidth: 460 }}>
          {filtered ? (
            <>
              <Typography variant="h2">Ninguna tarea coincide con estos filtros.</Typography>
              <Button
                sx={{ mt: 2, ml: -2 }}
                onClick={() => {
                  setStatusFilter('');
                  setPriorityFilter('');
                }}
              >
                Quitar filtros
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h2">Todavía no hay tareas.</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Las tareas se organizan en proyectos. {projects.length === 0 ? 'Empezá por crear uno.' : 'Creá la primera y aparecerá acá, ordenada por vencimiento.'}
              </Typography>
              {projects.length === 0 ? (
                <Button component={Link} href="/projects" variant="outlined" sx={{ mt: 2.5 }}>
                  Ir a Proyectos
                </Button>
              ) : (
                <Button variant="outlined" sx={{ mt: 2.5 }} onClick={() => setDialog({ open: true, task: null })}>
                  Nueva tarea
                </Button>
              )}
            </>
          )}
        </Box>
      )}

      <TaskDialog
        open={dialog.open}
        task={dialog.task}
        projects={projects}
        users={users}
        onClose={closeDialog}
        onSaved={() => {
          closeDialog();
          load();
        }}
        onDeleted={() => {
          closeDialog();
          load();
        }}
      />
    </>
  );
}
