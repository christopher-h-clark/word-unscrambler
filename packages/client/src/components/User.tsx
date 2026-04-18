import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import React from 'react';
import type { IUserDTO } from '../types/shared';
import { getUserFullName } from '../types/shared';

interface IProps {
  user: IUserDTO;
}

export const User: React.FC<IProps> = ({ user }) => (
  <Card data-testid="user-card">
    <CardHeader data-testid="user-card-header" title={`User: ${getUserFullName(user)}`} />
    <CardContent>
      <Typography>Id: {user.userId}</Typography>
      <Typography>Image Url: {user.imageUrl}</Typography>
    </CardContent>
  </Card>
);
