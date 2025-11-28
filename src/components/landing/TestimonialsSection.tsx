import { TestimonialCard } from "./TestimonialCard";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "João Silva",
      location: "São Paulo, SP",
      company: "Agência de Marketing",
      testimonial: "As projeções automáticas me ajudam a tomar decisões com confiança. Finalmente consigo planejar investimentos sabendo quanto vai sobrar.",
      initials: "JS",
    },
    {
      name: "Ana Costa",
      location: "Belo Horizonte, MG",
      company: "Estúdio de Design",
      testimonial: "O sistema de parcelamento é perfeito. Compro equipamentos parcelados e a Saldar já organiza tudo automaticamente. Muito prático.",
      initials: "AC",
    },
  ];

  return (
    <section id="depoimentos" className="py-20 md:py-28">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-public-sans text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Empresas que já utilizam a Saldar
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};
