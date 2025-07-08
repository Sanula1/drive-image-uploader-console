
import React from 'react';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">
          🔧 Testing Preview - Can you see this?
        </h1>
        <p className="text-xl text-muted-foreground">
          If you can see this message, the preview is working!
        </p>
        <div className="mt-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg border">
          <p className="text-foreground font-medium">Preview Status: ✅ WORKING</p>
        </div>
        <div className="mt-8 p-6 bg-card border rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Ready to Build Your Google Drive Image Uploader
          </h2>
          <p className="text-muted-foreground">
            Once the preview is working, we can create your image upload functionality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
