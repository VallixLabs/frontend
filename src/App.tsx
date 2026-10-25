import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './site/Home';
import SignInPage from './signin/SignInPage';
import Playground from './site/Playground';
import Research from './site/Research';
import WhoWeAre from './site/WhoWeAre';

/**
 * The landing page, "Who we are", research, the playground, and the sign-in at /workbench: the backend returns there after Google sign-in, so the
 * path stays even though the workbench itself is gone. Anything else falls back to the landing page.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/who-we-are" element={<WhoWeAre />} />
        <Route path="/research" element={<Research />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/workbench" element={<SignInPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
