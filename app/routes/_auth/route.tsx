import { Outlet } from "@remix-run/react";

export default function Auth() {
  return (
    <main
      className={
        "bg-dotted-pattern flex min-h-screen w-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat py-10 md:py-20"
      }
    >
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
