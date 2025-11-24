import { TestimonialCard } from "./TestimonialCard";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Maria Santos",
      location: "Florianópolis, SC",
      company: "Loja de Roupas",
      testimonial: "Antes eu perdia horas com planilhas. Agora em 5 minutos eu sei exatamente como está meu financeiro. A Saldar simplificou tudo.",
      initials: "MS",
    },
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
    <section id="depoimentos" className="bg-white py-20 md:py-28">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="bg-fintech-white-ice rounded-3xl p-12 md:p-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#252F1D]">
              Empresas que já utilizam a Saldar
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
