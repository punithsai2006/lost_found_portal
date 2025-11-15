import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getReport } from '../../services/reportService';
import Loading from '../common/Loading';

const ReportDetail = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await getReport(reportId);
        setReport(response);
      } catch (error) {
        console.error('Failed to fetch report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

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

  if (loading) {
    return <Loading />;
  }

  if (!report) {
    return (
      <Card>
        <Card.Body>
          <Alert variant="danger">Report not found</Alert>
          <Button variant="primary" onClick={() => navigate('/reports')}>
            Back to Reports
          </Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header as="h3" className="d-flex justify-content-between align-items-center">
        <span>Report Details</span>
        <div>
          {getReportTypeBadge(report.report_type)}
          {getStatusBadge(report.status)}
          <Button 
            variant="outline-secondary" 
            className="ms-2"
            onClick={() => navigate('/reports')}
          >
            Back to Reports
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <h5>Item Information</h5>
        <p><strong>Item:</strong> {report.item_title || 'N/A'}</p>
        <p><strong>Report Type:</strong> {report.report_type}</p>
        <p><strong>Status:</strong> {report.status}</p>
        
        <h5>Report Details</h5>
        <p><strong>Reporter:</strong> {report.reporter_name || 'N/A'}</p>
        <p><strong>Location:</strong> {report.location_name || 'N/A'}</p>
        <p><strong>Date:</strong> {(report.reported_date ? new Date(report.reported_date) : new Date(report.reported_on)).toLocaleDateString()}</p>
        
        {report.details && (
          <>
            <h5>Additional Details</h5>
            <p>{report.details}</p>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default ReportDetail;