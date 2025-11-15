import React from 'react';
import ReportList from '../components/reports/ReportList';
import { Container } from 'react-bootstrap';

const Reports = () => {
  return (
    <Container className="py-4">
      <ReportList />
    </Container>
  );
};

export default Reports;