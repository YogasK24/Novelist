// src/pages/WritePage.tsx

import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCurrentBookStore } from '../stores/currentBookStore';
import { Container, Spinner, Navbar, Nav } from 'react-bootstrap';
import ChapterList from '../components/bookview/ChapterList'; // Import list kita

const WritePage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const { loadBookData, clearBookData, isLoading, currentBook } = useCurrentBookStore();

  useEffect(() => {
    const id = parseInt(bookId || '0');
    if (id) {
      // Kita tetap butuh 'loadBookData' untuk
      // mengambil daftar bab dan info buku
      loadBookData(id);
    }
    return () => {
      clearBookData();
    };
  }, [bookId, loadBookData, clearBookData]);

  if (isLoading || !currentBook) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <div>
      {/* Kita buat header simpel untuk halaman ini */}
      <Navbar bg="dark" variant="dark" sticky="top">
        <Container fluid>
          <Nav.Link as={Link} to={`/book/${bookId}`} className="text-light">
            &larr; Kembali ke World-Building
          </Nav.Link>
          <Navbar.Brand className="mx-auto">
            {currentBook.title} - (Menulis)
          </Navbar.Brand>
          <div style={{ width: '40px' }}></div> {/* Spacer */}
        </Container>
      </Navbar>
      
      {/* Konten Halaman: Daftar Bab */}
      <Container className="mt-4">
        <ChapterList />
      </Container>
      
      {/* Kita bisa sembunyikan BottomNav di halaman ini,
          atau biarkan saja (tergantung App.tsx) */}
    </div>
  );
};

export default WritePage;
