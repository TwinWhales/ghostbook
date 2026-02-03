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

  return (
    <div className="text-center py-10 md:py-20">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-mono">
        <span className="text-muted-foreground">root@localhost:~# </span>
        <span className="text-primary">{text}</span>
        <span className="animate-pulse">_</span>
      </h1>
      <p className="mt-4 text-xl text-muted-foreground">
        Hidden Network for Alumni
      </p>
    </div>
  )
}
