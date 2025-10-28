// src/components/MainNavbar.tsx
import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MainNavbar: React.FC = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Novelist
        </Navbar.Brand>
        {/* Tambahkan ikon '?' dan '...' di sini nanti jika perlu */}
      </Container>
    </Navbar>
  );
};

export default MainNavbar;
