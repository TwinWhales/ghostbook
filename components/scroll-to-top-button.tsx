'use client'

import { ArrowUp } from 'lucide-react'

export function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div 
      onClick={scrollToTop}
      className="animate-bounce cursor-pointer p-2 hover:text-gray-500 transition-colors"
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-6 w-6 text-gray-400" />
    </div>
  )
}
