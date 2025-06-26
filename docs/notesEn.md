https://chatgpt.com/share/685c569b-e124-8002-8f49-e6c008096200

# Development Note – Custom Web Analytics Tool

## Project Objective

Develop a complete, self-hosted user behavior tracking system for my WordPress portfolio site.  
The goal is to have full control over the collected data and to demonstrate my full-stack skills (Frontend, API design, Backend, Database).

---

## List of User Behaviors to Track (Tracking Scope)

| Category | Behavior |
|---|---|
| Navigation | Page views (page loads) |
| Engagement | Scroll depth |
|  | Clicks on Call-to-Action buttons |
|  | Clicks on internal navigation links |
|  | Clicks on external links |
| Forms | Contact form submissions |
| Session | Assign a unique session ID per visit |
| Incoming Traffic | Referrer URL |
|  | UTM parameters (if present in the URL) |
| User Environment | Device type (Mobile / Desktop / Tablet) |
|  | Operating system |
|  | Browser and version |
| To develop later | Time on page, JavaScript error tracking, heatmaps |

---

## Development Phases

### Week One – Frontend Focus (Client-side Tracking)

#### Week Goal

Build a lightweight JavaScript tracking script, integrated into WordPress, capable of capturing essential events and sending them to a collection endpoint (temporary mock backend).

---

### Tasks Planned for Week 1

| Day | Tasks |
|---|---|
| Day 1 | Define the scope of events to track:<br>- Finalize the list of user behaviors to track<br>- Define the exact data to send for each event<br>- Choose session management method (localStorage / cookies) |
| Day 2 | Project frontend structure:<br>- Create the development environment (repo, JS files, etc.)<br>- Define the architecture of the tracking script |
| Day 3 | Implement the first event detectors:<br>- Page views<br>- Scroll depth<br>- Clicks (buttons, links) |
| Day 4 | Set up a mock endpoint to test data sending:<br>- Simple backend (PHP or external test service like webhook.site)<br>- Test JSON payload POST requests |
| Day 5 | End-to-end testing:<br>- Simulate user navigation<br>- Check outgoing requests<br>- Frontend debugging |
| Day 6 | Finalize payload structure:<br>- Standardize event formats<br>- Document the JSON format |
| Day 7 | Documentation:<br>- Write the project README<br>- Weekly summary and preparation for the next steps (backend, database) |

---

## Next Steps (Following Weeks)

- Create the MySQL database (using custom tables within WordPress)
- Develop the API to receive and store the events
- Build analysis dashboards for the collected data
- Optimize performance and security
- Add advanced features (heatmaps, error tracking, etc.)

---

## JSON Payload Specification per Event

### 1. Page View

- **Event name (event_type):**  
`"page_view"`

- **Fields to include in the payload:**
  - `page_url` : Full page URL
  - `referrer` : Referring URL
  - `session_id` : Unique user session ID
  - `timestamp` : Date/time of the event
  - `device_type` : Device type (desktop / mobile / tablet)
  - `browser` : Browser
  - `os` : Operating system
  - `utm_parameters` : If present (source, medium, campaign, etc.)

---

### 2. Scroll Depth

- **Event name (event_type):**  
`"scroll_depth"`

- **Fields to include:**
  - `page_url`
  - `scroll_percentage` : Scroll depth reached (e.g., 25, 50, 75, 100)
  - `session_id`
  - `timestamp`

---

### 3. Click (Call-to-Action, Navigation, External Link)

- **Event name (event_type):**  
`"click"`

- **Fields to include:**
  - `element_id` or `element_text` : ID or text of the clicked button/link
  - `element_type` : Element type (button / link / nav / external)
  - `page_url`
  - `session_id`
  - `timestamp`

---

### 4. Form Submission

- **Event name (event_type):**  
`"form_submission"`

- **Fields to include:**
  - `form_id` or `form_name`
  - `fields_filled` : List of field names filled (without personal values)
  - `page_url`
  - `session_id`
  - `timestamp`

---

### 5. Session Start (optional)

- **Event name (event_type):**  
`"session_start"`

- **Fields to include:**
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
- Implement the payload structure in the JavaScript tracking script
- Set up a mock endpoint for POST request testing

---

## Session Management Method

To track unique user sessions across page views and interactions, I will use browser cookies.

### Technical Details:

- **Session ID Generation:**  
A UUID (Universally Unique Identifier) will be generated for each new session.

- **Storage Method:**  
The session ID will be stored in a **cookie** with the following properties:
  - **Name:** `custom_analytics_session_id`
  - **Expiration:**  
    The cookie will expire **30 minutes after the user's last interaction** (rolling expiration on each event). This is in line with common analytics practices (e.g., Google Analytics session definition).

- **Session Timeout Logic:**  
If no activity is detected within 30 minutes, a new session ID will be generated on the next interaction or page load.

- **Privacy Consideration:**  
Since this is a first-party cookie and does not contain any personal information, it remains compliant with basic privacy standards. However, a consent mechanism may be considered later for GDPR compliance.

### Example Workflow:

1. On first page view:  
→ Check if cookie exists  
→ If not, generate a new UUID  
→ Set the cookie with 30-minute expiration  

2. On each user interaction (page view, scroll, click, etc.):  
→ Refresh the cookie expiration to extend the session window  

3. After 30 minutes of inactivity:  
→ Next event will generate a new session ID  
→ Start a new session lifecycle  

### Data Flow Diagram
[![Diagramme de flux de données](https://vienneaucodetrail.tech/wp-content/uploads/2025/06/deepseek_mermaid_20250625_ae603d-scaled.png "a diagram")](https://vienneaucodetrail.tech/wp-content/uploads/2025/06/deepseek_mermaid_20250625_ae603d-scaled.png)
