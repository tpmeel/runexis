import React from 'react'
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import {Connection} from "../types";

interface Node {
    name: string,
    ipv4: string,
    mac: string,
    connections: Connection[]
}

function CustomTable(props: any) {

    function viewContent(node: Node) {
        if (props.type === 'nodes') {
            return (
                <TableRow key={node.name}>
                    <TableCell component="th" scope="row" align="center">
                        <Typography>
                            {`${node.name} : ${node.ipv4} : ${node.mac}`}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Button variant="outlined" color="secondary" onClick={() => props.deleteNode(node.name)}>
                            -
                        </Button>
                    </TableCell>
                </TableRow>
            )
        } else if (props.type === 'links' && node.connections.length !== 0) {
            return (
                <TableRow key={node.name}>
                    <TableCell component="th" scope="row" align="center">
                        {node.connections.map((item, i: number) => (
                            <Grid
                                container
                                direction="row"
                                justifyContent="space-around"
                                alignItems="center"
                                key={i}
                            >
                                <Grid item>
                                    <Typography>
                                        {`${node.name} -> ${Object.keys(item)[0]} : ${Object.values(item)[0]} mbps`}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Button variant="outlined" color="secondary"
                                            onClick={() => props.deleteLink(Object.keys(item)[0], node.name)}>
                                        -
                                    </Button>
                                </Grid>
                            </Grid>

                        ))}
                    </TableCell>
                </TableRow>
            )
        } else {
            return null
        }
    }
    return (
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        {props.data.nodes.map((node: Node) => (
                            viewContent(node)
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
export default CustomTable