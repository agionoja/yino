import { Form, Outlet, useNavigation } from "@remix-run/react";
import authBg from "~/assets/images/auth-bg.png";
import { Button } from "~/components/button";

export default function Auth() {
  // const navigation = useNavigation();
  // const isSubmitting =
  //   navigation.state === "submitting" &&
  //   navigation.formData?.get("_action") === "verify";
  return (
    <main
      style={{
        backgroundImage: `linear-gradient(rgba(232, 244, 248, 0.95), rgba(244, 245, 247, 0.98)), url(${authBg})`,
      }}
      className={
        "flex min-h-screen w-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat py-10 md:py-20"
      }
    >
      {/*<Form method={"POST"} action={"/auth/send-verification"}>*/}
      {/*  <Button name={"_action"} value={"verify"} className={"bg-red-500"}>*/}
      {/*    {isSubmitting ? "Verifying..." : "Verify"}*/}
      {/*  </Button>*/}
      {/*</Form>*/}
      <div
        className={
          "flex w-full flex-col gap-6 px-4 md:w-[70%] md:rounded-lg md:p-6 md:shadow lg:w-[35%] 2xl:w-[30%]"
        }
      >
        <Outlet />
      </div>
    </main>
  );
}
