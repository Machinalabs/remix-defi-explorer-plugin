import React from "react"
import { PluginApi, IRemixApi, Api, PluginClient } from "@remixproject/plugin"

import { Protocol, ThemeType } from "./types"

export const AppContext = React.createContext({
  clientInstance: {} as PluginApi<Readonly<IRemixApi>> &
    PluginClient<Api, Readonly<IRemixApi>>,
  protocols: [] as Protocol[],
  setProtocols: (protocols: Protocol[]) => {
    console.log("Calling Set Protocols")
  },
  themeType: "dark" as ThemeType,
  setThemeType: (themeType: ThemeType) => {
    console.log("Calling Set Theme Type")
  },
})
