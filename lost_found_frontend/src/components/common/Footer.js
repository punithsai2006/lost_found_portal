import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer mt-auto">
      <Container>
        <Row className="py-4">
          <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
            <h5 className="mb-2" style={{ color: '#4a90e2' }}>🔍 Lost & Found Portal</h5>
            <p className="text-muted mb-0">
              Helping you find what you've lost and return what you've found.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <p className="text-muted mb-0">
              &copy; {new Date().getFullYear()} Lost & Found Portal. All rights reserved.
            </p>
            <p className="text-muted small mt-2 mb-0">
              Made with ❤️ for our community
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;