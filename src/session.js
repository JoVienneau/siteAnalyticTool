// session.js
// Handles session management using browser cookies

// Generate a simple UUID (v4 style)
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Get cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Set cookie
function setCookie(name, value, minutes) {
  const expiryDate = new Date();
  expiryDate.setTime(expiryDate.getTime() + (minutes * 60 * 1000));
  const expires = "expires=" + expiryDate.toUTCString();
  document.cookie = `${name}=${value}; ${expires}; path=/`;
}

// Get or create session ID
export function getSessionId() {
  const cookieName = 'custom_analytics_session_id';
  let sessionId = getCookie(cookieName);

  if (!sessionId) {
    sessionId = generateUUID();
  }

  // Refresh expiration (rolling 30 min)
  setCookie(cookieName, sessionId, 30);

  return sessionId;
}
