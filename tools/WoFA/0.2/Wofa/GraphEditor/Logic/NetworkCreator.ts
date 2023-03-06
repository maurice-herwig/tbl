import type {Graph} from "../Models";
import {convertGraphToVis, convertWoFAModelToGraph, convertGraphToWofaModel, convertNodeGraphToVis} from "./Converter"
import {DataSet} from "vis-data";
import {Network} from 'vis-network';
import type {Options} from 'vis-network';
import type {Node as NodeVis, Edge as EdgeVis} from 'vis-network';
import {EmptyGraph} from "../Examples/exampleGraphs";
import type {Edge, Node} from "../Models";


export class NetworkGraph {

    public selectedOperation: string = 'nothingSelected';

    private networkInstance: Network | undefined;
    private nodes: any = new DataSet<NodeVis>();
    private edges: any = new DataSet<EdgeVis>();
    private graph: Graph;
    private element: HTMLElement;

    private readonly openNodeDialogFunction: Function;
    private readonly openEdgeDialogFunction: Function;
    private updateAutomaton: Function;

    public nodeCounterId: number = 1
    public edgeCounterId: number = 1


    constructor(automaton: string, element: Object, openNodeDialogFunction: Function, openEdgeDialogFunction: Function,
                updateAutomaton: Function) {

        this.graph = convertWoFAModelToGraph(automaton)
        this.element = <HTMLElement>element
        this.openNodeDialogFunction = openNodeDialogFunction
        this.openEdgeDialogFunction = openEdgeDialogFunction
        this.updateAutomaton = updateAutomaton
    }

    createNetwork() {
        // convert the graph to a valid vis input
        const data = convertGraphToVis(this.graph)

        // set the edges and nodes
        this.nodes = data.nodes;
        this.edges = data.edges;

        // init variables
        const classGlobalThis = this;
        this.nodeCounterId = this.nodes.length + 1;
        this.edgeCounterId = this.edges.length + 1;

        // Add options to the graph
        const options: Options = {
            height: '300px',
            edges: {
                hidden: false,
                font: {align: 'middle'},
                arrows: {to: true},
                color: "#000000"
            },
            nodes: {
                hidden: false,
                borderWidth: 2,
                borderWidthSelected: 4,
                color: "#ffffff",
            },
            physics: {
                enabled: true,
                solver: 'repulsion',
                barnesHut: {
                    avoidOverlap: 0.1,
                    springConstant: 0,
                }
            },
            interaction: {
                hover: true
            },
            manipulation: {
                enabled: false,
                addEdge: function (data: any, callback: any) {
                    if (classGlobalThis.edges && data['to'] != -1 && data['from'] != -1) {
                        let edgeExists = false;
                        // @ts-ignore
                        for (let exEdge of classGlobalThis.graph.Edges) {
                            if (exEdge.From == data['from'] && exEdge.To == data['to']) {
                                edgeExists = true;
                                break;
                            }
                        }
                        if (!edgeExists) {
                            if (classGlobalThis.nodes) {
                                data['id'] = classGlobalThis.edgeCounterId;
                                classGlobalThis.edgeCounterId++;
                            }
                            callback(data);
                            classGlobalThis.graph.Edges.push({
                                From: data['from'],
                                To: data['to'],
                                Id: data['id'],
                                Labels: []
                            });
                            classGlobalThis.openEdgeDialog({
                                edges: [data['id']],
                                nodes: [],
                                pointer: {
                                    DOM: {
                                        x: (window.innerWidth * 0.9) / 2,
                                        y: (window.innerHeight * 0.9) / 2,
                                    }
                                }
                            });
                        }
                    }
                    if (classGlobalThis.networkInstance) classGlobalThis.networkInstance.addEdgeMode();
                },
                addNode: function (data: any, callback: any) {
                    if (classGlobalThis.nodes) {
                        data['label'] = "q" + classGlobalThis.nodeCounterId;
                        data['id'] = classGlobalThis.nodeCounterId;
                        classGlobalThis.nodeCounterId++;
                    }
                    callback(data);
                    classGlobalThis.addNode(data, false);
                    if (classGlobalThis.networkInstance) classGlobalThis.networkInstance.addNodeMode();
                }

            }
        }

        // generate the network
        this.networkInstance = new Network(this.element, data, options);

        // Add network event by select a Node
        this.networkInstance.on('selectNode', params => {
            if (params['nodes'].length == 1) {
                if (this.selectedOperation == "delete" && params['nodes'][0] != -1) {
                    this.deleteNode(params['nodes'][0]);
                } else if (this.selectedOperation == "nothingSelected" && params['nodes'][0] != -1) {
                    this.openNodeDialog(params)
                }
            }
        });

        // Add network event by select an Edge
        this.networkInstance.on('selectEdge', params => {
            if (params['edges'].length == 1) {
                if (this.selectedOperation == "delete" && params['edges'][0] > -1) {
                    this.deleteEdgeById(params['edges'][0]);
                } else if (this.selectedOperation == "nothingSelected" && params['edges'][0] > -1) {
                    this.openEdgeDialog(params)
                }
            }
        });

        // Add event before drawing, to draw the states
        this.networkInstance.on("beforeDrawing", ctx => {
            classGlobalThis.drawFinalStates(ctx);
            classGlobalThis.drawInitStates(ctx);
        });

        // Add event to set the Mode
        this.networkInstance.on("oncontext", () => {
            this.setModeNull();
        });


    }

    //____________________Swap Mode____________________
    changeMode() {
        if (!this.networkInstance) return;

        if (this.selectedOperation == "node") {
            this.networkInstance.addNodeMode();
        } else if (this.selectedOperation == "edge") {
            this.networkInstance.addEdgeMode();
        } else {
            this.networkInstance.enableEditMode();
        }
    }

    setModeNull() {
        this.selectedOperation = 'nothingSelected';
        this.changeMode();
    }

    addNewNodes() {
        if (this.selectedOperation == "node") {
            this.selectedOperation = 'nothingSelected';
        } else {
            this.selectedOperation = 'node'
        }
        this.changeMode();
    }

    addNewEdges() {
        if (this.selectedOperation == "edge") {
            this.selectedOperation = 'nothingSelected';
        } else {
            this.selectedOperation = 'edge'
        }
        this.changeMode();
    }

    deleteNodeEdge() {
        if (this.selectedOperation == "delete") {
            this.selectedOperation = 'nothingSelected';
        } else {
            this.selectedOperation = 'delete'
        }
        this.changeMode();
    }

    //____________________Node Dialog____________________
    private openNodeDialog(params: any) {
        if (params['nodes'].length != 1) {
            console.error("More than one state was selected.")
            return
        }

        // Get the position of the node
        const position = params['nodes'][0]
        let node = null;

        // find the selected node
        for (const currentNode of this.graph.Nodes || []) {
            if (currentNode.Id == position) {
                node = currentNode;
                break
            }
        }

        // check if the node was found
        if (node == null) {
            console.error("State does not exist in the data model.")
        }


        this.openNodeDialogFunction(node)

    }

    closeNodeDialog(node: Node) {
        // update the network labels
        let selectedNode = null;
        for (let tmpNode of this.nodes.get()) {
            if (tmpNode['id'] == node.Id) {
                selectedNode = tmpNode;
                break;
            }
        }

        if (selectedNode) selectedNode = convertNodeGraphToVis(node)
        this.nodes.update(selectedNode)

        // unselect all components of the network graph
        this.networkInstance?.unselectAll()

        // update the automaton
        this.updateAutomaton(convertGraphToWofaModel(this.graph))
    }

    //____________________Edge Dialog____________________
    private openEdgeDialog(params: any) {
        if (!(params['edges'].length == 1 && params['nodes'].length == 0)) {
            console.error("Not only one edge was selected.")
        }

        let edge = null;

        // find the selected node
        for (const i in this.graph.Edges) {
            const currentEdge = this.graph.Edges[i]
            if (currentEdge.Id == params['edges'][0]) {
                edge = currentEdge;
                break
            }
        }

        // check if the edge was found
        if (edge == null) {
            console.error("Edge does not exist in the data model.")
        }


        this.openEdgeDialogFunction(edge)


    }

    closeEdgeDialog(edge: Edge) {
        // update the network labels
        let selectedEdge = null;
        for (let tmpEdge of this.edges.get()) {
            if (tmpEdge['id'] == edge.Id) {
                selectedEdge = tmpEdge;
                break;
            }
        }
        if (selectedEdge) selectedEdge.label = edge.Labels.join(' | ')

        this.edges.update(selectedEdge)

        // unselect all components of the network graph
        this.networkInstance?.unselectAll()

        // update the automaton
        this.updateAutomaton(convertGraphToWofaModel(this.graph))
    }

    //____________________Graph Operation____________________

    private drawFinalStates(ctx: any) {
        let modelNodes = this.graph.Nodes;
        let idsOfFinalStates = [];
        let finalStatesLabelsById = {};

        for (let modelNode of modelNodes) {
            if (modelNode.IsFinal) {
                idsOfFinalStates.push(modelNode.Id);
                // @ts-ignore
                finalStatesLabelsById[modelNode.Id] = modelNode.Name;
            }
        }

        if (idsOfFinalStates.length) {
            let positionByNodeId = this.networkInstance?.getPositions(idsOfFinalStates);
            if (positionByNodeId) {
                for (let id of idsOfFinalStates) {
                    // @ts-ignore
                    let name = finalStatesLabelsById[id] || "";
                    let textWidth = 10 + ctx.measureText(name).width;
                    ctx.strokeStyle = "#000000"
                    ctx.fillStyle = "#ffffff"
                    ctx.lineWidth = 2;

                    ctx.beginPath()
                    ctx.ellipse(
                        positionByNodeId[id].x,
                        positionByNodeId[id].y,
                        textWidth > 20 ? textWidth : 20,
                        20,
                        0,
                        2 * Math.PI,
                        false
                    );
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
            }
        }
    }

    private drawInitStates(ctx: any) {
        let modelNodes = this.graph.Nodes;
        let idsOfInitialStates = [];
        let finalStatesLabelsById = {};

        for (let modelNode of modelNodes) {
            if (modelNode.IsInitial) {
                idsOfInitialStates.push(modelNode.Id);
                // @ts-ignore
                finalStatesLabelsById[modelNode.Id] = modelNode.Name;
            }
        }

        if (idsOfInitialStates.length) {
            let positionByNodeId = this.networkInstance?.getPositions(idsOfInitialStates);
            if (positionByNodeId) {
                for (let id of idsOfInitialStates) {
                    // @ts-ignore
                    let name = finalStatesLabelsById[id] || "";
                    let textWidth = ctx.measureText(name).width;
                    ctx.strokeStyle = "#000000"
                    ctx.fillStyle = "#ffffff"
                    ctx.lineWidth = 2;

                    ctx.beginPath()
                    ctx.moveTo(positionByNodeId[id].x, positionByNodeId[id].y);
                    ctx.lineTo(positionByNodeId[id].x - 30 - textWidth * 0.8, positionByNodeId[id].y - 20);
                    ctx.lineTo(positionByNodeId[id].x - 30 - textWidth * 0.8, positionByNodeId[id].y + 20);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
            }
        }
    }

    private addNode(node: NodeVis, addNodeToVisModel = true) {
        if (addNodeToVisModel) this.nodes.add(node);
        this.graph.Nodes.push({
            Id: Number(node['id']) || -1,
            Name: node['label'] || "Start",
            IsInitial: false,
            IsFinal: false,
        });

        // update the automaton
        this.updateAutomaton(convertGraphToWofaModel(this.graph))
        return node;
    }

    private deleteEdgeById(edgeId: number) {
        let edge = null;
        for (let tmpEdge of this.graph.Edges) {
            if (tmpEdge.Id == edgeId) {
                edge = tmpEdge;
                break;
            }
        }
        if (edge) this.deleteEdge(edge.From, edge.To);
    }

    private deleteEdge(fromNodeId: number, toNodeId: number) {
        //Model
        let edgesIds = [];
        let newEdges = [];
        let existAnotherEdge = fromNodeId != -1;
        for (let edge of this.graph.Edges) {
            if (edge['From'] == fromNodeId && edge['To'] == toNodeId) {
                edgesIds.push(edge['Id']);
            } else {
                newEdges.push(edge)
            }
        }

        this.graph.Edges = newEdges;
        if (fromNodeId == -1) {
            for (let edge of this.graph.Edges) {
                if (edge['From'] == -1) {
                    existAnotherEdge = true;
                    break;
                }
            }
        }
        //VisModel
        if (this.edges) this.edges.remove(edgesIds);
        if (this.nodes && !existAnotherEdge) this.deleteNode(-1);
    }

    private deleteNode(nodeId: number) {
        //Model
        let index = -1;
        let deleteNodes = [nodeId];
        let existAnotherEdge = false;
        let newEdges = [];
        let ids = [];
        let initNode = false;

        for (let i = 0; 0 < this.graph.Nodes.length; i++) {
            if (this.graph.Nodes[i].Id == nodeId) {
                index = i;
                break;
            }
        }
        if (index > -1) {
            this.graph.Nodes.splice(index, 1);
        }

        for (let edge of this.graph.Edges) {
            if (edge.To != nodeId && edge.From != nodeId) {
                newEdges.push(edge);
            } else {
                if (edge.From == -1) {
                    initNode = true;
                }
                ids.push(edge.Id)
            }
        }
        this.graph.Edges = newEdges;

        if (initNode) {
            for (let edge of this.graph.Edges) {
                if (edge['From'] == -1) {
                    existAnotherEdge = true;
                    break;
                }
            }
            if (!existAnotherEdge) deleteNodes.push(-1);
        }


        //VisModel
        if (this.edges) this.edges.remove(ids);
        if (this.nodes) this.nodes.remove(deleteNodes);

        // update the automaton
        this.updateAutomaton(convertGraphToWofaModel(this.graph))
    }

    setNetworkToCenter() {
        this.setModeNull();
        this.networkInstance?.fit();
    }

    reposition() {
        this.setModeNull();
        this.createNetwork();
    }

    deleteGraph() {
        this.graph = EmptyGraph()
        this.createNetwork()

        // update the automaton
        this.updateAutomaton(convertGraphToWofaModel(this.graph))

    }
}
