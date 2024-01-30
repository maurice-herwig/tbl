<script lang="ts">
    import currentPageManager from "../../ModelStores/currentPageManager.js";
    import type {Block} from "../../serverCommunication.js";
    import CodemirrorEditor from "./CodemirrorEditor/CodemirrorEditor.svelte";
    import GraphEditor from "./GraphEditor/GraphEditor.svelte";
    import {Circle} from 'svelte-loading-spinners';


    export let block: Block;

    let points = block.user_data.weight;
    let docStr = block.user_data.automaton_1.value === "" ? block.public_data.template.value : block.user_data.automaton_1.value;
    let errorText = "";
    export let showTextEditor = false
    export let loadPoints = false

    function setShowTextEditor() {
        showTextEditor = true
    }

    function setShowGraphEditor() {
        showTextEditor = false
    }

    async function saveAndEvaluate() {
        loadPoints = true
        try {
            await currentPageManager.runBlockAction(block.block_id, "user_data", {
                "automaton_1": {
                    type: "txt",
                    value: docStr
                }
            });
            await currentPageManager.runBlockAction(block.block_id, "authorization", undefined);
            await currentPageManager.runBlockAction(block.block_id, "grading_weight", undefined);
            errorText = "";
        } catch (error: any) {
            errorText = JSON.stringify(error);
        }

        points = block.user_data.points
        loadPoints = false
    }

</script>


<div>
    <div class="button-container">
        <button on:click={setShowGraphEditor}>Show graph editor</button>
        <button on:click={setShowTextEditor}>Show text editor</button>
    </div>
    <div class="editorWrapper">
        {#if showTextEditor}
            <CodemirrorEditor bind:docStr={docStr}/>
        {:else }
            <GraphEditor bind:automatonAsStr={docStr}/>
        {/if}
    </div>
    <div class="pointsbar">

        <button on:click={saveAndEvaluate}>Save and evaluate!</button>
        {#if loadPoints}
            <div>
                <Circle size="20" color="black" unit="px" duration="1s"/>
            </div>
        {:else }
            <div class="points">
                {points}/{block.public_data['max_points']} points!
            </div>
        {/if}
    </div>
    <div class="error">
        {errorText}
    </div>
</div>

<style>
    .error {
        color: darkred;
    }

    .pointsbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
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

    .points {
        text-align: right;
        font-weight: bold;
    }

    .editorWrapper {
        position: relative;
        width: 100%;
        box-sizing: border-box;
        min-height: 300px;
    }

    .button-container {
        display: flex;
        flex-direction: row;
        align-items: flex-start
    }

</style>