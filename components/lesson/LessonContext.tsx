'use client';

import { createContext, useContext } from 'react';

type LessonContextType = {
  run: () => void;
  running: boolean;
};

const LessonContext = createContext<LessonContextType | null>(null);

export function LessonProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: LessonContextType;
}) {
  return (
    <LessonContext.Provider value={value}>
      {children}
    </LessonContext.Provider>
  );
}

export function useLesson() {
  const ctx = useContext(LessonContext);
  if (!ctx) {
    throw new Error('useLesson must be used inside LessonProvider');
  }
  return ctx;
}
