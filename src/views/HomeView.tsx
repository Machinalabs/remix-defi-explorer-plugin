import React from "react"

import { AppContext } from "../AppContext"


export const HomeView: React.FC = () => {
  // const [hasError, setHasError] = useState(false)
  return (
    <AppContext.Consumer>
      {({ clientInstance, contracts }) =>
        <h1>Home</h1>
      }
    </AppContext.Consumer>
  )
}
