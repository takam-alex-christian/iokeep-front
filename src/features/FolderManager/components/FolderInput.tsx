
import React, { useState, useEffect } from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFolder } from "@fortawesome/free-regular-svg-icons"
import {  } from "@fortawesome/free-solid-svg-icons"

import { Button, Input, Tooltip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Spacer } from "@nextui-org/react"
import { createFolder, useFolders } from "@/lib/folderUtils"

type FormStateType = {
    foldername: {
        value: string,
        isEngaged: boolean,
        isInvalid: boolean,
        errorMessage: string
    }
}

export default function () {

    const [formState, setFormState] = useState<FormStateType>({
        foldername: {
            value: "",
            isEngaged: false,
            isInvalid: false,
            errorMessage: ""
        }
    })



    const { folderData, isLoading } = useFolders()

    useEffect(() => {

        if (formState.foldername.isEngaged) validateFolderName()

    }, [formState.foldername.value])


    function folderNameChangeHandler(value: string) {
        setFormState((prevState) => {
            return { ...prevState, foldername: { ...prevState.foldername, value, isEngaged: true } }
        })
    }

    function validateFolderName() {

        let isInvalid: boolean = false
        let errorMessage: string = ""

        if (formState.foldername.value.length != 0) {
            if (!isLoading && folderData.find(({ folderName }) => { return folderName == formState.foldername.value })) {
                isInvalid = true
                errorMessage = "foldername unavailable!"
            }
        } else {
            isInvalid = true
            errorMessage = "empty folder name"
        }

        setFormState((prevState) => {
            return { ...prevState, foldername: { ...prevState.foldername, isInvalid, errorMessage } }
        })
    }

    function folderSubmitHandler(e: React.FormEvent) {
        e.preventDefault()

        /** Todo
         * Display loading state
         * clear formState
        */
        createFolder(formState.foldername.value).then((jsonResponse)=>{
            if(!jsonResponse.error){
                if (jsonResponse.success){
                    //mutate folders
                    alert("folder added")
                }else{
                    alert("failed")
                }
            }else {
                setFormState((prevState)=>{
                    return {...prevState, foldername: {...prevState.foldername, errorMessage: jsonResponse.error!.message, isInvalid: true}}
                })
            }
        })

    }

    return (
        <form onSubmit={folderSubmitHandler}>
            <div className="flex flex-row gap-2 items-center ">
                <Tooltip placement="right" isOpen={formState.foldername.isInvalid} offset={20} showArrow={true} content={
                    <div className="h-10 flex justify-center items-center">{formState.foldername.errorMessage}</div>
                } color="default">
                    <Input
                        autoFocus

                        value={formState.foldername.value}
                        onValueChange={folderNameChangeHandler}

                        isRequired

                        isInvalid={formState.foldername.isInvalid && formState.foldername.isEngaged}
                        // errorMessage={formState.foldername.errorMessage}

                        startContent={<FontAwesomeIcon className="text-sm" icon={faFolder} />}
                        placeholder="folder name"
                        variant="flat"
                        color="default"
                        classNames={{ input: "", inputWrapper: "h-9 px-4", innerWrapper: "flex flex-row gap-[2px]" }}
                    />
                </Tooltip>

                {/* <Button isIconOnly size={"sm"} variant="flat" color={"primary"}><FontAwesomeIcon icon={faPlus} /></Button> */}
            </div>

        </form>
    )
}