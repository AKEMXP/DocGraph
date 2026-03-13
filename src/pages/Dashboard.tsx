import { Link } from 'react-router-dom';
import { FileStack, AlertCircle, ArrowRight, Building2, FileText, Clock, CheckCircle, Edit3, ArrowUpRight } from 'lucide-react';
import { organization, submissions, recentDocuments, getDocumentsWithPendingUpdates, getTotalDocumentCount } from '../data/mockData';

export function Dashboard() {
  const docsWithPendingUpdates = getDocumentsWithPendingUpdates();
  const pendingUpdatesCount = docsWithPendingUpdates.reduce((acc, doc) => acc + doc.pendingUpdates.length, 0);
  const totalDocuments = getTotalDocumentCount();

  const stats = [
    {
      label: 'Active Submissions',
      value: organization.submissionsInProgress,
      icon: FileStack,
      color: 'bg-blue-500',
    },
    {
      label: 'Pending Updates',
      value: pendingUpdatesCount,
      icon: AlertCircle,
      color: pendingUpdatesCount > 0 ? 'bg-amber-500' : 'bg-slate-400',
      highlight: pendingUpdatesCount > 0,
      subtitle: pendingUpdatesCount > 0 ? `${docsWithPendingUpdates.length} documents affected` : undefined,
    },
    {
      label: 'Total Documents',
      value: totalDocuments,
      icon: FileText,
      color: 'bg-emerald-500',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'final':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'in_review':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'draft':
        return <Edit3 className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{organization.name}</h1>
            <p className="text-blue-100 max-w-2xl">{organization.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-white rounded-xl p-6 shadow-sm border ${stat.highlight ? 'border-amber-200' : 'border-slate-200'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
                  {stat.subtitle && (
                    <p className={`text-xs mt-1 ${stat.highlight ? 'text-amber-600 font-medium' : 'text-slate-400'}`}>
                      {stat.subtitle}
                    </p>
                  )}
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Recent Submissions</h2>
              <Link
                to="/submissions"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {submissions.slice(0, 4).map(submission => (
              <Link
                key={submission.id}
                to={`/submissions/${submission.id}`}
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-slate-800">{submission.name}</p>
                  <p className="text-sm text-slate-500">{submission.drugName}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    submission.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-700'
                      : submission.status === 'under_review'
                      ? 'bg-amber-100 text-amber-700'
                      : submission.status === 'submitted'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {submission.status.replace('_', ' ')}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-amber-200">
          <div className="p-6 border-b border-amber-100 bg-amber-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-semibold text-slate-800">Pending Updates</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                {pendingUpdatesCount} updates
              </span>
            </div>
          </div>
          <div className="divide-y divide-slate-100 max-h-[320px] overflow-y-auto">
            {docsWithPendingUpdates.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                <CheckCircle className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                <p className="text-sm">All documents are up to date</p>
              </div>
            ) : (
              docsWithPendingUpdates.map(doc => (
                <Link
                  key={doc.id}
                  to={`/submissions/${doc.submissionId}?focus=${doc.id}`}
                  className="flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-sm truncate">{doc.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{doc.submissionName}</p>
                    <div className="mt-1.5 space-y-0.5">
                      {doc.pendingUpdates.slice(0, 2).map((update, idx) => (
                        <div key={idx} className="flex items-center gap-1 text-[11px] text-slate-500">
                          <ArrowUpRight className="w-3 h-3 text-amber-500" />
                          <span className="truncate">{update.sourceDocName}: {update.sourceSection}</span>
                        </div>
                      ))}
                      {doc.pendingUpdates.length > 2 && (
                        <p className="text-[10px] text-slate-400">+{doc.pendingUpdates.length - 2} more</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">My Recent Documents</h2>
              <FileText className="w-5 h-5 text-slate-400" />
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {recentDocuments.slice(0, 5).map(doc => (
              <Link
                key={doc.id}
                to={`/submissions/${doc.submissionId}?focus=${doc.id}`}
                className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 text-sm truncate">{doc.name}</p>
                  <p className="text-xs text-slate-400">{doc.submissionName}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {getStatusIcon(doc.status)}
                  <span className="text-[10px] text-slate-400">{formatTimeAgo(doc.lastEditedAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
