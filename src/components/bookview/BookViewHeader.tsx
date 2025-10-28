// src/components/bookview/BookViewHeader.tsx
import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCurrentBookStore } from '../../stores/currentBookStore';

const BookViewHeader: React.FC = () => {
  const currentBook = useCurrentBookStore((state) => state.currentBook);

  return (
    <Navbar bg="dark" variant="dark" sticky="top">
      <Container fluid>
        <Nav.Link as={Link} to="/" className="text-light">
          &larr; {/* Tombol Back */}
        </Nav.Link>
        <Navbar.Brand className="mx-auto">
          {currentBook?.title || 'Loading...'}
        </Navbar.Brand>
        {/* Tambahkan ikon 'mata' dan '...' di sini */}
        <div style={{ width: '40px' }}></div> {/* Spacer */}
      </Container>
    </Navbar>
  );
};

export default BookViewHeader;