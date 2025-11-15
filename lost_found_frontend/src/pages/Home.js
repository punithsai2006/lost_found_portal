import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';   // ✅ IMPORT AUTH CONTEXT

const Home = () => {

  const { isAuthenticated } = useAuth();   // ✅ CHECK LOGIN STATUS

  return (
    <div className="home-page">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>

            {/* Hero Section */}
            <div className="hero-section mb-5">
              <h1
                className="mb-4 display-2 fw-bold"
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}
              >
                🔍 Lost and Found Portal
              </h1>

              <p
                className="lead mb-5"
                style={{ fontSize: '1.4rem', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}
              >
                Reconnect with your lost belongings
              </p>

              {/* Login and Register Buttons — SHOW ONLY IF NOT LOGGED IN */}
              {!isAuthenticated && (
                <div className="mt-5 d-flex justify-content-center gap-3 flex-wrap">
                  <Button
                    as={Link}
                    to="/login"
                    variant="light"
                    size="lg"
                    className="px-5 py-3"
                    style={{
                      borderRadius: '50px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                      minWidth: '150px'
                    }}
                  >
                    🔐 Login
                  </Button>

                  <Button
                    as={Link}
                    to="/register"
                    variant="outline-light"
                    size="lg"
                    className="px-5 py-3"
                    style={{
                      borderRadius: '50px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      borderWidth: '3px',
                      minWidth: '150px'
                    }}
                  >
                    📝 Register
                  </Button>
                </div>
              )}
            </div>

            {/* Information Section */}
            <Row className="mt-5">
              <Col md={12}>
                <Card
                  className="info-card shadow-lg"
                  style={{ border: 'none', borderRadius: '20px' }}
                >
                  <Card.Body className="p-5">
                    <h2
                      className="text-center mb-4 fw-bold"
                      style={{ color: '#4a90e2' }}
                    >
                      What is a Lost and Found Portal?
                    </h2>

                    <div className="mb-4">
                      <p
                        className="lead"
                        style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#333' }}
                      >
                        A <strong>Lost and Found Portal</strong> is a digital platform
                        designed to help people reconnect with their lost belongings and
                        return found items to their rightful owners. It serves as a
                        centralized hub for the community to report, search, and claim
                        lost or found items efficiently.
                      </p>
                    </div>

                    <Row className="mt-4">

                      <Col md={6} className="mb-4">
                        <div className="d-flex align-items-start">
                          <div className="me-3" style={{ fontSize: '2.5rem' }}>📱</div>
                          <div>
                            <h4 className="fw-bold mb-2" style={{ color: '#4a90e2' }}>
                              Easy Reporting
                            </h4>
                            <p className="text-muted">
                              Quickly report items you've lost or found with detailed
                              descriptions, photos, and location information.
                            </p>
                          </div>
                        </div>
                      </Col>

                      <Col md={6} className="mb-4">
                        <div className="d-flex align-items-start">
                          <div className="me-3" style={{ fontSize: '2.5rem' }}>🔍</div>
                          <div>
                            <h4 className="fw-bold mb-2" style={{ color: '#50c878' }}>
                              Quick Search
                            </h4>
                            <p className="text-muted">
                              Search through reported items using keywords, categories, or
                              locations to find your belongings efficiently.
                            </p>
                          </div>
                        </div>
                      </Col>

                      <Col md={6} className="mb-4">
                        <div className="d-flex align-items-start">
                          <div className="me-3" style={{ fontSize: '2.5rem' }}>✅</div>
                          <div>
                            <h4 className="fw-bold mb-2" style={{ color: '#e74c3c' }}>
                              Secure Claims
                            </h4>
                            <p className="text-muted">
                              Claim items through a secure verification process that
                              ensures rightful owners get their belongings.
                            </p>
                          </div>
                        </div>
                      </Col>

                      <Col md={6} className="mb-4">
                        <div className="d-flex align-items-start">
                          <div className="me-3" style={{ fontSize: '2.5rem' }}>🌐</div>
                          <div>
                            <h4 className="fw-bold mb-2" style={{ color: '#f39c12' }}>
                              Community Driven
                            </h4>
                            <p className="text-muted">
                              Connect with people in your area and contribute to a safer
                              and more responsible community.
                            </p>
                          </div>
                        </div>
                      </Col>

                    </Row>

                    <div
                      className="mt-5 p-4 rounded"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(74, 144, 226, 0.1) 0%, rgba(80, 200, 120, 0.1) 100%)'
                      }}
                    >
                      <h5 className="fw-bold mb-3" style={{ color: '#4a90e2' }}>
                        How It Works:
                      </h5>

                      <ol
                        style={{
                          fontSize: '1.05rem',
                          lineHeight: '2',
                          color: '#333'
                        }}
                      >
                        <li><strong>Register or Login:</strong> Create an account or sign in.</li>
                        <li><strong>Report Items:</strong> Add lost or found items with photos.</li>
                        <li><strong>Search & Browse:</strong> Look for lost or found items.</li>
                        <li><strong>Claim Items:</strong> Verify ownership & claim your items.</li>
                        <li><strong>Get Notified:</strong> Stay updated on your item status.</li>
                      </ol>

                    </div>

                  </Card.Body>
                </Card>
              </Col>
            </Row>

          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
