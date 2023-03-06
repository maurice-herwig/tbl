<script lang="ts">
    import {NetworkGraph} from "../Logic/NetworkCreator";
    import {Edge} from "../Models";
    import {onMount} from "svelte";

    export let settings: [boolean, Edge, NetworkGraph];
    export let letters
    let oldLabels

    onMount(async () => {
        if (settings) {
            oldLabels = this.settings[1].Labels
        }
    });

    function close() {
        // reformat the string
        // @ts-ignore
        if (typeof settings[1].Labels === 'string') {
            // @ts-ignore
            let split = settings[1].Labels.split(",")
            let newLabelsSet: Set<any> = new Set()
            for (const i in split) {
                const letter = split[i].trim()
                if (letter != "") {
                    newLabelsSet.add(letter)
                }
            }

            // set the new labels
            settings[1].Labels = Array.from(newLabelsSet)
        } else {
            settings[1].Labels = oldLabels
        }

        settings[0] = false;
        settings[2].closeEdgeDialog(settings[1])
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
                <label for={letters}>Letters</label>
                <input id={letters} type="text" bind:value={settings[1].Labels}>
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