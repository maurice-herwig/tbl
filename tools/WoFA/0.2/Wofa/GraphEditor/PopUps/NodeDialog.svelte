<script lang="ts">
    import type {Node} from "../Models";
    import {NetworkGraph} from "../Logic/NetworkCreator";

    export let settings: [boolean, Node, NetworkGraph];
    export let nodeNameInput
    export let isFinalCheckbox
    export let isInitialCheckbox


    function close() {
        settings[0] = false;
        settings[2].closeNodeDialog(settings[1])
    }

    function onKeypress(e: KeyboardEvent) {
        if (e.code === "Escape" && open) {
            e.preventDefault();
            close();
        }
    }

</script>

<svelte:window on:keydown={onKeypress}></svelte:window>
<div class:open={settings[0]} class="background" on:click={(e) => {if (e.target === e.currentTarget) close()}}>
    <div class="wrapper">
        <button class="closeBtn" on:click={() => close()}><img src="../../../../img/closeBtn.png" alt="close"></button>
        {#if settings[1]}
            <div>
                <label for={nodeNameInput}>Name</label>
                <input id={nodeNameInput} type="text" bind:value={settings[1].Name}>
            </div>
            <div>
                <label for={isInitialCheckbox}>Initial state</label>
                <input id={isInitialCheckbox} type="checkbox" bind:checked={settings[1].IsInitial}/>
                <label for={isFinalCheckbox}>Final state</label>
                <input id={isFinalCheckbox} type="checkbox" bind:checked={settings[1].IsFinal}/>
            </div>
        {/if}
    </div>
</div>

<style>
    .background {
        display: none;
    }

    .open.background {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.282);
        z-index: 2;
        backdrop-filter: blure();
        backdrop-filter: blur(1px);
    }

    .wrapper {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        box-sizing: border-box;
        border: 5px solid black;
        border-radius: 5px;
        width: 100%;
        background-color: white;
        max-width: 300px;
        /* height: 500px; */
        display: flex;
        flex-direction: column;
        justify-content: center;
        /* align-items: center; */
        padding: 30px;
    }

    .closeBtn {
        position: absolute;
        right: 20px;
        top: 20px;
        height: 30px;
        width: 30px;
    }

    .closeBtn Img {
        display: block;
        height: 20px;
    }

</style>