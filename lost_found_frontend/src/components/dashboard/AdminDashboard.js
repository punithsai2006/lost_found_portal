import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button } from 'react-bootstrap';
import api from '../../services/api';
import Loading from '../common/Loading';

const AdminDashboard = () => {
  const [pendingClaims, setPendingClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingClaims = async () => {
      try {
        const response = await api.get('/users/dashboard/admin/pending_claims');
        setPendingClaims(response.data);
      } catch (error) {
        console.error('Failed to fetch pending claims:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingClaims();
  }, []);

  const handleApproveClaim = async (claimId) => {
    try {
      await api.post(`/claims/${claimId}/approve`);
      const updated = await api.get('/users/dashboard/admin/pending_claims');
      setPendingClaims(updated.data);
    } catch (error) {
      console.error('Failed to approve claim:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Card>
      <Card.Header as="h5">Admin Dashboard</Card.Header>
      <Card.Body>
        <h5>Pending Claims</h5>

        {pendingClaims.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Item</th>
                <th>Claimer</th>
                <th>Claim Date</th>
                <th>Current Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingClaims.map((claim) => (
                <tr key={claim.claim_id}>
                  <td>{claim.title}</td>
                  <td>{claim.claimer_name}</td>
                  <td>{new Date(claim.claimed_on).toLocaleDateString()}</td>
                  <td>
                    <Badge bg="warning">{claim.current_status}</Badge>
                  </td>
                  <td>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleApproveClaim(claim.claim_id)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="ms-2"
                      href={`/claims/${claim.claim_id}`}
                    >
                      Review
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No pending claims at the moment.</p>
        )}
      </Card.Body>
    </Card>
  );
};

export default AdminDashboard;
