import type { Organization, User, Submission } from '../types';

export const organization: Organization = {
  id: 'org-1',
  name: 'PharmaCorp Research',
  description: 'Leading pharmaceutical research organization specializing in oncology and immunology treatments',
  userCount: 24,
  submissionsInProgress: 3,
};

export const users: User[] = [
  { id: 'user-1', name: 'Dr. Sarah Chen', email: 'sarah.chen@pharmacorp.com', role: 'admin' },
  { id: 'user-2', name: 'James Wilson', email: 'james.wilson@pharmacorp.com', role: 'writer' },
  { id: 'user-3', name: 'Emily Rodriguez', email: 'emily.rodriguez@pharmacorp.com', role: 'reviewer' },
  { id: 'user-4', name: 'Michael Park', email: 'michael.park@pharmacorp.com', role: 'writer' },
  { id: 'user-5', name: 'Lisa Thompson', email: 'lisa.thompson@pharmacorp.com', role: 'reviewer' },
];

export const submissions: Submission[] = [
  {
    id: 'sub-1',
    name: 'NDA-2024-001 Oncology Treatment',
    status: 'in_progress',
    drugName: 'Oncoxib',
    submissionType: 'NDA',
    targetDate: '2024-12-15',
    createdAt: '2024-01-15',
    updatedAt: '2024-03-10',
    documentCount: 156,
    writingProjectCount: 8,
  },
  {
    id: 'sub-2',
    name: 'BLA-2024-003 Immunotherapy',
    status: 'under_review',
    drugName: 'ImmunoGen-X',
    submissionType: 'BLA',
    targetDate: '2024-09-30',
    createdAt: '2023-08-20',
    updatedAt: '2024-03-08',
    documentCount: 203,
    writingProjectCount: 12,
  },
  {
    id: 'sub-3',
    name: 'IND-2024-007 Phase I Trial',
    status: 'draft',
    drugName: 'NeuroCalm',
    submissionType: 'IND',
    targetDate: '2024-06-01',
    createdAt: '2024-02-28',
    updatedAt: '2024-03-05',
    documentCount: 45,
    writingProjectCount: 4,
  },
  {
    id: 'sub-4',
    name: 'NDA-2021-045 Archived Submission',
    status: 'archived',
    drugName: 'CardioSafe',
    submissionType: 'NDA',
    targetDate: '2021-11-30',
    createdAt: '2020-09-12',
    updatedAt: '2022-01-05',
    documentCount: 132,
    writingProjectCount: 7,
  },
];

export interface RecentDocument {
  id: string;
  name: string;
  type: string;
  submissionName: string;
  submissionId: string;
  lastEditedAt: string;
  status: 'draft' | 'in_review' | 'approved' | 'final';
}

export const recentDocuments: RecentDocument[] = [
  {
    id: 'doc-csr-101',
    name: 'CSR ONC-101-001',
    type: 'CSR',
    submissionName: 'NDA-2024-001',
    submissionId: 'sub-1',
    lastEditedAt: '2024-03-12T14:30:00',
    status: 'draft',
  },
  {
    id: 'doc-clinical-overview',
    name: 'Clinical Overview (2.5)',
    type: 'Clinical Overview',
    submissionName: 'NDA-2024-001',
    submissionId: 'sub-1',
    lastEditedAt: '2024-03-12T11:15:00',
    status: 'draft',
  },
  {
    id: 'doc-protocol-201',
    name: 'Protocol IMX-201-001',
    type: 'Protocol',
    submissionName: 'BLA-2024-003',
    submissionId: 'sub-2',
    lastEditedAt: '2024-03-11T16:45:00',
    status: 'final',
  },
  {
    id: 'doc-sap-301',
    name: 'SAP NC-301-001',
    type: 'SAP',
    submissionName: 'IND-2024-007',
    submissionId: 'sub-3',
    lastEditedAt: '2024-03-11T09:20:00',
    status: 'draft',
  },
  {
    id: 'doc-ib',
    name: 'Investigator Brochure',
    type: 'IB',
    submissionName: 'NDA-2024-001',
    submissionId: 'sub-1',
    lastEditedAt: '2024-03-10T17:00:00',
    status: 'approved',
  },
];

export type QCIssueSeverity = 'critical' | 'major' | 'minor';
export type QCIssueType = 'inconsistency' | 'missing_reference' | 'outdated_data' | 'formatting' | 'cross_reference';

export interface QCIssue {
  id: string;
  documentId: string;
  documentName: string;
  submissionId: string;
  type: QCIssueType;
  severity: QCIssueSeverity;
  description: string;
  section: string;
  detectedAt: string;
  relatedDocumentId?: string;
  relatedDocumentName?: string;
}

export const qcIssues: QCIssue[] = [
  {
    id: 'qc-1',
    documentId: 'doc-clinical-overview',
    documentName: 'Clinical Overview',
    submissionId: 'sub-1',
    type: 'inconsistency',
    severity: 'critical',
    description: 'Primary endpoint definition differs from Protocol ONC-101',
    section: '2.5.4 Overview of Efficacy',
    detectedAt: '2024-03-12T10:00:00',
    relatedDocumentId: 'doc-protocol-101',
    relatedDocumentName: 'Protocol ONC-101',
  },
  {
    id: 'qc-2',
    documentId: 'doc-clinical-summary',
    documentName: 'Clinical Summary',
    submissionId: 'sub-1',
    type: 'outdated_data',
    severity: 'major',
    description: 'Safety data not updated with latest CSR amendments',
    section: '2.7.4 Summary of Clinical Safety',
    detectedAt: '2024-03-12T09:30:00',
    relatedDocumentId: 'doc-csr-101',
    relatedDocumentName: 'CSR ONC-101',
  },
  {
    id: 'qc-3',
    documentId: 'doc-ib',
    documentName: 'Investigator Brochure',
    submissionId: 'sub-1',
    type: 'cross_reference',
    severity: 'major',
    description: 'Table 5.2 references non-existent Section 4.3.2',
    section: '5.2 Safety and Efficacy',
    detectedAt: '2024-03-11T15:20:00',
  },
  {
    id: 'qc-4',
    documentId: 'doc-csr-101',
    documentName: 'CSR ONC-101',
    submissionId: 'sub-1',
    type: 'inconsistency',
    severity: 'minor',
    description: 'Patient count discrepancy between synopsis and Section 11',
    section: '2. Synopsis',
    detectedAt: '2024-03-11T14:00:00',
  },
  {
    id: 'qc-5',
    documentId: 'doc-sap-101',
    documentName: 'SAP ONC-101',
    submissionId: 'sub-1',
    type: 'missing_reference',
    severity: 'minor',
    description: 'Missing citation for statistical methodology',
    section: '4. Analysis Methods',
    detectedAt: '2024-03-10T11:30:00',
  },
  {
    id: 'qc-6',
    documentId: 'doc-clinical-overview-2',
    documentName: 'Clinical Overview',
    submissionId: 'sub-2',
    type: 'inconsistency',
    severity: 'major',
    description: 'Dosing regimen inconsistent with approved labeling',
    section: '2.5.1 Product Development Rationale',
    detectedAt: '2024-03-10T10:15:00',
  },
  {
    id: 'qc-7',
    documentId: 'doc-protocol-301',
    documentName: 'Protocol NC-301',
    submissionId: 'sub-3',
    type: 'formatting',
    severity: 'minor',
    description: 'Table formatting inconsistent with template',
    section: '9. Statistical Methods',
    detectedAt: '2024-03-09T16:45:00',
  },
];

export const qcIssueTypeLabels: Record<QCIssueType, string> = {
  inconsistency: 'Inconsistency',
  missing_reference: 'Missing Reference',
  outdated_data: 'Outdated Data',
  formatting: 'Formatting',
  cross_reference: 'Cross-Reference Error',
};

export const qcIssueSeverityColors: Record<QCIssueSeverity, { bg: string; text: string }> = {
  critical: { bg: 'bg-red-100', text: 'text-red-700' },
  major: { bg: 'bg-amber-100', text: 'text-amber-700' },
  minor: { bg: 'bg-slate-100', text: 'text-slate-600' },
};

export const getQCIssues = (submissionId: string): QCIssue[] => {
  return qcIssues.filter(issue => issue.submissionId === submissionId);
};

export interface DocumentWithPendingUpdate {
  id: string;
  name: string;
  type: string;
  submissionId: string;
  submissionName: string;
  pendingUpdates: PendingUpdate[];
}

export const getDocumentsWithPendingUpdates = (): DocumentWithPendingUpdate[] => {
  const docs: DocumentWithPendingUpdate[] = [];
  
  const submissionList = [
    { id: 'sub-1', name: 'NDA-2024-001' },
    { id: 'sub-2', name: 'BLA-2024-003' },
    { id: 'sub-3', name: 'IND-2024-007' },
  ];
  
  submissionList.forEach(sub => {
    const studies = getStudies(sub.id);
    const summaryDocs = getSummaryDocuments(sub.id);
    
    studies.forEach(study => {
      if (study.documents.protocol?.pendingUpdates?.length) {
        docs.push({
          id: study.documents.protocol.id,
          name: study.documents.protocol.name,
          type: 'Protocol',
          submissionId: sub.id,
          submissionName: sub.name,
          pendingUpdates: study.documents.protocol.pendingUpdates,
        });
      }
      if (study.documents.sap?.pendingUpdates?.length) {
        docs.push({
          id: study.documents.sap.id,
          name: study.documents.sap.name,
          type: 'SAP',
          submissionId: sub.id,
          submissionName: sub.name,
          pendingUpdates: study.documents.sap.pendingUpdates,
        });
      }
      if (study.documents.csr?.pendingUpdates?.length) {
        docs.push({
          id: study.documents.csr.id,
          name: study.documents.csr.name,
          type: 'CSR',
          submissionId: sub.id,
          submissionName: sub.name,
          pendingUpdates: study.documents.csr.pendingUpdates,
        });
      }
      study.operationalDocs?.forEach(opDoc => {
        if (opDoc.pendingUpdates?.length) {
          docs.push({
            id: opDoc.id,
            name: opDoc.name,
            type: opDoc.shortName,
            submissionId: sub.id,
            submissionName: sub.name,
            pendingUpdates: opDoc.pendingUpdates,
          });
        }
      });
    });
    
    summaryDocs.forEach(doc => {
      if (doc.pendingUpdates?.length) {
        docs.push({
          id: doc.id,
          name: doc.name,
          type: doc.shortName,
          submissionId: sub.id,
          submissionName: sub.name,
          pendingUpdates: doc.pendingUpdates,
        });
      }
    });
  });
  
  return docs;
};

export const getPendingUpdatesCount = (): number => {
  return getDocumentsWithPendingUpdates().reduce((acc, doc) => acc + doc.pendingUpdates.length, 0);
};

export const getTotalDocumentCount = (): number => {
  let count = 0;
  
  submissions.forEach(sub => {
    const studies = getStudies(sub.id);
    const summaryDocs = getSummaryDocuments(sub.id);
    const crossStudyDocs = getCrossStudyDocuments(sub.id);
    
    studies.forEach(study => {
      if (study.documents.protocol) count++;
      if (study.documents.sap) count++;
      if (study.documents.csr) count++;
      count += study.operationalDocs?.length || 0;
    });
    
    count += summaryDocs.length;
    count += crossStudyDocs.length;
  });
  
  return count;
};

export type VeevaSyncStatus = 'synced' | 'syncing' | 'pending_upload' | 'conflict' | 'not_synced';

export interface PendingUpdate {
  sourceDocId: string;
  sourceDocName: string;
  sourceSection: string;
  targetSection: string;
  changeType: 'modified' | 'added' | 'deleted';
  changedAt: string;
}

export interface StudyDocument {
  id: string;
  name: string;
  shortName: string;
  type: 'protocol' | 'sap' | 'csr';
  status: 'draft' | 'in_review' | 'approved' | 'final';
  version: string;
  supportingDocs: { id: string; name: string; type: string }[];
  veevaSync?: VeevaSyncStatus;
  veevaDocId?: string;
  localPath?: string;
  pendingUpdates?: PendingUpdate[];
}

export type OperationalDocType = 'icf' | 'pis' | 'crf';

export interface OperationalDocument {
  id: string;
  name: string;
  shortName: string;
  type: OperationalDocType;
  status: 'draft' | 'in_review' | 'approved' | 'final';
  version: string;
  veevaSync?: VeevaSyncStatus;
  veevaDocId?: string;
  localPath?: string;
  pendingUpdates?: PendingUpdate[];
}

export const veevaSyncLabels: Record<VeevaSyncStatus, string> = {
  synced: 'Synced',
  syncing: 'Syncing...',
  pending_upload: 'Pending Upload',
  conflict: 'Conflict',
  not_synced: 'Not Synced',
};

export const operationalDocLabels: Record<OperationalDocType, string> = {
  icf: 'Informed Consent Form',
  pis: 'Patient Information Sheet',
  crf: 'Case Report Form',
};

export type StudyType = 'pivotal' | 'supportive' | 'pk' | 'pd' | 'pk_pd' | 'safety' | 'dose_finding' | 'bioequivalence';

export interface Study {
  id: string;
  studyId: string;
  name: string;
  phase: 'Phase 1' | 'Phase 2' | 'Phase 3' | 'Phase 1/2' | 'Phase 2/3';
  studyType: StudyType;
  status: 'ongoing' | 'completed' | 'terminated';
  color: string;
  documents: {
    protocol?: StudyDocument;
    sap?: StudyDocument;
    csr?: StudyDocument;
  };
  operationalDocs: OperationalDocument[];
}

export const studyTypeLabels: Record<StudyType, string> = {
  pivotal: 'Pivotal',
  supportive: 'Supportive',
  pk: 'PK',
  pd: 'PD',
  pk_pd: 'PK/PD',
  safety: 'Safety',
  dose_finding: 'Dose Finding',
  bioequivalence: 'Bioequivalence',
};

export interface SummaryDocument {
  id: string;
  name: string;
  shortName: string;
  type: 'ib' | 'nonclinical' | 'cmc' | 'clinical_overview' | 'clinical_summary';
  status: 'draft' | 'in_review' | 'approved' | 'final';
  version: string;
  color: string;
  supportingDocs: { id: string; name: string; type: string }[];
  veevaSync?: VeevaSyncStatus;
  veevaDocId?: string;
  localPath?: string;
  pendingUpdates?: PendingUpdate[];
}

export interface DocumentLink {
  id: string;
  sourceId: string;
  targetId: string;
  relationshipType: 'informs' | 'summarizes';
}

export const studyColors = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
];

export const summaryDocColors: Record<string, string> = {
  ib: '#f97316',
  nonclinical: '#8b5cf6',
  cmc: '#ec4899',
  clinical_overview: '#06b6d4',
  clinical_summary: '#14b8a6',
};

export const getStudies = (submissionId: string): Study[] => {
  if (submissionId === 'sub-1') {
    return [
      {
        id: 'study-101',
        studyId: 'ONC-101',
        name: 'Phase 3 Pivotal Efficacy Study',
        phase: 'Phase 3',
        studyType: 'pivotal',
        status: 'completed',
        color: studyColors[0],
        documents: {
          protocol: {
            id: 'doc-protocol-101',
            name: 'Protocol ONC-101-001',
            shortName: 'Protocol',
            type: 'protocol',
            status: 'final',
            version: '2.1',
            supportingDocs: [
              { id: 'sp-1a', name: 'Protocol Amendment 1', type: 'Amendment' },
              { id: 'sp-1b', name: 'Protocol Amendment 2', type: 'Amendment' },
            ],
            veevaSync: 'synced',
            veevaDocId: 'VV-DOC-101-PROT',
            localPath: '/documents/ONC-101/Protocol_v2.1.docx',
          },
          sap: {
            id: 'doc-sap-101',
            name: 'SAP ONC-101-001',
            shortName: 'SAP',
            type: 'sap',
            status: 'final',
            version: '1.0',
            supportingDocs: [],
            veevaSync: 'synced',
            veevaDocId: 'VV-DOC-101-SAP',
            localPath: '/documents/ONC-101/SAP_v1.0.docx',
            pendingUpdates: [
              { sourceDocId: 'doc-protocol-101', sourceDocName: 'Protocol', sourceSection: '9. Statistical Methods', targetSection: '4. Analysis Methods', changeType: 'modified', changedAt: '2024-03-10' },
            ],
          },
          csr: {
            id: 'doc-csr-101',
            name: 'CSR ONC-101-001',
            shortName: 'CSR',
            type: 'csr',
            status: 'in_review',
            version: '1.0',
            supportingDocs: [
              { id: 'sc-1a', name: 'Efficacy Tables', type: 'TFLs' },
              { id: 'sc-1b', name: 'Safety Tables', type: 'TFLs' },
              { id: 'sc-1c', name: 'Patient Narratives', type: 'Narrative' },
            ],
            veevaSync: 'pending_upload',
            veevaDocId: 'VV-DOC-101-CSR',
            localPath: '/documents/ONC-101/CSR_v1.0.docx',
            pendingUpdates: [
              { sourceDocId: 'doc-protocol-101', sourceDocName: 'Protocol', sourceSection: '3. Study Objectives', targetSection: '8. Study Objectives', changeType: 'modified', changedAt: '2024-03-08' },
              { sourceDocId: 'doc-sap-101', sourceDocName: 'SAP', sourceSection: '4. Analysis Methods', targetSection: '9. Investigational Plan', changeType: 'modified', changedAt: '2024-03-10' },
            ],
          },
        },
        operationalDocs: [
          { id: 'op-icf-101', name: 'Informed Consent Form', shortName: 'ICF', type: 'icf', status: 'approved', version: '3.0', veevaSync: 'synced', veevaDocId: 'VV-DOC-101-ICF', localPath: '/documents/ONC-101/ICF_v3.0.docx', pendingUpdates: [{ sourceDocId: 'doc-protocol-101', sourceDocName: 'Protocol', sourceSection: '5. Study Population', targetSection: '4. Study Procedures', changeType: 'modified', changedAt: '2024-03-05' }] },
          { id: 'op-pis-101', name: 'Patient Information Sheet', shortName: 'PIS', type: 'pis', status: 'approved', version: '3.0', veevaSync: 'synced', veevaDocId: 'VV-DOC-101-PIS', localPath: '/documents/ONC-101/PIS_v3.0.docx' },
          { id: 'op-crf-101', name: 'Case Report Form', shortName: 'CRF', type: 'crf', status: 'final', version: '1.5', veevaSync: 'conflict', veevaDocId: 'VV-DOC-101-CRF', localPath: '/documents/ONC-101/CRF_v1.5.docx' },
        ],
      },
      {
        id: 'study-102',
        studyId: 'ONC-102',
        name: 'Phase 3 Confirmatory Study',
        phase: 'Phase 3',
        studyType: 'pivotal',
        status: 'completed',
        color: studyColors[1],
        documents: {
          protocol: {
            id: 'doc-protocol-102',
            name: 'Protocol ONC-102-001',
            shortName: 'Protocol',
            type: 'protocol',
            status: 'final',
            version: '1.2',
            supportingDocs: [
              { id: 'sp-2a', name: 'Protocol Amendment 1', type: 'Amendment' },
            ],
            veevaSync: 'synced',
            veevaDocId: 'VV-DOC-102-PROT',
            localPath: '/documents/ONC-102/Protocol_v1.2.docx',
          },
          sap: {
            id: 'doc-sap-102',
            name: 'SAP ONC-102-001',
            shortName: 'SAP',
            type: 'sap',
            status: 'final',
            version: '1.1',
            supportingDocs: [],
            veevaSync: 'synced',
            veevaDocId: 'VV-DOC-102-SAP',
            localPath: '/documents/ONC-102/SAP_v1.1.docx',
          },
          csr: {
            id: 'doc-csr-102',
            name: 'CSR ONC-102-001',
            shortName: 'CSR',
            type: 'csr',
            status: 'draft',
            version: '0.8',
            supportingDocs: [
              { id: 'sc-2a', name: 'Efficacy Tables', type: 'TFLs' },
              { id: 'sc-2b', name: 'Safety Tables', type: 'TFLs' },
            ],
            veevaSync: 'syncing',
            veevaDocId: 'VV-DOC-102-CSR',
            localPath: '/documents/ONC-102/CSR_v0.8.docx',
            pendingUpdates: [
              { sourceDocId: 'doc-protocol-102', sourceDocName: 'Protocol', sourceSection: '4. Study Design', targetSection: '9.1. Overall Study Design', changeType: 'modified', changedAt: '2024-03-12' },
            ],
          },
        },
        operationalDocs: [
          { id: 'op-icf-102', name: 'Informed Consent Form', shortName: 'ICF', type: 'icf', status: 'approved', version: '2.0', veevaSync: 'synced', localPath: '/documents/ONC-102/ICF_v2.0.docx' },
          { id: 'op-pis-102', name: 'Patient Information Sheet', shortName: 'PIS', type: 'pis', status: 'approved', version: '2.0', veevaSync: 'synced', localPath: '/documents/ONC-102/PIS_v2.0.docx' },
          { id: 'op-crf-102', name: 'Case Report Form', shortName: 'CRF', type: 'crf', status: 'approved', version: '1.2', veevaSync: 'pending_upload', localPath: '/documents/ONC-102/CRF_v1.2.docx' },
        ],
      },
      {
        id: 'study-103',
        studyId: 'ONC-103',
        name: 'Phase 1 First-in-Human',
        phase: 'Phase 1',
        studyType: 'dose_finding',
        status: 'completed',
        color: studyColors[2],
        documents: {
          protocol: {
            id: 'doc-protocol-103',
            name: 'Protocol ONC-103-001',
            shortName: 'Protocol',
            type: 'protocol',
            status: 'final',
            version: '1.0',
            supportingDocs: [],
            veevaSync: 'synced',
            localPath: '/documents/ONC-103/Protocol_v1.0.docx',
          },
          sap: {
            id: 'doc-sap-103',
            name: 'SAP ONC-103-001',
            shortName: 'SAP',
            type: 'sap',
            status: 'final',
            version: '1.0',
            supportingDocs: [],
            veevaSync: 'synced',
            localPath: '/documents/ONC-103/SAP_v1.0.docx',
          },
          csr: {
            id: 'doc-csr-103',
            name: 'CSR ONC-103-001',
            shortName: 'CSR',
            type: 'csr',
            status: 'final',
            version: '1.0',
            supportingDocs: [
              { id: 'sc-3a', name: 'Dose Escalation Summary', type: 'Analysis' },
            ],
            veevaSync: 'synced',
            localPath: '/documents/ONC-103/CSR_v1.0.docx',
          },
        },
        operationalDocs: [
          { id: 'op-icf-103', name: 'Informed Consent Form', shortName: 'ICF', type: 'icf', status: 'final', version: '1.0', veevaSync: 'synced', localPath: '/documents/ONC-103/ICF_v1.0.docx' },
          { id: 'op-crf-103', name: 'Case Report Form', shortName: 'CRF', type: 'crf', status: 'final', version: '1.0', veevaSync: 'synced', localPath: '/documents/ONC-103/CRF_v1.0.docx' },
        ],
      },
      {
        id: 'study-104',
        studyId: 'ONC-104',
        name: 'PK Study in Healthy Volunteers',
        phase: 'Phase 1',
        studyType: 'pk',
        status: 'completed',
        color: studyColors[3],
        documents: {
          protocol: {
            id: 'doc-protocol-104',
            name: 'Protocol ONC-104-001',
            shortName: 'Protocol',
            type: 'protocol',
            status: 'final',
            version: '1.0',
            supportingDocs: [],
          },
          sap: {
            id: 'doc-sap-104',
            name: 'SAP ONC-104-001',
            shortName: 'SAP',
            type: 'sap',
            status: 'final',
            version: '1.0',
            supportingDocs: [],
          },
          csr: {
            id: 'doc-csr-104',
            name: 'CSR ONC-104-001',
            shortName: 'CSR',
            type: 'csr',
            status: 'final',
            version: '1.0',
            supportingDocs: [
              { id: 'sc-4a', name: 'PK Parameters Summary', type: 'Analysis' },
              { id: 'sc-4b', name: 'Bioanalytical Report', type: 'Report' },
            ],
          },
        },
        operationalDocs: [
          { id: 'op-icf-104', name: 'Informed Consent Form', shortName: 'ICF', type: 'icf', status: 'final', version: '1.0' },
        ],
      },
      {
        id: 'study-105',
        studyId: 'ONC-105',
        name: 'Food Effect PK Study',
        phase: 'Phase 1',
        studyType: 'pk',
        status: 'completed',
        color: studyColors[4],
        documents: {
          protocol: {
            id: 'doc-protocol-105',
            name: 'Protocol ONC-105-001',
            shortName: 'Protocol',
            type: 'protocol',
            status: 'final',
            version: '1.0',
            supportingDocs: [],
          },
          csr: {
            id: 'doc-csr-105',
            name: 'CSR ONC-105-001',
            shortName: 'CSR',
            type: 'csr',
            status: 'final',
            version: '1.0',
            supportingDocs: [
              { id: 'sc-5a', name: 'Food Effect Analysis', type: 'Analysis' },
            ],
          },
        },
        operationalDocs: [
          { id: 'op-icf-105', name: 'Informed Consent Form', shortName: 'ICF', type: 'icf', status: 'final', version: '1.0' },
        ],
      },
      {
        id: 'study-106',
        studyId: 'ONC-106',
        name: 'Drug-Drug Interaction Study',
        phase: 'Phase 1',
        studyType: 'pk',
        status: 'completed',
        color: '#64748b',
        documents: {
          protocol: {
            id: 'doc-protocol-106',
            name: 'Protocol ONC-106-001',
            shortName: 'Protocol',
            type: 'protocol',
            status: 'final',
            version: '1.0',
            supportingDocs: [],
          },
          csr: {
            id: 'doc-csr-106',
            name: 'CSR ONC-106-001',
            shortName: 'CSR',
            type: 'csr',
            status: 'final',
            version: '1.0',
            supportingDocs: [
              { id: 'sc-6a', name: 'DDI Assessment', type: 'Analysis' },
            ],
          },
        },
        operationalDocs: [
          { id: 'op-icf-106', name: 'Informed Consent Form', shortName: 'ICF', type: 'icf', status: 'final', version: '1.0' },
        ],
      },
      {
        id: 'study-107',
        studyId: 'ONC-107',
        name: 'QTc Study',
        phase: 'Phase 1',
        studyType: 'safety',
        status: 'completed',
        color: '#ef4444',
        documents: {
          protocol: {
            id: 'doc-protocol-107',
            name: 'Protocol ONC-107-001',
            shortName: 'Protocol',
            type: 'protocol',
            status: 'final',
            version: '1.0',
            supportingDocs: [],
          },
          csr: {
            id: 'doc-csr-107',
            name: 'CSR ONC-107-001',
            shortName: 'CSR',
            type: 'csr',
            status: 'final',
            version: '1.0',
            supportingDocs: [
              { id: 'sc-7a', name: 'ECG Analysis', type: 'Analysis' },
              { id: 'sc-7b', name: 'Concentration-QTc Analysis', type: 'Analysis' },
            ],
          },
        },
        operationalDocs: [
          { id: 'op-icf-107', name: 'Informed Consent Form', shortName: 'ICF', type: 'icf', status: 'final', version: '1.0' },
        ],
      },
      {
        id: 'study-108',
        studyId: 'ONC-108',
        name: 'Hepatic Impairment PK Study',
        phase: 'Phase 1',
        studyType: 'pk',
        status: 'completed',
        color: '#a855f7',
        documents: {
          protocol: {
            id: 'doc-protocol-108',
            name: 'Protocol ONC-108-001',
            shortName: 'Protocol',
            type: 'protocol',
            status: 'final',
            version: '1.0',
            supportingDocs: [],
          },
          csr: {
            id: 'doc-csr-108',
            name: 'CSR ONC-108-001',
            shortName: 'CSR',
            type: 'csr',
            status: 'final',
            version: '1.0',
            supportingDocs: [],
          },
        },
        operationalDocs: [],
      },
      {
        id: 'study-109',
        studyId: 'ONC-109',
        name: 'Renal Impairment PK Study',
        phase: 'Phase 1',
        studyType: 'pk',
        status: 'completed',
        color: '#0ea5e9',
        documents: {
          protocol: {
            id: 'doc-protocol-109',
            name: 'Protocol ONC-109-001',
            shortName: 'Protocol',
            type: 'protocol',
            status: 'final',
            version: '1.0',
            supportingDocs: [],
          },
          csr: {
            id: 'doc-csr-109',
            name: 'CSR ONC-109-001',
            shortName: 'CSR',
            type: 'csr',
            status: 'final',
            version: '1.0',
            supportingDocs: [],
          },
        },
        operationalDocs: [],
      },
    ];
  }
  
  if (submissionId === 'sub-2') {
    return [
      {
        id: 'study-201',
        studyId: 'IMX-201',
        name: 'Phase 3 Pivotal Study',
        phase: 'Phase 3',
        studyType: 'pivotal',
        status: 'completed',
        color: '#0ea5e9',
        documents: {
          protocol: {
            id: 'doc-protocol-201',
            name: 'Protocol IMX-201-001',
            shortName: 'Protocol',
            type: 'protocol',
            status: 'final',
            version: '3.0',
            supportingDocs: [
              { id: 'sp-201a', name: 'Protocol Amendment 1', type: 'Amendment' },
              { id: 'sp-201b', name: 'Protocol Amendment 2', type: 'Amendment' },
            ],
            veevaSync: 'synced',
            localPath: '/documents/IMX-201/Protocol_v3.0.docx',
          },
          sap: {
            id: 'doc-sap-201',
            name: 'SAP IMX-201-001',
            shortName: 'SAP',
            type: 'sap',
            status: 'final',
            version: '2.0',
            supportingDocs: [],
            veevaSync: 'synced',
            localPath: '/documents/IMX-201/SAP_v2.0.docx',
          },
          csr: {
            id: 'doc-csr-201',
            name: 'CSR IMX-201-001',
            shortName: 'CSR',
            type: 'csr',
            status: 'approved',
            version: '1.0',
            supportingDocs: [
              { id: 'sc-201a', name: 'Efficacy Tables', type: 'TFLs' },
              { id: 'sc-201b', name: 'Safety Tables', type: 'TFLs' },
            ],
            veevaSync: 'synced',
            localPath: '/documents/IMX-201/CSR_v1.0.docx',
          },
        },
        operationalDocs: [
          { id: 'op-icf-201', name: 'Informed Consent Form', shortName: 'ICF', type: 'icf', status: 'approved', version: '3.0', veevaSync: 'synced', localPath: '/documents/IMX-201/ICF_v3.0.docx' },
          { id: 'op-pis-201', name: 'Patient Information Sheet', shortName: 'PIS', type: 'pis', status: 'approved', version: '3.0', veevaSync: 'synced', localPath: '/documents/IMX-201/PIS_v3.0.docx' },
        ],
      },
      {
        id: 'study-202',
        studyId: 'IMX-202',
        name: 'Phase 2 Dose-Finding Study',
        phase: 'Phase 2',
        studyType: 'dose_finding',
        status: 'completed',
        color: '#8b5cf6',
        documents: {
          protocol: {
            id: 'doc-protocol-202',
            name: 'Protocol IMX-202-001',
            shortName: 'Protocol',
            type: 'protocol',
            status: 'final',
            version: '1.0',
            supportingDocs: [],
            veevaSync: 'synced',
            localPath: '/documents/IMX-202/Protocol_v1.0.docx',
          },
          sap: {
            id: 'doc-sap-202',
            name: 'SAP IMX-202-001',
            shortName: 'SAP',
            type: 'sap',
            status: 'final',
            version: '1.0',
            supportingDocs: [],
            veevaSync: 'synced',
            localPath: '/documents/IMX-202/SAP_v1.0.docx',
          },
          csr: {
            id: 'doc-csr-202',
            name: 'CSR IMX-202-001',
            shortName: 'CSR',
            type: 'csr',
            status: 'final',
            version: '1.0',
            supportingDocs: [
              { id: 'sc-202a', name: 'Dose Response Analysis', type: 'Analysis' },
            ],
            veevaSync: 'synced',
            localPath: '/documents/IMX-202/CSR_v1.0.docx',
          },
        },
        operationalDocs: [
          { id: 'op-icf-202', name: 'Informed Consent Form', shortName: 'ICF', type: 'icf', status: 'final', version: '1.0', veevaSync: 'synced', localPath: '/documents/IMX-202/ICF_v1.0.docx' },
        ],
      },
      {
        id: 'study-203',
        studyId: 'IMX-203',
        name: 'Phase 1 First-in-Human',
        phase: 'Phase 1',
        studyType: 'pk',
        status: 'completed',
        color: '#f59e0b',
        documents: {
          protocol: {
            id: 'doc-protocol-203',
            name: 'Protocol IMX-203-001',
            shortName: 'Protocol',
            type: 'protocol',
            status: 'final',
            version: '1.0',
            supportingDocs: [],
            veevaSync: 'synced',
            localPath: '/documents/IMX-203/Protocol_v1.0.docx',
          },
          csr: {
            id: 'doc-csr-203',
            name: 'CSR IMX-203-001',
            shortName: 'CSR',
            type: 'csr',
            status: 'final',
            version: '1.0',
            supportingDocs: [
              { id: 'sc-203a', name: 'PK Analysis', type: 'Analysis' },
            ],
            veevaSync: 'synced',
            localPath: '/documents/IMX-203/CSR_v1.0.docx',
          },
        },
        operationalDocs: [
          { id: 'op-icf-203', name: 'Informed Consent Form', shortName: 'ICF', type: 'icf', status: 'final', version: '1.0', veevaSync: 'synced', localPath: '/documents/IMX-203/ICF_v1.0.docx' },
        ],
      },
      {
        id: 'study-204',
        studyId: 'IMX-204',
        name: 'Long-term Safety Extension',
        phase: 'Phase 3',
        studyType: 'safety',
        status: 'ongoing',
        color: '#ef4444',
        documents: {
          protocol: {
            id: 'doc-protocol-204',
            name: 'Protocol IMX-204-001',
            shortName: 'Protocol',
            type: 'protocol',
            status: 'final',
            version: '2.0',
            supportingDocs: [
              { id: 'sp-204a', name: 'Protocol Amendment 1', type: 'Amendment' },
            ],
            veevaSync: 'synced',
            localPath: '/documents/IMX-204/Protocol_v2.0.docx',
          },
          sap: {
            id: 'doc-sap-204',
            name: 'SAP IMX-204-001',
            shortName: 'SAP',
            type: 'sap',
            status: 'approved',
            version: '1.0',
            supportingDocs: [],
            veevaSync: 'synced',
            localPath: '/documents/IMX-204/SAP_v1.0.docx',
          },
        },
        operationalDocs: [
          { id: 'op-icf-204', name: 'Informed Consent Form', shortName: 'ICF', type: 'icf', status: 'approved', version: '2.0', veevaSync: 'synced', localPath: '/documents/IMX-204/ICF_v2.0.docx' },
          { id: 'op-crf-204', name: 'Case Report Form', shortName: 'CRF', type: 'crf', status: 'approved', version: '1.0', veevaSync: 'synced', localPath: '/documents/IMX-204/CRF_v1.0.docx' },
        ],
      },
    ];
  }
  
  if (submissionId === 'sub-3') {
    return [
      {
        id: 'study-301',
        studyId: 'NC-301',
        name: 'Phase 1 First-in-Human SAD/MAD',
        phase: 'Phase 1',
        studyType: 'dose_finding',
        status: 'ongoing',
        color: '#10b981',
        documents: {
          protocol: {
            id: 'doc-protocol-301',
            name: 'Protocol NC-301-001',
            shortName: 'Protocol',
            type: 'protocol',
            status: 'approved',
            version: '1.0',
            supportingDocs: [],
            veevaSync: 'synced',
            localPath: '/documents/NC-301/Protocol_v1.0.docx',
          },
          sap: {
            id: 'doc-sap-301',
            name: 'SAP NC-301-001',
            shortName: 'SAP',
            type: 'sap',
            status: 'draft',
            version: '0.5',
            supportingDocs: [],
            veevaSync: 'pending_upload',
            localPath: '/documents/NC-301/SAP_v0.5.docx',
            pendingUpdates: [
              { sourceDocId: 'doc-protocol-301', sourceDocName: 'Protocol', sourceSection: '9. Statistical Methods', targetSection: '4. Analysis Methods', changeType: 'modified', changedAt: '2024-03-01' },
            ],
          },
        },
        operationalDocs: [
          { id: 'op-icf-301', name: 'Informed Consent Form', shortName: 'ICF', type: 'icf', status: 'approved', version: '1.0', veevaSync: 'synced', localPath: '/documents/NC-301/ICF_v1.0.docx' },
          { id: 'op-crf-301', name: 'Case Report Form', shortName: 'CRF', type: 'crf', status: 'draft', version: '0.8', veevaSync: 'pending_upload', localPath: '/documents/NC-301/CRF_v0.8.docx' },
        ],
      },
    ];
  }
  
  return [];
};

export const getSummaryDocuments = (submissionId: string): SummaryDocument[] => {
  if (submissionId === 'sub-1') {
    return [
      {
        id: 'doc-ib',
        name: 'Investigator Brochure',
        shortName: 'IB',
        type: 'ib',
        status: 'approved',
        version: '5.0',
        color: summaryDocColors.ib,
        supportingDocs: [
          { id: 'si-1', name: 'IB Supplement - Safety Update', type: 'Supplement' },
        ],
        veevaSync: 'synced',
        veevaDocId: 'VV-DOC-IB',
        localPath: '/documents/Module2/IB_v5.0.docx',
        pendingUpdates: [
          { sourceDocId: 'doc-csr-101', sourceDocName: 'CSR ONC-101', sourceSection: '12. Safety Evaluation', targetSection: '5.2. Safety and Efficacy', changeType: 'modified', changedAt: '2024-03-10' },
        ],
      },
      {
        id: 'doc-nonclinical',
        name: 'Nonclinical Overview (2.4)',
        shortName: 'Nonclinical Overview',
        type: 'nonclinical',
        status: 'approved',
        version: '1.0',
        color: summaryDocColors.nonclinical,
        supportingDocs: [
          { id: 'sn-1', name: 'Pharmacology Written Summary', type: 'Module 2.6.2' },
          { id: 'sn-2', name: 'Toxicology Written Summary', type: 'Module 2.6.6' },
        ],
        veevaSync: 'synced',
        localPath: '/documents/Module2/Nonclinical_v1.0.docx',
      },
      {
        id: 'doc-cmc',
        name: 'Quality Overall Summary (2.3)',
        shortName: 'CMC / QOS',
        type: 'cmc',
        status: 'approved',
        version: '2.0',
        color: summaryDocColors.cmc,
        supportingDocs: [
          { id: 'sm-1', name: 'Drug Substance (3.2.S)', type: 'Module 3' },
          { id: 'sm-2', name: 'Drug Product (3.2.P)', type: 'Module 3' },
        ],
        veevaSync: 'synced',
        localPath: '/documents/Module2/CMC_QOS_v2.0.docx',
      },
      {
        id: 'doc-clinical-overview',
        name: 'Clinical Overview (2.5)',
        shortName: 'Clinical Overview',
        type: 'clinical_overview',
        status: 'draft',
        version: '0.5',
        color: summaryDocColors.clinical_overview,
        supportingDocs: [],
        veevaSync: 'pending_upload',
        localPath: '/documents/Module2/Clinical_Overview_v0.5.docx',
        pendingUpdates: [
          { sourceDocId: 'doc-csr-101', sourceDocName: 'CSR ONC-101', sourceSection: '11. Efficacy Evaluation', targetSection: '2.5.4. Overview of Efficacy', changeType: 'modified', changedAt: '2024-03-11' },
          { sourceDocId: 'doc-csr-102', sourceDocName: 'CSR ONC-102', sourceSection: '11. Efficacy Evaluation', targetSection: '2.5.4. Overview of Efficacy', changeType: 'added', changedAt: '2024-03-12' },
        ],
      },
      {
        id: 'doc-clinical-summary',
        name: 'Clinical Summary (2.7)',
        shortName: 'Clinical Summary',
        type: 'clinical_summary',
        status: 'draft',
        version: '0.3',
        color: summaryDocColors.clinical_summary,
        supportingDocs: [],
        veevaSync: 'syncing',
        localPath: '/documents/Module2/Clinical_Summary_v0.3.docx',
        pendingUpdates: [
          { sourceDocId: 'doc-csr-101', sourceDocName: 'CSR ONC-101', sourceSection: '2. Synopsis', targetSection: '2.7.6. Synopses', changeType: 'modified', changedAt: '2024-03-09' },
        ],
      },
    ];
  }
  
  if (submissionId === 'sub-2') {
    return [
      {
        id: 'doc-ib-2',
        name: 'Investigator Brochure',
        shortName: 'IB',
        type: 'ib',
        status: 'approved',
        version: '8.0',
        color: summaryDocColors.ib,
        supportingDocs: [
          { id: 'si-2a', name: 'IB Supplement - Immunogenicity', type: 'Supplement' },
        ],
        veevaSync: 'synced',
        localPath: '/documents/IMX/Module2/IB_v8.0.docx',
      },
      {
        id: 'doc-nonclinical-2',
        name: 'Nonclinical Overview (2.4)',
        shortName: 'Nonclinical Overview',
        type: 'nonclinical',
        status: 'approved',
        version: '1.0',
        color: summaryDocColors.nonclinical,
        supportingDocs: [],
        veevaSync: 'synced',
        localPath: '/documents/IMX/Module2/Nonclinical_v1.0.docx',
      },
      {
        id: 'doc-cmc-2',
        name: 'Quality Overall Summary (2.3)',
        shortName: 'CMC / QOS',
        type: 'cmc',
        status: 'approved',
        version: '3.0',
        color: summaryDocColors.cmc,
        supportingDocs: [
          { id: 'sm-2a', name: 'Drug Substance (3.2.S)', type: 'Module 3' },
          { id: 'sm-2b', name: 'Drug Product (3.2.P)', type: 'Module 3' },
        ],
        veevaSync: 'synced',
        localPath: '/documents/IMX/Module2/CMC_QOS_v3.0.docx',
      },
      {
        id: 'doc-clinical-overview-2',
        name: 'Clinical Overview (2.5)',
        shortName: 'Clinical Overview',
        type: 'clinical_overview',
        status: 'in_review',
        version: '1.0',
        color: summaryDocColors.clinical_overview,
        supportingDocs: [],
        veevaSync: 'synced',
        localPath: '/documents/IMX/Module2/Clinical_Overview_v1.0.docx',
      },
      {
        id: 'doc-clinical-summary-2',
        name: 'Clinical Summary (2.7)',
        shortName: 'Clinical Summary',
        type: 'clinical_summary',
        status: 'in_review',
        version: '1.0',
        color: summaryDocColors.clinical_summary,
        supportingDocs: [],
        veevaSync: 'pending_upload',
        localPath: '/documents/IMX/Module2/Clinical_Summary_v1.0.docx',
        pendingUpdates: [
          { sourceDocId: 'doc-csr-204', sourceDocName: 'CSR IMX-204', sourceSection: '12. Safety Evaluation', targetSection: '2.7.4. Summary of Clinical Safety', changeType: 'added', changedAt: '2024-03-05' },
        ],
      },
    ];
  }
  
  if (submissionId === 'sub-3') {
    return [
      {
        id: 'doc-ib-3',
        name: 'Investigator Brochure',
        shortName: 'IB',
        type: 'ib',
        status: 'draft',
        version: '1.0',
        color: summaryDocColors.ib,
        supportingDocs: [],
        veevaSync: 'pending_upload',
        localPath: '/documents/NC/IB_v1.0.docx',
        pendingUpdates: [
          { sourceDocId: 'doc-protocol-301', sourceDocName: 'Protocol NC-301', sourceSection: '2. Background', targetSection: '2. Introduction', changeType: 'modified', changedAt: '2024-02-28' },
        ],
      },
    ];
  }
  
  return [];
};

export const getDocumentLinks = (submissionId: string): DocumentLink[] => {
  if (submissionId === 'sub-1') {
    return [
      // Pivotal studies inform IB
      { id: 'link-1', sourceId: 'study-101', targetId: 'doc-ib', relationshipType: 'informs' },
      { id: 'link-2', sourceId: 'study-102', targetId: 'doc-ib', relationshipType: 'informs' },
      
      // Dose finding study informs IB
      { id: 'link-3', sourceId: 'study-103', targetId: 'doc-ib', relationshipType: 'informs' },
      
      // Safety study informs IB
      { id: 'link-4', sourceId: 'study-107', targetId: 'doc-ib', relationshipType: 'informs' },
      
      // IB informs nonclinical
      { id: 'link-5', sourceId: 'doc-ib', targetId: 'doc-nonclinical', relationshipType: 'informs' },
      
      // Pivotal studies summarized in Clinical Overview & Summary
      { id: 'link-6', sourceId: 'study-101', targetId: 'doc-clinical-overview', relationshipType: 'summarizes' },
      { id: 'link-7', sourceId: 'study-102', targetId: 'doc-clinical-overview', relationshipType: 'summarizes' },
      { id: 'link-8', sourceId: 'study-101', targetId: 'doc-clinical-summary', relationshipType: 'summarizes' },
      { id: 'link-9', sourceId: 'study-102', targetId: 'doc-clinical-summary', relationshipType: 'summarizes' },
      
      // Dose finding study summarized
      { id: 'link-10', sourceId: 'study-103', targetId: 'doc-clinical-overview', relationshipType: 'summarizes' },
      { id: 'link-11', sourceId: 'study-103', targetId: 'doc-clinical-summary', relationshipType: 'summarizes' },
      
      // PK studies summarized in Clinical Summary (Biopharm section)
      { id: 'link-12', sourceId: 'study-104', targetId: 'doc-clinical-summary', relationshipType: 'summarizes' },
      { id: 'link-13', sourceId: 'study-105', targetId: 'doc-clinical-summary', relationshipType: 'summarizes' },
      { id: 'link-14', sourceId: 'study-106', targetId: 'doc-clinical-summary', relationshipType: 'summarizes' },
      { id: 'link-15', sourceId: 'study-108', targetId: 'doc-clinical-summary', relationshipType: 'summarizes' },
      { id: 'link-16', sourceId: 'study-109', targetId: 'doc-clinical-summary', relationshipType: 'summarizes' },
      
      // Safety study (QTc) summarized
      { id: 'link-17', sourceId: 'study-107', targetId: 'doc-clinical-summary', relationshipType: 'summarizes' },
      { id: 'link-18', sourceId: 'study-107', targetId: 'doc-clinical-overview', relationshipType: 'summarizes' },
      
      // Nonclinical and CMC inform Clinical Overview
      { id: 'link-19', sourceId: 'doc-nonclinical', targetId: 'doc-clinical-overview', relationshipType: 'informs' },
      { id: 'link-20', sourceId: 'doc-cmc', targetId: 'doc-clinical-overview', relationshipType: 'informs' },
    ];
  }
  
  if (submissionId === 'sub-2') {
    return [
      // Pivotal study informs IB
      { id: 'link-201', sourceId: 'study-201', targetId: 'doc-ib-2', relationshipType: 'informs' },
      
      // Dose finding study informs IB
      { id: 'link-202', sourceId: 'study-202', targetId: 'doc-ib-2', relationshipType: 'informs' },
      
      // PK study informs IB
      { id: 'link-203', sourceId: 'study-203', targetId: 'doc-ib-2', relationshipType: 'informs' },
      
      // Safety extension informs IB
      { id: 'link-204', sourceId: 'study-204', targetId: 'doc-ib-2', relationshipType: 'informs' },
      
      // IB informs nonclinical
      { id: 'link-205', sourceId: 'doc-ib-2', targetId: 'doc-nonclinical-2', relationshipType: 'informs' },
      
      // Studies summarized in Clinical Overview & Summary
      { id: 'link-206', sourceId: 'study-201', targetId: 'doc-clinical-overview-2', relationshipType: 'summarizes' },
      { id: 'link-207', sourceId: 'study-202', targetId: 'doc-clinical-overview-2', relationshipType: 'summarizes' },
      { id: 'link-208', sourceId: 'study-201', targetId: 'doc-clinical-summary-2', relationshipType: 'summarizes' },
      { id: 'link-209', sourceId: 'study-202', targetId: 'doc-clinical-summary-2', relationshipType: 'summarizes' },
      { id: 'link-210', sourceId: 'study-203', targetId: 'doc-clinical-summary-2', relationshipType: 'summarizes' },
      { id: 'link-211', sourceId: 'study-204', targetId: 'doc-clinical-summary-2', relationshipType: 'summarizes' },
      
      // Nonclinical and CMC inform Clinical Overview
      { id: 'link-212', sourceId: 'doc-nonclinical-2', targetId: 'doc-clinical-overview-2', relationshipType: 'informs' },
      { id: 'link-213', sourceId: 'doc-cmc-2', targetId: 'doc-clinical-overview-2', relationshipType: 'informs' },
    ];
  }
  
  if (submissionId === 'sub-3') {
    return [
      // Single study informs IB (IND only has one study typically)
      { id: 'link-301', sourceId: 'study-301', targetId: 'doc-ib-3', relationshipType: 'informs' },
    ];
  }
  
  return [];
};

export interface SectionInfo {
  id: string;
  number: string;
  title: string;
}

export type MappingType = 'copy_paste' | 'summary_elaborate' | 'rewrite_tone' | 'retrospective';

export const mappingTypeLabels: Record<MappingType, string> = {
  copy_paste: 'Copy-Paste',
  summary_elaborate: 'Summary → Elaborate',
  rewrite_tone: 'Rewrite (Tone)',
  retrospective: 'Retrospective Rewrite',
};

export const mappingTypeColors: Record<MappingType, string> = {
  copy_paste: '#22c55e',
  summary_elaborate: '#3b82f6',
  rewrite_tone: '#f59e0b',
  retrospective: '#8b5cf6',
};

export const getProtocolSections = (): SectionInfo[] => [
  { id: 'ps-1', number: '1', title: 'Introduction' },
  { id: 'ps-2', number: '2', title: 'Background and Rationale' },
  { id: 'ps-3', number: '3', title: 'Study Objectives' },
  { id: 'ps-4', number: '3.1', title: 'Primary Objectives' },
  { id: 'ps-5', number: '3.2', title: 'Secondary Objectives' },
  { id: 'ps-6', number: '4', title: 'Study Design' },
  { id: 'ps-7', number: '5', title: 'Study Population' },
  { id: 'ps-8', number: '5.1', title: 'Inclusion Criteria' },
  { id: 'ps-9', number: '5.2', title: 'Exclusion Criteria' },
  { id: 'ps-10', number: '6', title: 'Treatment' },
  { id: 'ps-11', number: '7', title: 'Efficacy Assessments' },
  { id: 'ps-12', number: '8', title: 'Safety Assessments' },
  { id: 'ps-13', number: '9', title: 'Statistical Methods' },
];

export const getCSRSections = (): SectionInfo[] => [
  { id: 'cs-1', number: '1', title: 'Title Page' },
  { id: 'cs-2', number: '2', title: 'Synopsis' },
  { id: 'cs-3', number: '3', title: 'Table of Contents' },
  { id: 'cs-4', number: '4', title: 'List of Abbreviations' },
  { id: 'cs-5', number: '5', title: 'Ethics' },
  { id: 'cs-6', number: '6', title: 'Investigators and Study Sites' },
  { id: 'cs-7', number: '7', title: 'Introduction' },
  { id: 'cs-8', number: '8', title: 'Study Objectives' },
  { id: 'cs-9', number: '9', title: 'Investigational Plan' },
  { id: 'cs-10', number: '9.1', title: 'Overall Study Design' },
  { id: 'cs-11', number: '9.2', title: 'Selection of Study Population' },
  { id: 'cs-12', number: '9.3', title: 'Treatments' },
  { id: 'cs-13', number: '9.4', title: 'Efficacy and Safety Variables' },
  { id: 'cs-14', number: '10', title: 'Study Patients' },
  { id: 'cs-15', number: '11', title: 'Efficacy Evaluation' },
  { id: 'cs-16', number: '12', title: 'Safety Evaluation' },
  { id: 'cs-17', number: '13', title: 'Discussion and Conclusions' },
];

export const getICFSections = (): SectionInfo[] => [
  { id: 'icf-1', number: '1', title: 'Study Title' },
  { id: 'icf-2', number: '2', title: 'Introduction' },
  { id: 'icf-3', number: '3', title: 'Purpose of the Study' },
  { id: 'icf-4', number: '4', title: 'Study Procedures' },
  { id: 'icf-5', number: '5', title: 'Risks and Discomforts' },
  { id: 'icf-6', number: '6', title: 'Benefits' },
  { id: 'icf-7', number: '7', title: 'Alternative Treatments' },
  { id: 'icf-8', number: '8', title: 'Confidentiality' },
  { id: 'icf-9', number: '9', title: 'Compensation' },
  { id: 'icf-10', number: '10', title: 'Voluntary Participation' },
  { id: 'icf-11', number: '11', title: 'Contact Information' },
  { id: 'icf-12', number: '12', title: 'Signature Page' },
];

export const getClinicalOverviewSections = (): SectionInfo[] => [
  { id: 'co-1', number: '2.5.1', title: 'Product Development Rationale' },
  { id: 'co-2', number: '2.5.2', title: 'Overview of Biopharmaceutics' },
  { id: 'co-3', number: '2.5.3', title: 'Overview of Clinical Pharmacology' },
  { id: 'co-4', number: '2.5.4', title: 'Overview of Efficacy' },
  { id: 'co-5', number: '2.5.5', title: 'Overview of Safety' },
  { id: 'co-6', number: '2.5.6', title: 'Benefits and Risks Conclusions' },
];

export const getClinicalSummarySections = (): SectionInfo[] => [
  { id: 'csum-1', number: '2.7.1', title: 'Summary of Biopharmaceutic Studies' },
  { id: 'csum-2', number: '2.7.2', title: 'Summary of Clinical Pharmacology Studies' },
  { id: 'csum-3', number: '2.7.3', title: 'Summary of Clinical Efficacy' },
  { id: 'csum-4', number: '2.7.4', title: 'Summary of Clinical Safety' },
  { id: 'csum-5', number: '2.7.5', title: 'Literature References' },
  { id: 'csum-6', number: '2.7.6', title: 'Synopses of Individual Studies' },
];

export const getIBSections = (): SectionInfo[] => [
  { id: 'ib-1', number: '1', title: 'Summary' },
  { id: 'ib-2', number: '2', title: 'Introduction' },
  { id: 'ib-3', number: '3', title: 'Physical, Chemical and Pharmaceutical Properties' },
  { id: 'ib-4', number: '4', title: 'Nonclinical Studies' },
  { id: 'ib-5', number: '5', title: 'Effects in Humans' },
  { id: 'ib-6', number: '5.1', title: 'Pharmacokinetics' },
  { id: 'ib-7', number: '5.2', title: 'Safety and Efficacy' },
  { id: 'ib-8', number: '6', title: 'Summary of Data and Guidance for Investigator' },
];

export type DocumentType = 'protocol' | 'csr' | 'icf' | 'clinical_overview' | 'clinical_summary' | 'ib';

export const documentTypeLabels: Record<DocumentType, string> = {
  protocol: 'Protocol',
  csr: 'CSR',
  icf: 'ICF',
  clinical_overview: 'Clinical Overview',
  clinical_summary: 'Clinical Summary',
  ib: 'Investigator Brochure',
};

export const getSections = (docType: DocumentType): SectionInfo[] => {
  switch (docType) {
    case 'protocol': return getProtocolSections();
    case 'csr': return getCSRSections();
    case 'icf': return getICFSections();
    case 'clinical_overview': return getClinicalOverviewSections();
    case 'clinical_summary': return getClinicalSummarySections();
    case 'ib': return getIBSections();
    default: return [];
  }
};

export const getSectionMappings = (sourceType: string, targetType: string): { source: SectionInfo; target: SectionInfo; type: MappingType }[] => {
  if (sourceType === 'protocol' && targetType === 'csr') {
    const protocol = getProtocolSections();
    const csr = getCSRSections();
    
    return [
      { source: protocol[2], target: csr[7], type: 'copy_paste' },
      { source: protocol[3], target: csr[7], type: 'copy_paste' },
      { source: protocol[4], target: csr[7], type: 'copy_paste' },
      { source: protocol[5], target: csr[9], type: 'copy_paste' },
      { source: protocol[6], target: csr[10], type: 'copy_paste' },
      { source: protocol[7], target: csr[10], type: 'copy_paste' },
      { source: protocol[8], target: csr[10], type: 'copy_paste' },
      { source: protocol[9], target: csr[11], type: 'copy_paste' },
      { source: protocol[10], target: csr[12], type: 'rewrite_tone' },
      { source: protocol[10], target: csr[14], type: 'retrospective' },
      { source: protocol[11], target: csr[12], type: 'rewrite_tone' },
      { source: protocol[11], target: csr[15], type: 'retrospective' },
      { source: protocol[12], target: csr[8], type: 'copy_paste' },
    ];
  }
  
  if (sourceType === 'protocol' && targetType === 'icf') {
    const protocol = getProtocolSections();
    const icf = getICFSections();
    
    return [
      { source: protocol[0], target: icf[0], type: 'copy_paste' },
      { source: protocol[1], target: icf[1], type: 'summary_elaborate' },
      { source: protocol[2], target: icf[2], type: 'rewrite_tone' },
      { source: protocol[3], target: icf[2], type: 'rewrite_tone' },
      { source: protocol[5], target: icf[3], type: 'rewrite_tone' },
      { source: protocol[6], target: icf[3], type: 'summary_elaborate' },
      { source: protocol[9], target: icf[3], type: 'rewrite_tone' },
      { source: protocol[11], target: icf[4], type: 'rewrite_tone' },
      { source: protocol[10], target: icf[5], type: 'summary_elaborate' },
    ];
  }
  
  if (sourceType === 'csr' && targetType === 'clinical_overview') {
    const csr = getCSRSections();
    const co = getClinicalOverviewSections();
    
    return [
      { source: csr[1], target: co[0], type: 'summary_elaborate' },
      { source: csr[7], target: co[0], type: 'summary_elaborate' },
      { source: csr[9], target: co[3], type: 'summary_elaborate' },
      { source: csr[14], target: co[3], type: 'summary_elaborate' },
      { source: csr[15], target: co[4], type: 'summary_elaborate' },
      { source: csr[16], target: co[5], type: 'summary_elaborate' },
    ];
  }
  
  if (sourceType === 'csr' && targetType === 'clinical_summary') {
    const csr = getCSRSections();
    const csum = getClinicalSummarySections();
    
    return [
      { source: csr[1], target: csum[5], type: 'copy_paste' },
      { source: csr[9], target: csum[2], type: 'summary_elaborate' },
      { source: csr[14], target: csum[2], type: 'summary_elaborate' },
      { source: csr[15], target: csum[3], type: 'summary_elaborate' },
      { source: csr[16], target: csum[2], type: 'summary_elaborate' },
    ];
  }
  
  if (sourceType === 'csr' && targetType === 'ib') {
    const csr = getCSRSections();
    const ib = getIBSections();
    
    return [
      { source: csr[1], target: ib[0], type: 'summary_elaborate' },
      { source: csr[14], target: ib[6], type: 'summary_elaborate' },
      { source: csr[15], target: ib[6], type: 'summary_elaborate' },
    ];
  }
  
  return [];
};

export type CrossStudyDocType = 'sae_form' | 'monitoring_plan' | 'dsmb_charter';

export interface CrossStudyDocument {
  id: string;
  name: string;
  shortName: string;
  type: CrossStudyDocType;
  status: 'draft' | 'in_review' | 'approved' | 'final';
  version: string;
  color: string;
}

export const crossStudyDocLabels: Record<CrossStudyDocType, string> = {
  sae_form: 'SAE Report Form',
  monitoring_plan: 'Monitoring Plan',
  dsmb_charter: 'DSMB Charter',
};

export const getCrossStudyDocuments = (submissionId: string): CrossStudyDocument[] => {
  if (submissionId === 'sub-1') {
    return [
      {
        id: 'doc-sae-form',
        name: 'SAE Report Form',
        shortName: 'SAE Form',
        type: 'sae_form',
        status: 'approved',
        version: '2.0',
        color: '#ef4444',
      },
      {
        id: 'doc-monitoring',
        name: 'Monitoring Plan',
        shortName: 'Monitoring Plan',
        type: 'monitoring_plan',
        status: 'approved',
        version: '1.0',
        color: '#059669',
      },
      {
        id: 'doc-dsmb',
        name: 'DSMB Charter',
        shortName: 'DSMB Charter',
        type: 'dsmb_charter',
        status: 'approved',
        version: '1.0',
        color: '#dc2626',
      },
    ];
  }
  
  if (submissionId === 'sub-2') {
    return [
      {
        id: 'doc-sae-form-2',
        name: 'SAE Report Form',
        shortName: 'SAE Form',
        type: 'sae_form',
        status: 'approved',
        version: '3.0',
        color: '#ef4444',
      },
      {
        id: 'doc-monitoring-2',
        name: 'Monitoring Plan',
        shortName: 'Monitoring Plan',
        type: 'monitoring_plan',
        status: 'approved',
        version: '2.0',
        color: '#059669',
      },
      {
        id: 'doc-dsmb-2',
        name: 'DSMB Charter',
        shortName: 'DSMB Charter',
        type: 'dsmb_charter',
        status: 'approved',
        version: '1.0',
        color: '#dc2626',
      },
    ];
  }
  
  if (submissionId === 'sub-3') {
    return [
      {
        id: 'doc-sae-form-3',
        name: 'SAE Report Form',
        shortName: 'SAE Form',
        type: 'sae_form',
        status: 'draft',
        version: '1.0',
        color: '#ef4444',
      },
    ];
  }
  
  return [];
};
