// src/components/bookview/ChapterList.tsx
// (Ganti SELURUH isi file ini dengan kode di bawah)

import React, { useState, useMemo } from 'react';
import { ListGroup, Button, Stack, Dropdown } from 'react-bootstrap';
import { useCurrentBookStore } from '../../stores/currentBookStore';
import AddChapterModal from './AddChapterModal';
import type { IChapter } from '../../types/data';

const ChapterList: React.FC = () => {
  const { chapters: rawChapters, deleteChapter } = useCurrentBookStore((state) => ({
    chapters: state.chapters,
    deleteChapter: state.deleteChapter,
  }));

  // Gunakan useMemo untuk mengurutkan list hanya saat data berubah
  const chapters = useMemo(() => {
    return [...rawChapters].sort((a, b) => a.order - b.order);
  }, [rawChapters]);

  // State untuk modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState<IChapter | null>(null);

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Yakin ingin menghapus bab "${name}"?`)) {
      deleteChapter(id);
    }
  };

  const handleEdit = (chap: IChapter) => {
    setEditingChapter(chap);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingChapter(null);
  };

  return (
    <div>
      <Button
        variant="primary"
        className="mb-3"
        onClick={() => setShowAddModal(true)} // Hanya trigger modal 'Add'
      >
        + Tambah Bab
      </Button>

      <ListGroup>
        {chapters.length > 0 ? (
          chapters.map((chap) => (
            <ListGroup.Item key={chap.id}>
              <Stack direction="horizontal" gap={3}>
                {/* Konten Utama */}
                <div 
                  className="me-auto" 
                  onClick={() => alert(`Buka editor untuk ${chap.title}`)} // <-- Placeholder Editor
                  style={{ cursor: 'pointer', flexGrow: 1 }}
                >
                  <h5>{chap.order}. {chap.title}</h5>
                  <small className="text-muted">
                    {/* Nanti bisa tampilkan jumlah kata */}
                  </small>
                </div>
                
                {/* Tombol Aksi (Edit/Hapus) */}
                <Dropdown>
                  <Dropdown.Toggle variant="link" size="sm" className="text-muted" id={`dropdown-chap-${chap.id}`}>
                    ⋮
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleEdit(chap)}>
                      Edit Judul
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDelete(chap.id!, chap.title)} className="text-danger">
                      Hapus Bab
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

              </Stack>
            </ListGroup.Item>
          ))
        ) : (
          <p>Belum ada bab. Klik tombol di atas untuk memulai naskahmu!</p>
        )}
      </ListGroup>

      {/* RENDER MODALNYA */}
      <AddChapterModal
        show={showAddModal || !!editingChapter}
        onHide={handleCloseModal}
        chapterToEdit={editingChapter}
      />
    </div>
  );
};

export default ChapterList;
