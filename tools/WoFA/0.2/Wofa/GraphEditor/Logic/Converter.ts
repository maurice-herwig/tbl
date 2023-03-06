import {Graph, Node as ModelNode, Edge as ModelEdge} from "../Models"
import type {Data, Edge, Node} from "vis-network";
import {DataSet} from "vis-data";

export function convertNodeGraphToVis(modelNode: ModelNode): Node {
    const node: Node = {
        id: modelNode.Id,
        label: modelNode.Name,
    };

    if (modelNode.IsFinal) {
        node.color = {
            border: '#000000',
            background: '#ffffc4',
            hover: {
                border: '#000000',
                background: "#ffffb1"
            },
            highlight: {
                border: '#000000',
                background: "#ffffb1"
            }
        }
    } else {
        node.color = {
            border: "#c3c3c3",
            background: "#FFFFFF",
            hover: {
                border: '#c3c3c3',
                background: "#FFFFFF"
            },
            highlight: {
                border: '#c3c3c3',
                background: "#FFFFFF"
            }
        };
    }

    return node;
}

export function convertGraphToVis(graph: Graph) {

    function convertEdge(modelEdge: ModelEdge): Edge {
        const edge = {
            from: modelEdge.From,
            to: modelEdge.To,
            id: modelEdge.Id,
        } as Edge;

        edge.label = modelEdge.Labels.join(' | ');

        return edge;
    }


    // start of the main method
    const nodes = new DataSet<Node>();
    const edges = new DataSet<Edge>();

    const convertedEdges = graph.Edges.map<Edge>(e => convertEdge(e));
    edges.add(convertedEdges);

    const convertedNodes = graph.Nodes.map<Node>(n => convertNodeGraphToVis(n));
    nodes.add(convertedNodes);

    return {nodes, edges} as Data;
}

export function convertGraphToWofaModel(graph: Graph) {
    let res = ""

    // calc the alphabet, start states and accepted states
    let alphabet = new Set()
    let start_states = new Set()
    let acc_states = new Set()
    let nodes = new Set()
    let nodeDict = new Map()

    // Add the alphabet nodes
    for (const i in graph.Edges) {
        for (const j in graph.Edges[i].Labels) {
            alphabet.add(graph.Edges[i].Labels[j])
        }
    }

    // Add all nodes
    for (const i in graph.Nodes) {
        let nodeName = graph.Nodes[i].Name


        if (nodes.has(nodeName)) {
            console.log('The node ' + nodeName + ' exists more than one time.')

            let counter = 1
            while (nodes.has(nodeName.concat(counter.toString()))) {
                counter += 1
            }

            nodeName = nodeName.concat(counter.toString())
        }

        nodes.add(nodeName)
        nodeDict.set(graph.Nodes[i].Id, nodeName)

        if (graph.Nodes[i].IsInitial) {
            start_states.add(nodeName)
        }

        if (graph.Nodes[i].IsFinal) {
            acc_states.add(nodeName)
        }
    }

    // set the alphabet
    res += 'input_alphabet = '

    for (const letter of alphabet) {
        res = res + letter + ","
    }

    res = res.slice(0, -1)
    res += "\n \n"

    // set the start states
    res += "start_states = "
    for (const state of start_states) {
        res = res + state + ","
    }

    res = res.slice(0, -1)
    res += "\n \n"

    // set the transitions
    res += "transitions = "

    // calc the transitions
    let transitions = new Set()

    for (const i in graph.Edges) {
        for (const j in graph.Edges[i].Labels) {

            transitions.add([nodeDict.get(graph.Edges[i].From),
                graph.Edges[i].Labels[j],
                nodeDict.get(graph.Edges[i].To)])
        }
    }

    let firstTrans = true

    for (const t of transitions) {
        if (firstTrans) {
            firstTrans = false
        } else {
            res += "\t      "
        }
        // @ts-ignore
        res += t[0]
        res += ", "
        // @ts-ignore
        res += t[1]
        res += "\t"
        res += "-> "
        // @ts-ignore
        res += t[2]
        res += "\n"
    }
    res += "\n"

    // set the accepted states
    res += "acc_states = "
    for (const state of acc_states) {
        res = res + state + ","
    }

    res = res.slice(0, -1)

    return res
}

export function convertWoFAModelToGraph(str: string): Graph{
    let lines = str.split('\n')
    let graph = new Graph();
    let nodeId = 1;
    let edgeId = 1;

    let purged = []
    // Remove whitespace, ignore comments, remove empty lines
    for (const line of lines) {
        const newLine = line.split('#')[0].trim()
        if (newLine != "") {
            purged.push(newLine)
        }
    }

    const first = purged[0]
    const second = purged[1]
    const third = purged[2]
    const last = purged[purged.length - 1]

    if (!(first.startsWith("input_alphabet") &&
        second.startsWith("start_states") &&
        third.startsWith("transitions") &&
        last.startsWith("acc_states"))) {
        console.error("Error: Key words input_alphabet, start_states, transitions and acc_states must occur in exactly " +
            "in this order")
    }

    const initialStates = second.split("=")[1].split(",").map(n => n.trim());
    const finalStates = last.split("=")[1].split(",").map(n => n.trim());

    purged[2] = purged[2].split("=")[1].trim();
    for (let i = 2; i < purged.length - 1; i++) {
        if (purged[i].includes(",") && purged[i].includes("->")) {
            const start = purged[i].split(",")[0].trim();
            const label = purged[i].split(",")[1].split("->")[0].trim();

            let startNode = null;

            // find start Node
            for (const node of graph.Nodes) {
                if (start == node.Name) {
                    startNode = node;
                    break;
                }
            }

            if (!startNode) {
                // define new start Node
                startNode = new ModelNode();
                startNode.IsInitial = initialStates.includes(start)
                startNode.IsFinal = finalStates.includes(start)
                startNode.Name = start
                startNode.Id = nodeId

                graph.Nodes.push(startNode)
                nodeId += 1
            }

            const ends = purged[i].split('->')[1].trim().split(";");
            for (let end of ends) {
                end = end.trim();
                let endNode = null

                // find end Node
                for (const node of graph.Nodes) {
                    if (end == node.Name) {
                        endNode = node;
                        break;
                    }
                }

                if (!endNode) {
                    // define new end Node
                    endNode = new ModelNode()
                    endNode.IsInitial = initialStates.includes(end)
                    endNode.IsFinal = finalStates.includes(end)
                    endNode.Name = end
                    endNode.Id = nodeId

                    graph.Nodes.push(endNode)
                    nodeId += 1
                }

                // edge
                let edge
                for (const e of graph.Edges) {
                    if (e.To == endNode.Id && e.From == startNode.Id) {
                        edge = e;
                        break
                    }
                }


                if (edge) {
                    edge.Labels.push(label)
                } else {
                    edge = new ModelEdge();
                    edge.Id = edgeId;
                    edge.From = startNode.Id;
                    edge.To = endNode.Id;
                    edge.Labels.push(label);

                    graph.Edges.push(edge);
                    edgeId += 1;
                }
            }
        }
    }
    return graph
}