import html from "../../assets/landing/html-3.png";
import mobile from "../../assets/landing/monitor-mobbile.png";
import tech from "../../assets/landing/monitor-recorder.png";
import sourcing from "../../assets/landing/watch-status.png";
import consultancy from "../../assets/landing/health.png";
const serviceData = [
  {
    id: 1,
    icon: html,
    name: "Website Development",
    content:
      "Crafting responsive and high-performing websites tailored to your needs.",
  },
  {
    id: 2,
    icon: mobile,
    name: "Mobile Development",
    content:
      "Building innovative and user-friendly mobile applications across platforms.",
  },
  {
    id: 3,
    icon: tech,
    name: "Tech Training",
    content:
      "Upskill your team with our expert-led training programs in the latest technologies.",
  },
  {
    id: 4,
    icon: sourcing,
    name: "Out Sourcing",
    content:
      "Leverage our expert team to handle your business operations efficiently.",
  },
  {
    id: 5,
    icon: consultancy,
    name: "Consultancy",
    content:
      "Get tailored advice from our seasoned consultants to drive your business forward.",
  },
];

export default function Services() {
  return (
    <section className="p-4 text-text-gray lg:px-20">
      <div className="mb-5 flex flex-col items-center">
        <span className="mb-2 rounded-3xl bg-gradient-to-r from-anti-flash-white via-blue to-anti-flash-white px-8 py-0.5 text-center font-medium text-white">
          Services
        </span>
        <h2 className="mb-4 text-4xl font-semibold text-black">
          Our Expertise
        </h2>
        <p className="text-center lg:flex lg:flex-col">
          Explore our comprehensive range of services designed to empower your
          business with expert
          <span className="pl-2">
            training, innovative development, and tailored solutions to drive
            your success.
          </span>
        </p>
      </div>
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          {serviceData.slice(0, 2).map((item) => (
            <div key={item.id}>
              <div className="flex h-[226px] flex-col items-start gap-6 rounded-lg border border-anti-flash-white p-6 shadow-sm shadow-white lg:w-[596px]">
                <div className="flex items-center justify-center rounded-full bg-imgage-bg p-2">
                  <img
                    src={item.icon}
                    alt="icon"
                    className="h-full w-full object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold text-black">{item.name}</h3>
                <p>{item.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 lg:flex-row">
          {serviceData.slice(2).map((item) => (
            <div key={item.id} className="flex items-center">
              <div className="flex h-[226px] flex-col items-start gap-6 rounded-lg border border-anti-flash-white p-4 shadow-sm shadow-white lg:w-[389.33px]">
                <div className="flex items-center justify-center rounded-full bg-imgage-bg p-2">
                  <img
                    src={item.icon}
                    alt="icon"
                    className="h-full w-full object-contain"
                  />
                </div>

                <h3 className="text-xl font-bold text-black">{item.name}</h3>
                <p>{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
