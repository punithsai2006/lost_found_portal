-- lost_and_found_schema.sql
-- Corrected & fully working version

DROP DATABASE IF EXISTS lost_found_portal;

CREATE DATABASE lost_found_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE lost_found_portal;

-- --------------------------------------------------
-- Roles table (RBAC)
-- --------------------------------------------------
CREATE TABLE role (
  role_id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(30) UNIQUE NOT NULL
) ENGINE=InnoDB;

-- Insert default roles (IMPORTANT!)
INSERT INTO role (role_name) VALUES
('student'),
('admin'),
('staff');

-- --------------------------------------------------
-- Users table
-- --------------------------------------------------
CREATE TABLE user_account (
  user_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  branch VARCHAR(50),
  roll_number VARCHAR(30) UNIQUE NOT NULL,
  school VARCHAR(100),
  email VARCHAR(150),
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role_id TINYINT UNSIGNED NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES role(role_id)
) ENGINE=InnoDB;

-- --------------------------------------------------
-- Category table
-- --------------------------------------------------
CREATE TABLE category (
  category_id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(50) UNIQUE NOT NULL
) ENGINE=InnoDB;

-- Insert common categories
INSERT INTO category (category_name) VALUES
('Electronics'),
('Bags'),
('Documents'),
('ID Cards'),
('Accessories'),
('Clothing'),
('Books'),
('Keys'),
('Wallets'),
('Other');

-- --------------------------------------------------
-- Location table
-- --------------------------------------------------
CREATE TABLE location (
  location_id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  location_name VARCHAR(100) UNIQUE NOT NULL,
  building VARCHAR(100),
  floor VARCHAR(20)
) ENGINE=InnoDB;

-- Insert sample locations
INSERT INTO location (location_name, building, floor) VALUES
('Library', 'Block A', '1st'),
('Canteen', 'Block B', 'Ground'),
('Main Gate', 'Entrance', 'Ground'),
('Lab 1', 'Block C', '2nd'),
('Parking Lot', 'Main', 'Ground'),
('Auditorium', 'Block A', 'Ground'),
('Sports Complex', 'Block D', 'Ground');

-- --------------------------------------------------
-- Item table
-- --------------------------------------------------
CREATE TABLE item (
  item_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  category_id SMALLINT UNSIGNED,
  description TEXT,
  created_by INT UNSIGNED,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  current_status ENUM('lost','found','claimed','completed','discarded') DEFAULT 'lost',
  last_status_change TIMESTAMP NULL,
  UNIQUE KEY uk_title_createdby (title, created_by),
  FOREIGN KEY (category_id) REFERENCES category(category_id),
  FOREIGN KEY (created_by) REFERENCES user_account(user_id)
) ENGINE=InnoDB;

-- --------------------------------------------------
-- Report table (CORRECTED - includes reported_date)
-- --------------------------------------------------
CREATE TABLE report (
  report_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  item_id INT UNSIGNED NOT NULL,
  reporter_id INT UNSIGNED NOT NULL,
  report_type ENUM('lost','found') NOT NULL,
  location_id SMALLINT UNSIGNED,
  reported_date DATE DEFAULT NULL,
  reported_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  details TEXT,
  status ENUM('open','in_review','resolved') DEFAULT 'open',
  FOREIGN KEY (item_id) REFERENCES item(item_id) ON DELETE CASCADE,
  FOREIGN KEY (reporter_id) REFERENCES user_account(user_id),
  FOREIGN KEY (location_id) REFERENCES location(location_id)
) ENGINE=InnoDB;

-- --------------------------------------------------
-- Item Images
-- --------------------------------------------------
CREATE TABLE item_image (
  image_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  item_id INT UNSIGNED NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  uploaded_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES item(item_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------------
-- Claims table
-- --------------------------------------------------
CREATE TABLE claim (
  claim_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  item_id INT UNSIGNED NOT NULL,
  claimer_id INT UNSIGNED NOT NULL,
  claim_text TEXT,
  claim_status ENUM('pending','approved','rejected') DEFAULT 'pending',
  claimed_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  decided_by INT UNSIGNED,
  decided_on TIMESTAMP NULL,
  FOREIGN KEY (item_id) REFERENCES item(item_id),
  FOREIGN KEY (claimer_id) REFERENCES user_account(user_id),
  FOREIGN KEY (decided_by) REFERENCES user_account(user_id)
) ENGINE=InnoDB;

-- --------------------------------------------------
-- Notifications
-- --------------------------------------------------
CREATE TABLE notification (
  notification_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_account(user_id)
) ENGINE=InnoDB;

-- --------------------------------------------------
-- History (logs)
-- --------------------------------------------------
CREATE TABLE history (
  history_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  item_id INT UNSIGNED,
  action VARCHAR(80) NOT NULL,
  action_details TEXT,
  action_by INT UNSIGNED,
  action_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES item(item_id),
  FOREIGN KEY (action_by) REFERENCES user_account(user_id)
) ENGINE=InnoDB;

-- --------------------------------------------------
-- Session Audit
-- --------------------------------------------------
CREATE TABLE session_audit (
  session_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED,
  login_time TIMESTAMP NULL,
  logout_time TIMESTAMP NULL,
  ip_address VARCHAR(45),
  FOREIGN KEY (user_id) REFERENCES user_account(user_id)
) ENGINE=InnoDB;

-- --------------------------------------------------
-- Indexes for better performance
-- --------------------------------------------------
CREATE INDEX idx_item_status ON item (current_status);
CREATE INDEX idx_item_created_by ON item (created_by);
CREATE INDEX idx_report_type ON report (report_type);
CREATE INDEX idx_report_status ON report (status);
CREATE INDEX idx_reporter ON report (reporter_id);
CREATE INDEX idx_claim_status ON claim (claim_status);
CREATE INDEX idx_claim_item ON claim (item_id);
CREATE INDEX idx_notification_user ON notification (user_id);
CREATE INDEX idx_notification_read ON notification (is_read);
CREATE INDEX idx_history_item ON history (item_id);

-- --------------------------------------------------
-- Views
-- --------------------------------------------------
CREATE VIEW vw_student_dashboard AS
SELECT 
  u.user_id, 
  u.name, 
  u.roll_number, 
  i.item_id, 
  i.title, 
  i.current_status,
  r.report_id,
  r.report_type, 
  r.status as report_status,
  r.reported_on, 
  l.location_name
FROM user_account u
JOIN report r ON r.reporter_id = u.user_id
JOIN item i ON i.item_id = r.item_id
LEFT JOIN location l ON l.location_id = r.location_id;

CREATE VIEW vw_admin_pending_claims AS
SELECT 
  cl.claim_id, 
  cl.item_id, 
  i.title, 
  cl.claimer_id, 
  cu.name AS claimer_name,
  cl.claimed_on, 
  i.current_status,
  cl.claim_text
FROM claim cl
JOIN item i ON i.item_id = cl.item_id
JOIN user_account cu ON cu.user_id = cl.claimer_id
WHERE cl.claim_status = 'pending'
ORDER BY cl.claimed_on DESC;

-- --------------------------------------------------
-- Trigger for Item Status Change
-- --------------------------------------------------
DROP TRIGGER IF EXISTS trg_item_status_change;

DELIMITER $$

CREATE TRIGGER trg_item_status_change
AFTER UPDATE ON item
FOR EACH ROW
BEGIN
  IF OLD.current_status <> NEW.current_status THEN
    INSERT INTO history (item_id, action, action_details, action_by)
    VALUES (
      NEW.item_id, 
      CONCAT('status_change:', NEW.current_status),
      CONCAT('Changed from ', OLD.current_status, ' to ', NEW.current_status),
      NEW.created_by
    );
    
    -- Update last_status_change timestamp
    UPDATE item 
    SET last_status_change = NOW() 
    WHERE item_id = NEW.item_id;
  END IF;
END$$

DELIMITER ;

-- --------------------------------------------------
-- Stored Procedure: Approve Claim
-- --------------------------------------------------
DROP PROCEDURE IF EXISTS approve_claim;

DELIMITER $$

CREATE PROCEDURE approve_claim(IN p_claim_id INT UNSIGNED, IN p_admin_id INT UNSIGNED)
BEGIN
  DECLARE v_item_id INT UNSIGNED;
  DECLARE v_rows INT DEFAULT 0;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;

  -- Get the item_id for the claim
  SELECT item_id INTO v_item_id 
  FROM claim 
  WHERE claim_id = p_claim_id 
  FOR UPDATE;

  IF v_item_id IS NULL THEN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Claim not found';
  END IF;

  -- Check if claim is pending
  SELECT COUNT(*) INTO v_rows 
  FROM claim 
  WHERE claim_id = p_claim_id AND claim_status = 'pending';
  
  IF v_rows = 0 THEN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Claim is not pending';
  END IF;

  -- Update item status to claimed
  UPDATE item
  SET current_status = 'claimed', 
      last_status_change = NOW()
  WHERE item_id = v_item_id 
    AND current_status IN ('found','lost');

  -- Approve the claim
  UPDATE claim
  SET claim_status = 'approved', 
      decided_by = p_admin_id, 
      decided_on = NOW()
  WHERE claim_id = p_claim_id;

  -- Reject other pending claims for the same item
  UPDATE claim
  SET claim_status = 'rejected', 
      decided_by = p_admin_id, 
      decided_on = NOW()
  WHERE item_id = v_item_id 
    AND claim_id <> p_claim_id 
    AND claim_status = 'pending';

  -- Log the action
  INSERT INTO history (item_id, action, action_details, action_by)
  VALUES (
    v_item_id, 
    'claim_approved', 
    CONCAT('Claim ID ', p_claim_id, ' approved by admin'),
    p_admin_id
  );

  COMMIT;
END$$

DELIMITER ;

-- --------------------------------------------------
-- Stored Procedure: Reject Claim
-- --------------------------------------------------
DROP PROCEDURE IF EXISTS reject_claim;

DELIMITER $$

CREATE PROCEDURE reject_claim(IN p_claim_id INT UNSIGNED, IN p_admin_id INT UNSIGNED)
BEGIN
  DECLARE v_item_id INT UNSIGNED;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;

  -- Get the item_id for the claim
  SELECT item_id INTO v_item_id 
  FROM claim 
  WHERE claim_id = p_claim_id 
  FOR UPDATE;

  IF v_item_id IS NULL THEN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Claim not found';
  END IF;

  -- Reject the claim
  UPDATE claim
  SET claim_status = 'rejected', 
      decided_by = p_admin_id, 
      decided_on = NOW()
  WHERE claim_id = p_claim_id;

  -- Log the action
  INSERT INTO history (item_id, action, action_details, action_by)
  VALUES (
    v_item_id, 
    'claim_rejected', 
    CONCAT('Claim ID ', p_claim_id, ' rejected by admin'),
    p_admin_id
  );

  COMMIT;
END$$

DELIMITER ;

-- --------------------------------------------------
-- Sample Data (Optional - for testing)
-- --------------------------------------------------
-- Uncomment below to add sample data for testing

/*
-- Sample admin user (password: admin123 - hash this in your app)
INSERT INTO user_account (name, roll_number, password_hash, role_id, email) VALUES
('Admin User', 'ADMIN001', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', 2, 'admin@example.com');

-- Sample student user (password: student123 - hash this in your app)
INSERT INTO user_account (name, roll_number, password_hash, role_id, email, branch) VALUES
('John Doe', 'STU001', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', 1, 'john@example.com', 'Computer Science');
*/

-- --------------------------------------------------
-- End of Schema
-- --------------------------------------------------

