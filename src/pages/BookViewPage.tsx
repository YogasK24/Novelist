// src/pages/BookViewPage.tsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCurrentBookStore } from '../stores/currentBookStore';
import { Container, Spinner } from 'react-bootstrap';
import BookViewHeader from '../components/bookview/BookViewHeader';
import BookViewTabs from '../components/bookview/BookViewTabs';
import BottomNav from '../components/bookview/BottomNav';

const BookViewPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const { loadBookData, clearBookData, isLoading } = useCurrentBookStore();

  useEffect(() => {
    const id = parseInt(bookId || '0');
    if (id) {
      loadBookData(id);
    }

    // PENTING: Cleanup function saat komponen unmount
    return () => {
      clearBookData();
    };
  }, [bookId, loadBookData, clearBookData]);

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <div style={{ paddingBottom: '70px' }}> {/* Beri padding untuk BottomNav */}
      <BookViewHeader />
      <Container fluid className="mt-3">
        <BookViewTabs />
      </Container>
      <BottomNav />
    </div>
  );
};

export default BookViewPage;
