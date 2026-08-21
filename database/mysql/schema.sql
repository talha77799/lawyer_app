-- VR-Lawyer secondary database (MySQL)
-- Scope: financial reports, analytics, audit logs, payment reports.
-- User/case/document IDs below are MongoDB ObjectId strings (CHAR(24)),
-- kept as opaque references — MySQL does not own referential integrity
-- across the two databases; enforce that in the application layer.

CREATE DATABASE IF NOT EXISTS vr_lawyer_reports
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE vr_lawyer_reports;

-- Every write-worthy action across the platform, for compliance/security review.
CREATE TABLE audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  actor_user_id CHAR(24) NOT NULL,
  actor_role ENUM('lawyer', 'client', 'admin') NOT NULL,
  action VARCHAR(100) NOT NULL,          -- e.g. 'case.update', 'auth.login', 'payment.refund'
  resource_type VARCHAR(50) NOT NULL,    -- e.g. 'Case', 'User', 'Payment'
  resource_id CHAR(24),
  ip_address VARCHAR(45),
  user_agent VARCHAR(255),
  metadata JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_actor (actor_user_id),
  INDEX idx_audit_resource (resource_type, resource_id),
  INDEX idx_audit_created (created_at)
) ENGINE=InnoDB;

-- Stripe payment records, mirrored here (not Mongo) since financial
-- reporting benefits from SQL joins/aggregation.
CREATE TABLE payments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  stripe_payment_intent_id VARCHAR(255) NOT NULL UNIQUE,
  lawyer_user_id CHAR(24) NOT NULL,
  client_user_id CHAR(24) NOT NULL,
  case_id CHAR(24),
  amount_cents BIGINT NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'usd',
  status ENUM('pending', 'succeeded', 'failed', 'refunded', 'partially_refunded') NOT NULL DEFAULT 'pending',
  description VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_payments_lawyer (lawyer_user_id),
  INDEX idx_payments_client (client_user_id),
  INDEX idx_payments_status (status)
) ENGINE=InnoDB;

CREATE TABLE invoices (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  lawyer_user_id CHAR(24) NOT NULL,
  client_user_id CHAR(24) NOT NULL,
  case_id CHAR(24),
  payment_id BIGINT UNSIGNED,
  amount_cents BIGINT NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'usd',
  status ENUM('draft', 'sent', 'paid', 'overdue', 'void') NOT NULL DEFAULT 'draft',
  issued_at DATE,
  due_at DATE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
  INDEX idx_invoices_lawyer (lawyer_user_id),
  INDEX idx_invoices_status (status)
) ENGINE=InnoDB;

-- Daily rollups for dashboard charts, computed by a scheduled job rather
-- than aggregated live on every dashboard load.
CREATE TABLE lawyer_daily_stats (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  lawyer_user_id CHAR(24) NOT NULL,
  stat_date DATE NOT NULL,
  active_cases INT UNSIGNED NOT NULL DEFAULT 0,
  closed_cases INT UNSIGNED NOT NULL DEFAULT 0,
  new_cases INT UNSIGNED NOT NULL DEFAULT 0,
  revenue_cents BIGINT NOT NULL DEFAULT 0,
  appointments_completed INT UNSIGNED NOT NULL DEFAULT 0,
  UNIQUE KEY uq_lawyer_date (lawyer_user_id, stat_date)
) ENGINE=InnoDB;

CREATE TABLE login_audit (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(24) NOT NULL,
  success TINYINT(1) NOT NULL,
  ip_address VARCHAR(45),
  user_agent VARCHAR(255),
  device_id VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_login_user (user_id),
  INDEX idx_login_created (created_at)
) ENGINE=InnoDB;
