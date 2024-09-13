import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <main
      className={
        "flex min-h-screen w-full items-center justify-center py-10 md:py-20"
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
