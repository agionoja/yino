import { MetaFunction } from "@remix-run/node";
// import { Form, Link } from "@remix-run/react";
import Services from "~/routes/_landing.services/route";

export const meta: MetaFunction = () => {
  return [
    { title: "Yino" },
    { name: "description", content: "Welcome to Yino!" },
  ];
};

export default function Index() {
  return (
    <div className="p-4 font-sans">
      <Services />
    </div>
  );
}
