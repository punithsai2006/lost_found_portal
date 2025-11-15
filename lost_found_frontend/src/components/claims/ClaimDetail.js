import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getClaim, approveClaim, rejectClaim } from '../../services/claimService';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../common/Loading';

const ClaimDetail = () => {
  const { claimId } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const response = await getClaim(claimId);
        setClaim(response);
      } catch (error) {
        console.error('Failed to fetch claim:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClaim();
  }, [claimId]);

  const getStatusBadge = (status) => {
    let variant = 'secondary';
    if (status === 'pending') variant = 'warning';
    else if (status === 'approved') variant = 'success';
    else if (status === 'rejected') variant = 'danger';
    
    return <Badge bg={variant}>{status}</Badge>;
  };

  const handleApprove = async () => {
    try {
      await approveClaim(claimId);
      setClaim(prev => ({
        ...prev,
        claim_status: 'approved'
      }));
    } catch (error) {
      console.error('Failed to approve claim:', error);
    }
  };

  const handleReject = async () => {
    try {
      await rejectClaim(claimId);
      setClaim(prev => ({
        ...prev,
        claim_status: 'rejected'
      }));
    } catch (error) {
      console.error('Failed to reject claim:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!claim) {
    return (
      <Card>
        <Card.Body>
          <Alert variant="danger">Claim not found</Alert>
          <Button variant="primary" onClick={() => navigate('/claims')}>
            Back to Claims
          </Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header as="h3" className="d-flex justify-content-between align-items-center">
        <span>Claim Details</span>
        <div>
          {getStatusBadge(claim.claim_status)}
          <Button 
            variant="outline-secondary" 
            className="ms-2"
            onClick={() => navigate('/claims')}
          >
            Back to Claims
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <h5>Item Information</h5>
        <p><strong>Item:</strong> {claim.item_title || 'N/A'}</p>
        
        <h5>Claim Information</h5>
        <p><strong>Claimer:</strong> {claim.claimer_name || 'N/A'}</p>
        <p><strong>Claim Status:</strong> {claim.claim_status}</p>
        <p><strong>Claim Date:</strong> {new Date(claim.claimed_on).toLocaleDateString()}</p>
        
        {claim.decided_on && (
          <p><strong>Decision Date:</strong> {new Date(claim.decided_on).toLocaleDateString()}</p>
        )}
        
        {claim.decider_name && (
          <p><strong>Decided By:</strong> {claim.decider_name}</p>
        )}
        
        {claim.claim_text && (
          <>
            <h5>Claim Details</h5>
            <p>{claim.claim_text}</p>
          </>
        )}
        
        {isAdmin && claim.claim_status === 'pending' && (
          <div className="mt-3">
            <Button variant="success" onClick={handleApprove}>
              Approve Claim
            </Button>
            <Button 
              variant="danger" 
              className="ms-2"
              onClick={handleReject}
            >
              Reject Claim
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ClaimDetail;