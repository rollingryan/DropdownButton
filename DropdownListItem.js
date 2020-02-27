import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import DropdownSubMenu from './DropdownSubMenu';

const DropdownListItem = ({
  label,
  onClick,
  dropdownIcon,
  alert,
  toggleDropdown,
  options,
  open,
}) => {
  return (
    <>
      <div
        className={`dropdown-button__list__item 
      ${(alert && `dropdown-button__list__item--alert`) || ''}         `}
        onClick={() => {
          onClick();
        }}>
        {dropdownIcon && (
          <Icon className="icon--margin-right" icon={dropdownIcon} />
        )}
        {label}
        {options && (
          <Icon
            icon="right"
            className={`dropdown-button__list__item__arrow ${
              open ? 'dropdown-button__list__item__arrow--open' : ''
            }`}
          />
        )}
      </div>
      {options ? (
        <DropdownSubMenu
          toggleSubMenu={onClick}
          toggleDropdown={toggleDropdown}
          options={options}
          open={open}
        />
      ) : null}
    </>
  );
};

const optionPropType = PropTypes.shape({
  /** Name for key */
  name: PropTypes.string.isRequired,
  /** Option label to display */
  label: PropTypes.string.isRequired,
  /** Function to call when option clicked */
  onClick: PropTypes.func.isRequired,
  /** Icon for option */
  dropdownIcon: PropTypes.string,
  /** Colorize option red */
  alert: PropTypes.bool,
});

DropdownListItem.propTypes = {
  /** Option label to display */
  label: PropTypes.string.isRequired,
  /** Function to call when option clicked, from options or sub menu toggle */
  onClick: PropTypes.func.isRequired,
  /** Icon for option */
  dropdownIcon: PropTypes.string,
  /** Colorize option red */
  alert: PropTypes.bool,
  /** Function to close dropdown */
  toggleDropdown: PropTypes.func.isRequired,
  /** Array of options */
  options: PropTypes.arrayOf(optionPropType),
  /** True if sub menu is open */
  open: PropTypes.bool,
};

DropdownListItem.defaultProps = {
  dropdownIcon: undefined,
  alert: undefined,
  options: undefined,
  open: undefined,
};

export default DropdownListItem;
