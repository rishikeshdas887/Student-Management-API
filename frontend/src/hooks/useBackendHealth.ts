import { useState, useEffect, useCallback } from 'react'
import { studentApi } from '../services/api'
import type { HealthResponse } from '../types/student'

export interface HealthState {
  isChecking: boolean
  isConnected: boolean
  lastChecked: Date | null
  error: string | null
  data: HealthResponse | null
}

export function useBackendHealth(pollIntervalMs = 30000) {
  const [health, setHealth] = useState<HealthState>({
    isChecking: true,
    isConnected: false,
    lastChecked: null,
    error: null,
    data: null,
  })

  const checkHealth = useCallback(async () => {
    setHealth((prev) => ({ ...prev, isChecking: true }))
    try {
      const res = await studentApi.getHealth()
      setHealth({
        isChecking: false,
        isConnected: res.status === 'ok' && res.database === 'connected',
        lastChecked: new Date(),
        error: null,
        data: res,
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Backend unreachable'
      setHealth({
        isChecking: false,
        isConnected: false,
        lastChecked: new Date(),
        error: msg,
        data: null,
      })
    }
  }, [])

  useEffect(() => {
    checkHealth()
    const timer = setInterval(checkHealth, pollIntervalMs)
    return () => clearInterval(timer)
  }, [checkHealth, pollIntervalMs])

  return { ...health, recheck: checkHealth }
}
