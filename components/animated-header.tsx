'use client'

import { useEffect, useState } from 'react'

export function AnimatedHeader() {
  const [text, setText] = useState('/etc/passwd')
  const targetText = '/etc/GHOSTd'
  
  useEffect(() => {
    const text1 = '/etc/passwd'
    const text2 = '/etc/GHOSTd'
    
    let currentInterval: NodeJS.Timeout
    let currentTimeout: NodeJS.Timeout

    const animate = (from: string, to: string, onComplete: () => void) => {
        let step = 0
        const maxSteps = to.length - 5 

        currentInterval = setInterval(() => {
            if (step >= maxSteps) {
                clearInterval(currentInterval)
                onComplete()
                return
            }

            setText(() => {
                const prefix = to.substring(0, 5 + step + 1)
                const suffix = from.substring(5 + step + 1)
                return prefix + suffix
            })
            
            step++
        }, 300)
    }

    const loop = () => {
        // 1. Forward: passwd -> GHOSTd
        animate(text1, text2, () => {
            // 2. Wait 3s
            currentTimeout = setTimeout(() => {
                // 3. Backward: GHOSTd -> passwd
                animate(text2, text1, () => {
                    // 4. Wait 1s and Loop
                     currentTimeout = setTimeout(loop, 1000)
                })
            }, 3000)
        })
    }

    // Start with delay
    currentTimeout = setTimeout(loop, 1000)

    return () => {
        clearInterval(currentInterval)
        clearTimeout(currentTimeout)
    }
  }, [])

  const handleScroll = () => {
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] text-center pb-20">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-mono">
        <span className="text-gray-400">root@localhost:~# </span>
        <span className="text-green-500">{text}</span>
        <span className="animate-pulse text-green-500">_</span>
      </h1>
      <p className="mt-4 text-xl text-gray-400 font-mono">
        $ sudo connect ob --target=yb
      </p>
      <div 
        onClick={handleScroll}
        className="absolute bottom-10 animate-bounce cursor-pointer p-2 hover:text-gray-300 transition-colors"
        aria-label="Scroll down"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-gray-500"
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </div>
    </div>
  )
}
