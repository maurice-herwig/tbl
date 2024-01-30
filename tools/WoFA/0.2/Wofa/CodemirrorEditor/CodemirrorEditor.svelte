<script lang="ts">
    import {onMount} from 'svelte'
    import {EditorState} from "@codemirror/state"
    import {EditorView, keymap, highlightSpecialChars, ViewUpdate} from "@codemirror/view"
    import {defaultKeymap, indentWithTab, history, historyKeymap} from "@codemirror/commands"
    import {lightTheme} from './theme'

    
    export let docStr:string = "test";
    let wrapper:HTMLElement;
    

    let view : EditorView;
    onMount(()=>{
        let startState = EditorState.create({
            doc: docStr,
            extensions: [
                lightTheme,
                keymap.of([...defaultKeymap, indentWithTab, ...historyKeymap]),
                highlightSpecialChars(),
                history(),
                EditorView.updateListener.of((v:ViewUpdate) => {
                    if (v.docChanged) {
                        // Document changed
                        let _docStr = ""
                        let docArray = [...v.state.doc];
                        for(let i = 0; i < docArray.length; i++) {
                            _docStr += docArray[i];
                            if(i < docArray.length-1) {
                                docStr += "\n";
                            }    
                        }
                
                        docStr = _docStr;
                    }
                })

            ],
            
        })

        view = new EditorView({
            state: startState,
            parent: wrapper
        })

        

    });

    export function focusEditor(){
        console.log("focus enter")
        view.focus();
    }

</script>

<div class="wrapper" bind:this={wrapper} ></div>


<style>

    .wrapper{
        position: relative;
        width: 100%;
        overflow: hidden;
        font-size: 16px;
        line-height: normal;
        min-height: 300px;
        border: 2px solid rgb(130, 130, 130);
        box-sizing: border-box;
    }
    .wrapper:focus , .wrapper:focus-within, .wrapper:focus-visible{
        border: 2px solid black;
    }

    .wrapper :global(.cm-editor){
        height: 100%;
        width: 100%;
    }
    .wrapper :global(.cm-editor){
        outline: none;
    }
    .wrapper :global(.cm-line){
        line-height: normal;
        padding: 0;
        margin: 0;
    }
    

    .wrapper :global(.cm-content){
        padding: 0px !important;
        word-wrap: break-word !important;
        width: 100% !important;
        white-space: normal !important;
        flex-grow: initial !important;
        flex-shrink: initial !important;
    }
    .wrapper :global(.cm-scroller) {
        width: 100%;
        word-break: break-word;
    }

    /* scrollbar */
    .wrapper :global(.cm-scroller::-webkit-scrollbar) {
        width: 10px;
    }
    .wrapper :global(.cm-scroller::-webkit-scrollbar-track) {
        background: #f1f1f1;
    }
    .wrapper :global(.cm-scroller::-webkit-scrollbar-thumb) {
        background: #c1c1c1;
    }
    .wrapper :global(.cm-scroller::-webkit-scrollbar-thumb:hover) {
        background: #c1c1c1;
    }
</style>