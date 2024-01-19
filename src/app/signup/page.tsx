
import Image from "next/image"
import SignupForm from "@/features/SignupForm"
import IokeepLogo from "@/assets/iokeeplogo.svg"
import Logo from "@/assets/logo.svg"

export default function () {
    return (
        <main className="flex flex-col min-h-screen ">
            <div className="flex flex-col items-center justify-center flex-grow">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-col gap-2 text-center">
                        <div>
                            <Image width={128} alt="iokeep v2 logo" src={Logo} />
                        </div>
                        <h2 className="text-xl">Sigup Please</h2>
                    </div>

                    <SignupForm />
                </div>

            </div>

        </main>

    )
}