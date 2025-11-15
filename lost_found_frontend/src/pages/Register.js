import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import RegisterForm from '../components/auth/RegisterForm';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="auth-page" style={{ 
      minHeight: 'calc(100vh - 76px)',
      background: 'linear-gradient(135deg, rgba(74, 144, 226, 0.05) 0%, rgba(80, 200, 120, 0.05) 100%)'
    }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={7}>
            <div className="text-center mb-4">
              <h2 className="fw-bold" style={{ color: '#50c878', fontSize: '2rem' }}>
                📝 Join Our Community
              </h2>
              <p className="text-muted">Create your account to start using the Lost & Found Portal</p>
            </div>
            <RegisterForm />
            <div className="text-center mt-4">
              <p style={{ fontSize: '1rem', color: '#666' }}>
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  style={{ 
                    color: '#4a90e2', 
                    fontWeight: '600',
                    textDecoration: 'none'
                  }}
                >
                  Login here
                </Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;