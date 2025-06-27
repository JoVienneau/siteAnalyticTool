## Project Objective

Develop a complete, self-hosted user behavior tracking system for my WordPress portfolio site.  
The goal is to have full control over collected data and demonstrate full-stack skills (Frontend, API design, Backend, Database).

---

## User Behaviors to Track (Tracking Scope)

| Category | Behavior |
|---|---|
| Navigation | Page views (page loads) |
| Engagement | Scroll depth |
|  | Clicks on Call-to-Action buttons |
|  | Clicks on internal navigation links |
|  | Clicks on external links |
| Forms | Contact form submissions |
| Session | Assign unique session ID per visit |
| Incoming Traffic | Referrer URL |
|  | UTM parameters (if present in URL) |
| User Environment | Device type (Mobile/Desktop/Tablet) |
|  | Operating system |
|  | Browser and version |
| Future Development | Time on page, JavaScript error tracking, heatmaps |

---

## Development Phases

### Week One – Frontend Focus (Client-side Tracking)

#### Week Goal

Build a lightweight JavaScript tracking script integrated into WordPress, capable of capturing essential events and sending them to a collection endpoint (temporary mock backend).

---

### Week 1 Tasks
1. Define tracking scope: - Finalize behavior list - Specify data for each event - Choose session management method (localStorage/cookies)
2. Frontend project structure: - Create dev environment (repo, JS files) - Define tracking script architecture
3. Implement event detectors: - Page views - Scroll depth - Clicks (buttons, links)
4. Set up mock endpoint: - Simple backend (PHP or external service like webhook.site) - Test JSON payload POST requests
5. End-to-end testing: - Simulate user navigation - Verify outgoing requests - Frontend debugging
6. Finalize payload structure: - Standardize event formats - Document JSON format
7. Documentation: - Write project README - Weekly summary and next steps prep (backend, database)

---

## Next Steps (Following Weeks)

- Create MySQL database (using custom WordPress tables)
- Develop API to receive/store events
- Build data analysis dashboards
- Performance and security optimizations
- Add advanced features (heatmaps, error tracking, etc.)

---

## JSON Payload Specifications per Event

### 1. Page View

- **Event name (event_type):**  
`"page_view"`

- **Payload fields:**
  - `page_url`: Full page URL
  - `referrer`: Referring URL
  - `session_id`: Unique user session ID
  - `timestamp`: Event date/time
  - `device_type`: Device (desktop/mobile/tablet)
  - `browser`: Browser
  - `os`: Operating system
  - `utm_parameters`: If present (source, medium, campaign, etc.)

---

### 2. Scroll Depth

- **Event name (event_type):**  
`"scroll_depth"`

- **Payload fields:**
  - `page_url`
  - `scroll_percentage`: Scroll depth reached (e.g., 25, 50, 75, 100)
  - `session_id`
  - `timestamp`

---

### 3. Click (Call-to-Action, Navigation, External Link)

- **Event name (event_type):**  
`"click"`

- **Payload fields:**
  - `element_id` or `element_text`: Clicked button/link ID or text
  - `element_type`: Element type (button/link/nav/external)
  - `page_url`
  - `session_id`
  - `timestamp`

---

### 4. Form Submission

- **Event name (event_type):**  
`"form_submission"`

- **Payload fields:**
  - `form_id` or `form_name`
  - `fields_filled`: List of filled field names (without personal values)
  - `page_url`
  - `session_id`
  - `timestamp`

---

### 5. Session Start (optional)

- **Event name (event_type):**  
`"session_start"`

- **Payload fields:**
  - `session_id`
  - `start_time`
  - `device_type`
  - `browser`
  - `os`

---

## Global Fields (Included in All Events)

- `session_id`
- `timestamp`
- `page_url`
- `user_agent`
- `device_type`
- `browser`
- `os`

---

## Immediate Next Steps

- Validate this specification
- Implement payload structure in JavaScript tracking script
- Set up mock endpoint for POST testing

---

## Session Management Method

To track unique user sessions across pages and interactions, I'll use browser cookies.

### Technical Details:

- **Session ID Generation:**  
UUID (Universally Unique Identifier) for each new session.

- **Storage Method:**  
Session ID stored in cookie with properties:
  - **Name:** `custom_analytics_session_id`
  - **Expiration:**  
    30 minutes after last interaction (rolling expiration). Aligns with standard analytics practices.

- **Session Timeout Logic:**  
New session ID generated after 30 minutes inactivity.

- **Privacy Considerations:**  
First-party cookie with no personal data remains privacy-compliant.  
GDPR consent mechanism may be added later.

### Example Workflow:

1. First page load:  
→ Check for existing cookie  
→ Generate new UUID if missing  
→ Set cookie with 30-minute expiration  

2. Each interaction:  
→ Refresh cookie expiration  

3. After 30 minutes inactivity:  
→ New session ID generated  

### Data Flow Diagram
[![Data Flow Diagram](https://vienneaucodetrail.tech/wp-content/uploads/2025/06/deepseek_mermaid_20250625_ae603d-scaled.png)](https://vienneaucodetrail.tech/wp-content/uploads/2025/06/deepseek_mermaid_20250625_ae603d-scaled.png)
