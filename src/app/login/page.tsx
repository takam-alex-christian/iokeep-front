import LoginForm from "@/features/LoginForm";
import FormWrapper from "@/layouts/FormWrapper";

import Footer from "@/layouts/Footer";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex flex-col flex-grow justify-center items-center">
        <FormWrapper label={"Log in to iokeep"}>
          <LoginForm />
        </FormWrapper>
      </div>

      <Footer />
    </main>
  );
}
