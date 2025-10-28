// src/pages/DashboardPage.tsx
import React, { useState } from 'react';
import MainNavbar from '../components/MainNavbar';
import BookList from '../components/dashboard/BookList';
import AddBookButton from '../components/dashboard/AddBookButton';
import AddBookModal from '../components/dashboard/AddBookModal'; // <-- 1. IMPORT MODAL
import type { IBook } from '../types/data'; // <-- 2. IMPORT TIPE

const DashboardPage: React.FC = () => {
  // 3. ANGKAT STATE KE SINI
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState<IBook | null>(null);

  // 4. Buat handler untuk 'Edit'
  const handleEditClick = (book: IBook) => {
    setEditingBook(book);
  };
  
  // 5. Buat handler untuk 'Add'
  const handleAddClick = () => {
    setShowAddModal(true);
  };
  
  // 6. Buat handler untuk 'Close'
  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingBook(null);
  };

  return (
    <div>
      <MainNavbar />
      
      {/* 7. Kirim handler sebagai props */}
      <BookList onEditClick={handleEditClick} />
      <AddBookButton onAddClick={handleAddClick} />
      
      {/* 8. Render modal di sini */}
      <AddBookModal
        show={showAddModal || !!editingBook}
        onHide={handleCloseModal}
        bookToEdit={editingBook}
      />
    </div>
  );
};

export default DashboardPage;