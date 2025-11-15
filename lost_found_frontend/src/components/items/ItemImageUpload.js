import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { uploadItemImage } from '../../services/itemService';

const ItemImageUpload = ({ itemId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setSuccess('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await uploadItemImage(itemId, file);
      setSuccess('Image uploaded successfully!');
      setFile(null);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Header as="h5">Upload Image</Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form.Group className="mb-3">
          <Form.Label>Select Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </Form.Group>
        
        <Button
          variant="primary"
          onClick={handleUpload}
          disabled={loading || !file}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ItemImageUpload;