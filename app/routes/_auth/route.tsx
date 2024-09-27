import { Outlet } from "@remix-run/react";
import authBg from "~/assets/images/auth-bg.png";

export default function AuthLayout() {
  return (
    <main
      style={{
        backgroundImage: `linear-gradient(rgba(205, 236, 248, 0.95), rgba(244, 245, 247, 0.98)), url(${authBg})`,
      }}
      className={
        "flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat py-10 md:py-20"
      }
    >
      <div
        className={
          "flex w-full flex-col gap-6 px-4 md:w-[70%] md:px-0 lg:w-[35%] 2xl:w-[30%]"
        }
      >
        <Outlet />
      </div>
    </main>
  );
}
