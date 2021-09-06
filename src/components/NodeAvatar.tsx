import React from 'react'
import {ArcherElement} from "react-archer";
import Avatar from '@material-ui/core/Avatar';
import {Connection} from "../types";

function NodeAvatar(props:any) {

    return(
        <ArcherElement
            id={`${props?.data.nodes[props.numberOfNode].name}`}
            relations={props?.data.nodes[props.numberOfNode].connections.map((connection:Connection) => {
                const [key, value] = Object.entries(connection)[0]
                return(
                    {
                        targetId: key,
                        targetAnchor: props.targetAnchor,
                        sourceAnchor: props.sourceAnchor,
                        style: { strokeColor: 'blue', strokeWidth: 1 },
                       // label: <div style={{ marginTop: '-20px' }}>{value}</div>,
                    }
                )
            })}
        >
            <div>
                <Avatar> {props?.data.nodes[props.numberOfNode].name} </Avatar>
            </div>
        </ArcherElement>
    )
}

export default NodeAvatar
