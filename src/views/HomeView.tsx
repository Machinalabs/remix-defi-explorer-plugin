import React, { useContext } from "react"

import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

import { AppContext } from "../AppContext"

import UniswapContracts from '../contracts/uniswap.json'

enum ProtocolName {
  UMA = "UMA",
  Uniswap = "Uniswap"
}

interface Protocol {
  name: ProtocolName
  isInstalled: boolean
  description: string
}

const getProtocols = (): Protocol[] => {
  return [{
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
      await (clientInstance.fileManager as any).setFile(`browser/uniswap/${contractName}.sol`, `${content}`)

      // write deploy file
    })
  }

  const install = (name: ProtocolName) => {
    console.log("About to install")
    switch (name) {
      case ProtocolName.Uniswap:
        installUniswap()
      // case ProtocolName.UMA:
      //   installUMA()
    }
  }

  // const [hasError, setHasError] = useState(false)

  return (
    <AppContext.Consumer>
      {({ clientInstance, contracts }) => (
        <ListGroup>
          {getProtocols().map((item, index) => {
            return (
              <ListGroup.Item key={index}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <h6 className="plugin-name">{item.name}</h6>
                  <button className="btn btn-success btn-sm" onClick={() => install(item.name)}>{item.isInstalled ? "Uninswall" : "Install"}</button>
                </div>
                <p className="text-body plugin-text">{item.description}</p>
              </ListGroup.Item>
            )
          })}
        </ListGroup>

      )}
    </AppContext.Consumer>
  )
}
