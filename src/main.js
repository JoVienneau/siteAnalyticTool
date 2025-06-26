import { trackPageView, trackScrollDepth, initClickTracking } from './tracker.js';
import { getScrollPercentage } from '../utils/utils.js';


// Call page view tracking on page load
trackPageView();


//---------------- SCROLL TRACKING LOGIC ----------------//

let lastScrollPercentageTracked = 0;

window.addEventListener('scroll', () => {
  const scrollPercentage = getScrollPercentage();

  const milestones = [25, 50, 75, 100];

  milestones.forEach((milestone) => {
    if (scrollPercentage >= milestone && lastScrollPercentageTracked < milestone) {
      trackScrollDepth(milestone);
      lastScrollPercentageTracked = milestone;
    }
  });
});

// ---------------- CLICK TRACKING LOGIC ---------------- //

document.addEventListener('DOMContentLoaded', () => {
  initClickTracking();
});
