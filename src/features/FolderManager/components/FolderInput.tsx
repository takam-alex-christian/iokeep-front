
import React from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFolder } from "@fortawesome/free-regular-svg-icons"
import { faPlus } from "@fortawesome/free-solid-svg-icons"

import { Button, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react"

export default function () {
    const listOfIcon = {
        "folderIcon": ""
    }

    function folderSubmitHandler(e: React.FormEvent) {
        e.preventDefault()
        console.log("new folder submitted")
    }

    return (
        <form onSubmit={folderSubmitHandler}>
            <div className="flex flex-row gap-2 items-center">
                <Input
                    startContent={<FontAwesomeIcon className="text-sm" icon={faFolder} />}
                    placeholder="folder name"
                    variant="flat"
                    color="default"
                    classNames={{ input: "", inputWrapper: "h-9 px-4", innerWrapper: "flex flex-row gap-[2px]" }}
                />
                {/* <Button isIconOnly size={"sm"} variant="flat" color={"primary"}><FontAwesomeIcon icon={faPlus} /></Button> */}
            </div>

        </form>
    )
}