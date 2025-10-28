// src/components/bookview/LocationList.tsx
// (Ganti SELURUH isi file ini dengan kode di bawah)

import React, { useState } from 'react';
import { ListGroup, Button, Stack, Dropdown } from 'react-bootstrap';
import { useCurrentBookStore } from '../../stores/currentBookStore';
import AddLocationModal from './AddLocationModal';
import type { ILocation } from '../../types/data';

const LocationList: React.FC = () => {
  const { locations, deleteLocation } = useCurrentBookStore((state) => ({
    locations: state.locations,
    deleteLocation: state.deleteLocation,
  }));
  
  // State untuk modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<ILocation | null>(null);

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Yakin ingin menghapus lokasi "${name}"?`)) {
      deleteLocation(id);
    }
  };

  const handleEdit = (loc: ILocation) => {
    setEditingLocation(loc);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingLocation(null);
  };

  return (
    <div>
      <Button
        variant="primary"
        className="mb-3"
        onClick={() => setShowAddModal(true)} // Hanya trigger modal 'Add'
      >
        + Tambah Lokasi
      </Button>

      <ListGroup>
        {locations.length > 0 ? (
          locations.map((loc) => (
            <ListGroup.Item key={loc.id}>
              <Stack direction="horizontal" gap={3}>
                {/* Konten Utama */}
                <div className="me-auto">
                  <h5>{loc.name}</h5>
                  <p className="mb-1 text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                    {loc.description || 'Tidak ada deskripsi.'}
                  </p>
                </div>
                
                {/* Tombol Aksi (Edit/Hapus) */}
                <Dropdown>
                  <Dropdown.Toggle variant="link" size="sm" className="text-muted" id={`dropdown-${loc.id}`}>
                    ⋮
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleEdit(loc)}>
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDelete(loc.id!, loc.name)} className="text-danger">
                      Hapus
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

              </Stack>
            </ListGroup.Item>
          ))
        ) : (
          <p>Belum ada lokasi. Klik tombol di atas untuk menambah!</p>
        )}
      </ListGroup>

      {/* RENDER MODALNYA */}
      <AddLocationModal
        show={showAddModal || !!editingLocation}
        onHide={handleCloseModal}
        locationToEdit={editingLocation}
      />
    </div>
  );
};

export default LocationList;
