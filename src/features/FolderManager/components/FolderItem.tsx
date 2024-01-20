
import { Button, Card, CardBody } from "@nextui-org/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFolder } from "@fortawesome/free-regular-svg-icons"

interface FolderItemProps{
    isSelected: boolean
}

export default function (props: FolderItemProps) {
    return (
        <Button className="w-full justify-start " size="md" variant="light">

            <div className="flex flex-row items-center gap-2">

                <FontAwesomeIcon icon={faFolder} />

                <div>
                    New project
                </div>
            </div>
        </Button>
    )
}