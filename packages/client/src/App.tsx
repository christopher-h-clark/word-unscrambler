import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-text-primary text-center">Word Unscrambler</h1>
        <p className="text-muted-foreground text-center text-sm">
          Enter your letters to find all possible words
        </p>
        <div className="space-y-4">
          <Input placeholder="Enter letters (e.g. a b c d e)" />
          <Button className="w-full">Find Words</Button>
        </div>
      </div>
    </div>
  );
};
