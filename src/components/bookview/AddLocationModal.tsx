// src/components/bookview/AddLocationModal.tsx
// (Ganti SELURUH isi file ini dengan kode di bawah)

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useCurrentBookStore } from '../../stores/currentBookStore';
import type { ILocation } from '../../types/data'; // Import Tipe

interface AddLocationModalProps {
  show: boolean;
  onHide: () => void;
  locationToEdit: ILocation | null; // <-- PROPS BARU
}

const AddLocationModal: React.FC<AddLocationModalProps> = ({ show, onHide, locationToEdit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const { addLocation, updateLocation } = useCurrentBookStore((state) => ({
    addLocation: state.addLocation,
    updateLocation: state.updateLocation,
  }));

  // Gunakan useEffect untuk mengisi form saat 'locationToEdit' berubah
  useEffect(() => {
    if (locationToEdit) {
      // Mode Edit: Isi form dengan data yang ada
      setName(locationToEdit.name);
      setDescription(locationToEdit.description);
    } else {
      // Mode Tambah: Kosongkan form
      setName('');
      setDescription('');
    }
  }, [locationToEdit, show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (locationToEdit) {
      // Mode Edit: Panggil updateLocation
      await updateLocation(locationToEdit.id!, { name: name.trim(), description: description.trim() });
    } else {
      // Mode Tambah: Panggil addLocation
      await addLocation(name.trim(), description.trim());
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
          {locationToEdit ? 'Edit Lokasi' : 'Tambah Lokasi Baru'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="locName">
            <Form.Label>Nama Lokasi</Form.Label>
            <Form.Control
              type="text"
              placeholder="Misal: Hutan Ajaib..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
            />
          </Form.Group>
          <Form.Group controlId="locDesc">
            <Form.Label>Deskripsi Singkat (Opsional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Deskripsi fisik, suasana..."
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

export default AddLocationModal;
