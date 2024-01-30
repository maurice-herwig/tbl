<script lang="ts">
    import {onMount} from 'svelte';

    import type {Node, Edge} from "./Models";
    import {NetworkGraph} from "./Logic/NetworkCreator";

    import Information from "./PopUps/Information.svelte";
    import NodeDialog from "./PopUps/NodeDialog.svelte";
    import EdgeDialog from "./PopUps/EdgeDialog.svelte";

    export let automatonAsStr: string = 'input_alphabet = a, b \n \n start_states = 0 \n \n transitions =  \n \n' +
        'acc_states = 0,1 ';

    let element: HTMLElement;
    let networkGraph: NetworkGraph;

    let isGraphInfoOpen = false;

    let nodeDialogSettings: [boolean, Node | null, NetworkGraph | null] = [false, null, networkGraph];
    let edgeDialogSettings: [boolean, Edge | null, NetworkGraph | null] = [false, null, networkGraph]

    export let newStateButton = false
    export let newEdgeButton = false
    export let clearStateButton = false


    onMount(async () => {
        networkGraph = new NetworkGraph(automatonAsStr, element, openNodeDialog, openEdgeDialog, updateAutomatonAsStr)
        networkGraph.createNetwork()
    });

    function openInformation() {
        isGraphInfoOpen = true
    }

    function openNodeDialog(node: Node) {
        nodeDialogSettings = [true, node, networkGraph]
    }

    function openEdgeDialog(edge: Edge) {
        edgeDialogSettings = [true, edge, networkGraph]
    }

    function updateAutomatonAsStr(str: string) {
        automatonAsStr = str
    }

    function resetAllButtons(){
        newStateButton = false
        newEdgeButton = false
        clearStateButton = false
    }

    function addNewNodes(){
        if (newStateButton) {
            resetAllButtons()
            networkGraph?.setModeNull()
        } else {
            resetAllButtons()
            newStateButton = true
            networkGraph?.addNewNodes()
        }
    }

    function addNewEdge() {
        if (newEdgeButton) {
            resetAllButtons()
            networkGraph?.setModeNull()
        } else {
            resetAllButtons()
            networkGraph?.addNewEdges()
            newEdgeButton = true
        }
    }

    function clearState() {
        if (clearStateButton) {
            resetAllButtons()
            networkGraph?.setModeNull()
        } else {
            resetAllButtons()
            networkGraph?.deleteNodeEdge()
            clearStateButton = true
        }
    }

    function graphToCenter() {
        resetAllButtons()
        networkGraph?.setNetworkToCenter()
        networkGraph?.setModeNull()
    }

    function refreshGraph() {
        resetAllButtons()
        networkGraph?.reposition()
        networkGraph?.setModeNull()
    }

    function deleteGraph(){
        if (confirm('Are you sure you to delete the graph?')) {
            networkGraph?.deleteGraph()
        }
        resetAllButtons()
        networkGraph?.setModeNull()
    }


</script>

<Information bind:open={isGraphInfoOpen}></Information>
<NodeDialog bind:settings={nodeDialogSettings}></NodeDialog>
<EdgeDialog bind:settings={edgeDialogSettings}></EdgeDialog>


<button on:click={ () => {addNewNodes()}} class="is_active_{newStateButton}">
    <img src="../../../../img/addIcon.png" alt="" >
    new state
</button>

<button on:click={ () => {addNewEdge()}} class="is_active_{newEdgeButton}">
    <img src="../../../../img/addIcon.png" alt="" >
    new edge
</button>

<button on:click={ () => {clearState()}} class="is_active_{clearStateButton}">
    <img src="../../../../img/trashcan.png" alt="" >
    state
</button>

<button on:click={ () => {graphToCenter()}}>
    graph to center
</button>

<button on:click={ () => {refreshGraph()}}>
    <img src="../../../../img/autorenew.jpg" alt="" >
    graph
</button>

<button on:click={ () => {deleteGraph()}}>
    <img src="../../../../img/trashcan.png" alt="" >
    graph
</button>

<button on:click={ () => {openInformation()}}>
    <img src="../../../../img/moreIcon.png" alt="" >
</button>

<div bind:this={element} class="graph"></div>

<style>
    .graph {
        height: calc(100% - 86px);
        weight: 100%;
        border: 1px solid lightgray;
        min-height: 300px;
    }
    img{
        height: 17px;
        padding-inline: 5px;
    }

    button {
        display: flex;
        align-items: center;
        justify-content: space-around;
        background: none;

        float: left;
        height: 35px;

        margin: 5px;

        font-size: 16px;
        font-weight: bold;

        border: 1px solid black;
        border-radius: 5px;
        cursor: pointer;
    }

    button:hover {
        filter: brightness(0.9);
    }
</style>
