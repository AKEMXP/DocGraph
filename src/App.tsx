import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Submissions } from './pages/Submissions';
import { SubmissionDetail } from './pages/SubmissionDetail';
import { SectionRelationship } from './pages/SectionRelationship';
import { StudyDocuments } from './pages/StudyDocuments';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/submissions" element={<Submissions />} />
          <Route path="/submissions/:submissionId" element={<SubmissionDetail />} />
          <Route path="/submissions/:submissionId/sections" element={<SectionRelationship />} />
          <Route path="/submissions/:submissionId/study/:studyId" element={<StudyDocuments />} />
          <Route path="/submissions/:submissionId/study/:studyId/sections" element={<SectionRelationship />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
