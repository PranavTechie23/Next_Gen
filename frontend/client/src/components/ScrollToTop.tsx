import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // Temporarily disable smooth scrolling CSS to force instant scroll
    const html = document.documentElement;
    const body = document.body;
    const originalScrollBehavior = html.style.scrollBehavior;
    
    // Disable smooth scrolling immediately - this overrides CSS
    html.style.scrollBehavior = 'auto';
    if (body) {
      body.style.scrollBehavior = 'auto';
    }
    
    // Force instant scroll - do it immediately and aggressively
    const forceInstantScroll = () => {
      // Direct assignment (fastest method)
      html.scrollTop = 0;
      body.scrollTop = 0;
      
      // Also use window.scrollTo without behavior option
      window.scrollTo(0, 0);
      
      // For any scrollable containers, reset them too
      const scrollableElements = document.querySelectorAll('[data-scroll-container]');
      scrollableElements.forEach((element) => {
        (element as HTMLElement).scrollTop = 0;
      });
    };
    
    // Execute immediately (synchronous)
    forceInstantScroll();
    
    // Also execute in next frame to catch any delayed renders
    requestAnimationFrame(() => {
      forceInstantScroll();
      // One more time in the next frame to be absolutely sure
      requestAnimationFrame(forceInstantScroll);
    });
    
    // Restore original scroll behavior after ensuring scroll is complete
    // Use a longer delay to ensure smooth scrolling doesn't interfere
    const restoreScrollBehavior = () => {
      html.style.scrollBehavior = originalScrollBehavior || '';
      if (body) {
        body.style.scrollBehavior = '';
      }
    };
    
    // Restore after ensuring scroll is complete (100ms should be enough)
    setTimeout(restoreScrollBehavior, 100);
    
    // Cleanup function to restore on unmount
    return () => {
      restoreScrollBehavior();
    };
  }, [location]);

  return null;
}

