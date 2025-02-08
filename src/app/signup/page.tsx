import SignupForm from "@/features/SignupForm";

import FormWrapper from "@/layouts/FormWrapper";

import Footer from "@/layouts/Footer";

export default function () {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="flex-grow h-full flex flex-col items-center justify-center ">
        <FormWrapper label="Sigup to ioKeep">
          <SignupForm />
        </FormWrapper>
      </div>
      <Footer />
    </main>
  );
}
