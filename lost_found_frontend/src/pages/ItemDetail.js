import React from 'react';
import ItemDetailComponent from '../components/items/ItemDetail';
import { Container } from 'react-bootstrap';

const ItemDetail = () => {
  return (
    <Container className="py-4">
      <ItemDetailComponent />
    </Container>
  );
};

export default ItemDetail;