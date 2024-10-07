import mall1 from "../../assets/landing/mall1.png";
import mall2 from "../../assets/landing/mall2.png";
import mall3 from "../../assets/landing/mall3.png";

const data = [
  {
    id: 1,
    img: mall1,
    title: "E-Commerce Platform Development for ABC Ltd.",
    content: `We built a scalable and secure e-commerce platform that increased ABC Ltd.'s online sales by 50%`,
    time: "12 hours ago",
  },
  {
    id: 2,
    img: mall2,
    title: "E-Commerce Platform Development for ABC Ltd.",
    content: `We built a scalable and secure e-commerce platform that increased ABC Ltd.'s online sales by 50%`,
    time: "12 hours ago",
  },
  {
    id: 3,
    img: mall3,
    title: "E-Commerce Platform Development for ABC Ltd.",
    content: `We built a scalable and secure e-commerce platform that increased ABC Ltd.'s online sales by 50%`,
    time: "12 hours ago",
  },
];

export default function Work() {
  return (
    <section className="p-4 text-text-gray lg:px-20">
      <div className="mb-5 flex flex-col items-center">
        <span className="mb-2 rounded-3xl bg-gradient-to-r from-anti-flash-white via-blue to-anti-flash-white px-8 py-0.5 text-center font-medium text-white">
          Works
        </span>
        <h2 className="mb-4 text-4xl font-semibold text-black">
          Our Work In Action
        </h2>
        <p className="text-center lg:flex lg:flex-col">
          Explore our portfolio of standout projects where we've delivered
          impactful solutions, showcasing our expertise and
          <span className="pl-2">
            commitment to driving success for our clients.
          </span>
        </p>
      </div>
      <div className="flex flex-col items-center gap-6">
        <div className="mb-4 flex flex-col items-center gap-4 lg:flex-row">
          {data.map((item) => (
            <div key={item.id}>
              <div className="flex h-[276px] w-[389px] flex-col items-center">
                <div>
                  <img
                    src={item.img}
                    alt="icon"
                    className="h-full w-full rounded-t-lg object-contain"
                  />
                </div>

                <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
                  <h3 className="text-[16px] font-medium text-black">
                    {item.title}
                  </h3>
                  <p>{item.content}</p>
                  <span className="mt-2 block font-medium text-black">
                    {item.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
