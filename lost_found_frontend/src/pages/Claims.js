import React from 'react';
import ClaimList from '../components/claims/ClaimList';
import { Container } from 'react-bootstrap';

const Claims = () => {
  return (
    <Container className="py-4">
      <ClaimList />
    </Container>
  );
};

export default Claims;