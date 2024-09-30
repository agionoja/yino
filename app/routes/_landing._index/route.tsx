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
  
    </div>
  );
}
