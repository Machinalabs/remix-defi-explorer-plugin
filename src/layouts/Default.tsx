import React, { PropsWithChildren } from "react"

interface Props {
  from: string
}

export const DefaultLayout: React.FC<PropsWithChildren<Props>> = ({
  children,
  from,
}) => {
  return <div>{children}</div>
}
