import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// No StrictMode: the landing page drives a loader, a WebGL scene and several canvases imperatively, and
// StrictMode's dev-only double mount would run the loader animation twice.
createRoot(document.getElementById('root')!).render(<App />);
