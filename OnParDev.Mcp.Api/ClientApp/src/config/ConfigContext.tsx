import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'
import { ConfigApi } from '../api/apis/ConfigApi'
import { ConfigResponse } from '../api/models/ConfigResponse'

const api = new ConfigApi()

export type Config = ConfigResponse

const ConfigContext = createContext<Config | undefined>(undefined)

export const ConfigProvider: FC<{ children: ReactNode; initialConfig?: Config }> = ({ children, initialConfig }) => {
  const [config, setConfig] = useState<Config | undefined>(initialConfig)

  useEffect(() => {
    if (!initialConfig) {
      api.getConfig().then(setConfig)
    }
  }, [initialConfig])

  if (!config) return null

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
}

export const useConfig = () => {
  const ctx = useContext(ConfigContext)
  if (!ctx) throw new Error('Config not loaded')
  return ctx
}
