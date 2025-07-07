import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/slices/authSlice';
import './HoverDropdown.css';

const HoverDropdown = ({ title, items, isActive }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isMobile = window.innerWidth < 992;
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
    }
  };

  const handleTitleClick = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    }
  };

  const handleItemClick = (path) => {
    // Immediately hide dropdown
    setIsHovered(false);
    setIsMobileOpen(false);

    // Navigate to the selected page
    navigate(path);
  };

  return (
    <div
      className={`hover-dropdown ${isActive ? 'active' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={dropdownRef}
    >
      <span
        className="dropdown-title"
        onClick={handleTitleClick}
      >
        {title}
      </span>
      <div className={`dropdown-menu ${isHovered || isMobileOpen ? 'show' : ''}`}>
        {items.map((item, index) => {
          // Skip cart-related items when user is not logged in
          if (!currentUser && (item.path === '/cart' || item.path === '/checkout' || item.path === '/wishlist')) {
            return null;
          }

          return (
            <Link
              key={index}
              to={item.path}
              className="dropdown-item"
              onClick={(e) => {
                e.preventDefault(); // Prevent default link behavior
                handleItemClick(item.path);
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HoverDropdown;
