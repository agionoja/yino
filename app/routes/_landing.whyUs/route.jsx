import { Link } from "@remix-run/react";
import arrow from "../../assets/landing/white-arrow-up.png";
import airplane from "../../assets/landing/airplane.png";
import expertise from "../../assets/landing/expertise.png";
import padLock from "../../assets/landing/padlock.png";
import star from "../../assets/landing/star.png";

const data = [
  {
    id: 1,
    name: " Proven\nExpertise",
    icon: expertise,
    content: "With years of experience, we deliver solutions that work.",
  },
  {
    id: 2,
    name: "Customer-Centric\nApproach",
    icon: star,
    content: "We prioritize your needs to create custom solutions.",
  },
  {
    id: 3,
    name: "Innovative\nSolutions",
    icon: padLock,
    content: "We stay ahead of the curve with the latest tech trends.",
  },
  {
    id: 4,
    name: "Reliable\nSupport",
    icon: airplane,
    content: "Our team is here for you every step of the way.",
  },
];

export default function WhyUs() {
  return (
    <section className="why-bg rounded-lg text-white">
      <div className="mb-5 flex flex-col items-center pt-8">
        <span className="from-dark-blue to-dark-blue mb-3 rounded-3xl bg-gradient-to-r via-blue px-8 py-0.5 text-center font-medium text-white">
          Choose Us
        </span>
        <h2 className="mb-4 text-4xl font-semibold">Why Yino Technology?</h2>
        <p className="text-center lg:flex lg:flex-col">
          Discover the key advantages that set Yino Technology apart, delivering
          unparalleled expertise,
          <span className="pl-2">
            innovative solutions, and dedicated support to help your business
            thrive.
          </span>
        </p>
      </div>
      <div>
        <div className="flex flex-col items-center gap-4 px-8 lg:flex-row">
          {data.map((item) => (
            <div key={item.id}>
              <div className="flex flex-col items-center gap-6 p-6 lg:items-start lg:justify-start">
                <div className="flex items-center justify-center rounded-full bg-imgage-bg p-2">
                  <img
                    src={item.icon}
                    alt="icon"
                    className="h-full w-full object-contain"
                  />
                </div>
                <h3 className="whitespace-pre-line text-xl font-bold">
                  {item.name}
                </h3>
                <p className="text-center lg:text-start">{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Link
        to={"/"}
        className="flex items-center justify-center gap-2 px-12 py-8 font-semibold text-white no-underline lg:justify-end"
      >
        <span>Sign Up</span>
        <img src={arrow} alt="img" width={18} />
      </Link>
    </section>
  );
}
