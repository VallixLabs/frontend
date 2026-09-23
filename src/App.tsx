import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LandingPage from './LandingPage';
import WorkbenchPage from './workbench/WorkbenchPage';

/**
 * Two pages, deliberately on paths rather than hashes: the landing page navigates
 * its own sections with `#model`, `#pricing` and friends, and a hash router would
 * fight those anchors for the same part of the URL.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/workbench" element={<WorkbenchPage />} />
      </Routes>
    </BrowserRouter>
  );
}
