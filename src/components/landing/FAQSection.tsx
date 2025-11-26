import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "O que é a Saldar?",
      answer: "A Saldar é uma plataforma financeira criada para simplificar o controle de receitas, despesas e projeções para empresas brasileiras.",
    },
    {
      question: "Para quem a Saldar foi criada?",
      answer: "Para MEIs, autônomos e pequenas empresas que precisam de organização financeira sem complicação.",
    },
    {
      question: "A Saldar substitui planilhas?",
      answer: "Sim. Todo o controle financeiro é automatizado e visual, sem fórmulas nem tabelas confusas.",
    },
    {
      question: "A plataforma é difícil de usar?",
      answer: "Não. A interface é intuitiva, minimalista e fácil de entender mesmo para quem não domina finanças.",
    },
    {
      question: "Posso controlar recebimentos e pagamentos futuros?",
      answer: "Sim. A Saldar mostra projeções automáticas do mês e avisa sobre vencimentos.",
    },
    {
      question: "A Saldar organiza parcelamentos?",
      answer: "Sim. O sistema gera todas as parcelas automaticamente.",
    },
  ];

  return (
    <section className="py-20 px-6 bg-landing-bg">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-public-sans text-4xl md:text-5xl font-bold text-landing-text mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-gray-600">
            Tudo o que você precisa saber sobre a Saldar
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden"
            >
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem
                  value={`item-${index}`}
                  className="border-0"
                >
                  <AccordionTrigger className="text-left text-lg font-medium text-landing-text hover:text-landing-green transition-colors px-6 py-6 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-gray-600 leading-relaxed px-6 pb-6 animate-fade-in border-t border-gray-200">
                    <div className="pt-4">
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </div>

        {/* CTA Footer */}
        <div className="text-center mt-12 animate-fade-in">
          <p className="text-gray-600 mb-4">
            Ainda tem dúvidas?
          </p>
          <a
            href="/login"
            className="inline-flex items-center justify-center text-landing-green font-medium hover:text-landing-green-accent transition-colors"
          >
            Entre em contato conosco →
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
