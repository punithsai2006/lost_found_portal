import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Row, Col, Alert, Form, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getItem, updateItem } from '../../services/itemService';
import { createClaim } from '../../services/claimService';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../common/Loading';

const ItemDetail = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claimText, setClaimText] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await getItem(itemId);
        setItem(response);
      } catch (error) {
        console.error('Failed to fetch item:', error);
        setMessage('Failed to load item details');
        setMessageType('danger');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  const handleClaimItem = async () => {
    if (!claimText.trim()) {
      setMessage('Please provide details about your claim');
      setMessageType('warning');
      return;
    }

    setClaimLoading(true);
    try {
      await createClaim({
        item_id: parseInt(itemId),
        claim_text: claimText
      });
      setMessage('Your claim has been submitted successfully');
      setMessageType('success');
      setClaimText('');
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Failed to submit claim');
      setMessageType('danger');
    } finally {
      setClaimLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    let variant = 'secondary';
    if (status === 'lost') variant = 'danger';
    else if (status === 'found') variant = 'success';
    else if (status === 'claimed') variant = 'primary';
    else if (status === 'completed') variant = 'success';
    else if (status === 'discarded') variant = 'warning';
    
    return <Badge bg={variant} className="status-badge">{status}</Badge>;
  };

  const handleStatusChange = async (status) => {
    if (!window.confirm(`Are you sure you want to change the status to "${status}"?`)) {
      return;
    }

    setStatusLoading(true);
    setMessage('');
    try {
      const updatedItem = await updateItem(itemId, { current_status: status });
      setItem(updatedItem);
      setMessage(`Item status updated to "${status}" successfully!`);
      setMessageType('success');
      setShowStatusModal(false);
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Failed to update status');
      setMessageType('danger');
    } finally {
      setStatusLoading(false);
    }
  };

  const canChangeStatus = () => {
    if (!isAuthenticated || !user) return false;
    return item?.created_by === user.user_id || user.role_name === 'admin';
  };

  if (loading) {
    return <Loading />;
  }

  if (!item) {
    return (
      <Card>
        <Card.Body>
          <Alert variant="danger">Item not found</Alert>
          <Button variant="primary" onClick={() => navigate('/items')}>
            Back to Items
          </Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <Card.Header as="h3" className="d-flex justify-content-between align-items-center">
          <span>{item.title}</span>
          <div className="d-flex align-items-center gap-2">
            {getStatusBadge(item.current_status)}
            {canChangeStatus() && (
              <Button 
                variant="outline-light" 
                size="sm"
                onClick={() => setShowStatusModal(true)}
              >
                Change Status
              </Button>
            )}
            <Button 
              variant="outline-light" 
              size="sm"
              onClick={() => navigate('/items')}
            >
              ← Back
            </Button>
          </div>
        </Card.Header>

        <Card.Body>
          {message && <Alert variant={messageType} dismissible onClose={() => setMessage('')}>{message}</Alert>}
          
          <Row>
            <Col md={8}>
              <div className="mb-4">
                <h5 className="text-primary mb-3"><i className="bi bi-info-circle me-2"></i>Description</h5>
                <p className="lead">{item.description || 'No description available'}</p>
              </div>
              
              <div className="mb-4">
                <h5 className="text-primary mb-3"><i className="bi bi-card-list me-2"></i>Item Details</h5>
                <Row>
                  <Col sm={6} className="mb-2"><strong>Category:</strong> {item.category_name || 'N/A'}</Col>
                  <Col sm={6} className="mb-2"><strong>Status:</strong> {getStatusBadge(item.current_status)}</Col>
                  <Col sm={6} className="mb-2"><strong>Reported By:</strong> {item.creator_name || 'N/A'}</Col>
                  <Col sm={6} className="mb-2"><strong>Reported On:</strong> {new Date(item.created_on).toLocaleDateString()}</Col>
                  <Col sm={6} className="mb-2"><strong>Last Report Type:</strong> {item.last_report_type || 'N/A'}</Col>
                  <Col sm={6} className="mb-2"><strong>Last Report Date:</strong> {item.last_report_date ? new Date(item.last_report_date).toLocaleDateString() : 'N/A'}</Col>
                  <Col sm={12} className="mb-2"><strong>Last Known Location:</strong> {item.last_location_name || 'N/A'}</Col>
                  {item.last_status_change && (
                    <Col sm={12} className="mb-2"><strong>Last Status Change:</strong> {new Date(item.last_status_change).toLocaleDateString()}</Col>
                  )}
                </Row>
              </div>
              
              {isAuthenticated && item.current_status === 'found' && item.created_by !== user?.user_id && (
                <div className="mt-4 p-3 bg-light rounded">
                  <h5 className="text-success mb-3"><i className="bi bi-check-circle me-2"></i>Claim This Item</h5>
                  <Form.Group className="mb-3">
                    <Form.Label>Claim Details</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Provide claim details..."
                      value={claimText}
                      onChange={(e) => setClaimText(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="success" onClick={handleClaimItem} disabled={claimLoading} size="lg">
                    {claimLoading ? 'Submitting...' : 'Submit Claim'}
                  </Button>
                </div>
              )}
            </Col>
            
            <Col md={4}>
              <div className="mb-3">
                <h5 className="text-primary mb-3"><i className="bi bi-images me-2"></i>Images</h5>
                {item.images && item.images.length > 0 ? (
                  <div className="d-grid gap-2">
                    {item.images.map((image) => (
                      <img
                        key={image.image_id}
                        src={image.file_path.startsWith('http') ? image.file_path : `http://127.0.0.1:8000${image.file_path}`}
                        alt={item.title}
                        className="item-image"
                        style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 bg-light rounded">
                    <i className="bi bi-image" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                    <p className="text-muted mt-2">No images available</p>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Item Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Current Status: {getStatusBadge(item.current_status)}</p>
          <Form.Label>Select New Status:</Form.Label>
          <Form.Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="mb-3">
            <option value="">Select status...</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
            <option value="claimed">Claimed</option>
            <option value="completed">Completed</option>
            <option value="discarded">Discarded</option>
          </Form.Select>
          {newStatus && (
            <Alert variant="info">
              Changing status to: <strong>{newStatus}</strong>
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => handleStatusChange(newStatus)} disabled={!newStatus || statusLoading}>
            {statusLoading ? 'Updating...' : 'Update Status'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ItemDetail;
