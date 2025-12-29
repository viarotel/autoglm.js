import type { AgentConfigType, DeviceInfo, EventData } from 'autoglm.js'
import type { ReactNode } from 'react'
import type { AgentContextValue, AgentEvent } from '@/config/types'
import { AutoGLM, EventType } from 'autoglm.js'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

const AgentContext = createContext<AgentContextValue | null>(null)

export function useAgentContext(): AgentContextValue {
  const context = useContext(AgentContext)
  if (!context) {
    throw new Error('useAgentContext must be used within an AgentProvider')
  }
  return context
}

interface AgentProviderProps {
  children: ReactNode
  config: AgentConfigType
}

export function AgentProvider({ children, config }: AgentProviderProps) {
  const navigate = useNavigate()
  const [isRunning, setIsRunning] = useState(false)
  const [currentTask, setCurrentTask] = useState<string | null>(null)
  const [events, setEvents] = useState<AgentEvent[]>([])
  const [version, setVersion] = useState<string>('Loading...')
  const [devices, setDevices] = useState<DeviceInfo[]>([])
  const [systemCheck, setSystemCheck] = useState<boolean | null>(null)
  const [apiCheck, setApiCheck] = useState<boolean | null>(null)
  const [currentDeviceId, setCurrentDeviceId] = useState<string | undefined>(config.deviceId)

  const agentRef = useRef<AutoGLM | null>(null)
  const cleanupRef = useRef<(() => void)[]>([])

  useEffect(() => {
    const agent = new AutoGLM(config)

    agentRef.current = agent

    const handleAllEvents = (type: EventType, data: EventData) => {
      if (type === EventType.START) {
        const message = data.message
        setCurrentTask(String(message))
        setIsRunning(true)
      }
      if (type === EventType.TASK_COMPLETE || type === EventType.ERROR || type === EventType.ABORTED) {
        setIsRunning(false)
      }

      setEvents(prev => [
        ...prev,
        {
          type,
          data: data.message ?? data,
          time: data.time,
          deviceId: agentRef.current?.config.deviceId,
        },
      ])
    }

    agent.on('*', handleAllEvents)

    cleanupRef.current.push(() => {
      agent.off('*', handleAllEvents)
    })

    const initializeAgent = async () => {
      try {
        const [versionInfo, deviceList] = await Promise.all([
          agent.adb.getVersion(),
          agent.adb.getConnectedDevices(),
        ])
        setVersion(versionInfo.success ? `v${versionInfo.version || 'Not Installed'}` : 'Not Installed')
        setDevices(deviceList)
        if (deviceList.length > 0) {
          agent.updateConfig({
            deviceId: deviceList[0].deviceId,
          })
          setCurrentDeviceId(deviceList[0].deviceId)
        }
      }
      catch {
        setVersion('Error')
        setDevices([])
      }
      try {
        const [systemResult, apiResult] = await Promise.all([
          agent.checkSystemRequirements(),
          agent.checkModelApi(),
        ])
        setSystemCheck(systemResult.success)
        setApiCheck(apiResult.success)
      }
      catch {
        setSystemCheck(false)
        setApiCheck(false)
      }
    }

    initializeAgent()

    return () => {
      cleanupRef.current.forEach(cleanup => cleanup())
      cleanupRef.current = []
    }
  }, [config])

  const run = useCallback(async (query: string) => {
    const agent = agentRef.current
    if (!agent) {
      throw new Error('Agent not initialized')
    }
    setEvents([])
    await agent.run(query)
  }, [])

  const abort = useCallback((reason?: string) => {
    const agent = agentRef.current
    if (agent) {
      agent.abort(reason)
    }
  }, [])

  const stop = useCallback(() => {
    setIsRunning(false)
    setCurrentTask(null)
  }, [])

  const clearEvents = useCallback(() => {
    setEvents([])
  }, [])

  const refreshDevices = useCallback(async () => {
    const agent = agentRef.current
    if (!agent)
      return
    try {
      const deviceList = await agent.adb.getConnectedDevices()
      setDevices(deviceList)
    }
    catch {
      setDevices([])
    }
  }, [])

  const checkSystem = useCallback(async () => {
    const agent = agentRef.current
    if (!agent) {
      setSystemCheck(false)
      return
    }
    try {
      const result = await agent.checkSystemRequirements()
      setSystemCheck(result.success)
    }
    catch {
      setSystemCheck(false)
    }
  }, [])

  const checkApi = useCallback(async () => {
    const agent = agentRef.current
    if (!agent) {
      setApiCheck(false)
      return
    }
    try {
      const result = await agent.checkModelApi()
      setApiCheck(result.success)
    }
    catch {
      setApiCheck(false)
    }
  }, [])

  const getConfig = useCallback(() => {
    return agentRef.current?.config || config
  }, [])

  const updateConfig = useCallback((newConfig: Partial<AgentConfigType>) => {
    const agent = agentRef.current
    if (agent) {
      agent.updateConfig(newConfig)
      if (newConfig.deviceId !== undefined) {
        setCurrentDeviceId(newConfig.deviceId)
      }
    }
  }, [])

  const value: AgentContextValue = {
    events,
    version,
    devices,
    apiCheck,
    isRunning,
    currentTask,
    systemCheck,
    currentDeviceId,
    abort,
    run,
    stop,
    checkApi,
    navigate,
    getConfig,
    clearEvents,
    checkSystem,
    updateConfig,
    refreshDevices,
  }

  return (
    <AgentContext.Provider value={value}>
      {children}
    </AgentContext.Provider>
  )
}
