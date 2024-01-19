
import { Input, Button, Link } from "@nextui-org/react"


export default function () {
    return (
        <div className="p-6 w-96 flex flex-col gap-0">
            <form >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Input
                            placeholder={"Username"}
                            required={true}
                            size="sm"
                        />
                        <div className="flex flex-row justify-end pt-2 pb-0">
                            <Link href={"#"}>password forgoten ?</Link>
                        </div>
                        <Input
                            placeholder={"Password"}
                            required={true}
                            size="sm"
                        />
                    </div>

                    <Button size="lg" color="primary" variant="solid">Log in</Button>

                </div>
            </form>
            <div className="flex flex-row justify-center items-center gap-2 px-2 py-4">
                <div>New to iokeep?</div>
                <Link href={"/signup"} showAnchorIcon={true}>Sign up</Link>
            </div>
        </div>
    )
}