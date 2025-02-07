import SignupForm from "@/features/SignupForm";

import FormWrapper from "@/layouts/FormWrapper";

import Footer from "@/layouts/Footer";

export default function () {
  return (
    <main className="flex flex-col h-svh ">
      <div className="flex flex-col items-center justify-center flex-grow">
        <FormWrapper label="Sigup to ioKeep">
          <SignupForm />
        </FormWrapper>
      </div>
      <Footer />
    </main>
  );
}
