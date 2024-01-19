import { Input, Button } from "@nextui-org/react"

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

                    <Button size="lg" color="primary" variant="solid">Submit</Button>

                </div>
            </form>
        </div>
    )
}