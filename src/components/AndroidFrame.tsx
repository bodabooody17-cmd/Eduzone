import React from 'react';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  return (
    <div className="w-full min-h-screen bg-slate-900 flex justify-center items-start overflow-x-hidden">
      <div className="w-full max-w-5xl min-h-screen bg-slate-50 relative shadow-2xl flex flex-col overflow-x-hidden">
        {children}
      </div>
    </div>
  );
};
