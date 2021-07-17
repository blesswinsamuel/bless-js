import { useEffect, useRef } from 'react'

export default function useThrottle(doThing, limit) {
  const lastRan = useRef(Date.now())

  useEffect(() => {
    const handler = setTimeout(function() {
      if (Date.now() - lastRan.current >= limit) {
        doThing()
        lastRan.current = Date.now()
      }
    }, limit - (Date.now() - lastRan.current))

    return () => {
      clearTimeout(handler)
    }
  }, [limit, doThing])
}
