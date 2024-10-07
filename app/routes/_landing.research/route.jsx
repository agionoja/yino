import doctor from "../../assets/landing/doctor.png";
import agriculture from "../../assets/landing/agriculture.png";
import educaction from "../../assets/landing/edu.png";

const researchData = [
  {
    id: 1,
    icon: educaction,
    name: "Education",
    content:
      "Our research in education explores innovative methods and tools to enhance learning experiences, making education more accessible, engaging, and effective for learners worldwide.",
  },
  {
    id: 2,
    icon: doctor,
    name: "Health",
    content:
      "Our research in health focuses on developing cutting-edge technologies and solutions to improve patient outcomes, enhance medical practices, and address global health challenges.",
  },
  {
    id: 3,
    icon: agriculture,
    name: "Agriculture",
    content:
      "We are revolutionizing agriculture through research aimed at increasing productivity, sustainability, and resilience in the face of climate change, ensuring food security for future generations.",
  },
];

export default function Research() {
  return (
    <section className="text-text-gray p-4 lg:px-20">
      <div className="mb-5 flex flex-col items-center">
        <span className="mb-2 rounded-3xl bg-gradient-to-r from-anti-flash-white via-blue to-anti-flash-white px-8 py-0.5 text-center font-medium text-white">
          Research
        </span>
        <h2 className="mb-4 text-4xl font-semibold text-black">
          Our Research Areas
        </h2>
        <p className="text-center">
          Explore our dedicated research areas in Health, Agriculture, and
          Education, where we innovate for a better future.
        </p>
      </div>
      <div className="flex flex-col items-center gap-4 lg:flex-row">
        {researchData.map((item) => (
          <div key={item.id}>
            <div className="flex h-[305px] flex-col items-start gap-6 rounded-lg border border-gray-400 px-6 py-3 lg:py-6 shadow-sm lg:w-[389px]">
              <div className="bg-imgage-bg mx-auto flex h-16 w-16 items-center justify-center rounded-full p-1">
                <img
                  src={item.icon}
                  alt="img"
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-black">{item.name}</h3>
              <p>{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
