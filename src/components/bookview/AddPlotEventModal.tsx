import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useCurrentBookStore } from '../../stores/currentBookStore';
import type { IPlotEvent } from '../../types/data'; // Import Tipe

interface AddPlotEventModalProps {
  show: boolean;
  onHide: () => void;
  eventToEdit: IPlotEvent | null; // <-- PROPS BARU
}

const AddPlotEventModal: React.FC<AddPlotEventModalProps> = ({ show, onHide, eventToEdit }) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  
  const { addPlotEvent, updatePlotEvent } = useCurrentBookStore((state) => ({
    addPlotEvent: state.addPlotEvent,
    updatePlotEvent: state.updatePlotEvent,
  }));

  // Gunakan useEffect untuk mengisi form
  useEffect(() => {
    if (eventToEdit) {
      // Mode Edit
      setTitle(eventToEdit.title);
      setSummary(eventToEdit.summary);
    } else {
      // Mode Tambah
      setTitle('');
      setSummary('');
    }
  }, [eventToEdit, show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (eventToEdit) {
      // Mode Edit
      await updatePlotEvent(eventToEdit.id!, { title: title.trim(), summary: summary.trim() });
    } else {
      // Mode Tambah
      await addPlotEvent(title.trim(), summary.trim());
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
          {eventToEdit ? 'Edit Event Plot' : 'Tambah Event Plot Baru'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="eventName">
            <Form.Label>Judul Event/Scene</Form.Label>
            <Form.Control
              type="text"
              placeholder="Misal: Pertemuan Pertama..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </Form.Group>
          <Form.Group controlId="eventSummary">
            <Form.Label>Ringkasan (Opsional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Apa yang terjadi di event/scene ini?"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
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

export default AddPlotEventModal;