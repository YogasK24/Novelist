// src/components/bookview/AddChapterModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useCurrentBookStore } from '../../stores/currentBookStore';
import type { IChapter } from '../../types/data';

interface AddChapterModalProps {
  show: boolean;
  onHide: () => void;
  chapterToEdit: IChapter | null; // Props untuk mode edit
}

const AddChapterModal: React.FC<AddChapterModalProps> = ({ show, onHide, chapterToEdit }) => {
  const [title, setTitle] = useState('');
  
  const { addChapter, updateChapter } = useCurrentBookStore((state) => ({
    addChapter: state.addChapter,
    updateChapter: state.updateChapter,
  }));

  // Gunakan useEffect untuk mengisi form
  useEffect(() => {
    if (chapterToEdit) {
      // Mode Edit
      setTitle(chapterToEdit.title);
    } else {
      // Mode Tambah
      setTitle('');
    }
  }, [chapterToEdit, show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (chapterToEdit) {
      // Mode Edit
      await updateChapter(chapterToEdit.id!, title.trim());
    } else {
      // Mode Tambah
      await addChapter(title.trim());
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
          {chapterToEdit ? 'Edit Judul Bab' : 'Buat Bab Baru'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group controlId="chapterTitle">
            <Form.Label>Judul Bab</Form.Label>
            <Form.Control
              type="text"
              placeholder="Misal: Bab 1: Permulaan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Batal</Button>
          <Button variant="primary" type="submit" disabled={!title.trim()}>
            Simpan
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddChapterModal;
