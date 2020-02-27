import React from 'react';
import PropTypes from 'prop-types';

const SubMenu = ({
  toggleSubMenu,
  toggleDropdown,
  options,
  open,
}) => {
  return (
    <div
      className={`dropdown-button__list__sub-menu 
        ${open ? 'dropdown-button__list__sub-menu--open' : ''}
        `}>
      {options.map(item => {
        const { name, label, onClick } = item;
        return (
          <div
            key={name}
            className="dropdown-button__list__sub-menu__item"
            onClick={() => {
              // call option onClick and close dropdown and all sub menus
              onClick();
              toggleSubMenu();
              toggleDropdown();
            }}>
            {label}
          </div>
        );
      })}
    </div>
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

SubMenu.propTypes = {
  /** Function to close sub menu */
  toggleSubMenu: PropTypes.func.isRequired,
  /** Function to close dropdown */
  toggleDropdown: PropTypes.func.isRequired,
  /** Array of options */
  options: PropTypes.arrayOf(optionPropType).isRequired,
  /** True if sub menu is open */
  open: PropTypes.bool,
};

SubMenu.defaultProps = {
  open: undefined,
};

export default SubMenu;
