import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { CardPage } from './pages/CardPage';

function CardRoute() {
  const { username, slug } = useParams();
  if (!username) return null;
  return <CardPage username={username} slug={slug} />;
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <p className="text-6xl font-light text-neutral-200 mb-4">404</p>
        <p className="text-neutral-500 text-sm">Page not found</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:username" element={<CardRoute />} />
        <Route path="/:username/:slug" element={<CardRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
