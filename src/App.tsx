import React, { useState, useEffect, useRef } from "react"

import {
  createIframeClient,
  CompilationFileSources,
  CompilationResult,
} from "@remixproject/plugin"

import { AppContext } from "./AppContext"
import { Routes } from "./routes"

import { useLocalStorage } from "./hooks/useLocalStorage"

import { getReceiptStatus, getEtherScanApi, getNetworkName } from "./utils"
import { Receipt, ThemeType } from "./types"

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
  const [apiKey, setAPIKey] = useLocalStorage("apiKey", "")
  const [clientInstance, setClientInstance] = useState(undefined as any)
  const [receipts, setReceipts] = useLocalStorage("receipts", [])
  const [contracts, setContracts] = useState([] as string[])
  const [themeType, setThemeType] = useState("dark" as ThemeType)

  const clientInstanceRef = useRef(clientInstance)
  clientInstanceRef.current = clientInstance
  const contractsRef = useRef(contracts)
  contractsRef.current = contracts

  useEffect(() => {
    console.log("Remix Etherscan loading...")
    const client = createIframeClient({ devMode })
    const loadClient = async () => {
      await client.onload()
      setClientInstance(client)
      console.log("Remix Etherscan Plugin has been loaded")

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

  useEffect(() => {
    if (!clientInstance) {
      return
    }

    const receiptsNotVerified: Receipt[] = receipts.filter((item: Receipt) => {
      return item.status !== "Verified"
    })

    if (receiptsNotVerified.length > 0) {
      let timer1 = setInterval(() => {
        receiptsNotVerified.forEach(async (item) => {
          if (!clientInstanceRef.current) {
            return
          }
          const network = await getNetworkName(clientInstanceRef.current)
          if (network === "vm") {
            return
          }
          const status = await getReceiptStatus(
            item.guid,
            apiKey,
            getEtherScanApi(network)
          )
          if (status === "Pass - Verified") {
            const newReceipts = receipts.map((currentReceipt: Receipt) => {
              if (currentReceipt.guid === item.guid) {
                return {
                  ...currentReceipt,
                  status: "Verified",
                }
              }
              return currentReceipt
            })

            clearInterval(timer1)

            setReceipts(newReceipts)

            return () => {
              clearInterval(timer1)
            }
          }
        })
      }, 5000)
    }
  }, [receipts, clientInstance, apiKey, setReceipts])

  return (
    <AppContext.Provider
      value={{
        apiKey,
        setAPIKey,
        clientInstance,
        receipts,
        setReceipts,
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
