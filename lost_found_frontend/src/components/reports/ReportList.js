import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getReports } from '../../services/reportService';
import Loading from '../common/Loading';

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const params = {};
        if (typeFilter) params.report_type = typeFilter;
        if (statusFilter) params.status = statusFilter;
        
        const response = await getReports(params);
        setReports(response);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [typeFilter, statusFilter]);

  const getReportTypeBadge = (type) => {
    let variant = 'secondary';
    if (type === 'lost') variant = 'danger';
    else if (type === 'found') variant = 'success';
    
    return <Badge bg={variant}>{type}</Badge>;
  };

  const getStatusBadge = (status) => {
    let variant = 'secondary';
    if (status === 'open') variant = 'primary';
    else if (status === 'in_review') variant = 'warning';
    else if (status === 'resolved') variant = 'success';
    
    return <Badge bg={variant}>{status}</Badge>;
  };

  const filteredReports = reports.filter(report => 
    (report.item_title && report.item_title.toLowerCase().includes(filter.toLowerCase())) ||
    (report.details && report.details.toLowerCase().includes(filter.toLowerCase()))
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <Card>
      <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
        <span>Reports</span>
        <Button variant="primary" onClick={() => navigate('/reports/new')}>New Report</Button>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Search reports..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_review">In Review</option>
              <option value="resolved">Resolved</option>
            </Form.Select>
          </Col>
        </Row>
        
        {filteredReports.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Item</th>
                <th>Type</th>
                <th>Status</th>
                <th>Reporter</th>
                <th>Location</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.report_id}>
                  <td>{report.item_title || 'N/A'}</td>
                  <td>{getReportTypeBadge(report.report_type)}</td>
                  <td>{getStatusBadge(report.status)}</td>
                  <td>{report.reporter_name || 'N/A'}</td>
                  <td>{report.location_name || 'N/A'}</td>
                  <td>{(report.reported_date ? new Date(report.reported_date) : new Date(report.reported_on)).toLocaleDateString()}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => navigate(`/reports/${report.report_id}`)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No reports found matching your criteria.</p>
        )}
      </Card.Body>
    </Card>
  );
};

export default ReportList;