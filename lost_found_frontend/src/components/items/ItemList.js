import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getItems } from '../../services/itemService';
import Loading from '../common/Loading';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const params = {};
        if (statusFilter) params.status = statusFilter;
        
        const response = await getItems(params);
        setItems(response);
      } catch (error) {
        console.error('Failed to fetch items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [statusFilter]);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const q = sp.get('q');
    const s = sp.get('status');
    if (q) setFilter(q);
    if (s) setStatusFilter(s);
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

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(filter.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(filter.toLowerCase()))
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <Card>
      <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
        <span>Lost and Found Items</span>
        <Button variant="primary" onClick={() => navigate('/reports/new')}>
          <i className="bi bi-plus-circle me-1"></i>Report New Item
        </Button>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col md={8}>
            <Form.Control
              type="text"
              placeholder="Search items..."
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
              <option value="lost">Lost</option>
              <option value="found">Found</option>
              <option value="claimed">Claimed</option>
              <option value="completed">Completed</option>
              <option value="discarded">Discarded</option>
            </Form.Select>
          </Col>
        </Row>
        
        {filteredItems.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Reported By</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.item_id}>
                  <td>{item.title}</td>
                  <td>{item.category_name || 'N/A'}</td>
                  <td>{getStatusBadge(item.current_status)}</td>
                  <td>{item.creator_name || 'N/A'}</td>
                  <td>{new Date(item.created_on).toLocaleDateString()}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => navigate(`/items/${item.item_id}`)}
                      className="me-1"
                    >
                      View
                    </Button>
                    <Button 
                      variant="outline-success" 
                      size="sm"
                      onClick={() => navigate(`/reports/new?item_id=${item.item_id}`)}
                    >
                      Report Item
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No items found matching your criteria.</p>
        )}
      </Card.Body>
    </Card>
  );
};

export default ItemList;