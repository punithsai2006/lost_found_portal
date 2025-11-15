import React, { useState, useEffect } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { getClaim, approveClaim } from '../../services/claimService';
import Loading from '../common/Loading';

const ClaimApproval = () => {
  const { claimId } = useParams();
  const navigate = useNavigate();
  
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const response = await getClaim(claimId);
        setClaim(response);
      } catch (error) {
        console.error('Failed to fetch claim:', error);
        setError('Failed to load claim details');
      } finally {
        setLoading(false);
      }
    };

    fetchClaim();
  }, [claimId]);

  const handleApprove = async () => {
    setApproving(true);
    setError('');
    setSuccess('');

    try {
      await approveClaim(claimId);
      setSuccess('Claim approved successfully!');
      setTimeout(() => {
        navigate('/claims');
      }, 1500);
    } catch (error) {
      console.error('Failed to approve claim:', error);
      setError(error.response?.data?.detail || 'Failed to approve claim');
    } finally {
      setApproving(false);
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
    <Card className="mx-auto" style={{ maxWidth: '800px' }}>
      <Card.Header as="h5">Approve Claim</Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <h5>Claim Information</h5>
        <p><strong>Item:</strong> {claim.item_title || 'N/A'}</p>
        <p><strong>Claimer:</strong> {claim.claimer_name || 'N/A'}</p>
        <p><strong>Claim Date:</strong> {new Date(claim.claimed_on).toLocaleDateString()}</p>
        
        {claim.claim_text && (
          <>
            <h5>Claim Details</h5>
            <p>{claim.claim_text}</p>
          </>
        )}
        
        <div className="mt-4">
          <Button
            variant="success"
            onClick={handleApprove}
            disabled={approving || claim.claim_status !== 'pending'}
          >
            {approving ? 'Approving...' : 'Approve Claim'}
          </Button>
          
          <Button
            variant="outline-secondary"
            className="ms-2"
            onClick={() => navigate('/claims')}
          >
            Cancel
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ClaimApproval;
