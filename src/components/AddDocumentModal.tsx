import { useEffect, useState } from 'react';
import { X, FileText, Link2, Upload, Cloud, Sparkles, FilePlus, Trash2 } from 'lucide-react';
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

const CREATION_OPTIONS = [
  { id: 'upload' as const, label: 'Upload a document', icon: Upload },
  { id: 'veeva' as const, label: 'Import from Veeva', icon: Cloud },
  { id: 'generate' as const, label: 'Generate initial draft', icon: Sparkles },
  { id: 'empty' as const, label: 'Create empty doc', icon: FilePlus },
];

const SUBMISSION_DOC_TYPES = [
  { value: 'clinical_overview', label: 'Clinical Overview' },
  { value: 'clinical_summary', label: 'Clinical Summary' },
  { value: 'ib', label: 'Investigator Brochure' },
  { value: 'cmc', label: 'CMC' },
  { value: 'nonclinical', label: 'Nonclinical Overview' },
  { value: 'labeling', label: 'Labeling (CCDS / SmPC / USPI)' },
  { value: 'smpc', label: 'SmPC' },
  { value: 'uspi', label: 'USPI' },
  { value: 'protocol', label: 'Protocol' },
  { value: 'sap', label: 'SAP' },
  { value: 'csr', label: 'CSR' },
];

const STUDY_DOC_TYPES = [
  { value: 'icf', label: 'ICF' },
  { value: 'pis', label: 'PIS' },
  { value: 'crf', label: 'CRF' },
  { value: 'protocol', label: 'Protocol' },
  { value: 'sap', label: 'SAP' },
  { value: 'csr', label: 'CSR' },
];

const STUDY_SPECIFIC_DOC_TYPES = ['protocol', 'sap', 'csr', 'icf', 'pis', 'crf'];

// Mock Veeva documents for import mockup
const MOCK_VEEVA_DOCS = [
  { id: 'veeva-1', name: 'Clinical Summary Study 202 v2.1', type: 'Clinical Summary', docType: 'clinical_summary' },
  { id: 'veeva-2', name: 'Clinical Overview Draft v0.5', type: 'Clinical Overview', docType: 'clinical_overview' },
  { id: 'veeva-3', name: 'IB_Oncoxib_v5.0', type: 'Investigator Brochure', docType: 'ib' },
];

export function AddDocumentModal({
  isOpen,
  context,
  studies = [],
  defaultStudyId,
  supportingOptions,
  onClose,
  onSubmit,
}: AddDocumentModalProps) {
  const [step, setStep] = useState<'creation' | 'import' | 'form'>('creation');
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
    setStep('creation');
    setForm(prev => ({
      context,
      studyId: defaultStudyId ?? prev.studyId,
      title: '',
      shortName: '',
      docType: context === 'study' ? 'icf' : 'clinical_summary',
      status: 'draft',
      version: '0.1',
      creationMode: 'upload',
      supportingDocIds: [],
    }));
  }, [isOpen, context, defaultStudyId]);

  if (!isOpen) return null;

  const handleCreationSelect = (mode: AddDocumentForm['creationMode']) => {
    setForm(prev => ({ ...prev, creationMode: mode }));
    if (mode === 'upload' || mode === 'veeva') {
      setStep('import');
    } else {
      setStep('form');
    }
  };

  const handleImportComplete = (autoFilled: Partial<AddDocumentForm>) => {
    setForm(prev => ({ ...prev, ...autoFilled }));
    setStep('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  const scopeLabel =
    context === 'study'
      ? 'This document will be added to the current study.'
      : 'This document will be added to this submission.';

  const docTypes = context === 'study' ? STUDY_DOC_TYPES : SUBMISSION_DOC_TYPES;
  const isStudySpecific =
    context === 'submission' && STUDY_SPECIFIC_DOC_TYPES.includes(form.docType);
  const availableSupporting = supportingOptions.filter(o => !form.supportingDocIds.includes(o.id));
  const selectedSupporting = form.supportingDocIds
    .map(id => supportingOptions.find(o => o.id === id))
    .filter(Boolean) as SupportingDocOption[];

  // Step 1: Creation mode dialog
  if (step === 'creation') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md m-4 p-6">
          <div className="flex items-center justify-between mb-6">
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
          <p className="text-sm font-medium text-slate-600 mb-4">How do you want to start?</p>
          <div className="grid grid-cols-2 gap-3">
            {CREATION_OPTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => handleCreationSelect(id)}
                className="flex items-center gap-3 p-4 rounded-xl border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-slate-600" />
                </div>
                <span className="text-sm font-medium text-slate-800">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Import mockup (Upload or Veeva)
  if (step === 'import') {
    const isVeeva = form.creationMode === 'veeva';
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {isVeeva ? (
                <Cloud className="w-5 h-5 text-blue-600" />
              ) : (
                <Upload className="w-5 h-5 text-blue-600" />
              )}
              <div>
                <h2 className="text-base font-semibold text-slate-800">
                  {isVeeva ? 'Import from Veeva' : 'Upload a document'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isVeeva
                    ? 'Select a document from your Veeva Vault to import.'
                    : 'Select a file to upload. Metadata will be extracted automatically.'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {isVeeva ? (
            <div className="space-y-2 mb-6">
              {MOCK_VEEVA_DOCS.map(doc => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() =>
                    handleImportComplete({
                      title: doc.name,
                      shortName: doc.type,
                      docType: doc.docType,
                      status: 'draft',
                      version: '1.0',
                    })
                  }
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 text-left transition-colors"
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{doc.name}</p>
                    <p className="text-xs text-slate-500">{doc.type}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div
              onClick={() =>
                handleImportComplete({
                  title: 'Clinical Summary (Study 202)',
                  shortName: 'Clinical Summary',
                  docType: 'clinical_summary',
                  status: 'draft',
                  version: '0.1',
                })
              }
              className="mb-6 flex flex-col items-center justify-center py-12 px-6 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-colors"
            >
              <Upload className="w-10 h-10 text-slate-400 mb-3" />
              <p className="text-sm font-medium text-slate-600">Drop file here or click to browse</p>
              <p className="text-xs text-slate-400 mt-1">DOCX, PDF supported</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Step 3: Add Document form
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
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

          <div
            className={`grid gap-4 ${isStudySpecific ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'}`}
          >
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Document Type
              </label>
              <select
                value={form.docType}
                onChange={e =>
                  setForm(prev => {
                    const docType = e.target.value;
                    const willBeStudySpecific =
                      context === 'submission' && STUDY_SPECIFIC_DOC_TYPES.includes(docType);
                    return {
                      ...prev,
                      docType,
                      studyId: willBeStudySpecific ? prev.studyId : undefined,
                    };
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {docTypes.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {isStudySpecific && (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Attach to study <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.studyId || ''}
                  onChange={e => {
                    const v = e.target.value;
                    setForm(prev => ({
                      ...prev,
                      studyId: v === '__new__' ? '__new__' : v || undefined,
                    }));
                  }}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a study...</option>
                  <option value="__new__">Create new study...</option>
                  {studies.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.studyId} • {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
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
            <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1.5">
              <Link2 className="w-3 h-3" />
              Supporting documents (optional)
            </label>
            <p className="text-[11px] text-slate-400 mb-2">
              Add upstream sources that this document will depend on.
            </p>
            <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border border-slate-200 rounded-lg bg-slate-50/50">
              {selectedSupporting.map(opt => (
                <span
                  key={opt.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-700"
                >
                  {opt.label} • {opt.type}
                  <button
                    type="button"
                    onClick={() =>
                      setForm(prev => ({
                        ...prev,
                        supportingDocIds: prev.supportingDocIds.filter(id => id !== opt.id),
                      }))
                    }
                    className="p-0.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {availableSupporting.length > 0 && (
                <select
                  value=""
                  onChange={e => {
                    const id = e.target.value;
                    if (id)
                      setForm(prev => ({
                        ...prev,
                        supportingDocIds: [...prev.supportingDocIds, id],
                      }));
                    e.target.value = '';
                  }}
                  className="px-2 py-1 rounded-md border border-dashed border-slate-300 text-xs text-slate-500 bg-transparent hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">+ Add document</option>
                  {availableSupporting.map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label} • {opt.type}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={() => setStep('creation')}
              className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors text-sm"
            >
              ← Back
            </button>
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
