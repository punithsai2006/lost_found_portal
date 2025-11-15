import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import { Container } from 'react-bootstrap';

const Dashboard = () => {
  const { isAdmin } = useAuth();

  return (
    <Container className="py-4">
      {isAdmin ? <AdminDashboard /> : <StudentDashboard />}
    </Container>
  );
};

export default Dashboard;