import { useState, useCallback } from 'react'

export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState)

  const openModal = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggleModal = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal
  }
}

export default useModal
