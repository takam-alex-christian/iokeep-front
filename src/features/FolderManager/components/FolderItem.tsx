"use client"
import { useState, useEffect } from "react"

import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, } from "@nextui-org/react"
import { motion, AnimatePresence, useAnimate } from "framer-motion"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFolder } from "@fortawesome/free-regular-svg-icons"
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons"

interface FolderItemProps {
    isSelected: boolean
}

export default function (props: FolderItemProps) {

    const [optionButtonScope, animateOptionButton] = useAnimate() //as in animate option button scrope

    const [itemState, setItemState] = useState<{
        isHovered: boolean
    }>({
        isHovered: false
    })


    useEffect(()=>{
        if(itemState.isHovered) animateOptionButton(optionButtonScope.current, {opacity: 1}, {duration: 0.8})
        else animateOptionButton(optionButtonScope.current, {opacity: 0}, {duration: 0.4})
    }, [itemState.isHovered]) 

    return (
        <div onMouseEnter={() => { setItemState((prevState) => { return { ...prevState, isHovered: true } }) }} onMouseLeave={() => { setItemState((prevState) => { return { ...prevState, isHovered: false } }) }} className="relative flex flex-row items-center">
            <Button className="w-full justify-start " size="md" variant="light">

                <div className="flex flex-row items-center gap-2">

                    <FontAwesomeIcon icon={faFolder} />

                    <div>
                        New project
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
                        <DropdownItem className="text-danger" key={"delete"} color="danger" variant="flat">
                            Delete
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>

            </div>

        </div>
    )
}