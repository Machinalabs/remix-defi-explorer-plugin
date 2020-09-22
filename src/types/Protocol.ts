export enum ProtocolName {
    UMA = "UMA",
    Uniswap = "Uniswap"
}

export interface Protocol {
    name: ProtocolName
    isInstalled: boolean
    description: string
}
