
import Image from "next/image"
import Link from "next/link"

import V2Logo from "@/assets/logo.svg"

import { Button, Switch } from "@nextui-org/react"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb, faRightFromBracket, faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons"
import { faLightbulb as darkBulb } from "@fortawesome/free-regular-svg-icons"

export default function () {
    return (
        <header className="px-2 py-4 flex flex-row justify-center ">

            <div className="w-4/5 flex flex-row justify-between items-center ">
                {/* logo */}
                <Link href={"/app"}>
                    <Image width={48} src={V2Logo} alt={"iokeep v2 logo"} />
                </Link>


                <div className="flex flex-row justify-center items-center gap-2">
                    <Button isIconOnly variant="flat" color="default"><FontAwesomeIcon icon={faCircleHalfStroke} /></Button>
                    <Button variant="flat" color="default" isIconOnly><FontAwesomeIcon icon={faRightFromBracket} /></Button>
                </div>
            </div>
        </header>
    )
}