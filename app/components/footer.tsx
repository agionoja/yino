import { Link } from "@remix-run/react";
import logo from "../assets/images/logo.png";

export default function Footer() {
  return (
    <>
      <footer className="flex flex-col justify-between gap-32 bg-dark-jungle-green px-20 py-12 font-inter text-white">
        <div className="flex items-start gap-3">
          <img src={logo} alt="logo" className="h-20" />
          <div className="flex basis-full items-start justify-between gap-9 text-[14px]">
            <div>
              <h6 className="pb-3 text-lg font-semibold uppercase text-neutral-500">
                Info
              </h6>
              <ul className="flex flex-col justify-evenly gap-2">
                <Link to={""}></Link>
                <li>About us</li>
                <Link to={"#"}></Link>
                <li>For customers</li>
                <Link to={"#"}></Link>
                <li>Contacts</li>
                <Link to={"#"}></Link>
              </ul>
            </div>
            <div>
              <h6 className="pb-3 text-lg font-semibold uppercase text-neutral-500">
                Contact Us
              </h6>
              <ul className="flex flex-col justify-evenly gap-2">
                <li>+234 980 971-24-19</li>
                <a href="mailto:yinotech@gmail.com">
                  <li>yinotech@gmail.com</li>
                </a>
              </ul>
            </div>
            <div>
              <h6 className="pb-3 text-lg font-semibold uppercase text-neutral-500">
                Find us
              </h6>
              <ul className="flex flex-col justify-evenly gap-2">
                <li>Jos </li>
                <li className="text-neutral-500">
                  Everyday from 10 am to 8 pm
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>© 2024 — Copyright </div>
          <div>Privacy</div>
        </div>
      </footer>
    </>
  );
}
