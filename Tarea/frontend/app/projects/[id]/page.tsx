'use client';

import { use, useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import toast from 'react-hot-toast';
import { deleteProject, getProject, getUsers, type Task } from '@/lib/api';
import { useLoad } from '@/lib/useLoad';
import { progress } from '@/lib/tasks';
import { useTaskStatus } from '@/lib/useTaskStatus';
import TaskList from '@/components/TaskList';
import TaskDialog from '@/components/TaskDialog';
import ProjectDialog from '@/components/ProjectDialog';
import { ListSkeleton, LoadError } from '@/components/LoadState';

const fetchUsers = () => getUsers().then((response) => response.data);

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const projectId = Number(id);
  const router = useRouter();

  const fetchProject = useCallback(() => getProject(projectId).then((response) => response.data), [projectId]);
  const { state, data: project, reload: load, setData: setProject } = useLoad(fetchProject);
  const { data: userData } = useLoad(fetchUsers);
  const users = userData ?? [];
  const [taskDialog, setTaskDialog] = useState<{ open: boolean; task: Task | null }>({ open: false, task: null });
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const setTasks = useCallback(
    (update: (tasks: Task[]) => Task[]) => setProject((current) => ({ ...current, tasks: update(current.tasks ?? []) })),
    [setProject],
  );
  const changeStatus = useTaskStatus(setTasks);

  const remove = async () => {
    if (!project) return;
    try {
      await deleteProject(project.id);
      toast.success('Proyecto eliminado');
      router.push('/projects');
    } catch {
      toast.error('No se pudo eliminar el proyecto. Probá de nuevo.');
      setConfirmingDelete(false);
    }
  };

  const back = (
    <Button component={Link} href="/projects" startIcon={<ArrowBackIcon />} sx={{ ml: -2, mb: 2 }}>
      Proyectos
    </Button>
  );

  if (state === 'loading') {
    return (
      <>
        {back}
        <ListSkeleton />
      </>
    );
  }
  if (state === 'error') {
    return (
      <>
        {back}
        <LoadError what="los datos del proyecto" onRetry={load} />
      </>
    );
  }
  if (state === 'missing' || !project) {
    return (
      <>
        {back}
        <Typography variant="h1">Este proyecto no existe.</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Puede que lo hayan eliminado. Volvé a la lista para ver los que siguen activos.
        </Typography>
      </>
    );
  }

  const tasks = project.tasks ?? [];
  const { done, total, percent } = progress(tasks);
  const closeTaskDialog = () => setTaskDialog((current) => ({ ...current, open: false }));

  return (
    <>
      {back}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box sx={{ flex: 1, minWidth: 240 }}>
          <Typography variant="h1" sx={{ overflowWrap: 'anywhere' }}>
            {project.name}
          </Typography>
          {project.description && (
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: '62ch' }}>
              {project.description}
            </Typography>
          )}
          {project.user && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Responsable: {project.user.name}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1, pt: 0.5 }}>
          <Button onClick={() => setEditing(true)}>Editar</Button>
          <Button color="error" onClick={() => setConfirmingDelete(true)}>
            Eliminar
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2.5, mb: 4 }}>
        <Box sx={{ flex: 1, minWidth: 200, maxWidth: 360 }}>
          <Typography variant="body2" sx={{ mb: 0.75, fontVariantNumeric: 'tabular-nums' }}>
            {total === 0 ? 'Sin tareas' : `${done} de ${total} completadas`}
          </Typography>
          <LinearProgress variant="determinate" value={percent} aria-label={`Avance del proyecto: ${percent}%`} />
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setTaskDialog({ open: true, task: null })}
          sx={{ ml: 'auto' }}
        >
          Nueva tarea
        </Button>
      </Box>

      {tasks.length > 0 ? (
        <TaskList
          tasks={tasks}
          showProject={false}
          onStatusChange={changeStatus}
          onOpen={(task) => setTaskDialog({ open: true, task })}
        />
      ) : (
        <Box sx={{ py: 4, maxWidth: 460 }}>
          <Typography variant="h2">Este proyecto todavía no tiene tareas.</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Sumá la primera con el botón Nueva tarea.
          </Typography>
        </Box>
      )}

      <TaskDialog
        open={taskDialog.open}
        task={taskDialog.task}
        projects={[project]}
        users={users}
        projectId={project.id}
        onClose={closeTaskDialog}
        onSaved={() => {
          closeTaskDialog();
          load();
        }}
        onDeleted={() => {
          closeTaskDialog();
          load();
        }}
      />

      <ProjectDialog
        open={editing}
        project={project}
        users={users}
        onClose={() => setEditing(false)}
        onSaved={() => {
          setEditing(false);
          load();
        }}
      />

      <Dialog open={confirmingDelete} onClose={() => setConfirmingDelete(false)} maxWidth="xs" fullWidth>
        <DialogTitle>¿Eliminar “{project.name}”?</DialogTitle>
        <DialogContent>
          <Typography>
            {total === 0
              ? 'El proyecto se elimina para siempre.'
              : `Se eliminan también sus ${total === 1 ? '1 tarea' : `${total} tareas`}. No se puede deshacer.`}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setConfirmingDelete(false)}>Conservar</Button>
          <Button color="error" variant="contained" onClick={remove}>
            Eliminar proyecto
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
