"use client"


import { useContext, useEffect, useRef, useState } from "react"

import { liveDataContext } from "@/contexts/liveDataContext"

//nextui imports
import { Button, ButtonProps, Divider } from "@nextui-org/react"

//font awesome lib imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { faBold, faItalic, faHeading, faUnderline, faRotateBackward, faRotateForward } from "@fortawesome/free-solid-svg-icons"

import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons"


//lexical imports
import { FORMAT_TEXT_COMMAND, CAN_UNDO_COMMAND, UNDO_COMMAND, REDO_COMMAND, CAN_REDO_COMMAND, $getSelection, $isRangeSelection, CLEAR_HISTORY_COMMAND } from "lexical"

import { $setBlocksType } from "@lexical/selection"


import { HeadingNode, $createHeadingNode } from "@lexical/rich-text"

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { LexicalComposer } from "@lexical/react/LexicalComposer"

import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"

//test data
import testNoteData from "@/data/test/notes.json"
import { createNote, useNotes } from "@/lib/noteUtils"
import { useSelectedNote } from "./libs/customHooks"



const theme = {
    heading: {
        h1: "text-lg font-semibold my-2"
    },
    paragraph: "my-2",
    text: {
        bold: 'font-bold',
        // code: '',
        italic: 'italic',
        // strikethrough: '',
        // subscript: '',
        // superscript: '',
        underline: 'underline'
        // underlineStrikethrough: '',
    }
}

function onError(error: Error) {
    console.error(error)
}

function ToolButton(props: ButtonProps) {
    return (
        <Button
            className=""
            isIconOnly={true}
            variant="light"
            color={props.color ? props.color : "default"}
            {...props}
        />
    )
}

function CustomToolBar() {

    const { liveAppData } = useContext(liveDataContext)

    const [editor] = useLexicalComposerContext()

    function boldButtonHandler() {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
    }

    function italicButtonHandler() {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
    }

    function underlineButtonHandler() {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
    }

    function headingButtonHandler() {


        editor.update(() => {
            const editorSelection = $getSelection();

            if ($isRangeSelection(editorSelection)) {
                $setBlocksType(editorSelection, () => $createHeadingNode("h1"));
            }
        })

    }

    // useEffect(()=>{

    //     editor.registerCommand(CAN_UNDO_COMMAND, (payload)=>{
    //         console.log(`content of the can_undo_command payload ${payload}`)
    //         return false
    //     }, 1)
    // }, [editor])

    function undoButtonHandler() {
        //@ts-ignore
        editor.dispatchCommand(UNDO_COMMAND);
    }

    function redoButtonHandler() {
        //@ts-ignore
        editor.dispatchCommand(REDO_COMMAND);
    }

    function saveButtonHandler() {
        // console.log(editor.getEditorState())
        const editorState = JSON.stringify(editor.getEditorState().toJSON()) //this version of the editor state can be stringified and stored

        if (liveAppData.selectedFolderId) createNote({ editorState, folderId: liveAppData.selectedFolderId }).then((jsonResponse) => {
            if (!jsonResponse.error) {
                if (jsonResponse.success) alert("note created") //noteId can be stored to current editor
                else alert("failed to save note")
            } else {
                console.log(jsonResponse.error.message)
            }
        })

        console.log(editorState)

    }

    return (
        <div className="flex flex-row gap-2 justify-between p-2 bg-default/10 rounded-t-xl">
            <div className="flex flex-row flex-grow gap-6">
                <div className="flex flex-row gap-0 bg-default/20 rounded-xl">
                    <ToolButton onPress={undoButtonHandler}><FontAwesomeIcon icon={faRotateBackward} /></ToolButton>
                    <ToolButton onPress={redoButtonHandler}><FontAwesomeIcon icon={faRotateForward} /></ToolButton>
                </div>

                <div className="flex flex-row gap-2 flex-grow ">
                    <div>
                        <ToolButton onPress={headingButtonHandler}><FontAwesomeIcon icon={faHeading} /></ToolButton>
                    </div>
                    {/* <Divider orientation="vertical" /> */}
                    <div className="flex flex-row gap-0">
                        <ToolButton onPress={italicButtonHandler}><FontAwesomeIcon icon={faItalic} /></ToolButton>
                        <ToolButton onPress={boldButtonHandler}><FontAwesomeIcon icon={faBold} /></ToolButton>
                        <ToolButton onPress={underlineButtonHandler}><FontAwesomeIcon icon={faUnderline} /></ToolButton>
                    </div>
                </div>
            </div>
            <div>
                <ToolButton onPress={saveButtonHandler} ><FontAwesomeIcon className="text-lg" icon={faFloppyDisk} /></ToolButton>
            </div>

        </div>
    )
}


// function AutoLoadSelectedNoteIntoEditor() {

//     const [editorState] = useLexicalComposerContext()

//     const { liveAppData } = useContext(liveDataContext)

//     const { isLoading, noteData } = useSelectedNote()


//     if (!isLoading && noteData != null) {
//         editorState.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined)
//         editorState.setEditorState(editorState.parseEditorState(noteData.editorState))
//     }

//     return null

// }

function TextEditor(props: { editorState?: string }) {

    //ajust editor value to the selected note

    const initialConfig = {
        editorState: props.editorState,
        namespace: "TextEditor",
        theme,
        onError,
        nodes: [HeadingNode,]
    }

    return (
        <div className="flex flex-col flex-grow ">

            {/* lexical editor */}
            <LexicalComposer initialConfig={initialConfig}>
                <div className=" flex-grow flex flex-col gap-0 bg-white shadow-sm rounded-xl">
                    <CustomToolBar />
                    {/* <Divider orientation="horizontal" /> */}
                    {/* <Divider orientation="horizontal" /> */}
                    <div className=" relative flex flex-col flex-grow py-2 px-6 bg-">
                        <RichTextPlugin
                            contentEditable={<ContentEditable className=" focus-within:outline-none flex-grow py-4" />}
                            placeholder={<div className="absolute top-8 left-6 z-10 text-neutral-400">Don't stop writing...</div>}
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                    </div>

                    <HistoryPlugin />

                </div>

                {/* <AutoLoadSelectedNoteIntoEditor /> */}
            </LexicalComposer>
        </div>
    )
}


export default function NoteEditor() {
    const {liveAppData} = useContext(liveDataContext)
    const {noteData} = useSelectedNote()

    // if(liveAppData.selectedNoteId?.length == 0) return <TextEditor />

    return (<TextEditor key={noteData?._id} editorState={noteData?.editorState} />)

}