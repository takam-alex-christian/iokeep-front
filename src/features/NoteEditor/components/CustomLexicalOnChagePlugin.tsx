import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useContext, useRef} from "react";
import { CustomNoteEditorContext } from "../libs/customEditorContext";

function CustomLexicalOnChagePlugin(){
    const [editor] = useLexicalComposerContext()

    const {customNoteEditorState, customNoteEditorDispatch} = useContext(CustomNoteEditorContext)

    const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(createTimeout())

    function createTimeout(){

        let createdTimeoutId = setTimeout(()=>{
            customNoteEditorDispatch({type: "idle_state_changed", payload: {isIdle: true}})
        }, 5000)

        return createdTimeoutId
    }

    useEffect(()=>{
        editor.registerUpdateListener((editorState)=>{
            // reschedule idle timeout

            idleTimeoutRef.current && clearTimeout(idleTimeoutRef.current) // clear timeout if it exists

            idleTimeoutRef.current = createTimeout() // create new timeout

            // set idle to false immediately
            customNoteEditorDispatch({type: "idle_state_changed", payload: {isIdle: false}})

        })

        return ()=>{
            idleTimeoutRef.current && clearTimeout(idleTimeoutRef.current)
        }
    }, [])


    useEffect(()=>{
        if(customNoteEditorState.isIdle){
            console.log("idle")
        }else {
            console.log("not idle")
        }
    }, [customNoteEditorState.isIdle])
}

export {CustomLexicalOnChagePlugin}