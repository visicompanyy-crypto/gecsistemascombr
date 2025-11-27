import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useState, useEffect } from 'react';

const steps: Step[] = [
  {
    target: '[data-tour="summary-cards"]',
    content: 'Bem-vindo ao seu painel financeiro! O card principal mostra o Resultado do Mês: se vai sobrar ou faltar dinheiro baseado nas receitas e despesas lançadas.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '[data-tour="new-transaction"]',
    content: 'Clique aqui para adicionar uma nova receita ou despesa. Você pode categorizar, definir vencimentos e formas de pagamento.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="month-selector"]',
    content: 'Navegue entre os meses para ver o histórico financeiro e planejar o futuro.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="filters"]',
    content: 'Use os filtros para encontrar transações específicas por nome, tipo, forma de pagamento ou centro de custo.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="transactions-table"]',
    content: 'Aqui estão todas as suas transações do mês. Você pode visualizar detalhes, editar, excluir ou marcar como paga.',
    placement: 'top',
  },
  {
    target: '[data-tour="charts"]',
    content: 'Visualize a distribuição das suas finanças por categoria em gráficos intuitivos. Tour finalizado! 🎉',
    placement: 'top',
  },
];

interface OnboardingTourProps {
  forceRun?: boolean;
  onComplete?: () => void;
}

export function OnboardingTour({ forceRun, onComplete }: OnboardingTourProps) {
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (forceRun) {
      setRun(true);
      return;
    }
    
    const hasSeenTour = localStorage.getItem('hasSeenOnboardingTour');
    if (!hasSeenTour) {
      // Pequeno delay para garantir que os elementos estejam renderizados
      const timer = setTimeout(() => setRun(true), 500);
      return () => clearTimeout(timer);
    }
  }, [forceRun]);

  const handleCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      localStorage.setItem('hasSeenOnboardingTour', 'true');
      setRun(false);
      onComplete?.();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      scrollToFirstStep
      disableScrolling={false}
      callback={handleCallback}
      styles={{
        options: {
          primaryColor: 'hsl(142, 76%, 36%)',
          backgroundColor: 'hsl(var(--card))',
          textColor: 'hsl(var(--foreground))',
          arrowColor: 'hsl(var(--card))',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 12,
          padding: 20,
        },
        tooltipContent: {
          fontSize: 14,
          lineHeight: 1.6,
        },
        buttonNext: {
          borderRadius: 8,
          padding: '10px 16px',
          fontWeight: 500,
        },
        buttonBack: {
          borderRadius: 8,
          marginRight: 10,
        },
        buttonSkip: {
          color: 'hsl(var(--muted-foreground))',
        },
        spotlight: {
          borderRadius: 12,
        },
      }}
      locale={{
        back: 'Voltar',
        close: 'Fechar',
        last: 'Finalizar',
        next: 'Próximo',
        skip: 'Pular tour',
      }}
    />
  );
}

// Função helper para resetar o tour
export function resetOnboardingTour() {
  localStorage.removeItem('hasSeenOnboardingTour');
}
