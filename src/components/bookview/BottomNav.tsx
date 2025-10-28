// src/components/bookview/BottomNav.tsx
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const { bookId } = useParams(); // Ambil bookId dari URL

  return (
    <Navbar bg="dark" variant="dark" fixed="bottom">
      <Container>
        <Nav className="w-100 justify-content-around" fill>
          {/* Tombol 'Plot' bisa link ke tab 'Events' */}
          <Nav.Link as={Link} to={`/book/${bookId}?tab=events`}>Plot</Nav.Link> 
          
          {/* INI YANG PENTING */}
          <Nav.Link as={Link} to={`/book/${bookId}/write`} className="fw-bold text-info">
            Write
          </Nav.Link>
          
          {/* Tombol FAB Biru di tengah bisa ditambahkan di sini */}
          
          <Nav.Link>Organize</Nav.Link>
          <Nav.Link>Schedule</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default BottomNav;
