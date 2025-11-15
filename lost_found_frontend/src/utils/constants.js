export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const ITEM_STATUS = {
  LOST: 'lost',
  FOUND: 'found',
  CLAIMED: 'claimed',
  COMPLETED: 'completed',
  DISCARDED: 'discarded'
};

export const REPORT_TYPE = {
  LOST: 'lost',
  FOUND: 'found'
};

export const CLAIM_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const USER_ROLES = {
  STUDENT: 'student',
  STAFF: 'staff',
  ADMIN: 'admin'
};