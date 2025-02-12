import { Button } from "@heroui/react";
import LoadingIndicator from "../LoadingIndicator";

function FormButton(props: { isLoading: boolean; label: string }) {
  return (
    <Button size="lg" color="primary" variant="solid" type="submit">
      <div className="relative flex flex-row w-full items-center justify-center gap-2">
        <div className="absolute flex flex-row justify-end items-center w-6 h-full ">
          <LoadingIndicator isLoading={props.isLoading} />
        </div>
        {!props.isLoading && <div className="">{props.label}</div>}
      </div>
    </Button>
  );
}

export default FormButton;
