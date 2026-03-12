import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Submission } from '../types';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Submission, 'id' | 'createdAt' | 'updatedAt' | 'documentCount' | 'writingProjectCount'>) => void;
  initialData?: Submission | null;
}

export function SubmissionModal({ isOpen, onClose, onSubmit, initialData }: SubmissionModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    drugName: '',
    submissionType: 'NDA' as Submission['submissionType'],
    status: 'draft' as Submission['status'],
    targetDate: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        drugName: initialData.drugName,
        submissionType: initialData.submissionType,
        status: initialData.status,
        targetDate: initialData.targetDate,
      });
    } else {
      setFormData({
        name: '',
        drugName: '',
        submissionType: 'NDA',
        status: 'draft',
        targetDate: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 m-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">
            {initialData ? 'Edit Submission' : 'New Submission'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Submission Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., NDA-2024-001 Oncology Treatment"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Drug Name
            </label>
            <input
              type="text"
              value={formData.drugName}
              onChange={e => setFormData(prev => ({ ...prev, drugName: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Oncoxib"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Submission Type
              </label>
              <select
                value={formData.submissionType}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    submissionType: e.target.value as Submission['submissionType'],
                  }))
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="NDA">NDA</option>
                <option value="BLA">BLA</option>
                <option value="ANDA">ANDA</option>
                <option value="IND">IND</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    status: e.target.value as Submission['status'],
                  }))
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="in_progress">In Progress</option>
                <option value="under_review">Under Review</option>
                <option value="submitted">Submitted</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Target Date
            </label>
            <input
              type="date"
              value={formData.targetDate}
              onChange={e => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {initialData ? 'Save Changes' : 'Create Submission'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
