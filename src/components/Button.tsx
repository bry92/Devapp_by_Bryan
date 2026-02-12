// src/components/Button.tsx
import React, { forwardRef, ButtonHTMLAttributes, useState } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'primary' | 'secondary';
  onClickWrapper?: () => void;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      variant = 'primary',
      onClickWrapper,
      disabled = false,
      type = 'button',
      className,
      'aria-label': ariaLabel,
      'aria-pressed': ariaPressed,
      ...rest
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const isPrimary = variant === 'primary';
    const baseStyles = {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '6px',
      backgroundColor: isPrimary
        ? disabled
          ? '#cccccc'
          : '#0066ff'
        : disabled
        ? '#a0a0a0'
        : '#6c757d',
      color: 'white',
      fontSize: '16px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      transition: 'all 150ms ease-in-out',
      outline: 'none',
    };

    const getStyleOverrides = () => {
      if (disabled) return {};
      
      const overrides: React.CSSProperties = {};
      
      if (isHovered) {
        overrides.backgroundColor = isPrimary ? '#0052cc' : '#5a6268';
        overrides.transform = 'translateY(-2px)';
        overrides.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }
      
      if (isActive) {
        overrides.transform = 'translateY(0)';
      }
      
      if (isFocused) {
        overrides.outline = '2px solid #0066ff';
        overrides.outlineOffset = '2px';
      }
      
      return overrides;
    };

    const mergedStyles = { ...baseStyles, ...getStyleOverrides() };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        aria-label={ariaLabel || label}
        aria-pressed={ariaPressed}
        aria-disabled={disabled}
        className={className}
        onClick={onClickWrapper}
        style={mergedStyles}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => !disabled && setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseDown={() => !disabled && setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
        {...rest}
      >
        {label}
      </button>
    );
  }
);

Button.displayName = 'Button';
