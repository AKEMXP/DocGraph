export interface Organization {
  id: string;
  name: string;
  description: string;
  userCount: number;
  submissionsInProgress: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'writer' | 'reviewer';
  avatar?: string;
}

export interface Submission {
  id: string;
  name: string;
  status: 'draft' | 'in_progress' | 'under_review' | 'submitted' | 'archived';
  drugName: string;
  submissionType: 'NDA' | 'BLA' | 'ANDA' | 'IND' | 'MAA';
  targetDate: string;
  createdAt: string;
  updatedAt: string;
  documentCount: number;
  writingProjectCount: number;
}
