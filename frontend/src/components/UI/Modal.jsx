import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import clsx from 'clsx'
import './Modal.css'

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  className,
  ...props
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const modalClass = clsx(
    'modal',
    `modal--${size}`,
    className
  )

  return (
    <div className="modal-overlay" onClick={onClose} {...props}>
      <div className={modalClass} onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button className="modal__close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal__content">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
