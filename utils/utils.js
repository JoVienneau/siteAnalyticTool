export function getScrollPercentage() {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const fullHeight = document.documentElement.scrollHeight;

  const scrollPercentage = Math.round(((scrollTop + windowHeight) / fullHeight) * 100);
  return scrollPercentage;
}
