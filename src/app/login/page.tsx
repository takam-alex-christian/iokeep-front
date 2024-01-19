
import LoginForm from "@/features/LoginForm"
import FormWrapper from "@/layouts/FormWrapper"

export default function () {
    return (
        <main className="min-h-screen flex flex-col">
            <div className="flex flex-col flex-grow justify-center items-center">
                <FormWrapper label={"Log in to iokeep"}>
                    <LoginForm />
                </FormWrapper>
            </div>

        </main>
    )
}