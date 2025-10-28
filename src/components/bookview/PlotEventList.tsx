// src/components/bookview/PlotEventList.tsx
// (Ganti SELURUH isi file ini dengan kode di bawah)

import React, { useState, useMemo } from 'react';
import { ListGroup, Button, Stack, Dropdown } from 'react-bootstrap';
import { useCurrentBookStore } from '../../stores/currentBookStore';
import AddPlotEventModal from './AddPlotEventModal';
import type { IPlotEvent } from '../../types/data';

const PlotEventList: React.FC = () => {
  const { plotEvents: rawPlotEvents, deletePlotEvent } = useCurrentBookStore((state) => ({
    plotEvents: state.plotEvents,
    deletePlotEvent: state.deletePlotEvent,
  }));
  
  // Gunakan useMemo untuk mengurutkan list hanya saat data berubah
  const plotEvents = useMemo(() => {
    return [...rawPlotEvents].sort((a, b) => a.order - b.order);
  }, [rawPlotEvents]);

  // State untuk modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<IPlotEvent | null>(null);

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Yakin ingin menghapus event "${name}"?`)) {
      deletePlotEvent(id);
    }
  };

  const handleEdit = (event: IPlotEvent) => {
    setEditingEvent(event);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingEvent(null);
  };

  return (
    <div>
      <Button
        variant="primary"
        className="mb-3"
        onClick={() => setShowAddModal(true)} // Hanya trigger modal 'Add'
      >
        + Tambah Event Plot
      </Button>

      <ListGroup>
        {plotEvents.length > 0 ? (
          plotEvents.map((event) => (
            <ListGroup.Item key={event.id}>
              <Stack direction="horizontal" gap={3}>
                {/* Konten Utama */}
                <div className="me-auto">
                  <h5>{event.order}. {event.title}</h5>
                  <p className="mb-1 text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                    {event.summary || 'Tidak ada ringkasan.'}
                  </p>
                </div>
                
                {/* Tombol Aksi (Edit/Hapus) */}
                <Dropdown>
                  <Dropdown.Toggle variant="link" size="sm" className="text-muted" id={`dropdown-${event.id}`}>
                    ⋮
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleEdit(event)}>
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDelete(event.id!, event.title)} className="text-danger">
                      Hapus
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

              </Stack>
            </ListGroup.Item>
          ))
        ) : (
          <p>Belum ada event plot. Klik tombol di atas untuk menambah!</p>
        )}
      </ListGroup>

      {/* RENDER MODALNYA */}
      <AddPlotEventModal
        show={showAddModal || !!editingEvent}
        onHide={handleCloseModal}
        eventToEdit={editingEvent}
      />
    </div>
  );
};

export default PlotEventList;
