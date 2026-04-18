import { CardHeader } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';

export const Usage: React.FC = () => (
  <Grid size={12}>
    <Card>
      <CardHeader title="Usage" />
      <CardContent>
        <Typography>
          <strong>npm run dev</strong> — Starts both client (port 5173) and server (port 3000)
        </Typography>
        <Typography>
          <strong>npm run dev:client</strong> — Frontend only (Vite on port 5173)
        </Typography>
        <Typography>
          <strong>npm run dev:server</strong> — Backend only (Express on port 3000)
        </Typography>
        <Typography>
          <strong>npm run build</strong> — Production build for all workspaces
        </Typography>
        <Typography>
          <strong>npm run lint</strong> — ESLint check across all workspaces
        </Typography>
        <Typography>
          <strong>npm run type-check</strong> — TypeScript strict check across all workspaces
        </Typography>
      </CardContent>
    </Card>
  </Grid>
);
