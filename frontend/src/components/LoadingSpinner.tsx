import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-primary rounded-full animate-pulse"></div>
          <Loader2 className="w-8 h-8 text-primary-foreground animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-muted-foreground animate-pulse">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;