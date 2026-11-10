'use client';

import { useState } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import { getProjects, getUsers, type Project } from '@/lib/api';
import { useLoad } from '@/lib/useLoad';
import { groupOf, progress } from '@/lib/tasks';
import { colors } from '@/app/theme';
import ProjectDialog from '@/components/ProjectDialog';
import { ListSkeleton, LoadError } from '@/components/LoadState';

const fetchProjects = () => getProjects().then((response) => response.data);
const fetchUsers = () => getUsers().then((response) => response.data);

function ProjectRow({ project }: { project: Project }) {
  const { done, total, percent } = progress(project.tasks);
  const overdue = (project.tasks ?? []).filter((task) => groupOf(task) === 'overdue').length;

  return (
    <Box component="li" sx={{ '& + &': { borderTop: `1px solid ${colors.line}` } }}>
      <Box
        component={Link}
        href={`/projects/${project.id}`}
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 220px' },
          columnGap: 4,
          rowGap: 1.5,
          alignItems: 'center',
          px: 2.5,
          py: 2.25,
          color: 'inherit',
          textDecoration: 'none',
          '&:hover h2': { textDecoration: 'underline' },
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h2" sx={{ overflowWrap: 'anywhere' }}>
            {project.name}
          </Typography>
          {project.description && (
            <Typography color="text.secondary" sx={{ mt: 0.25 }}>
              {project.description}
            </Typography>
          )}
          {project.user && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              Responsable: {project.user.name}
            </Typography>
          )}
        </Box>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 0.75 }}>
            <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums' }}>
              {total === 0 ? 'Sin tareas' : `${done} de ${total} completadas`}
            </Typography>
            {overdue > 0 && (
              <Typography variant="body2" sx={{ color: colors.amber, fontWeight: 700 }}>
                {overdue === 1 ? '1 vencida' : `${overdue} vencidas`}
              </Typography>
            )}
          </Box>
          <LinearProgress
            variant="determinate"
            value={percent}
            aria-label={`Avance de ${project.name}: ${percent}%`}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default function ProjectsPage() {
  const { state, data, reload: load } = useLoad(fetchProjects);
  const { data: userData } = useLoad(fetchUsers);
  const projects = data ?? [];
  const users = userData ?? [];
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Typography variant="h1" sx={{ flex: 1, minWidth: 220 }}>
          Proyectos
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Nuevo proyecto
        </Button>
      </Box>

      {state === 'loading' && <ListSkeleton rows={3} />}
      {state === 'error' && <LoadError what="los proyectos" onRetry={load} />}
      {state === 'ready' && projects.length > 0 && (
        <Box
          component="ul"
          sx={{
            listStyle: 'none',
            m: 0,
            p: 0,
            bgcolor: 'background.paper',
            border: `1px solid ${colors.line}`,
            borderRadius: 2,
          }}
        >
          {projects.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))}
        </Box>
      )}
      {state === 'ready' && projects.length === 0 && (
        <Box sx={{ py: 6, maxWidth: 460 }}>
          <Typography variant="h2">Todavía no hay proyectos.</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Un proyecto agrupa tareas con un mismo objetivo y un responsable.
          </Typography>
          <Button variant="outlined" sx={{ mt: 2.5 }} onClick={() => setDialogOpen(true)}>
            Nuevo proyecto
          </Button>
        </Box>
      )}

      <ProjectDialog
        open={dialogOpen}
        project={null}
        users={users}
        onClose={() => setDialogOpen(false)}
        onSaved={() => {
          setDialogOpen(false);
          load();
        }}
      />
    </>
  );
}
