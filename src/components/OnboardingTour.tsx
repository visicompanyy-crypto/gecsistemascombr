import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useState, useEffect } from 'react';

const steps: Step[] = [
  {
    target: '[data-tour="summary-cards"]',
    content: 'Este é o Resultado do Mês - mostra se vai sobrar ou faltar dinheiro. Verde = positivo, Vermelho = negativo. Os cards abaixo mostram receitas recebidas, receitas futuras, despesas futuras e totais do mês.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '[data-tour="new-transaction"]',
    content: 'Clique aqui para adicionar receitas ou despesas. Você pode definir: nome, valor, data de vencimento, forma de pagamento (PIX, cartão, boleto), centro de custo, e associar a um cliente para facilitar pagamentos futuros.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="month-selector"]',
    content: 'Navegue entre os meses para ver o histórico ou planejar o futuro. Você pode lançar despesas e receitas com vencimento em qualquer mês.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="filters"]',
    content: 'Use os filtros para encontrar transações específicas. Filtre por nome, tipo (receita/despesa), forma de pagamento ou centro de custo que você configurou.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="transactions-table"]',
    content: 'Aqui estão todas as transações do mês. Você pode: ver detalhes, editar, excluir ou marcar como paga. Transações pagas ficam com status diferente das pendentes.',
    placement: 'top',
  },
  {
    target: '[data-tour="charts"]',
    content: 'Visualize a distribuição das suas finanças por centro de custo. Receitas e despesas são separadas para você entender melhor para onde vai seu dinheiro. Tour finalizado! 🎉',
    placement: 'top',
  },
];

interface OnboardingTourProps {
  forceRun?: boolean;
  onComplete?: () => void;
  shouldRun?: boolean;
}

export function OnboardingTour({ forceRun, onComplete, shouldRun = true }: OnboardingTourProps) {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Don't start if shouldRun is false (e.g., FirstAccessModal is still open)
    if (!shouldRun) {
      setRun(false);
      return;
    }

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
  }, [forceRun, shouldRun]);

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
