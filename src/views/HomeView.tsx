import React, { useContext, useEffect } from "react"

import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

import { AppContext } from "../AppContext"

import UniswapContracts from '../contracts/uniswap.json'
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Protocol, ProtocolName } from "../types";


export const HomeView: React.FC = () => {
  const { clientInstance } = useContext(AppContext)

  const installUniswap = () => {
    Object.keys(UniswapContracts).map(async (item) => {
      const contractName = item as any;
      const contracts = UniswapContracts as { [key: string]: any }
      const fileName = contracts[contractName]
      console.log("Filename", fileName)

      const { content } = await clientInstance.contentImport.resolve(fileName)
      console.log("Content", content)

      console.log("clientInstance.fileManager as any)", clientInstance.fileManager)
      await (clientInstance.fileManager as any).setFile(`browser/uniswap/${contractName}`, `${content}`)

      // write deploy file
    })
  }

  const installUMA = () => {
    console.log("Installing UMA")
  }

  const install = (name: ProtocolName) => {
    console.log("About to install")
    switch (name) {
      case ProtocolName.Uniswap:
        installUniswap()
      case ProtocolName.UMA:
        installUMA()
    }
  }

  // const [hasError, setHasError] = useState(false)

  // const installedProtocols: Protocol[] = getProtocols().filter((item) => item.isInstalled === true)
  // const nonInstalledProtocols: Protocol[] = getProtocols().filter((item) => item.isInstalled === false)

  const { protocolsInstalled, protocols } = useContext(AppContext)

  return (
    <div>
      <header className="form-group plugins-header py-3 px-4 border-bottom">
        <input className="form-control" placeholder="Search" />
      </header>
      <section>
        <ActiveTile />
        <div className="list-group list-group-flush plugins-list-group">
          {protocolsInstalled.map((item: Protocol) => {
            return (
              <article key={item.name} className="list-group-item py-1 plugins-list-group-item" title={item.name} >
                <div className="justify-content-between align-items-center mb-2" style={{ display: "flex", flexDirection: "row" }}>
                  <h6 className="plugin-name">
                    {item.name}
                  </h6>
                  <ActivationButton isInstalled={item.isInstalled} />
                </div>
                <p className="text-body plugin-text">{item.description}</p>
              </article>
            )
          })}
        </div>
        <InactiveTile />
        <div className="list-group list-group-flush plugins-list-group">
          {protocols.filter(s => protocolsInstalled.find(item => item.name == s.name) ? false : true).map((item: Protocol) => {
            return (
              <article key={item.name} className="list-group-item py-1 plugins-list-group-item" title={item.name} >
                <div className="justify-content-between align-items-center mb-2" style={{ display: "flex", flexDirection: "row" }}>
                  <h6 className="plugin-name">
                    {item.name}
                  </h6>
                  <ActivationButton isInstalled={item.isInstalled} />
                </div>
                <p className="text-body plugin-text">{item.description}</p>
              </article>
            )
          })}      </div>
      </section>
    </div>
  )
}


const ActiveTile: React.FC = () => {
  return (
    <nav className="plugins-list-header justify-content-between navbar navbar-expand-lg bg-light navbar-light align-items-center">
      <span className="navbar-brand plugins-list-title">Active protocols</span>
    </nav>
  )
}

const InactiveTile: React.FC = () => {
  return (
    <nav className="plugins-list-header justify-content-between navbar navbar-expand-lg bg-light navbar-light align-items-center">
      <span className="navbar-brand plugins-list-title h6 mb-0 mr-2">Inactive Protocols</span>
    </nav>
  )
}

const ActivationButton: React.FC<{ isInstalled: boolean }> = ({ isInstalled }) => {
  const { setProtocolsInstalled } = useContext(AppContext)

  const { clientInstance } = useContext(AppContext)

  const installUniswap = () => {
    Object.keys(UniswapContracts).map(async (item) => {
      const contractName = item as any;
      const contracts = UniswapContracts as { [key: string]: any }
      const fileName = contracts[contractName]
      console.log("Filename", fileName)

      const { content } = await clientInstance.contentImport.resolve(fileName)
      console.log("Content", content)

      console.log("clientInstance.fileManager as any)", clientInstance.fileManager)
      await (clientInstance.fileManager as any).setFile(`browser/uniswap/${contractName}`, `${content}`)

      // write deploy file
    })
  }


  const uninstall = () => {
    console.log("uninstall")
  }

  return (
    isInstalled ?
      <button
        style={{ width: "5rem" }}
        onClick={() => installUniswap()}
        className="btn btn-secondary btn-sm">
        Uninstall
    </button>
      : <button
        style={{ width: "5rem" }}
        onClick={() => installUniswap()}
        className="btn btn-success btn-sm">
        Install
      </button>)
}

interface RootViewProps {
  installedProtocols: Protocol[]
  nonInstalledProtocols: Protocol[]
}