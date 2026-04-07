---
name: pci-compliance
description: PCI DSS compliance standards for secure application development. Use this skill when reviewing code for compliance, implementing payment-related features, handling sensitive data, or when asked about PCI security requirements.
---

# PCI DSS Compliance Standards

When reviewing or writing code, enforce the following PCI Data Security Standard (v4.0) requirements relevant to application development.

## Requirement 6: Develop and Maintain Secure Systems and Software

### 6.2 — Secure Development Practices

- **6.2.1** — All custom code must be reviewed for vulnerabilities before release to production
- **6.2.2** — Development, testing, and production environments must be separated
- **6.2.3** — Pre-production environments must not use real cardholder data
- **6.2.4** — All code changes must be reviewed by someone other than the author

### 6.3 — Protect Against Known Vulnerabilities

- **6.3.1** — All public-facing web applications must be protected against known attacks (OWASP Top 10)
- **6.3.2** — An inventory of custom and third-party software components must be maintained

### 6.5 — Address Common Coding Vulnerabilities

All code must be developed to prevent the following:

1. **SQL Injection** — All database queries MUST use parameterized statements. Never concatenate user input into query strings.
2. **Cross-Site Scripting (XSS)** — All user-supplied output must be encoded or escaped before rendering.
3. **Insecure Authentication** — Passwords must be hashed using bcrypt, scrypt, or Argon2 with appropriate work factors. Plaintext password storage is a CRITICAL violation.
4. **Insecure Direct Object References** — Access to resources must verify the requestor is authorized.
5. **Sensitive Data Exposure** — Never return password hashes, tokens, keys, or internal identifiers in API responses.

## Requirement 8: Identify Users and Authenticate Access

- **8.3.1** — All user access must require authentication (username + password or stronger)
- **8.3.6** — Passwords must be a minimum of 12 characters (or 8 characters if multi-factor is used)
- **8.3.7** — New passwords must not match any of the last 4 passwords used
- **8.6.2** — Credentials for application and system accounts must not be hardcoded in source code or configuration files checked into version control

## Requirement 3: Protect Stored Account Data

- **3.4.1** — Cardholder data at rest must be encrypted using strong cryptography
- **3.5.1** — Primary Account Numbers (PAN) must be rendered unreadable anywhere they are stored

## Requirement 10: Log and Monitor All Access

- **10.2.1** — Audit logs must capture: all individual user access to cardholder data, all actions by admins, all access to audit trails, all invalid access attempts, all authentication events
- **10.3.1** — Logs must include: user identification, event type, date/time, success/failure, origination of event, identity of affected resource
- **10.5.1** — Audit trail history must be retained for at least 12 months

## Applying These Standards

When reviewing code against these standards:

1. Flag any violation with the specific PCI requirement number (e.g., "Violates PCI DSS 6.5.1")
2. Rate severity as: **CRITICAL** (data breach risk), **HIGH** (compliance failure), **MEDIUM** (best practice gap)
3. Provide the specific remediation needed
4. If a file handles sensitive data (passwords, tokens, payment info), apply ALL relevant requirements from sections 3, 6, 8, and 10
