"use client"
import FolderItem from "./components/FolderItem";

import { Accordion, AccordionItem } from "@nextui-org/react";



export default function () {
    return (
        <div className="p-4">
            <Accordion defaultExpandedKeys={["0"]}>
                <AccordionItem key={0} isCompact={false} title={"Folders"}>
                    <ul className="flex flex-col gap-1">
                        <li>
                            <FolderItem isSelected={true} />
                        </li>
                        <li>
                            <FolderItem isSelected={false} />
                        </li>
                    </ul>
                </AccordionItem>
            </Accordion>

            {/* list folders */}
            {/* toggled visibity folder creation form */}
        </div>
    )
}