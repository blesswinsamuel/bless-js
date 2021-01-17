import { useCallback, useEffect, useRef, useState } from "react"

export interface AsyncState<T> {
  loading: boolean
  error?: Error | any
  data?: T
}

const useAsync = <T>(
  fn: (...args: any[]) => Promise<T>,
  loadOnMount: boolean = false
): [AsyncState<T>, (...args: any[]) => Promise<T | null>] => {
  const [state, set] = useState<AsyncState<T>>({
    loading: loadOnMount,
  })
  const mounted = useRef(true)

  const doFn = useCallback(
    (...args: any[]) => {
      const inner = async (...args: any[]) => {
        if (mounted.current) set({ loading: true, error: null })
        try {
          const data = await fn(...args)
          if (mounted.current) set({ loading: false, error: null, data: data })
          return data
        } catch (error) {
          if (mounted.current) set({ loading: false, error: error })
          error.retry = () => inner(...args)
          // throw error
          return null
        }
      }
      return inner(...args)
    },
    [set, fn]
  )

  useEffect(() => {
    mounted.current = true
    if (loadOnMount) {
      doFn()
    }
    return () => {
      mounted.current = false
    }
  }, [doFn, loadOnMount])

  return [state, doFn]
}

export default useAsync
