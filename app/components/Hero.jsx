import { Link } from "@remix-run/react";
import arrow from "../assets/landing/black-arrow-up.png";

export default function Hero() {
  return (
    <section className="flex flex-col items-center gap-16 font-inter">
      <div className="flex flex-col items-center">
        <h1 className="lg:ext-5xl mb-2 text-center text-3xl font-bold">
          Empowering Your Business with Cutting-Edge <br /> Technology Solutions
        </h1>
        <span className="text-center text-xl font-normal">
          Yino Technology specializes in Tech Trainings, Outsourcing,
          Consultancy, Web Development, and Mobile Development.
        </span>
      </div>
      <div className="flex items-center gap-8">
        <Link to={"services"} className="flex items-center gap-2 font-semibold">
          <span> View Services </span>
          <img src={arrow} alt="img" />
        </Link>
        <Link to={"signup"}>
          <div className="cursor-pointer rounded-sm bg-blue px-3 py-1 text-center text-white">
            Get Started
          </div>
        </Link>
      </div>
    </section>
  );
}
