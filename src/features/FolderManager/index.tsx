"use client"
import FolderItem from "./components/FolderItem";

import { Accordion, AccordionItem } from "@nextui-org/react";

import folderTestData from "@/data/test/folders.json"

export default function () {


    return (
        <div className="p-4">
            <Accordion defaultExpandedKeys={["0"]}>
                <AccordionItem key={0} isCompact={false} title={"Folders"}>
                    <ul className="flex flex-col gap-1">
                        {folderTestData.map((eachFolder, i) => {
                            return (
                                <li>
                                    <FolderItem key={i} name={eachFolder.name} isSelected={false} />
                                </li>
                            )
                        })}

                    </ul>
                </AccordionItem>
            </Accordion>

            {/* list folders */}
            {/* toggled visibity folder creation form */}
        </div>
    )
}