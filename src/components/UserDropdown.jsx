import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UserDropdown.css';

/**
 * UserDropdown component that matches the style of HoverDropdown
 * @param {Object} props - Component props
 * @param {string} props.username - The username to display
 * @param {Array} props.items - Array of dropdown items with label and path
 * @param {Function} props.onLogout - Function to call when logout is clicked
 * @returns {JSX.Element} - The rendered component
 */
const UserDropdown = ({ username, items = [], onLogout }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isMobile = window.innerWidth < 992;
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

  const handleItemClick = (path, isLogout = false) => {
    // Immediately hide dropdown
    setIsHovered(false);
    setIsMobileOpen(false);

    if (isLogout) {
      // Call the logout function
      onLogout();
    } else {
      // Navigate to the selected page
      navigate(path);
    }
  };

  return (
    <div
      className="user-hover-dropdown"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={dropdownRef}
    >
      <span
        className="dropdown-title"
        onClick={handleTitleClick}
      >
        Hello, {username}
      </span>
      <div className={`dropdown-menu ${isHovered || isMobileOpen ? 'show' : ''}`}>
        {items.map((item, index) => (
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
        ))}
        <div 
          className="dropdown-item logout-item"
          onClick={() => handleItemClick('', true)}
        >
          Logout
        </div>
      </div>
    </div>
  );
};

export default UserDropdown;
