import { useState, useEffect, useRef } from 'react';
import { Form, InputGroup, Dropdown } from 'react-bootstrap';
import { countryCodes } from '../data/countryCodes';
import { getPhoneExample } from '../utils/phoneValidation';
import './PhoneInput.css';

const PhoneInput = ({
  value,
  onChange,
  isInvalid,
  errorMessage,
  required = false,
  name = 'phone',
  label = 'Phone Number*'
}) => {
  const [selectedCountry, setSelectedCountry] = useState(
    countryCodes.find(country => country.code === 'US') || countryCodes[0]
  );
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Initialize from value prop if provided
  useEffect(() => {
    if (value) {
      // If value already has a country code, extract it
      if (value.startsWith('+')) {
        // Find the country code that matches the beginning of the value
        const matchingCountry = countryCodes.find(country =>
          value.startsWith(country.dial_code)
        );

        if (matchingCountry) {
          setSelectedCountry(matchingCountry);
          setPhoneNumber(value.substring(matchingCountry.dial_code.length).trim());
        } else {
          // If no matching country code found, just set the phone number
          setPhoneNumber(value);
        }
      } else {
        // If no country code in value, just set the phone number
        setPhoneNumber(value);
      }
    }
  }, [value]);

  // Update parent component when phone number or country changes
  useEffect(() => {
    // Only update if we have a phone number to prevent immediate validation errors
    if (phoneNumber.trim() === '') {
      // Don't trigger validation on empty input
      return;
    }

    const fullNumber = `${selectedCountry.dial_code} ${phoneNumber}`;
    // Pass both the full number and the country code to the parent component
    onChange({
      target: {
        name,
        value: fullNumber,
        // Add custom properties to the event object
        dataset: {
          countryCode: selectedCountry.code,
          dialCode: selectedCountry.dial_code
        }
      }
    });
  }, [selectedCountry, phoneNumber, onChange, name]);

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setDropdownOpen(false);
  };

  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  return (
    <Form.Group className="form-group">
      <Form.Label>{label}</Form.Label>
      <InputGroup>
        <Dropdown show={dropdownOpen} ref={dropdownRef} className="country-code-dropdown">
          <Dropdown.Toggle
            variant="outline-secondary"
            id="dropdown-country-code"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="country-code-toggle"
          >
            <span className="country-flag">{selectedCountry.code.substring(0, 2)}</span>
            <span className="country-dial-code">{selectedCountry.dial_code}</span>
          </Dropdown.Toggle>

          <Dropdown.Menu className="country-code-menu">
            {/* Search functionality can be added in the future */}
            <div className="country-list">
              {countryCodes.map((country) => (
                <Dropdown.Item
                  key={country.code}
                  onClick={() => handleCountrySelect(country)}
                  active={selectedCountry.code === country.code}
                >
                  <span className="country-flag">{country.code.substring(0, 2)}</span>
                  <span className="country-name">{country.name}</span>
                  <span className="country-dial-code">{country.dial_code}</span>
                </Dropdown.Item>
              ))}
            </div>
          </Dropdown.Menu>
        </Dropdown>

        <Form.Control
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          isInvalid={isInvalid}
          required={required}
          placeholder={getPhoneExample(selectedCountry.code)}
        />
        <Form.Control.Feedback type="invalid">
          {errorMessage}
        </Form.Control.Feedback>
      </InputGroup>
    </Form.Group>
  );
};

export default PhoneInput;
