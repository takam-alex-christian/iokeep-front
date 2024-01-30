"use client"

import { useEffect, useState, useContext} from "react"

import { Divider, Listbox } from "@nextui-org/react"

import testNotes from "@/data/test/notes.json"

import NoteItem from "./components/NoteItem"
import NoteToolBar from "./components/NoteToolBar"

import {liveDataContext} from "@/contexts/liveDataContext"
import { NoteItemType } from "./types"


async function loadTestNotes(){
    return testNotes
}

export default function NoteManager() {

    // some app contex will tell what folder is selected
    // let's assume these notes are from the currently selected folder

    const {liveAppData, liveAppDataDispatch} = useContext(liveDataContext)

    const [notesManagerState, setStateManagerState] = useState<{
        notes: NoteItemType[]
    }>({
        notes: []
    })

    //check for changes in selected folder to actualize note data
    useEffect(()=>{
        loadTestNotes().then((loadedNotes)=>{
            setStateManagerState((prevState)=>{
                return {...prevState, notes: loadedNotes.filter(({folderId})=>{ return folderId == liveAppData.selectedFolderId})}
            })
        }, (e)=>{
            console.log(e)
        })
    }, [liveAppData.selectedFolderId])


    return (
        <div className="flex flex-col gap-2 p-2">
            <NoteToolBar />

            <div className="py-2 flex flex-col gap-0">
                {notesManagerState.notes.map((eachNote, i) => {
                    return (
                        <div key={eachNote.noteId}>
                            <NoteItem key={eachNote.noteId} noteId={eachNote.noteId} creationDate={{ ...eachNote.creationDate }} description={eachNote.description} />
                            {notesManagerState.notes.length - 1 != i && <div className="px-3"><Divider className="bg-default/40" orientation="horizontal" /></div>}

                        </div>
                    )
                })}
            </div>
        </div>

    )
}