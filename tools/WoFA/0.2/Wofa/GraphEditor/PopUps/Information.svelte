<script lang="ts">

    export let open:boolean;
    function close(){
        open = false;
    }

    function onKeypress(e:KeyboardEvent){
        if(e.code === "Escape" && open){
            e.preventDefault();
            close();
        }
    }

</script>
<svelte:window on:keydown={onKeypress} ></svelte:window>
<div class:open={open} class="background" on:click={(e) => {if (e.target === e.currentTarget) close()}}>
    <div class="wrapper">
        <button class="closeBtn" on:click={() => close()}><img src="../../../../img/closeBtn.png" alt="close"></button>

        <h2>Toolbar explanation</h2>
        <div class="container">
            <button class="exampleButton">
                <img src="../../../../img/addIcon.png" alt="" >
                new state
            </button>
            <p>Adds a new state to the current automaton.</p>
        </div>
        <div class="container">
            <button class="exampleButton">
                <img src="../../../../img/addIcon.png" alt="" >
                new edge
            </button>
            <p>Adds a new edge to the current automaton.</p>
        </div>
        <div class="container">
            <button class="exampleButton">
                <img src="../../../../img/trashcan.png" alt="" >
                state
            </button>
            <p>Clear a chosen state of the current automaton</p>
        </div>
        <div class="container">
            <button class="exampleButton">
                graph to center
            </button>
            <p>Places the automaton in the center of the canvas.</p>
        </div>
        <div class="container">
            <button class="exampleButton">
                <img src="../../../../img/autorenew.jpg" alt="" >
                graph
            </button>
            <p>Repositions the states of the automaton.</p>
        </div>
        <div>
            <button class="exampleButton">
                <img src="../../../../img/trashcan.png" alt="" >
                graph
            </button>
            <p>Deletes the current automaton.</p>
        </div>

        <p>To edit a state or transition, click on the state or edge to set its properties.</p>
    </div>
</div>


<style>


    .background{
        display: none;
    }
    .open.background{
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

    .wrapper{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        box-sizing: border-box;
        border: 5px solid black;
        border-radius: 5px;
        width: 100%;
        background-color: white;
        max-width: 900px;
        /* height: 500px; */
        display: flex;
        flex-direction: column;
        justify-content: center;
        /* align-items: center; */
        padding: 30px;
    }

    .closeBtn{
        position: absolute;
        right: 20px;
        top: 20px;
        height: 30px;
        width: 30px;
    }
    .closeBtn Img{
        display: block;
        height: 20px;
    }

    .container {
        display: flex;
        flex-direction: row;
        align-items: flex-start
    }

    .exampleButton{
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

    img{
        height: 17px;
        padding-inline: 5px;
    }

</style>