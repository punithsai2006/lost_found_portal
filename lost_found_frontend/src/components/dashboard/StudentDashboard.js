import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { updateReportStatus } from '../../services/reportService';
import Loading from '../common/Loading';

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { user } = useAuth();

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/users/dashboard/student');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setMessage({ type: 'danger', text: 'Failed to load dashboard data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    let variant = 'secondary';
    if (status === 'lost') variant = 'danger';
    else if (status === 'found') variant = 'success';
    else if (status === 'claimed') variant = 'primary';
    else if (status === 'completed') variant = 'success';
    else if (status === 'discarded') variant = 'warning';
    
    return <Badge bg={variant} className="status-badge">{status}</Badge>;
  };

  const getReportTypeBadge = (type) => {
    let variant = 'secondary';
    if (type === 'lost') variant = 'danger';
    else if (type === 'found') variant = 'success';
    
    return <Badge bg={variant}>{type}</Badge>;
  };

  const getReportStatusBadge = (status) => {
    let variant = 'secondary';
    if (status === 'open') variant = 'primary';
    else if (status === 'in_review') variant = 'warning';
    else if (status === 'resolved') variant = 'success';
    
    return <Badge bg={variant}>{status}</Badge>;
  };

  const handleMarkAsCompleted = async (reportId) => {
    if (!window.confirm('Mark this report as completed? This will also mark the item as completed.')) {
      return;
    }

    setUpdating(true);
    setMessage({ type: '', text: '' });
    
    try {
      await updateReportStatus(reportId, 'resolved');
      setMessage({ type: 'success', text: 'Report marked as completed successfully!' });
      // Refresh dashboard data
      await fetchDashboardData();
    } catch (error) {
      console.error('Failed to update report status:', error);
      setMessage({ type: 'danger', text: error.response?.data?.detail || 'Failed to update report status' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Card>
      <Card.Header as="h5">My Dashboard</Card.Header>
      <Card.Body>
        <h5>Welcome, {user?.name}!</h5>
        <p>Here's a summary of your lost and found reports:</p>
        
        {message.text && (
          <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
            {message.text}
          </Alert>
        )}
        
        {dashboardData.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Item</th>
                <th>Item Status</th>
                <th>Report Type</th>
                <th>Report Status</th>
                <th>Location</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.map((item, index) => (
                <tr key={index}>
                  <td>{item.item_title || item.title}</td>
                  <td>{getStatusBadge(item.current_status)}</td>
                  <td>{getReportTypeBadge(item.report_type)}</td>
                  <td>{getReportStatusBadge(item.status)}</td>
                  <td>{item.location_name || 'N/A'}</td>
                  <td>{new Date(item.reported_on).toLocaleDateString()}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => window.location.href = `/items/${item.item_id}`}
                      className="me-1"
                    >
                      View Item
                    </Button>
                    {item.status !== 'resolved' && (
                      <Button 
                        variant="outline-success" 
                        size="sm"
                        onClick={() => handleMarkAsCompleted(item.report_id)}
                        disabled={updating}
                      >
                        Mark Completed
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="text-center py-4">
            <p>You haven't reported any lost or found items yet.</p>
            <Button variant="primary" onClick={() => window.location.href = '/reports/new'}>
              Report Your First Item
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default StudentDashboard;