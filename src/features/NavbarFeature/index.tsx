
import Image from "next/image"
import Link from "next/link"

import V2Logo from "@/assets/logo.svg"

import { Button, Switch } from "@nextui-org/react"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket, faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons"
import { logoutRequest } from "@/lib/authUtils"

import { useRouter } from 'next/navigation'

export default function () {

    const router = useRouter()

    function logoutButtonHandler() {
        logoutRequest().then((jsonResponse) => {
            if (jsonResponse.error) {
                //maybe show a modal to communicate the error with user for improved user experience
                alert(jsonResponse.error.message)

            } else {

                if (jsonResponse.success) {
                    router.replace("/login")
                } else {
                    alert(jsonResponse.info)
                }
            }
        })
    }

    return (
        <header className="px-2 py-4 flex flex-row justify-center bg-white">

            <div className="w-4/5 flex flex-row justify-between items-center ">
                {/* logo */}
                <Link href={"/app"}>
                    <Image width={48} src={V2Logo} alt={"iokeep v2 logo"} />
                </Link>


                <div className="flex flex-row justify-center items-center gap-2">
                    <Button isIconOnly variant="flat" color="default"><FontAwesomeIcon icon={faCircleHalfStroke} /></Button>
                    <Button onPress={logoutButtonHandler} variant="flat" color="default" isIconOnly><FontAwesomeIcon icon={faRightFromBracket} /></Button>
                </div>
            </div>
        </header>
    )
}