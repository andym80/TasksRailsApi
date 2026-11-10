'use client';

import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import type { TaskStatus } from '@/lib/api';
import { STATUS_LABEL } from '@/lib/tasks';
import { colors } from '@/app/theme';

// One ring per status: empty, half full, full with a check.
export function StatusIcon({ status, size = 22 }: { status: TaskStatus; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" aria-hidden="true" focusable="false">
      {status === 'pending' && <circle cx="11" cy="11" r="9" fill="none" stroke={colors.muted} strokeWidth="2" />}
      {status === 'in_progress' && (
        <>
          <circle cx="11" cy="11" r="9" fill="none" stroke={colors.blue} strokeWidth="2" />
          <path d="M11 5.5a5.5 5.5 0 0 1 0 11z" fill={colors.blue} />
        </>
      )}
      {status === 'completed' && (
        <>
          <circle cx="11" cy="11" r="10" fill={colors.viridian} />
          <path d="M6.5 11.3l3 3 6-6.4" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}

const STATUSES: TaskStatus[] = ['pending', 'in_progress', 'completed'];

export default function StatusButton({
  status,
  taskTitle,
  onChange,
}: {
  status: TaskStatus;
  taskTitle: string;
  onChange: (status: TaskStatus) => void;
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  return (
    <>
      <IconButton
        aria-label={`Estado de “${taskTitle}”: ${STATUS_LABEL[status]}. Cambiar estado`}
        aria-haspopup="menu"
        onClick={(event) => setAnchor(event.currentTarget)}
        sx={{ p: 1.25 }}
      >
        <StatusIcon status={status} />
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {STATUSES.map((option) => (
          <MenuItem
            key={option}
            selected={option === status}
            onClick={() => {
              setAnchor(null);
              if (option !== status) onChange(option);
            }}
          >
            <ListItemIcon sx={{ minWidth: 34 }}>
              <StatusIcon status={option} size={20} />
            </ListItemIcon>
            {STATUS_LABEL[option]}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
