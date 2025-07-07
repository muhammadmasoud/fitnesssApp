// VirtualList.jsx
import { memo, useState, useEffect, useRef, useCallback } from 'react';
import './VirtualList.css';

/**
 * A virtualized list component that only renders visible items for better performance
 * @param {Object} props - Component props
 * @param {Array} props.items - Array of items to render
 * @param {Function} props.renderItem - Function to render each item
 * @param {number} props.itemHeight - Height of each item in pixels
 * @param {number} props.height - Height of the list container in pixels
 * @param {number} props.overscan - Number of items to render above and below the visible area
 * @returns {JSX.Element} - The rendered component
 */
const VirtualList = ({
  items = [],
  renderItem,
  itemHeight = 60,
  height = 400,
  overscan = 3,
  className = ''
}) => {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Calculate total height for the container
  const totalHeight = items.length * itemHeight;

  // Calculate the range of visible items
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + height) / itemHeight) + overscan
  );

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  // Add scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Render only the visible items
  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          top: `${i * itemHeight}px`,
          height: `${itemHeight}px`,
          width: '100%'
        }}
      >
        {renderItem(items[i], i)}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`virtual-list-container ${className}`}
      style={{ height, overflow: 'auto', position: 'relative' }}
    >
      <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
        {visibleItems}
      </div>
    </div>
  );
};

// Export memoized component to prevent unnecessary re-renders
export default memo(VirtualList);
