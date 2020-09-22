import React, { useState, useEffect, useRef } from "react"

import {
  createIframeClient,
  CompilationFileSources,
  CompilationResult,
} from "@remixproject/plugin"

import { AppContext } from "./AppContext"
import { Routes } from "./routes"

import { Protocol, ProtocolName, ThemeType } from "./types"

import "./App.css"
import { useLocalStorage } from "./hooks/useLocalStorage"

const devMode = { port: 8080 }

const getProtocols = (): Protocol[] => {
  return [
    {
      name: ProtocolName.UMA,
      isInstalled: false,
      description: "Derivatives protocol"
    }, {
      name: ProtocolName.Uniswap,
      isInstalled: false,
      description: "The automatic market maker"
    }
  ]
}

const App = () => {
  const [clientInstance, setClientInstance] = useState(undefined as any)
  const [themeType, setThemeType] = useState("dark" as ThemeType)
  // @dev protocols: Protocol[]; setProtocols: (Protocol[])
  const [protocols, setProtocols] = useLocalStorage("protocols", [] as Protocol[])
  const [protocolsInstalled, setProtocolsInstalled] = useLocalStorage("protocolsInstalled", [] as Protocol[])

  const clientInstanceRef = useRef(clientInstance)
  clientInstanceRef.current = clientInstance

  useEffect(() => {
    console.log("Remix Defi Explorer loading...")
    const client = createIframeClient({ devMode })
    const loadClient = async () => {
      await client.onload()
      setClientInstance(client)
      console.log("Remix Defi Explorer Plugin has been loaded")
      const currentTheme = await client.call("theme", "currentTheme")
      setThemeType(currentTheme.quality)
      client.on("theme", "themeChanged", (theme) => {
        setThemeType(theme.quality)
      })
    }

    const loadProtocols = () => {
      console.log("Calling load protocols")
      const allProtocolsTyped = protocols as unknown as Protocol[]
      console.log("allProtocolsTyped.length", allProtocolsTyped.length)

      console.log("allProtocolsTyped", allProtocolsTyped)

      console.log("allProtocolsTyped", JSON.stringify(allProtocolsTyped))
      if (allProtocolsTyped.length === 0) {
        const allProtocols: Protocol[] = getProtocols()
        setProtocols(allProtocols)
      }
    }

    loadProtocols()
    loadClient()
  }, [])

  return (
    <AppContext.Provider
      value={{
        clientInstance,
        protocols,
        setProtocols,
        themeType,
        setThemeType,
        setProtocolsInstalled,
        protocolsInstalled
      }}
    >
      <Routes />
    </AppContext.Provider>
  )
}

export default App
