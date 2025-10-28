// src/components/dashboard/AddBookButton.tsx
import React from 'react';
import { Button } from 'react-bootstrap';

// Definisikan props baru
interface AddBookButtonProps {
  onAddClick: () => void;
}

const AddBookButton: React.FC<AddBookButtonProps> = ({ onAddClick }) => {
  const fabStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    borderRadius: '50%',
    width: '56px',
    height: '56px',
    fontSize: '1.5rem',
    zIndex: 1000,
  };

  return (
    <>
      <Button
        style={fabStyle}
        onClick={onAddClick} // Panggil props
      >
        +
      </Button>
    </>
  );
};

export default AddBookButton;