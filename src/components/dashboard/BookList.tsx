// src/components/dashboard/BookList.tsx
import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Dropdown, Button } from 'react-bootstrap';
import { useBookStore } from '../../stores/bookStore';
import { Link } from 'react-router-dom';
import type { IBook } from '../../types/data';

// Definisikan props baru
interface BookListProps {
  onEditClick: (book: IBook) => void;
}

const BookList: React.FC<BookListProps> = ({ onEditClick }) => {
  const { books, isLoading, fetchBooks, deleteBook } = useBookStore((state) => ({
    books: state.books,
    isLoading: state.isLoading,
    fetchBooks: state.fetchBooks,
    deleteBook: state.deleteBook,
  }));

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleDelete = (e: React.MouseEvent, bookId: number, bookTitle: string) => {
    e.preventDefault(); 
    if (window.confirm(`Yakin ingin menghapus buku "${bookTitle}" dan semua datanya?`)) {
      deleteBook(bookId);
    }
  };

  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (books.length === 0) {
    return (
      <Container className="text-center mt-5">
        <p>Belum ada buku. Klik tombol '+' untuk memulai!</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row xs={2} md={3} lg={4} xl={5} className="g-4">
        {books.map((book) => (
          <Col key={book.id}>
            <Card as={Link} to={`/book/${book.id}`} className="text-decoration-none h-100">
              <Card.Body className="d-flex flex-column">
                <Card.Title>{book.title}</Card.Title>
                <div className="mt-auto d-flex justify-content-end">
                  <Dropdown onClick={(e) => e.preventDefault()}>
                    <Dropdown.Toggle as={Button} variant="link" size="sm" className="text-muted">
                      ⋮
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={(e) => { e.preventDefault(); onEditClick(book); }}>
                        Edit Judul
                      </Dropdown.Item>
                      <Dropdown.Item onClick={(e) => handleDelete(e, book.id!, book.title)} className="text-danger">
                        Hapus
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default BookList;
