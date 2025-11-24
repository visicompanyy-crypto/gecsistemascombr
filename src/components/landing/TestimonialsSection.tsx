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
    <section id="depoimentos" className="bg-white py-20 md:py-32">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="title-outlined text-4xl md:text-5xl lg:text-6xl mb-6">
            Empresas que confiam na Saldar
          </h2>
          <p className="text-xl text-gray-600">
            Veja o que nossos clientes têm a dizer
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};
