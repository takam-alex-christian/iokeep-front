
import Image from "next/image"
import SignupForm from "@/features/SignupForm"
import IokeepLogo from "@/assets/iokeeplogo.svg"


import FormWrapper from "@/layouts/FormWrapper"

export default function () {
    return (
        <main className="flex flex-col min-h-screen ">
            <div className="flex flex-col items-center justify-center flex-grow">

                <FormWrapper label="Sigup to ioKeep">
                    <SignupForm />
                </FormWrapper>


            </div>

        </main>

    )
}