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
import toast from 'react-hot-toast';
import { apiErrors, createProject, updateProject, type Project, type User } from '@/lib/api';

interface FormValues {
  name: string;
  description: string;
  user_id: string;
}

function valuesFor(project: Project | null, users: User[]): FormValues {
  return {
    name: project?.name ?? '',
    description: project?.description ?? '',
    user_id: String(project?.user_id ?? users[0]?.id ?? ''),
  };
}

interface ProjectDialogProps {
  open: boolean;
  /** The project being edited, or null to create one. */
  project: Project | null;
  users: User[];
  onClose: () => void;
  onSaved: (project: Project) => void;
}

function ProjectForm({
  project,
  users,
  onClose,
  onSaved,
}: ProjectDialogProps) {
  const { control, register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: valuesFor(project, users),
  });
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const { errors, isSubmitting } = formState;

  const save = handleSubmit(async (values) => {
    const data = {
      name: values.name.trim(),
      description: values.description.trim() || null,
      user_id: Number(values.user_id),
    };
    try {
      const response = project ? await updateProject(project.id, data) : await createProject(data);
      toast.success(project ? 'Proyecto guardado' : 'Proyecto creado');
      onSaved(response.data);
    } catch (error) {
      const reasons = apiErrors(error);
      setServerErrors(reasons.length ? reasons : ['No se pudo guardar el proyecto. Revisá que la API esté en línea y probá de nuevo.']);
    }
  });

  return (
      <form onSubmit={save} noValidate>
        <DialogTitle>{project ? 'Editar proyecto' : 'Nuevo proyecto'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2.5, pt: 1 }}>
            {serverErrors.length > 0 && (
              <Alert severity="error">
                {serverErrors.map((message) => (
                  <div key={message}>{message}</div>
                ))}
              </Alert>
            )}
            {users.length === 0 && (
              <Alert severity="info">
                Todavía no hay usuarios. Cargá los de ejemplo con <code>rails db:seed</code> para poder asignar un responsable.
              </Alert>
            )}
            <TextField
              label="Nombre"
              autoFocus
              required
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              {...register('name', { validate: (value) => value.trim().length > 0 || 'Escribí un nombre para el proyecto.' })}
            />
            <TextField label="Descripción" multiline minRows={2} maxRows={6} {...register('description')} />
            <Controller
              name="user_id"
              control={control}
              rules={{ required: 'Elegí quién es responsable del proyecto.' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Responsable"
                  required
                  disabled={users.length === 0}
                  error={Boolean(errors.user_id)}
                  helperText={errors.user_id?.message}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={String(user.id)}>
                      {user.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting || users.length === 0}>
            {project ? 'Guardar cambios' : 'Crear proyecto'}
          </Button>
        </DialogActions>
      </form>
  );
}

// The form mounts each time the dialog opens, so it always starts from the project it was given.
export default function ProjectDialog(props: ProjectDialogProps) {
  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="sm" fullWidth>
      <ProjectForm key={props.users.length} {...props} />
    </Dialog>
  );
}
