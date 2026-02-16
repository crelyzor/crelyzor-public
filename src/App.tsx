import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { CardPage } from './pages/CardPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

function CardRoute() {
  const { username, slug } = useParams();
  if (!username) return null;
  return <CardPage username={username} slug={slug} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:username" element={<CardRoute />} />
        <Route path="/:username/:slug" element={<CardRoute />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

