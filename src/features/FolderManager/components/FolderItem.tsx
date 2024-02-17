"use client"

import React, { useState, useEffect, useContext } from "react"

import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, } from "@nextui-org/react"

import { useAnimate, motion } from "framer-motion"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFolder } from "@fortawesome/free-regular-svg-icons"
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons"

import { liveDataContext } from "@/contexts/liveDataContext"
import { FolderDataType } from "@/types"
import { deleteFolder, useFolders } from "@/lib/folderUtils"


export default function (props: FolderDataType) {

    const { liveAppData, liveAppDataDispatch } = useContext(liveDataContext)

    const { folderData, isLoading, error, mutate: mutateFolders } = useFolders()

    const [isVisible, setVisibility] = useState(true)

    const [optionButtonScope, animateOptionButton] = useAnimate() //as in animate option button scrope

    

    const [itemState, setItemState] = useState<{
        isHovered: boolean
    }>({
        isHovered: false
    })

    useEffect(()=>{

    }, [isVisible])

    useEffect(() => {
        if (itemState.isHovered) animateOptionButton(optionButtonScope.current, { opacity: 1 }, { duration: 0.4 })
        else animateOptionButton(optionButtonScope.current, { opacity: 0 }, { duration: 0.4 })
    }, [itemState.isHovered])

    function folderDeleteHandler() {

        deleteFolder(props._id).then((jsonResponse) => {
            if (!jsonResponse.error) {
                if (jsonResponse.success) {
                    setVisibility(false) //animates presence before removed from folders
                    // setTimeout(() => {
                    //     mutateFolders(folderData.filter((eachFolder) => { return eachFolder._id != props._id }))

                    // }, 500)
                    //animate presence

                } // remove folder from folderData
                else alert("failed")
            } else {
                console.log(jsonResponse.error.message)
            }
        })

    }

    function folderItemPressHandler() {

        liveAppDataDispatch({ type: "changedSelectedFolder", payload: { folderId: props._id } })

        console.log("folderManagerSelectedId changed to a new id");
    }

    return (
        <div>

            <div onMouseEnter={() => { setItemState((prevState) => { return { ...prevState, isHovered: true } }) }} onMouseLeave={() => { setItemState((prevState) => { return { ...prevState, isHovered: false } }) }} className="relative flex flex-row items-center">
                <Button

                    onPress={folderItemPressHandler}
                    className={`w-full justify-start ${props._id == liveAppData.selectedFolderId ? "bg-opacity-40 bg-default" : "bg-none"}`}
                    size="md"
                    variant="light"

                >

                    <div className="flex flex-row items-center gap-2">

                        <FontAwesomeIcon icon={faFolder} />

                        <div>
                            {props.folderName}
                        </div>
                    </div>
                </Button>
                <div className="absolute right-0">
                    <Dropdown>
                        <DropdownTrigger>

                            <Button className="" size={"sm"} variant="light" isIconOnly>
                                <FontAwesomeIcon className="opacity-0" ref={optionButtonScope} icon={faEllipsisVertical} />
                            </Button>

                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownItem key={"edit"}>
                                Rename
                            </DropdownItem>
                            <DropdownItem onPress={folderDeleteHandler} className="text-danger" key={"delete"} color="danger" variant="flat">
                                Delete
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>

                </div>

            </div>
        </div>
    )
}