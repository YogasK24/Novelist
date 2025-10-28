// src/components/bookview/CharacterList.tsx
// (Ganti SELURUH isi file ini dengan kode di bawah)

import React, { useState } from 'react';
import { ListGroup, Button, Stack, Dropdown } from 'react-bootstrap';
import { useCurrentBookStore } from '../../stores/currentBookStore';
import AddCharacterModal from './AddCharacterModal';
import type { ICharacter } from '../../types/data';

const CharacterList: React.FC = () => {
  const { characters, deleteCharacter } = useCurrentBookStore((state) => ({
    characters: state.characters,
    deleteCharacter: state.deleteCharacter,
  }));
  
  // Kita butuh 2 state untuk modal:
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<ICharacter | null>(null);

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Yakin ingin menghapus karakter "${name}"?`)) {
      deleteCharacter(id);
    }
  };

  const handleEdit = (char: ICharacter) => {
    setEditingCharacter(char);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingCharacter(null);
  };

  return (
    <div>
      <Button
        variant="primary"
        className="mb-3"
        onClick={() => setShowAddModal(true)} // Hanya trigger modal 'Add'
      >
        + Tambah Karakter
      </Button>

      <ListGroup>
        {characters.length > 0 ? (
          characters.map((char) => (
            <ListGroup.Item key={char.id}>
              <Stack direction="horizontal" gap={3}>
                {/* Konten Utama */}
                <div className="me-auto">
                  <h5>{char.name}</h5>
                  <p className="mb-1 text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                    {char.description || 'Tidak ada deskripsi.'}
                  </p>
                </div>
                
                {/* Tombol Aksi (Edit/Hapus) */}
                <Dropdown>
                  <Dropdown.Toggle variant="link" size="sm" className="text-muted" id={`dropdown-${char.id}`}>
                    ⋮
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleEdit(char)}>
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDelete(char.id!, char.name)} className="text-danger">
                      Hapus
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

              </Stack>
            </ListGroup.Item>
          ))
        ) : (
          <p>Belum ada karakter. Klik tombol di atas untuk menambah!</p>
        )}
      </ListGroup>

      {/* RENDER MODALNYA */}
      <AddCharacterModal
        // Modal akan Tampil jika 'showAddModal' ATAU 'editingCharacter' ada isinya
        show={showAddModal || !!editingCharacter}
        onHide={handleCloseModal}
        // Kirim data karakter ke modal HANYA jika mode 'edit'
        characterToEdit={editingCharacter}
      />
    </div>
  );
};

export default CharacterList;
