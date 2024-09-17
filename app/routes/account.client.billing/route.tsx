import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Billing | Yino" },
    { name: "description", content: "Your Billings" },
  ];
};

export default function Billing() {
  return <>This is the billing route</>;
}
