import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getClaims } from '../../services/claimService';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../common/Loading';

const ClaimList = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const params = {};
        if (statusFilter) params.status = statusFilter;
        
        const response = await getClaims(params);
        setClaims(response);
      } catch (error) {
        console.error('Failed to fetch claims:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, [statusFilter]);

  const getStatusBadge = (status) => {
    let variant = 'secondary';
    if (status === 'pending') variant = 'warning';
    else if (status === 'approved') variant = 'success';
    else if (status === 'rejected') variant = 'danger';
    
    return <Badge bg={variant}>{status}</Badge>;
  };

  const filteredClaims = claims.filter(claim => 
    (claim.item_title && claim.item_title.toLowerCase().includes(filter.toLowerCase())) ||
    (claim.claimer_name && claim.claimer_name.toLowerCase().includes(filter.toLowerCase())) ||
    (claim.claim_text && claim.claim_text.toLowerCase().includes(filter.toLowerCase()))
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <Card>
      <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
        <span>Claims</span>
        <Button variant="primary" onClick={() => navigate('/claims/new')}>New Claim</Button>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col md={8}>
            <Form.Control
              type="text"
              placeholder="Search claims..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </Form.Select>
          </Col>
        </Row>
        
        {filteredClaims.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Item</th>
                <th>Claimer</th>
                <th>Status</th>
                <th>Claim Date</th>
                {isAdmin && <th>Decided By</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims.map((claim) => (
                <tr key={claim.claim_id}>
                  <td>{claim.item_title || 'N/A'}</td>
                  <td>{claim.claimer_name || 'N/A'}</td>
                  <td>{getStatusBadge(claim.claim_status)}</td>
                  <td>{new Date(claim.claimed_on).toLocaleDateString()}</td>
                  {isAdmin && <td>{claim.decider_name || 'N/A'}</td>}
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => navigate(`/claims/${claim.claim_id}`)}
                    >
                      View
                    </Button>
                    {isAdmin && claim.claim_status === 'pending' && (
                      <Button 
                        variant="success" 
                        size="sm" 
                        className="ms-2"
                        onClick={() => navigate(`/claims/${claim.claim_id}/approve`)}
                      >
                        Approve
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No claims found matching your criteria.</p>
        )}
      </Card.Body>
    </Card>
  );
};

export default ClaimList;