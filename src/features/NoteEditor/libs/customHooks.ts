
import { liveDataContext } from "@/contexts/liveDataContext"

import { useContext, useEffect, useState } from "react"


function useSelectedNote() { //incomplete

    const { liveAppData } = useContext(liveDataContext)

    const [selectedNoteState, setSelectedNoteState] = useState<{
        isLoading: boolean,
        noteData: { editorState: string, _id: string } | null
    }>({
        isLoading: false,
        noteData: null
    })

    useEffect(() => {
        if (liveAppData.selectedNoteId) {

            const fsnHeaders = new Headers()
            fsnHeaders.append("Content-Type", "application/json")

            setSelectedNoteState((prevState)=>{
                return {...prevState, isLoading: true}
            })

            
            fetch(`be/notes/${liveAppData.selectedNoteId}`, {
                method: "GET",
                headers: fsnHeaders,
            }).then((res)=>{
                return res.json()
            }).then((jsonResponse)=>{
                console.log(jsonResponse)
                setSelectedNoteState((prevState)=>{
                    return {...prevState, isLoading: false, noteData: jsonResponse.data}
                })
            }).catch((err)=>{
                throw err
            })
        }
    }, [liveAppData.selectedNoteId])

    return {
        isLoading: selectedNoteState.isLoading,
        noteData: selectedNoteState.noteData
    }
}

export {useSelectedNote}