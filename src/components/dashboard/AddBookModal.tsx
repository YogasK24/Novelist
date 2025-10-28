// src/components/dashboard/AddBookModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useBookStore } from '../../stores/bookStore';
import type { IBook } from '../../types/data'; // Import Tipe

interface AddBookModalProps {
  show: boolean;
  onHide: () => void;
  bookToEdit: IBook | null; // <-- PROPS BARU
}

const AddBookModal: React.FC<AddBookModalProps> = ({ show, onHide, bookToEdit }) => {
  const [title, setTitle] = useState('');
  
  const { addNewBook, updateBookTitle } = useBookStore((state) => ({
    addNewBook: state.addNewBook,
    updateBookTitle: state.updateBookTitle,
  }));

  // Gunakan useEffect untuk mengisi form
  useEffect(() => {
    if (bookToEdit) {
      // Mode Edit
      setTitle(bookToEdit.title);
    } else {
      // Mode Tambah
      setTitle('');
    }
  }, [bookToEdit, show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (bookToEdit) {
      // Mode Edit
      await updateBookTitle(bookToEdit.id!, title.trim());
    } else {
      // Mode Tambah
      await addNewBook(title.trim());
    }
    
    onHide(); 
  };

  const handleClose = () => {
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {/* Judul dinamis! */}
          {bookToEdit ? 'Edit Judul Buku' : 'Buat Buku Baru'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group controlId="bookTitle">
            <Form.Label>Judul Buku</Form.Label>
            <Form.Control
              type="text"
              placeholder="Masukkan judul novel..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Batal
          </Button>
          <Button variant="primary" type="submit" disabled={!title.trim()}>
            Simpan
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddBookModal;
