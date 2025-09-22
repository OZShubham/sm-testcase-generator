import React from 'react'
import { Loader2 } from 'lucide-react'
import clsx from 'clsx'
import './Button.css'

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  className,
  onClick,
  type = 'button',
  ...props
}) => {
  const buttonClass = clsx(
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    {
      'btn--disabled': disabled,
      'btn--loading': loading,
      'btn--icon-only': Icon && !children,
      'btn--icon-right': iconPosition === 'right'
    },
    className
  )

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <Loader2 className="btn__spinner" size={16} />
      )}
      
      {Icon && iconPosition === 'left' && !loading && (
        <Icon className="btn__icon btn__icon--left" size={16} />
      )}
      
      {children && <span className="btn__text">{children}</span>}
      
      {Icon && iconPosition === 'right' && !loading && (
        <Icon className="btn__icon btn__icon--right" size={16} />
      )}
    </button>
  )
}

export default Button
