import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getItems } from '../../services/itemService';
import { createClaim } from '../../services/claimService';
import Loading from '../common/Loading';

const ClaimForm = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    item_id: '',
    claim_text: '',
    claim_status: 'pending'
  });
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getItems({ status: 'found' });
        setItems(response);
      } catch (error) {
        console.error('Failed to fetch items:', error);
        setError('Failed to load items');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await createClaim(formData);
      setSuccess('Claim submitted successfully!');
      setTimeout(() => {
        navigate('/claims');
      }, 1500);
    } catch (error) {
      console.error('Failed to submit claim:', error);
      setError(error.response?.data?.detail || 'Failed to submit claim');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <Loading />;
  }

  return (
    <Card className="mx-auto" style={{ maxWidth: '800px' }}>
      <Card.Header as="h5">Submit New Claim</Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="item_id">
            <Form.Label>Item</Form.Label>
            <Form.Select
              name="item_id"
              value={formData.item_id}
              onChange={handleChange}
              required
            >
              <option value="">Select an item to claim</option>
              {items.map(item => (
                <option key={item.item_id} value={item.item_id}>
                  {item.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="claim_text">
            <Form.Label>Claim Details</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="claim_text"
              value={formData.claim_text}
              onChange={handleChange}
              placeholder="Provide details about why this item belongs to you..."
              required
            />
          </Form.Group>
          
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Claim'}
          </Button>
          
          <Button
            variant="outline-secondary"
            className="ms-2"
            onClick={() => navigate('/claims')}
          >
            Cancel
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ClaimForm;