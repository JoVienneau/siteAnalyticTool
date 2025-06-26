// tracker.js
// Main tracking script entry point (console testing version)

import { getSessionId } from './session.js';

// Mock endpoint (Not used here, just for reference)
const TRACKING_ENDPOINT = 'http://localhost';  // Replace for production later

// Utility: Log event data to the console (instead of sending it)
function sendTrackingEvent(eventData) {
  console.log('--- Tracking Event Sent ---');
  console.log('Payload:', JSON.stringify(eventData, null, 2));
}

// Utility to parse UTM parameters from URL
function getUTMParameters() {
  const params = new URLSearchParams(window.location.search);
  const utmParams = {};

  const utmKeys = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content'
  ];

  utmKeys.forEach(key => {
    if (params.has(key)) {
      utmParams[key] = params.get(key);
    }
  });

  return Object.keys(utmParams).length > 0 ? utmParams : null;
}

// Basic device detection
function getDeviceInfo() {
  const userAgent = navigator.userAgent;
  let deviceType = 'desktop';

  if (/Mobi|Android|iPhone|iPad|iPod/i.test(userAgent)) {
    deviceType = /iPad|Tablet/i.test(userAgent) ? 'tablet' : 'mobile';
  }

  return {
    device_type: deviceType,
    os: getOS(),
    browser: getBrowser()
  };
}

// Detect operating system
function getOS() {
  const userAgent = navigator.userAgent;
  if (/Windows/i.test(userAgent)) return 'Windows';
  if (/Mac/i.test(userAgent)) return 'Mac';
  if (/Linux/i.test(userAgent)) return 'Linux';
  if (/Android/i.test(userAgent)) return 'Android';
  if (/iOS|iPhone|iPad|iPod/i.test(userAgent)) return 'iOS';
  return 'Unknown';
}

// Detect browser
function getBrowser() {
  const userAgent = navigator.userAgent;
  if (/Firefox/i.test(userAgent)) return 'Firefox';
  if (/Chrome/i.test(userAgent) && !/Edge/i.test(userAgent)) return 'Chrome';
  if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) return 'Safari';
  if (/Edge/i.test(userAgent)) return 'Edge';
  if (/Opera|OPR/i.test(userAgent)) return 'Opera';
  if (/MSIE|Trident/i.test(userAgent)) return 'IE';
  return 'Unknown';
}

// Enhanced page view tracking
function trackPageView() {
  const deviceInfo = getDeviceInfo();
  const utmParams = getUTMParameters();

  const payload = {
    event_type: 'page_view',
    page_url: window.location.href,
    referrer: document.referrer,
    session_id: getSessionId(),
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent,
    ...deviceInfo,  // Spread device info (device_type, os, browser)
    utm_parameters: utmParams,
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    viewport_size: `${window.innerWidth}x${window.innerHeight}`,
    language: navigator.language,
    prefers_dark_mode: window.matchMedia('(prefers-color-scheme: dark)').matches
  };

  console.log('Tracking: Page View');
  sendTrackingEvent(payload);

  return payload; // Useful for testing
}

// Track scroll depth (stub example)
function trackScrollDepth(scrollPercentage) {
  const payload = {
    event_type: 'scroll_depth',
    page_url: window.location.href,
    scroll_percentage: scrollPercentage,
    session_id: getSessionId(),
    timestamp: new Date().toISOString()
  };

  console.log(`Tracking: Scroll Depth (${scrollPercentage}%)`);
  sendTrackingEvent(payload);
}

// Enhanced click tracking function
function trackClick(element) {
  // Determine click type
  let clickType = 'generic';
  const href = element.href;
  const isExternalLink = element.tagName === 'A' &&
                       href &&
                       !href.startsWith(window.location.origin);

  // Classify click type
  if (element.tagName === 'A') {
    clickType = isExternalLink ? 'external_link' : 'internal_link';
  } else if (element.tagName === 'BUTTON') {
    clickType = 'button_click';
  } else if (element.hasAttribute('data-cta')) {
    clickType = 'cta_click';
  }

  // Prepare payload
  const payload = {
    event_type: 'click',
    element_type: clickType,
    element_id: element.id || null,
    element_class: element.className || null,
    element_text: element.innerText
                 ? element.innerText.trim().substring(0, 100)
                 : null,
    href: isExternalLink ? href : null,
    page_url: window.location.href,
    session_id: getSessionId(),
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent,
    // These would come from your detection utils:
    device_type: 'desktop', // TODO: Implement detection
    browser: 'chrome',      // TODO: Implement detection
    os: 'windows'          // TODO: Implement detection
  };

  // Special handling for external links
  if (isExternalLink) {
    payload.external_domain = new URL(href).hostname;
  }

  console.log(`Tracking: Click (${clickType})`);
  sendTrackingEvent(payload);

  return payload; // Useful for testing
}

// Initialize click tracking (add this to your main.js)
function initClickTracking() {
  document.addEventListener('click', function(event) {
    // Get the actual clicked element (handles event delegation)
    const target = event.target.closest('a, button, [data-track]');
    if (!target) return;

    // Skip if explicitly marked as no-track
    if (target.hasAttribute('data-no-track')) return;

    // Track the click
    trackClick(target);

    // Special handling for external links
    if (target.tagName === 'A' &&
        target.href &&
        !target.href.startsWith(window.location.origin)) {  // Added missing parenthesis
      // Allow default behavior after tracking
      setTimeout(() => {
        window.location.href = target.href;
      }, 150);
    }
  });
}

export { trackPageView, getUTMParameters, getDeviceInfo, trackScrollDepth, trackClick, initClickTracking };
