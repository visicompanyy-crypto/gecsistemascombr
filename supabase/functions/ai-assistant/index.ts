import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `Você é o assistente virtual do Saldar - Sistema de Gestão Financeira Inteligente.

SOBRE O SALDAR:
Sistema de gestão financeira pessoal e empresarial para controle de receitas e despesas.

FUNCIONALIDADES PRINCIPAIS:

1. CADASTRO DE TRANSAÇÕES:
- Receitas: dinheiro que entra (salário, vendas, etc.)
- Despesas: dinheiro que sai (contas, compras, etc.)
- Campos: descrição, valor, data de vencimento, forma de pagamento, centro de custo, cliente
- Formas de pagamento: PIX, Cartão de Crédito, Cartão de Débito, Boleto, Dinheiro, Transferência

2. CENTROS DE CUSTO:
- Categorias para organizar transações
- Tipos: Receita ou Despesa
- Exemplos: "Salário" (receita), "Alimentação" (despesa), "Freelance" (receita)
- Acesse pelo menu de Configurações ou pelo botão de gerenciar centros de custo

3. CLIENTES:
- Cadastro com nome e chave PIX
- Ao selecionar um cliente, a chave PIX é preenchida automaticamente
- Facilita pagamentos recorrentes para o mesmo destinatário

4. CARDS DE RESUMO FINANCEIRO:
- Resultado do Mês: receitas recebidas - despesas pagas (verde = positivo, vermelho = negativo)
- Receita Total Recebida: soma das receitas já recebidas no mês
- Receitas Futuras: receitas pendentes (ainda não recebidas)
- Despesas Futuras: despesas pendentes (ainda não pagas)

5. FILTROS:
- Por nome/descrição: digite para buscar
- Por tipo (receita/despesa): selecione no dropdown
- Por forma de pagamento: PIX, Cartão, Boleto, etc.
- Por centro de custo: suas categorias cadastradas

6. NAVEGAÇÃO POR MÊS:
- Use as setas < > para navegar entre meses
- Pode lançar transações com vencimento em qualquer mês futuro ou passado

7. GRÁFICOS:
- Pizza de receitas por centro de custo: veja de onde vem seu dinheiro
- Pizza de despesas por centro de custo: veja para onde vai seu dinheiro

8. STATUS DE TRANSAÇÃO:
- Pendente: ainda não pago/recebido (aparece destacado)
- Pago/Recebido: já concluído (pode ser marcado clicando no ícone de check)

9. AÇÕES EM TRANSAÇÕES:
- Ver detalhes: clique na transação
- Editar: botão de lápis
- Excluir: botão de lixeira
- Marcar como pago: botão de check

COMO RESPONDER:
- Seja claro, objetivo e amigável
- Use linguagem simples e direta
- Explique passo a passo quando necessário
- Se não souber algo específico do sistema, sugira entrar em contato com suporte
- Responda sempre em português do Brasil
- Use emojis com moderação para ser mais amigável 😊
- Mantenha respostas concisas mas completas`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("AI Assistant: Processing request with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Muitas requisições. Aguarde um momento e tente novamente." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Limite de uso atingido. Entre em contato com o suporte." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Erro ao processar sua mensagem. Tente novamente." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI Assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
