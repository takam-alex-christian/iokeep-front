"use client"

import { useState } from "react"

import { Divider, Listbox } from "@nextui-org/react"

import testNotes from "@/data/test/notes.json"

import NoteItem from "./components/NoteItem"
import NoteToolBar from "./components/NoteToolBar"

export default function NoteManager() {

    // some app contex will tell what folder is selected
    // let's assume these notes are from the currently selected folder

    const [notesManagerState, setStateManagerState] = useState({
        notes: testNotes
    })


    return (
        <div className="flex flex-col gap-2 p-2">
            <NoteToolBar />

            <div className="py-2 flex flex-col gap-0">
                {notesManagerState.notes.map((eachNotes, i) => {
                    return (
                        <>
                            <NoteItem key={i} noteId={eachNotes.notedId} creationDate={{ ...eachNotes.creationDate }} description={eachNotes.description} />
                            {notesManagerState.notes.length - 1 != i && <div className="px-3"><Divider className="bg-default/40" orientation="horizontal" /></div>}

                        </>
                    )
                })}
            </div>
        </div>

    )
}