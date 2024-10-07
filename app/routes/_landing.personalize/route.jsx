import { Link } from "@remix-run/react";
import laptop from "../../assets/landing/MacBook.png";
import arrow from "../../assets/landing/material-symbols_more-up.png";

export default function Personalized() {
  return (
    <section className="flex flex-col-reverse items-center gap-6 p-4 lg:flex-row lg:px-20">
      <div className="flex basis-[55%] flex-col gap-3">
        <h3 className="flex flex-col text-center text-4xl font-semibold lg:text-start lg:text-[40px]">
          Your Personalized
          <span className="pl-2 lg:pl-0">Dashboard Awaits</span>
        </h3>
        <p className="text-text-gray whitespace-pre-line text-center font-normal leading-8 lg:text-start lg:text-[20px]">
          Experience the power of seamless management with our intuitive
          dashboard, designed to give you complete control and insights tailored
          to your needs from the moment you sign up.
        </p>
        <Link
          to={"/"}
          className="flex items-center justify-center gap-2 font-semibold text-blue no-underline lg:justify-start"
        >
          <span>Sign Up</span>
          <img src={arrow} alt="img" width={18} />
        </Link>
      </div>
      <div className="basis-[45%]">
        <img src={laptop} alt="img" />
      </div>
    </section>
  );
}
