import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, FileStack, Calendar, Pill } from 'lucide-react';
import type { Submission } from '../types';
import { useSubmissions } from '../hooks/useSubmissions';
import { SubmissionModal } from '../components/SubmissionModal';

export function Submissions() {
  const { submissions, createSubmission, updateSubmission, deleteSubmission } = useSubmissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(null);

  const filteredSubmissions = submissions.filter(
    sub =>
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.drugName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = (data: Omit<Submission, 'id' | 'createdAt' | 'updatedAt' | 'documentCount' | 'writingProjectCount'>) => {
    createSubmission(data);
    setIsModalOpen(false);
  };

  const handleUpdate = (data: Omit<Submission, 'id' | 'createdAt' | 'updatedAt' | 'documentCount' | 'writingProjectCount'>) => {
    if (editingSubmission) {
      updateSubmission(editingSubmission.id, data);
      setEditingSubmission(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      deleteSubmission(id);
    }
  };

  const openEditModal = (submission: Submission) => {
    setEditingSubmission(submission);
  };

  const getStatusColor = (status: Submission['status']) => {
    switch (status) {
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'under_review':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'submitted':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">eCTD Submissions</h1>
          <p className="text-slate-500 mt-1">Manage your regulatory submissions</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          New Submission
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search submissions by name or drug..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid gap-4">
        {filteredSubmissions.map(submission => (
          <div
            key={submission.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <Link
                  to={`/submissions/${submission.id}`}
                  className="flex-1 group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {submission.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        submission.status
                      )}`}
                    >
                      {submission.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Pill className="w-4 h-4" />
                      {submission.drugName}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FileStack className="w-4 h-4" />
                      {submission.documentCount} documents
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      Target: {submission.targetDate}
                    </span>
                  </div>
                </Link>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => openEditModal(submission)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(submission.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width:
                        submission.status === 'submitted'
                          ? '100%'
                          : submission.status === 'under_review'
                          ? '75%'
                          : submission.status === 'in_progress'
                          ? '50%'
                          : '25%',
                    }}
                  />
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {submission.submissionType}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <SubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
      />

      <SubmissionModal
        isOpen={!!editingSubmission}
        onClose={() => setEditingSubmission(null)}
        onSubmit={handleUpdate}
        initialData={editingSubmission}
      />
    </div>
  );
}
