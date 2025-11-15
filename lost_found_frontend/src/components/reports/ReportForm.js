import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getItems, getCategories, createItem } from '../../services/itemService';
import { createReport } from '../../services/reportService';
import Loading from '../common/Loading';

const ReportForm = () => {
  const navigate = useNavigate();
  useAuth(); // calling the hook but not storing unused `user`

  const params = new URLSearchParams(window.location.search);
  const typeParam = params.get('type');
  const itemIdParam = params.get('item_id');
  
  const [formData, setFormData] = useState({
    item_id: itemIdParam || '',
    item_title: '',
    category_id: '',
    item_description: '',
    report_type: typeParam === 'found' ? 'found' : 'lost',
    reported_date: new Date().toISOString().split('T')[0],
    location_name: '',
    details: '',
    status: 'open'
  });
  
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [createNewItem, setCreateNewItem] = useState(!itemIdParam);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsResponse, categoriesResponse] = await Promise.all([
          getItems(),
          getCategories()
        ]);
        setItems(itemsResponse);
        setCategories(categoriesResponse);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to load necessary data');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
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
      let itemId = formData.item_id;

      if (createNewItem) {
        if (!formData.item_title.trim()) {
          setError('Item title is required');
          setLoading(false);
          return;
        }
        
        const newItem = await createItem({
          title: formData.item_title,
          category_id: formData.category_id || null,
          description: formData.item_description || null,
          current_status: formData.report_type
        });
        itemId = newItem.item_id;
      }

      const reportData = {
        item_id: itemId,
        report_type: formData.report_type,
        reported_date: formData.reported_date,
        location_name: formData.location_name,
        details: formData.details,
        status: formData.status
      };

      await createReport(reportData);
      setSuccess('Report submitted successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      console.error('Failed to submit report:', error);
      setError(error.response?.data?.detail || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <Loading />;
  }

  return (
    <Card className="mx-auto" style={{ maxWidth: '800px' }}>
      <Card.Header as="h5">Submit New Report</Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Check
              type="radio"
              label="Create New Item"
              name="itemOption"
              checked={createNewItem}
              onChange={() => setCreateNewItem(true)}
              className="mb-2"
            />
            <Form.Check
              type="radio"
              label="Report Existing Item"
              name="itemOption"
              checked={!createNewItem}
              onChange={() => setCreateNewItem(false)}
            />
          </Form.Group>

          {createNewItem ? (
            <>
              <Form.Group className="mb-3" controlId="item_title">
                <Form.Label>Item Name/Title <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="item_title"
                  value={formData.item_title}
                  onChange={handleChange}
                  placeholder="e.g., iPhone 12, Blue Backpack"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="category_id">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                >
                  <option value="">Select category (optional)</option>
                  {categories.map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="item_description">
                <Form.Label>Item Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="item_description"
                  value={formData.item_description}
                  onChange={handleChange}
                  placeholder="Describe the item"
                />
              </Form.Group>
            </>
          ) : (
            <Form.Group className="mb-3" controlId="item_id">
              <Form.Label>Select Item <span className="text-danger">*</span></Form.Label>
              <Form.Select
                name="item_id"
                value={formData.item_id}
                onChange={handleChange}
                required={!createNewItem}
              >
                <option value="">Select an item</option>
                {items.map(item => (
                  <option key={item.item_id} value={item.item_id}>
                    {item.title} {item.category_name ? `(${item.category_name})` : ''}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
          
          <Form.Group className="mb-3" controlId="report_type">
            <Form.Label>Report Type <span className="text-danger">*</span></Form.Label>
            <Form.Select
              name="report_type"
              value={formData.report_type}
              onChange={handleChange}
              required
            >
              <option value="lost">Lost Item</option>
              <option value="found">Found Item</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="reported_date">
            <Form.Label>Date <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="date"
              name="reported_date"
              value={formData.reported_date}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="location_name">
            <Form.Label>Place/Location <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="location_name"
              value={formData.location_name || ''}
              onChange={handleChange}
              placeholder="e.g., Library, Parking Lot"
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="details">
            <Form.Label>Description/Details</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="Add more details about the item"
            />
          </Form.Group>
          
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </Button>
          
          <Button
            variant="outline-secondary"
            className="ms-2"
            onClick={() => navigate('/reports')}
          >
            Cancel
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ReportForm;
