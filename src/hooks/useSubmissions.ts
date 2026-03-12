import { useState, useCallback } from 'react';
import type { Submission } from '../types';
import { submissions as initialSubmissions } from '../data/mockData';

export function useSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);

  const createSubmission = useCallback((data: Omit<Submission, 'id' | 'createdAt' | 'updatedAt' | 'documentCount' | 'writingProjectCount'>) => {
    const newSubmission: Submission = {
      ...data,
      id: `sub-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      documentCount: 0,
      writingProjectCount: 0,
    };
    setSubmissions(prev => [...prev, newSubmission]);
    return newSubmission;
  }, []);

  const updateSubmission = useCallback((id: string, data: Partial<Submission>) => {
    setSubmissions(prev =>
      prev.map(sub =>
        sub.id === id
          ? { ...sub, ...data, updatedAt: new Date().toISOString().split('T')[0] }
          : sub
      )
    );
  }, []);

  const deleteSubmission = useCallback((id: string) => {
    setSubmissions(prev => prev.filter(sub => sub.id !== id));
  }, []);

  const getSubmission = useCallback((id: string) => {
    return submissions.find(sub => sub.id === id);
  }, [submissions]);

  return {
    submissions,
    createSubmission,
    updateSubmission,
    deleteSubmission,
    getSubmission,
  };
}
