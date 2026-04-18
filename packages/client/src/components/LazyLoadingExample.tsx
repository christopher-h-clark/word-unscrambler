import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import React, { lazy, Suspense } from 'react';

const LazilyLoadedContent = lazy(() => import('./LazilyLoadedContent'));

const Spinner: React.FC = () => <div>LOADING...</div>;

export const LazyLoadingExample: React.FC = () => (
  <Card>
    <CardHeader title="Lazy Loading Example" />
    <CardContent>
      <Suspense fallback={<Spinner />}>
        <LazilyLoadedContent />
      </Suspense>
    </CardContent>
  </Card>
);
