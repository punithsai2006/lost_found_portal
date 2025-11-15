import React from 'react';
import ItemList from '../components/items/ItemList';
import { Container } from 'react-bootstrap';

const Items = () => {
  return (
    <Container className="py-4">
      <ItemList />
    </Container>
  );
};

export default Items;