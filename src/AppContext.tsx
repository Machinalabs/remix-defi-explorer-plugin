import React from "react"
import {  PluginClient } from "@remixproject/plugin"
import { PluginApi, Api } from "@remixproject/plugin-utils";
import { IRemixApi } from "@remixproject/plugin-api";

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
