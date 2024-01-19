import { Input, Button, Link } from "@nextui-org/react"

export default function () {
    return (
        <div className="p-6 w-96">
            <form >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Input
                            placeholder={"Username"}
                            required={true}
                            size="sm"
                        />
                        <Input
                            placeholder={"Password"}
                            required={true}
                            size="sm"
                        />

                        <Input
                            placeholder={"Confirm Password"}
                            required={true}
                            size="sm"
                        />

                    </div>

                    <Button size="lg" color="primary" variant="solid">Sign Up</Button>

                </div>
            </form>
            <div className="flex flex-row gap-2 px-2 py-4 justify-center items-center">
                <div>Already have an account?</div>
                <Link href={"/login"} showAnchorIcon={true}>Log in</Link>
            </div>
        </div>
    )
}