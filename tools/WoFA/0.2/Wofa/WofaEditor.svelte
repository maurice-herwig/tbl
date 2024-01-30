<script lang="ts">
    import CodemirrorEditor from "./CodemirrorEditor/CodemirrorEditor.svelte";
    import currentPageManager from "../../ModelStores/currentPageManager.js";
    import type {Block} from "../../serverCommunication"
    import GraphEditor from "./GraphEditor/GraphEditor.svelte";

    export let block: Block;

    let docStrSolution = block.secret_data.solution.value;
    let docStrTemplate = block.public_data.template.value;
    let errorText = "";

    export let showTextEditorSolution = false;
    export let showTextEditorTemplate = false;


    export async function onSave() {
        try {
            await currentPageManager.runBlockAction(block.block_id, "public_data", {
                "template": {
                    type: "txt",
                    value: docStrTemplate
                }
            });
            await currentPageManager.runBlockAction(block.block_id, "secret_data", {
                "solution": {
                    type: "txt",
                    value: docStrSolution
                }
            });
        } catch (error: any) {
            errorText = JSON.stringify(error);
            throw(error);
        }
    }

    let focusEditor: () => void | null;

    export async function onEnterEditMode() {
        console.log("editmode enter")
        if (focusEditor) focusEditor();
    }

    function setShowGraphEditorSolution () {
        showTextEditorSolution = false
    }

    function setShowTextEditorSolution () {
        showTextEditorSolution = true
    }

    function setShowGraphEditorTemplate () {
        showTextEditorTemplate = false
    }

    function setShowTextEditorTemplate () {
        showTextEditorTemplate = true
    }
</script>


<div>
    <div class="desc">Geben Sie hier eine mögliche Lösung an:</div>
    <div class="button-container">
        <button on:click={setShowGraphEditorSolution}>Show graph editor</button>
        <button on:click={setShowTextEditorSolution}>Show text editor</button>
    </div>
    <div class="editorWrapper">
        {#if showTextEditorSolution}
            <CodemirrorEditor bind:docStr={docStrSolution}/>
        {:else }
            <GraphEditor bind:automatonAsStr={docStrSolution}/>
        {/if}
    </div>
    <div class="desc">Geben Sie hier ein Template an:</div>
    <div class="button-container">
        <button on:click={setShowGraphEditorTemplate}>Show graph editor</button>
        <button on:click={setShowTextEditorTemplate}>Show text editor</button>
    </div>
    <div class="editorWrapper">
        {#if showTextEditorTemplate}
            <CodemirrorEditor bind:docStr={docStrTemplate}/>
        {:else }
            <GraphEditor bind:automatonAsStr={docStrTemplate}/>
        {/if}
    </div>
    <div class="error">{errorText}</div>
</div>


<style>
    .editorWrapper {
        position: relative;
        width: 100%;
        box-sizing: content-box;
    }

    .error {
        color: darkred;
    }

    .button-container {
        display: flex;
        flex-direction: row;
        align-items: flex-start
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