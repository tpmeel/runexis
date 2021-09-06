import React from 'react';
import {useState, useEffect} from 'react'

import {ArcherContainer} from 'react-archer';

import NodeAvatar from "./components/NodeAvatar";
import CustomTable from "./components/CustomTable";

import {Typography, Grid, Button} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { Node, State } from "./types";

const useStyles = makeStyles({
    root: {
        paddingTop: 50,
        paddingBottom: 200,
    },
    buttonPadding: {
        paddingTop: 30,
        paddingBottom: 15,
    },
    tables: {
        paddingLeft: '10%',
        width: 180,
    },
    formControlSpeed: {
        paddingLeft: 10,
    },
    formControlLinks: {
        margin: 10,
        minWidth: 220,
    },
    diagram: {
        height: 500,
        margin: 50,
    },
    diagramCenterNode: {
        display: 'flex',
        justifyContent: 'center',
    },
    diagramSpaceAroundNodes: {
        marginTop: 200,
        marginBottom: 200,
        display: 'flex',
        justifyContent: 'space-between',
    },
});

function App() {

    const classes = useStyles();

    const [isLoaded, setIsLoaded] = useState(false)

    const [state, setState] = useState<State | null>(null);

    const [openDialog, setOpenDialog] = useState({
        isDialogOpenNodes: false,
        isDialogOpenLinks: false,
    });

    const [form, setForm] = useState<Node>({
        name: '',
        ipv4: '',
        mac: '',
        connections: [],
    })

    const [link, setLink] = useState({
        from: '',
        to: '',
        speed: '',
    });

    const [linksTo, setLinksTo] = useState<State | null>(state)

    const closeDialog = () => {
        setOpenDialog({
            isDialogOpenLinks: false,
            isDialogOpenNodes: false,
        });
        setLink({
            from: '',
            to: '',
            speed: '',
        })
    }

    const handleClickOpenDialog = (type: string) => () => {
        if (type === 'nodes') {
            setOpenDialog({
                isDialogOpenLinks: false,
                isDialogOpenNodes: true,
            });
        } else if (type === 'links') {
            setOpenDialog({
                isDialogOpenNodes: false,
                isDialogOpenLinks: true,
            });
        }
    };

    const handleCloseDialog = (type: string) => () => {
        closeDialog()
    };

    const addNode = () => {
        let existedNodeIndex = state?.nodes.findIndex((item) => item.name === form.name)
        if (state!.nodes.length < 4 && existedNodeIndex === -1 && form.name !== '' && form.ipv4 !== '' && form.mac !== '') {
            let temp = {...state} as State;
            temp.nodes.push(form)
            setState({...temp})
        }
        closeDialog()
        setForm({
            name: '',
            ipv4: '',
            mac: '',
            connections: [],
        })
    }

    const deleteNode = (nodeName:string) => {
        let temp = {...state} as State;
        for( let i=0; i<temp.nodes.length; i++ ){
            temp.nodes[i].connections =  temp.nodes[i].connections.filter((connection) => Object.keys(connection)[0] !== nodeName)
        }
        temp.nodes = temp?.nodes.filter(item => item.name !== nodeName);
        setState({...temp})
    }

    const deleteLink = (linkName:string, nodeName:string) => {
        let temp = {...state} as State;
        let tempNodeIndex = temp.nodes.findIndex((item) => item.name === nodeName)
        temp.nodes[tempNodeIndex].connections = temp.nodes
                    .find((item) => item.name === nodeName)?.connections
                    .filter((connection) => Object.keys(connection)[0] !== linkName)!
        setState({...temp})
        console.log(temp)
    }

    const addLink = () => {
        let temp = {...state} as State;
        let existedLinkIndex = temp.nodes
            .find((item) => item.name === link.from)?.connections
            .findIndex((connection) => Object.keys(connection)[0] === link.to)
        if (existedLinkIndex === -1 && link.speed !== '') {
            temp.nodes
                .find((item) => item.name === link.from)?.connections
                .push({[link.to]: link.speed})
            setState({...temp})
        }
        closeDialog()
    }

    const handleChangeInput = (inputName: string) => (e: any) => {
        const value = e.target.value;
        if (inputName === 'speed') {
            setLink(prevState => ({
                ...prevState,
                speed: value
            }))
        } else {
            setForm(prevState => ({
                ...prevState,
                [inputName]: value
            }))
        }
    }

    const filterNodes = (value: string) => {
        let temp = {...state} as State;
        temp.nodes = temp?.nodes.filter(item => item.name !== value);
        setLinksTo({...temp})
    }

    const handleChangeSelect = (selectName: string) => (e: any) => {
        const value = e.target.value;
        if (selectName === 'from' && link.to !== '') {
            setLink(prevState => ({
                ...prevState,
                to: '',
                [selectName]: value
            }))
            filterNodes(value)
        } else if (selectName === 'from' && link.to === '') {
            filterNodes(value)
            setLink(prevState => ({
                ...prevState,
                [selectName]: value
            }))
        } else {
            setLink(prevState => ({
                ...prevState,
                [selectName]: value
            }))
        }
    };


    useEffect(() => {
        //типо данные с бэка
        const data = {
            nodes: [
                {
                    name: 'A',
                    ipv4: 'IP',
                    mac: 'MAC',
                    connections: [
                        {B: '12'},
                        {C: '11'},
                    ],
                },
                {
                    name: 'B',
                    ipv4: 'IP',
                    mac: 'MAC',
                    connections: [
                        {A: '12'},
                        {C: '11'},
                    ],
                },
                {
                    name: 'C',
                    ipv4: 'IP',
                    mac: 'MAC',
                    connections: [
                        {A: '10'},
                        {B: '12'},
                    ],
                },
            ]
        } as State

        setState(data)
        setLinksTo(data)
        setIsLoaded(true)
    }, [])

    if (!isLoaded) {
        return <Typography>Загрузка...</Typography>;
    } else {
        return (
            <Grid container className={classes.root}>
                <Grid item xs={4} className={classes.tables}>
                    <Typography>
                        My topology SPA
                    </Typography>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        className={classes.buttonPadding}
                    >
                        <Grid item>
                            <Typography>
                                Nodes:
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={handleClickOpenDialog('nodes')}>
                                +
                            </Button>
                            <Dialog open={openDialog.isDialogOpenNodes} onClose={handleCloseDialog('nodes')}>
                                <DialogTitle>Add node</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        label="Node name"
                                        fullWidth
                                        onChange={handleChangeInput('name')}
                                    />
                                    <TextField
                                        margin="dense"
                                        label="Node IP"
                                        fullWidth
                                        onChange={handleChangeInput('ipv4')}
                                    />
                                    <TextField
                                        margin="dense"
                                        label="Node MAC"
                                        fullWidth
                                        onChange={handleChangeInput('mac')}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseDialog('nodes')} color="primary">
                                        Cancel
                                    </Button>
                                    <Button onClick={addNode} color="primary">
                                        Add
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Grid>
                    </Grid>
                    <CustomTable data={state} deleteNode={deleteNode} type='nodes'/>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        className={classes.buttonPadding}
                    >
                        <Grid item>
                            <Typography>
                                Links:
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={handleClickOpenDialog('links')}>
                                +
                            </Button>
                            <Dialog open={openDialog.isDialogOpenLinks} onClose={handleCloseDialog('links')}>
                                <DialogTitle id="form-dialog-title">Add link</DialogTitle>
                                <DialogContent>
                                    <form>
                                        <FormControl className={classes.formControlLinks}>
                                            <InputLabel>Link From</InputLabel>
                                            <Select
                                                value={link.from}
                                                onChange={handleChangeSelect('from')}
                                            >
                                                {state?.nodes.map((node: any, i: number) => (
                                                    <MenuItem key={i} value={node.name}>{node.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormControl className={classes.formControlLinks}>
                                            <InputLabel>Link To</InputLabel>

                                            <Select
                                                value={link.to}
                                                onChange={handleChangeSelect('to')}
                                            >
                                                {linksTo?.nodes.map((node: any, i: number) => (
                                                    <MenuItem key={i} value={node.name}>{node.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormControl className={classes.formControlSpeed}>
                                            <TextField
                                                margin="dense"
                                                label="Speed in mbps"
                                                fullWidth
                                                onChange={handleChangeInput('speed')}
                                            />
                                        </FormControl>
                                    </form>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseDialog('links')} color="primary">
                                        Cancel
                                    </Button>
                                    <Button onClick={addLink} color="primary">
                                        Add
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Grid>
                    </Grid>
                    <CustomTable data={state} deleteLink={deleteLink} type='links'/>
                </Grid>

                <Grid item xs={8}>
                    <div className={classes.diagram}>
                        <ArcherContainer>
                            {/* не придумал как нормально вывести в цикле, прошлось захардкодить*/}
                            <div className={classes.diagramCenterNode}>
                                {state!.nodes.length > 0 &&
                                <NodeAvatar data={state} targetAnchor={'top'} sourceAnchor={'bottom'}
                                            numberOfNode={0}/>}
                            </div>
                            <div className={classes.diagramSpaceAroundNodes}>
                                {state!.nodes.length > 1 &&
                                <NodeAvatar data={state} targetAnchor={'left'} sourceAnchor={'right'}
                                            numberOfNode={1}/>}
                                {state!.nodes.length > 2 &&
                                <NodeAvatar data={state} targetAnchor={'right'} sourceAnchor={'left'}
                                            numberOfNode={2}/>}
                            </div>
                            <div className={classes.diagramCenterNode}>
                                {state!.nodes.length > 3 &&
                                <NodeAvatar data={state} targetAnchor={'bottom'} sourceAnchor={'top'}
                                            numberOfNode={3}/>}
                            </div>
                        </ArcherContainer>
                    </div>
                </Grid>
            </Grid>
        );
    }
}

export default App;