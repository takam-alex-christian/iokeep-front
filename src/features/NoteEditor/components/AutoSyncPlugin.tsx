"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useContext, useRef, useState} from "react";
import { CustomNoteEditorContext } from "../libs/customEditorContext";
import { $getRoot } from "lexical";

import { syncNote } from "../libs/editorUtils";

import {liveDataContext} from "@/contexts/liveDataContext"
import { useNotes } from "@/lib/noteUtils";

//ToDo rename this plugin to AutoSyncPlugin

function AutoSyncPlugin(){
    const [editor] = useLexicalComposerContext()

    const {customNoteEditorState, customNoteEditorDispatch} = useContext(CustomNoteEditorContext)

    const [liveNoteDescription, setLiveNoteDescription] = useState<string[]>([])

    /**
     * if liveAppData.selectedNoteId is set, then we can sync with noteId
     * else if liveAppData.selectedFolderId is set, then we can create a new note in the selected folder
     */

    const {liveAppData, liveAppDataDispatch} = useContext(liveDataContext) 

    const { notesData, mutate: mutateNotes, isLoading: isNotesLoading} = useNotes()

    const prevIdleState = useRef<boolean | null>(null) // previous idle state

    const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null) // should be always be initialized to null and set on editor update

    
    function createTimeout(){

        let createdTimeoutId = setTimeout(()=>{
            customNoteEditorDispatch({type: "idle_state_changed", payload: {isIdle: true}})
        }, 1000)

        return createdTimeoutId
    }

    useEffect(()=>{
        editor.registerUpdateListener(({editorState, prevEditorState})=>{
            // reschedule idle timeout

            let currentRoot = editorState.read(()=>{
                return $getRoot();
            })

            let prevRoot = prevEditorState.read(()=>{
                return $getRoot();
            })

            if (!(currentRoot === prevRoot) && !prevEditorState.isEmpty()){ // update idle state if the root is different
                idleTimeoutRef.current && clearTimeout(idleTimeoutRef.current) // clear timeout if it exists

                // set idle to false immediately
                customNoteEditorDispatch({type: "idle_state_changed", payload: {isIdle: false}})

                idleTimeoutRef.current = createTimeout() // create new timeout
            }else {
                //TODO: remove this console.log
                console.log("idle state is not changed, because roots are the same. as a result, we can skip the sync process")
            }
            
            
            

        })

        editor.registerTextContentListener((editorTextContent)=>{
            let tmpDescription = editorTextContent.split("\n").filter((eachText)=>{
                return eachText.length > 0
            })

            setLiveNoteDescription(tmpDescription.splice(0, 2))
        })

    }, [])


    useEffect(()=>{
        //TODO: remove this console.log
        console.log("customNoteEditorState.isIdle", customNoteEditorState.isIdle)
        //check if idle state has changed
        if(prevIdleState.current !== null && prevIdleState.current !== customNoteEditorState.isIdle && customNoteEditorState.isIdle && !isNotesLoading){
            
            //TODO: remove this console.log
            console.log("starting the sync process")
            customNoteEditorDispatch({type: "sync_state_changed", payload: {isSyncing: true}});
            // sync the note 

            if(liveAppData.selectedNoteId){
                //TODO: only sync the note if the editorState has changed
                syncNote({
                    noteId: liveAppData.selectedNoteId,
                    editorState: JSON.stringify(editor.getEditorState().toJSON()),
                    description: liveNoteDescription, // researching how description is created and explore if it can simply be reused,

                }).then((jsonResponse)=>{
                    if (jsonResponse.success && !jsonResponse.error){
                        customNoteEditorDispatch({type: "sync_state_changed", payload: {isSyncing: false}})

                        let newNotes = [...notesData];
                        let updatedNoteIndex = newNotes.findIndex((eachNote) => {
                            return eachNote._id == liveAppData.selectedNoteId;
                        });
                        newNotes[updatedNoteIndex].description =liveNoteDescription;

                        mutateNotes(newNotes);
                    }
                })

            }else if(liveAppData.selectedFolderId && !isNotesLoading){
                //create a new note
                //TODO: remove this console.log
                console.log(" should create a new note if editor is not empty")

                
                // don't create a new not if text content is empty
                editor.getEditorState().read(()=>{

                    let isNoteEditorEmpty: boolean = true;

                    const root = $getRoot();
                    
                    if (root.isEmpty()) isNoteEditorEmpty = true;
                    else{
                        //get all the children of root
                        // loop through them to find one which is not empty
                        // if found, set isNoteEditorEmpty to false
                        root.getChildren().some((child)=>{
                            
                            if(child.getTextContent().trim().length > 0) {
                                isNoteEditorEmpty = false;

                                return true;// break the loop
                            }

                            //if the child is empty, continue the loop
                            return false;
                        })
                    }
                    
                    if(!isNoteEditorEmpty){

                        syncNote({
                            folderId: liveAppData.selectedFolderId!,
                            editorState: JSON.stringify(editor.getEditorState().toJSON()),
                            description: liveNoteDescription,
                    }).then((jsonResponse)=>{
                        if (jsonResponse.success && !jsonResponse.error){
    
                            //TODO: remove this console.log
                            // console.log("jsonResponse.data", jsonResponse.data)
                            
                            mutateNotes([...notesData, 
                                {...jsonResponse.data, editorState: JSON.stringify(editor.getEditorState().toJSON()), description: liveNoteDescription}
                            ])
    
                            //since note is created, we can set the selectedNoteId to the new note id
                            liveAppDataDispatch({type: "changedSelectedNote", payload: {noteId: jsonResponse.data?._id!}})
    
                            customNoteEditorDispatch({type: "sync_state_changed", payload: {isSyncing: false}})
                        }
                    })
                    }
                    

                })


            }

            
        }
        //store the current idle state to prevIdleState
        prevIdleState.current = customNoteEditorState.isIdle

    }, [customNoteEditorState.isIdle])

    return null
}


export {AutoSyncPlugin}