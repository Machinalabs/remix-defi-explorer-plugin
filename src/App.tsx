import React, { useState, useEffect, useRef } from "react"

import {
  createIframeClient,
  CompilationFileSources,
  CompilationResult,
} from "@remixproject/plugin"

import { AppContext } from "./AppContext"
import { Routes } from "./routes"

import { useLocalStorage } from "./hooks/useLocalStorage"

import { getNetworkName } from "./utils"
import { ThemeType } from "./types"

import "./App.css"

const devMode = { port: 8080 }

export const getNewContractNames = (compilationResult: CompilationResult) => {
  const compiledContracts = compilationResult.contracts
  let result: string[] = []

  for (const file of Object.keys(compiledContracts)) {
    const newContractNames = Object.keys(compiledContracts[file])
    result = [...result, ...newContractNames]
  }

  return result
}

const App = () => {
  const [clientInstance, setClientInstance] = useState(undefined as any)
  const [contracts, setContracts] = useState([] as string[])
  const [themeType, setThemeType] = useState("dark" as ThemeType)

  const clientInstanceRef = useRef(clientInstance)
  clientInstanceRef.current = clientInstance
  const contractsRef = useRef(contracts)
  contractsRef.current = contracts

  useEffect(() => {
    console.log("Remix Defi Explorer loading...")
    const client = createIframeClient({ devMode })
    const loadClient = async () => {
      await client.onload()
      setClientInstance(client)
      console.log("Remix Defi Explorer Plugin has been loaded")

      client.solidity.on(
        "compilationFinished",
        (
          fileName: string,
          source: CompilationFileSources,
          languageVersion: string,
          data: CompilationResult
        ) => {
          console.log("New compilation received")
          const newContractsNames = getNewContractNames(data)

          const newContractsToSave: string[] = [
            ...contractsRef.current,
            ...newContractsNames,
          ]

          const uniqueContracts: string[] = [...new Set(newContractsToSave)]

          setContracts(uniqueContracts)
        }
      )

      const currentTheme = await client.call("theme", "currentTheme")
      setThemeType(currentTheme.quality)
      client.on("theme", "themeChanged", (theme) => {
        setThemeType(theme.quality)
      })
    }

    loadClient()
  }, [])


  return (
    <AppContext.Provider
      value={{
        clientInstance,
        contracts,
        setContracts,
        themeType,
        setThemeType,
      }}
    >
      <Routes />
    </AppContext.Provider>
  )
}

export default App
