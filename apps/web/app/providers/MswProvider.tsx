
'use client'

import { useEffect, useState } from 'react'

export function MswProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false)

  useEffect(() => {
    const init = async () => {
      if (process.env.NODE_ENV === 'development') {
        const { worker } = await import('@repo/mocks/browser')
        await worker.start({
          onUnhandledRequest: 'bypass',
        })
        setMswReady(true)
      } else {
        setMswReady(true)
      }
    }

    init()
  }, [])

  if (!mswReady) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}