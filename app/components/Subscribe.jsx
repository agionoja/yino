import subImg from "..//assets/landing/lady.png";
import { IoMdMail } from "react-icons/io";

export default function Subscribe() {
  return (
    <section className="my-6 p-4 lg:px-20">
      <div className="flex flex-col-reverse items-center justify-between gap-4 rounded-lg bg-[#1C54A6] px-12 py-8 lg:flex-row">
        <div className="flex flex-col items-center gap-6 text-white lg:items-start">
          <h3 className="font-manrope text-3xl font-bold  lg:text-5xl">
            Ready To Elevate <br /> Your Business?
          </h3>
          <span className="text-center lg:text-start">
            Contact us today for a free consultation and discover how Yino
            Technology can help your business thrive.
          </span>
          <div className="relative flex items-center gap-3">
            <IoMdMail className="absolute left-[0.3rem] md:left-3 text-2xl text-text-gray" />
            <input
              type="email"
              placeholder="Email Address"
              className="rounded-[5px] px-8 md:px-12 py-2 text-black focus:outline-none active:outline-none"
            />
            <div className="cursor-pointer rounded-[5px] bg-black px-4 py-2 text-center">
              Contact
            </div>
          </div>
        </div>
        <div>
          <img src={subImg} alt="img" />
        </div>
      </div>
    </section>
  );
}
