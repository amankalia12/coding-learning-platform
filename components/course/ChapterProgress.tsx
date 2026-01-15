'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { getCompletedLessons } from '@/lib/progress';

export default function ChapterProgress({
  lessonIds,
}: {
  lessonIds: string[];
}) {
  const { user } = useAuth();
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    async function load() {
      if (!user) return;

      const completed = await getCompletedLessons(
        user.id,
        lessonIds
      );
      setCompletedCount(completed.length);
    }

    load();
  }, [user, lessonIds]);

  if (!user) return null;

  const percent =
    lessonIds.length === 0
      ? 0
      : Math.round(
          (completedCount / lessonIds.length) * 100
        );

  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs text-white/60 mb-1">
        <span>
          {completedCount} / {lessonIds.length} completed
        </span>
        <span>{percent}%</span>
      </div>

      <div className="h-2 bg-white/10 rounded">
        <div
          className="h-2 bg-green-500 rounded"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
