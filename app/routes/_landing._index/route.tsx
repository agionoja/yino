import { MetaFunction } from "@remix-run/node";
// import { Form, Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Yino" },
    { name: "description", content: "Welcome to Yino!" },
  ];
};

export default function Index() {
  return (
    <div className="p-4 font-sans">
      {/* <h1 className="text-3xl">Welcome to Remix</h1>
      <ul className="mt-4 list-disc space-y-2 pl-6">
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/start/quickstart"
            rel="noreferrer"
          >
            5m Quick Start
          </a>
        </li>
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/start/tutorial"
            rel="noreferrer"
          >
            30m Tutorial
          </a>
        </li>
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/docs"
            rel="noreferrer"
          >
            Remix Docs
          </a>
        </li>{" "}
        <li>
          <Link
            className="text-blue-700 underline visited:text-purple-900"
            to="/auth/login"
            rel="noreferrer"
          >
            Login
          </Link>
        </li>{" "}
        <li>
          <Link
            className="text-blue-700 underline visited:text-purple-900"
            to="/auth/register"
            rel="noreferrer"
          >
            Register
          </Link>
        </li>
        <Form action={"/logout"} method={"POST"}>
          <li>
            <button
              type={"submit"}
              className="text-blue-700 underline visited:text-purple-900"
              rel="noreferrer"
            >
              Logout
            </button>
          </li>
        </Form>
      </ul> */}
    </div>
  );
}
