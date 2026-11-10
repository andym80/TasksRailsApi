'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { Task, TaskStatus } from '@/lib/api';
import { GROUP_LABEL, PRIORITY_LABEL, dueLabel, groupOf, groupTasks, type GroupKey } from '@/lib/tasks';
import { colors } from '@/app/theme';
import StatusButton from './StatusButton';

function TaskRow({
  task,
  showProject,
  onStatusChange,
  onOpen,
}: {
  task: Task;
  showProject: boolean;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  onOpen: (task: Task) => void;
}) {
  const done = task.status === 'completed';
  const overdue = groupOf(task) === 'overdue';

  return (
    <Box
      component="li"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        pl: 0.5,
        '& + &': { borderTop: `1px solid ${colors.line}` },
      }}
    >
      <StatusButton status={task.status} taskTitle={task.title} onChange={(status) => onStatusChange(task, status)} />
      <ButtonBase
        onClick={() => onOpen(task)}
        aria-label={`Editar “${task.title}”`}
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr auto auto' },
          alignItems: 'center',
          columnGap: 3,
          rowGap: 0.25,
          py: 1.5,
          pr: 2,
          textAlign: 'left',
          justifyContent: 'stretch',
          borderRadius: 1,
          '&:hover .task-title': { textDecoration: 'underline' },
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            className="task-title"
            sx={{
              fontWeight: 600,
              color: done ? colors.muted : colors.ink,
              textDecoration: done ? 'line-through' : 'none',
              overflowWrap: 'anywhere',
            }}
          >
            {task.title}
          </Typography>
          {(showProject || task.assigned_to) && (
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 1.5 }}>
              {showProject && task.project && <span>{task.project.name}</span>}
              {task.assigned_to && <span>{task.assigned_to.name}</span>}
            </Typography>
          )}
        </Box>
        <Typography
          variant="body2"
          sx={{
            display: task.priority === 'high' && !done ? 'block' : { xs: 'none', sm: 'block' },
            minWidth: 44,
            fontWeight: task.priority === 'high' ? 700 : 400,
            color: task.priority === 'high' && !done ? colors.red : colors.muted,
          }}
        >
          <Box component="span" sx={visuallyHidden}>
            Prioridad{' '}
          </Box>
          {PRIORITY_LABEL[task.priority]}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            minWidth: { sm: 132 },
            textAlign: { sm: 'right' },
            fontWeight: overdue ? 700 : 400,
            color: overdue ? colors.amber : colors.muted,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {dueLabel(task)}
        </Typography>
      </ButtonBase>
    </Box>
  );
}

const visuallyHidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
} as const;

function Group({
  groupKey,
  tasks,
  children,
}: {
  groupKey: GroupKey;
  tasks: Task[];
  children: React.ReactNode;
}) {
  // Completed work is kept out of the way until someone asks for it.
  const collapsible = groupKey === 'completed';
  const [open, setOpen] = useState(!collapsible);
  const headingId = `group-${groupKey}`;
  const heading = (
    <>
      <Typography component="span" variant="h3" sx={{ color: groupKey === 'overdue' ? colors.amber : colors.ink }}>
        {GROUP_LABEL[groupKey]}
      </Typography>
      <Typography component="span" variant="body2" color="text.secondary" sx={{ fontVariantNumeric: 'tabular-nums' }}>
        {tasks.length}
      </Typography>
    </>
  );

  return (
    <Box
      component="section"
      aria-labelledby={headingId}
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '168px 1fr' },
        columnGap: 3,
        rowGap: 1,
        alignItems: 'start',
      }}
    >
      <Box
        component="h2"
        id={headingId}
        sx={{ m: 0, position: { md: 'sticky' }, top: { md: 76 }, pt: { md: 1.75 } }}
      >
        {collapsible ? (
          <ButtonBase
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            sx={{ display: 'flex', alignItems: 'baseline', gap: 1, borderRadius: 1, py: 0.25, pr: 0.5 }}
          >
            {heading}
            <ExpandMoreIcon
              fontSize="small"
              sx={{ alignSelf: 'center', color: colors.muted, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}
            />
          </ButtonBase>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>{heading}</Box>
        )}
      </Box>
      {open ? (
        <Box
          component="ul"
          sx={{
            listStyle: 'none',
            m: 0,
            p: 0,
            bgcolor: colors.surface,
            border: `1px solid ${colors.line}`,
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: groupKey === 'overdue' ? `inset 3px 0 0 ${colors.amber}` : 'none',
          }}
        >
          {children}
        </Box>
      ) : (
        <Box />
      )}
    </Box>
  );
}

export default function TaskList({
  tasks,
  showProject = true,
  onStatusChange,
  onOpen,
}: {
  tasks: Task[];
  showProject?: boolean;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  onOpen: (task: Task) => void;
}) {
  return (
    <Box sx={{ display: 'grid', rowGap: { xs: 3.5, md: 3 } }}>
      {groupTasks(tasks).map((group) => (
        <Group key={group.key} groupKey={group.key} tasks={group.tasks}>
          {group.tasks.map((task) => (
            <TaskRow key={task.id} task={task} showProject={showProject} onStatusChange={onStatusChange} onOpen={onOpen} />
          ))}
        </Group>
      ))}
    </Box>
  );
}
