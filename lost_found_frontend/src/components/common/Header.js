import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm" style={{ position: 'relative', zIndex: 1050 }}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <span style={{ fontSize: '1.4rem' }}>🔍</span> Lost & Found Portal
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="fw-semibold">🏠 Home</Nav.Link>
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/items" className="fw-semibold">📦 Items</Nav.Link>
                <Nav.Link as={Link} to="/dashboard" className="fw-semibold">📊 Dashboard</Nav.Link>
                {isAdmin && (
                  <Nav.Link as={Link} to="/claims" className="fw-semibold">✅ Claims</Nav.Link>
                )}
              </>
            )}
          </Nav>
          <Nav style={{ position: 'relative', zIndex: 1051 }}>
            {isAuthenticated ? (
              <NavDropdown 
                title={`👤 ${user?.name}`} 
                id="basic-nav-dropdown" 
                className="fw-semibold"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile" style={{ zIndex: 1052 }}>
                  👤 Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item 
                  onClick={handleLogout}
                  style={{ zIndex: 1052, cursor: 'pointer' }}
                >
                  🚪 Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="fw-semibold">🔐 Login</Nav.Link>
                <Nav.Link as={Link} to="/register" className="fw-semibold">📝 Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;