import { CardHeader } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';

export const Home: React.FC = () => {
  return (
    <Grid size={12}>
      <Card>
        <CardHeader title="Word Unscrambler" />
        <CardContent>
          <Typography>
            A fullstack TypeScript word unscrambler built with React, Vite, and Express.
          </Typography>
          <Typography>
            Enter letters to find all valid words that can be formed from them.
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};
