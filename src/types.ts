export interface Connection {
    [key: string]: string
}

export interface Node {
    name: string,
    ipv4: string,
    mac: string,
    connections: Connection[]
}

export interface State {
    nodes: Node[]
}