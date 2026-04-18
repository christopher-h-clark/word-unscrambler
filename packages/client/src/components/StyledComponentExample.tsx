import { Button, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { styled } from '@mui/system';
import React from 'react';

const CustomCardHeader = styled(CardHeader)`
  background-color: bisque;
`;

const CustomButton = styled(Button)`
  background-color: orange;
  color: black;
`;

export const StyledComponentExample: React.FC = () => (
  <Card>
    <CustomCardHeader title="Styled Component Example" />
    <CardContent>
      <Typography>This is an example of styled component.</Typography>
      <CustomButton>Custom button</CustomButton>
    </CardContent>
  </Card>
);
