// src/components/bookview/BookViewTabs.tsx
import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import CharacterList from './CharacterList';
import LocationList from './LocationList';
import PlotEventList from './PlotEventList'; // <-- 1. IMPORT (pastikan sudah di-uncomment)

const BookViewTabs: React.FC = () => {
  return (
    <Tabs defaultActiveKey="characters" id="book-view-tabs" className="mb-3" fill>
      
      <Tab eventKey="themes" title="Themes">
        <div>Konten Themes di sini</div>
      </Tab>
      
      <Tab eventKey="events" title="Events">
        <PlotEventList /> {/* <-- 2. GANTI PLACEHOLDER DENGAN KOMPONEN INI */}
      </Tab>
      
      <Tab eventKey="characters" title="Characters">
        <CharacterList />
      </Tab>
      
      <Tab eventKey="locations" title="Locations">
        <LocationList />
      </Tab>
      
      <Tab eventKey="props" title="Props">
        <div>Konten Props di sini</div>
      </Tab>

    </Tabs>
  );
};

export default BookViewTabs;