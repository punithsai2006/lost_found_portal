import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import LoginForm from '../components/auth/LoginForm';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="auth-page" style={{ 
      minHeight: 'calc(100vh - 76px)',
      background: 'linear-gradient(135deg, rgba(74, 144, 226, 0.05) 0%, rgba(80, 200, 120, 0.05) 100%)'
    }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <div className="text-center mb-4">
              <h2 className="fw-bold" style={{ color: '#4a90e2', fontSize: '2rem' }}>
                🔐 Welcome Back
              </h2>
              <p className="text-muted">Login to your Lost & Found Portal account</p>
            </div>
            <LoginForm />
            <div className="text-center mt-4">
              <p style={{ fontSize: '1rem', color: '#666' }}>
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  style={{ 
                    color: '#4a90e2', 
                    fontWeight: '600',
                    textDecoration: 'none'
                  }}
                >
                  Register here
                </Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;