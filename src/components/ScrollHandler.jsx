import { useEffect, useRef, useCallback } from 'react';

/**
 * Component to handle scroll behavior for the header
 * Hides the header when scrolling down and shows it when scrolling up
 */
const ScrollHandler = () => {
  // Use refs instead of state to avoid re-renders and dependency issues
  const prevScrollPosRef = useRef(0);
  const headerRef = useRef(null);
  const visibleRef = useRef(true);

  // Memoize the scroll handler to avoid recreating it on each render
  const handleScroll = useCallback(() => {
    const currentScrollPos = window.scrollY;
    const header = headerRef.current;

    if (!header) return;

    // Always show header at the top of the page
    if (currentScrollPos < 50) {
      visibleRef.current = true;
    } else {
      // Show when scrolling up, hide when scrolling down
      // Use a threshold to avoid flickering (only change visibility if scrolled more than 5px)
      if (Math.abs(prevScrollPosRef.current - currentScrollPos) > 5) {
        visibleRef.current = prevScrollPosRef.current > currentScrollPos;
        prevScrollPosRef.current = currentScrollPos;
      }
    }

    // Update the header style
    header.style.transform = visibleRef.current ? 'translateY(0)' : 'translateY(-100%)';
  }, []);

  useEffect(() => {
    // Get the header element once and store it in a ref
    headerRef.current = document.querySelector('header');

    // Set initial scroll position
    prevScrollPosRef.current = window.scrollY;

    // Add scroll event listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial call to set the correct state
    handleScroll();

    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]); // Include handleScroll in dependencies

  // This component doesn't render anything
  return null;
};

export default ScrollHandler;
