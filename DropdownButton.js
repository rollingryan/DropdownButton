import React, { useState, useEffect, useRef, useCallback } from "react";
import { Manager, Reference, Popper } from "react-popper";
import PropTypes from "prop-types";
import Button from "../Button";
import Icon from "../Icon";

import DropdownListItem from "./DropdownListItem";
// import DropdownSubMenu from './DropdownSubMenu';

const DropdownButton = ({
  text,
  icon,
  theme,
  inverse,
  options,
  className,
  isDisabled,
  noMargin,
  onClick
}) => {
  const [dropdownOpen, setDropdownToggle] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState({});
  const dropdownListRef = useRef(null);
  const dropdownButtonRef = useRef(null);

  useEffect(() => {
    // on load if option has sub menu push name to state
    options.forEach(opt => {
      if (opt.subMenu) {
        const tempSubMenus = subMenuOpen;
        tempSubMenus[opt.name] = false;
        setSubMenuOpen(tempSubMenus);
      }
    });
  }, [options]);

  // Create refs to the button and list elements and return poppers ref function
  const setButtonRef = useCallback((node, ref) => {
    dropdownButtonRef.current = node;
    return ref(node);
  }, []);

  const setListRef = useCallback((node, ref) => {
    dropdownListRef.current = node;
    return ref(node);
  }, []);

  // Toggles for dropdown and sub menu
  const toggleDropdown = () => {
    if (onClick) {
      onClick();
    }
    setDropdownToggle(!dropdownOpen);
  };

  const toggleSubMenu = name => {
    const tempSubMenus = { ...subMenuOpen };
    Object.keys(tempSubMenus).forEach(key => {
      if (name && key === name) {
        tempSubMenus[key] = !tempSubMenus[key];
      } else {
        tempSubMenus[key] = false;
      }
    });
    setSubMenuOpen(tempSubMenus);
  };

  // Handle clicks outside of dropdown list
  const handleClickOutside = event => {
    // if the click outside dropdown list
    // and not the dropdown button (button hands click its self)
    // toggle dropdown list and sub menu
    if (
      dropdownOpen &&
      dropdownListRef.current &&
      !dropdownListRef.current.contains(event.target) &&
      dropdownButtonRef.current &&
      !dropdownButtonRef.current.contains(event.target)
    ) {
      toggleDropdown();
      toggleSubMenu();
    }
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  });

  const modifiers = {
    preventOverflow: {
      enabled: false
    },
    hide: {
      enabled: false
    },
    shift: {
      enabled: true,
      fn: data => {
        const tempData = { ...data };
        const { offsets } = tempData;
        const { popper, reference } = offsets;

        const refLeftPos = data.instance.reference.offsetParent.offsetLeft;
        const widthDiff = popper.width - reference.width;
        const buttonRefPos = dropdownButtonRef.current.getBoundingClientRect();

        // if menu list would go off screen on the left side and there is room then shift it, else keep it right aligned
        if (
          refLeftPos - widthDiff < 1 &&
          buttonRefPos.right + widthDiff < window.innerWidth
        ) {
          tempData.offsets.popper.left = 0;
        } else {
          tempData.offsets.popper.left = -widthDiff;
        }
        return tempData;
      }
    },
    flip: {
      enabled: false
    }
  };

  return (
    <Manager>
      <div
        className={`dropdown-button ${
          noMargin ? "dropdown-button--no-margin" : ""
        }`}
      >
        <Reference>
          {({ ref }) => (
            <div
              // Div wraps button for click and popper ref
              ref={node => setButtonRef(node, ref)}
              className="dropdown-button__wrapper"
            >
              <Button
                inverse={inverse}
                theme={theme}
                onClick={toggleDropdown}
                disabled={isDisabled}
                className={`${className} ${(dropdownOpen && "active") || ""}`}
              >
                {text}
                {icon && (
                  <Icon
                    icon={icon}
                    className={text && text.length > 0 && "icon--margin-left"}
                  />
                )}
              </Button>
            </div>
          )}
        </Reference>

        {dropdownOpen && (
          <Popper
            placement="bottom-start"
            modifiers={modifiers}
            eventsEnabled={false}
          >
            {({ ref, style, placement }) => {
              return (
                <div
                  ref={node => setListRef(node, ref)}
                  style={{ zIndex: 2, ...style }}
                  data-placement={placement}
                  className="dropdown-button__list"
                >
                  {options.map(item => {
                    const {
                      name,
                      label,
                      onClick,
                      alert,
                      dropdownIcon,
                      subMenu,
                      permissions
                    } = item;
                    return (
                      <DropdownListItem
                        key={name}
                        label={label}
                        onClick={() => {
                          // if it has subMenu onClick toggle just menu
                          // else call onClick from option and close dropdown
                          if (subMenu) {
                            toggleSubMenu(name);
                          } else {
                            onClick();
                            toggleDropdown();
                          }
                        }}
                        toggleDropdown={toggleDropdown}
                        alert={alert}
                        dropdownIcon={dropdownIcon}
                        options={subMenu || null}
                        open={subMenu ? subMenuOpen[name] : null}
                      />
                    );
                  })}
                </div>
              );
            }}
          </Popper>
        )}
      </div>
    </Manager>
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
  alert: PropTypes.bool
});

DropdownButton.propTypes = {
  /** Label for dropdown button */
  text: PropTypes.string,
  /** Theme based off button themes */
  theme: PropTypes.string,
  /** Inverse button theme */
  inverse: PropTypes.bool,
  /** Main icon for dropdown button, replaces down arrow */
  icon: PropTypes.string,
  /** Array of options */
  options: PropTypes.arrayOf(optionPropType).isRequired,
  /** Add extra className */
  className: PropTypes.string,
  /** Disable dropdown button */
  isDisabled: PropTypes.bool,
  /** Boolean to remove margin */
  noMargin: PropTypes.bool
};

DropdownButton.defaultProps = {
  text: undefined,
  theme: undefined,
  inverse: undefined,
  icon: "down",
  className: undefined,
  isDisabled: undefined,
  noMargin: false
};

export default DropdownButton;
