// src/App.tsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';

// Gunakan Lazy Loading biar aplikasi lebih cepat
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const BookViewPage = lazy(() => import('./pages/BookViewPage'));
const WritePage = lazy(() => import('./pages/WritePage')); // <-- TAMBAHKAN INI

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <Container className="d-flex justify-content-center align-items-center vh-100">
          <Spinner animation="border" />
        </Container>
      }>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/book/:bookId" element={<BookViewPage />} />
          <Route path="/book/:bookId/write" element={<WritePage />} /> {/* <-- TAMBAHKAN INI */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
