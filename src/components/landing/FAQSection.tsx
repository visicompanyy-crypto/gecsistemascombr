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
    <section className="py-20 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-muted-foreground">
            Tudo o que você precisa saber sobre a Saldar
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-card rounded-2xl shadow-sm border border-border/40 p-8 md:p-12 animate-fade-in">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-secondary/20 last:border-0 pb-4 last:pb-0"
              >
                <AccordionTrigger className="text-left text-lg font-medium text-foreground hover:text-primary transition-colors py-4 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2 pb-4 animate-fade-in">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA Footer */}
        <div className="text-center mt-12 animate-fade-in">
          <p className="text-muted-foreground mb-4">
            Ainda tem dúvidas?
          </p>
          <a
            href="/login"
            className="inline-flex items-center justify-center text-primary font-medium hover:text-primary-dark transition-colors"
          >
            Entre em contato conosco →
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
