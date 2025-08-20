import React from 'react'

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = React.useState(() => {
    try {
      const json = localStorage.getItem(key)
      return json != null ? JSON.parse(json) : initialValue
    } catch {
      return initialValue
    }
  })

  React.useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore write errors (e.g., storage full)
    }
  }, [key, value])

  return [value, setValue]
}
