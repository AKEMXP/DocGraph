import { useEffect, useState } from 'react';
import { X, FileText, Link2 } from 'lucide-react';
import type { Study } from '../data/mockData';

type GraphContext = 'submission' | 'study';

export interface SupportingDocOption {
  id: string;
  label: string;
  type: string;
}

export interface AddDocumentForm {
  context: GraphContext;
  studyId?: string;
  title: string;
  shortName: string;
  docType: string;
  status: string;
  version: string;
  creationMode: 'upload' | 'veeva' | 'generate' | 'empty';
  supportingDocIds: string[];
}

interface AddDocumentModalProps {
  isOpen: boolean;
  context: GraphContext;
  studies?: Study[];
  defaultStudyId?: string;
  supportingOptions: SupportingDocOption[];
  onClose: () => void;
  onSubmit: (form: AddDocumentForm) => void;
}

export function AddDocumentModal({
  isOpen,
  context,
  studies = [],
  defaultStudyId,
  supportingOptions,
  onClose,
  onSubmit,
}: AddDocumentModalProps) {
  const [form, setForm] = useState<AddDocumentForm>({
    context,
    studyId: defaultStudyId,
    title: '',
    shortName: '',
    docType: context === 'study' ? 'icf' : 'clinical_summary',
    status: 'draft',
    version: '0.1',
    creationMode: 'upload',
    supportingDocIds: [],
  });

  useEffect(() => {
    if (!isOpen) return;
    setForm(prev => ({
      context,
      studyId: defaultStudyId ?? prev.studyId,
      title: '',
      shortName: '',
      docType: context === 'study' ? 'icf' : 'clinical_summary',
      status: 'draft',
      version: '0.1',
      creationMode: 'upload',
      supportingDocIds: supportingOptions.slice(0, 2).map(o => o.id),
    }));
  }, [isOpen, context, defaultStudyId, supportingOptions]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  const scopeLabel =
    context === 'study'
      ? 'This document will be added to the current study.'
      : 'This document will be added to this submission.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl m-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-base font-semibold text-slate-800">Add Document</h2>
              <p className="text-xs text-slate-500">{scopeLabel}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {context === 'submission' && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Attach to study (optional)
              </label>
              <select
                value={form.studyId || ''}
                onChange={e =>
                  setForm(prev => ({ ...prev, studyId: e.target.value || undefined }))
                }
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No specific study</option>
                {studies.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.studyId} • {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Document Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Clinical Summary (Study 202)"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Short Name
              </label>
              <input
                type="text"
                value={form.shortName}
                onChange={e => setForm(prev => ({ ...prev, shortName: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Clinical Summary"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Document Type
              </label>
              <select
                value={form.docType}
                onChange={e => setForm(prev => ({ ...prev, docType: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {context === 'study' ? (
                  <>
                    <option value="icf">ICF</option>
                    <option value="pis">PIS</option>
                    <option value="crf">CRF</option>
                  </>
                ) : (
                  <>
                    <option value="clinical_overview">Clinical Overview</option>
                    <option value="clinical_summary">Clinical Summary</option>
                    <option value="ib">Investigator Brochure</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="in_review">In Review</option>
                <option value="approved">Approved</option>
                <option value="final">Final</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Version
              </label>
              <input
                type="text"
                value={form.version}
                onChange={e => setForm(prev => ({ ...prev, version: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 0.1"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              How do you want to start?
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'upload', label: 'Upload a document' },
                { id: 'veeva', label: 'Import from Veeva' },
                { id: 'generate', label: 'Generate initial draft' },
                { id: 'empty', label: 'Create empty doc' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    setForm(prev => ({ ...prev, creationMode: opt.id as AddDocumentForm['creationMode'] }))
                  }
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border ${
                    form.creationMode === opt.id
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1.5">
              <Link2 className="w-3 h-3" />
              Supporting documents (optional)
            </label>
            <p className="text-[11px] text-slate-400 mb-1">
              Multi-select upstream sources that this document will depend on.
            </p>
            <select
              multiple
              value={form.supportingDocIds}
              onChange={e => {
                const selected = Array.from(e.target.selectedOptions).map(o => o.value);
                setForm(prev => ({ ...prev, supportingDocIds: selected }));
              }}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 h-28"
            >
              {supportingOptions.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.label} • {opt.type}
                </option>
              ))}
            </select>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() =>
                  setForm(prev => ({
                    ...prev,
                    supportingDocIds: supportingOptions.slice(0, 2).map(o => o.id),
                  }))
                }
                className="px-2 py-1 rounded-lg border border-slate-200 text-[11px] text-slate-600 hover:bg-slate-50"
              >
                Refresh suggestions
              </button>
              <button
                type="button"
                onClick={() =>
                  setForm(prev => ({
                    ...prev,
                    supportingDocIds: supportingOptions.map(o => o.id),
                  }))
                }
                className="px-2 py-1 rounded-lg border border-slate-200 text-[11px] text-slate-600 hover:bg-slate-50"
              >
                Import from Veeva
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Add Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

