import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authService';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    branch: '',
    roll_number: '',
    school: '',
    email: '',
    phone: '',
    password: '',
    role_id: 1 // Default to student
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await registerUser(formData);
      setSuccess('Registration successful! Please login with your credentials.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setError(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto shadow" style={{ maxWidth: '650px' }}>
      <Card.Header as="h3" className="text-center text-white" style={{ background: '#50c878' }}>
        Create New Account
      </Card.Header>

      <Card.Body className="p-4">
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="roll_number">
            <Form.Label>Roll Number</Form.Label>
            <Form.Control
              type="text"
              name="roll_number"
              value={formData.roll_number}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="branch">
            <Form.Label>Branch</Form.Label>
            <Form.Control
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="school">
            <Form.Label>School</Form.Label>
            <Form.Control
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="phone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default RegisterForm;
