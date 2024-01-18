import { useState, useEffect } from 'react'

interface TimerProps {
  duration: number
  onTick: (value: number) => void
}

const useTimer = ({ duration = 0, onTick }: TimerProps) => {
  const [timer, setTimer] = useState<number>(0)
  const [timeOut, setTimeOut] = useState<number>(0)

  useEffect(() => {
    setTimeOut(((new Date().getTime() / 1000) | 0) + duration)
    setTimer(duration)
    tick
    return () => {
      if (timeOut) {
        clearTimeout(timeOut)
      }
    }
  }, [])

  useEffect(() => {
    if (timer !== 0) {
      onTick(timer)
    }
  })

  const tick = () => {
    if (timeOut) {
      clearTimeout(timeOut)
    }
    if (timer > 0) {
      setTimeout(() => {
        setTimer(timeOut - ((new Date().getTime() / 1000) | 0))
        tick
      }, 1000)
    }
  }
}

export default useTimer
