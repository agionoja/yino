import { MetaFunction } from "@remix-run/node";
// import { Form, Link } from "@remix-run/react";
import Services from "~/routes/_landing.services/route";
import Personalized from "~/routes/_landing.personalize/route";
import Research from "~/routes/_landing.research/route";
import WhyUs from "~/routes/_landing.whyUs/route";
import Work from "~/routes/_landing.work/route";
import Testimonial from "~/routes/_landing.testimonial/route";
import Subscribe from "../../components/Subscribe";

export const meta: MetaFunction = () => {
  return [
    { title: "Yino" },
    { name: "description", content: "Welcome to Yino!" },
  ];
};

export default function Index() {
  return (
    <div className="flex flex-col gap-12 font-inter">
      <Services />
      <Personalized />
      <Research />
      <WhyUs />
      <Work />
      <Testimonial />
      <Subscribe />
    </div>
  );
}
