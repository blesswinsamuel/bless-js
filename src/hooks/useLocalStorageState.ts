import { useCallback, useMemo, useState } from 'react'
import useThrottle from './useThrottle'

const PREFIX = 'bible:'

const ls = {
  getItem(key, defaultValue) {
    try {
      const token = localStorage.getItem(PREFIX + key)
      return token ? JSON.parse(token) : defaultValue
    } catch (err) {
      console.warn(`Failed to parse ${key}: ${err}`)
      return defaultValue
    }
  },

  saveItem(key, value) {
    try {
      if (value !== undefined) {
        localStorage.setItem(PREFIX + key, JSON.stringify(value))
      } else {
        localStorage.removeItem(PREFIX + key)
      }
    } catch (err) {
      console.warn(`Failed to save ${key}: ${err}`)
    }
  },
}

function useLocalStorageState(key, initialValue) {
  const lsState = useMemo(() => ls.getItem(key, initialValue), [
    key,
    initialValue,
  ])
  const [state, setState] = useState(lsState)
  const updateLocalStorageState = useCallback(() => {
    ls.saveItem(key, state)
  }, [key, state])
  useThrottle(updateLocalStorageState, 1000)
  return [state, setState]
}

export default useLocalStorageState
