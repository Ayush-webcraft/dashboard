type SwiptType = {
  el: HTMLElement, 
  threshold?: number,
  callbacks: {
    left: (e: TouchEvent) => void,
    right: (e: TouchEvent) => void,
  }
}
/**
 * Gesture detection config
 * @param {options} options - DOM element to bind the gesture to
 */
export const initSwipe = (options: SwiptType) => {
  let startX, startY, startTime;
  let threshold = options.threshold || 50;
  if (!options.el) {
    console.error('initSwipe: el is required')
    return
  }
  options.el.addEventListener('touchstart', (e) => {
      // Record the initial position and time
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
  }, { passive: true });

  options.el.addEventListener('touchend', (e) => {
      // Return early if there's no valid starting point (guards against edge-case triggers)
      if (startX === undefined || startY === undefined) return;
      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;
      const endTime = Date.now();
      // Calculate the movement distance
      const diffX = endX - startX;
      const diffY = endY - startY;
      const timeDiff = endTime - startTime;
      // Determine if this counts as a swipe: enough distance, reasonable time (guards against a long-press mistrigger, e.g. capped at 500ms)
      if (Math.abs(diffX) > threshold && Math.abs(diffX) > Math.abs(diffY) && timeDiff < 500) {
          if (diffX > 0) {
              // Swipe right
              console.log('👉 swipe right');
              options.callbacks.right?.(e);
          } else {
              // Swipe left
              console.log('👈 swipe left');
              options.callbacks.left?.(e);
          }
      }
      // Reset the starting point
      startX = startY = undefined;
  }, { passive: true });

  // Reset the position if the swipe is interrupted by the system taking over scrolling
  options.el.addEventListener('touchcancel', () => {
      startX = startY = undefined;
  }, { passive: true });
}