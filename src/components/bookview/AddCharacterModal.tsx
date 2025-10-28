// src/components/bookview/AddCharacterModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useCurrentBookStore } from '../../stores/currentBookStore';
import type { ICharacter } from '../../types/data'; // Import Tipe

interface AddCharacterModalProps {
  show: boolean;
  onHide: () => void;
  characterToEdit: ICharacter | null; // <-- PROPS BARU
}

const AddCharacterModal: React.FC<AddCharacterModalProps> = ({ show, onHide, characterToEdit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const { addCharacter, updateCharacter } = useCurrentBookStore((state) => ({
    addCharacter: state.addCharacter,
    updateCharacter: state.updateCharacter,
  }));

  // PENTING: Gunakan useEffect untuk mengisi form saat 'characterToEdit' berubah
  useEffect(() => {
    if (characterToEdit) {
      // Mode Edit: Isi form dengan data yang ada
      setName(characterToEdit.name);
      setDescription(characterToEdit.description);
    } else {
      // Mode Tambah: Kosongkan form
      setName('');
      setDescription('');
    }
  }, [characterToEdit, show]); // 'show' memastikan form reset saat modal dibuka ulang

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (characterToEdit) {
      // Mode Edit: Panggil updateCharacter
      await updateCharacter(characterToEdit.id!, { name: name.trim(), description: description.trim() });
    } else {
      // Mode Tambah: Panggil addCharacter
      await addCharacter(name.trim(), description.trim());
    }
    
    onHide(); // Tutup modal (state form akan di-reset oleh useEffect)
  };

  const handleClose = () => {
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {/* Judul dinamis! */}
          {characterToEdit ? 'Edit Karakter' : 'Tambah Karakter Baru'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="charName">
            <Form.Label>Nama Karakter</Form.Label>
            <Form.Control
              type="text"
              placeholder="Misal: Andra, Bima, ..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
            />
          </Form.Group>
          <Form.Group controlId="charDesc">
            <Form.Label>Deskripsi Singkat (Opsional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Ciri-ciri, peran, atau catatan singkat..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Batal
          </Button>
          <Button variant="primary" type="submit" disabled={!name.trim()}>
            Simpan
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddCharacterModal;
