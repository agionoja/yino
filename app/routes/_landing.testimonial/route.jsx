// import TestimonialSwiper from "../../components/TestimonialSwiper";

export default function Testimonials() {
  return (
    <section className="p-4 text-text-gray lg:px-20">
      <div className="mb-5 flex flex-col items-center">
        <span className="mb-2 rounded-3xl bg-gradient-to-r from-anti-flash-white via-blue to-anti-flash-white px-8 py-0.5 text-center font-medium text-white">
          Testimonial
        </span>
        <h2 className="mb-4 text-4xl font-semibold text-black">
          What Our Clients Say
        </h2>
        <p className="text-center">
          See what our clients are saying about their experiences with Yino
          Technology.
        </p>
      </div>
      {/* <TestimonialSwiper /> */}
    </section>
  );
}
