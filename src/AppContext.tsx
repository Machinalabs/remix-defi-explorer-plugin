import React from "react"
import { PluginApi, IRemixApi, Api, PluginClient } from "@remixproject/plugin"

import { ThemeType } from "./types"

export const AppContext = React.createContext({
  clientInstance: {} as PluginApi<Readonly<IRemixApi>> &
    PluginClient<Api, Readonly<IRemixApi>>,
  contracts: [] as string[],
  setContracts: (contracts: string[]) => {
    console.log("Calling Set Contract Names")
  },
  themeType: "dark" as ThemeType,
  setThemeType: (themeType: ThemeType) => {
    console.log("Calling Set Theme Type")
  },
})
