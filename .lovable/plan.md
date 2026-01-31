

## Plano: Botões de Tema e Repetir Tutorial no Header

### Resumo das Alterações Solicitadas

1. **Tutorial aparecer apenas na primeira vez** - O sistema já verifica se o usuário viu o tour via `localStorage`, mas precisamos garantir que funcione corretamente
2. **Adicionar botão de modo claro/escuro** - Toggle entre tema light (atual) e dark
3. **Adicionar botão para rever o tutorial** - Permitir que o usuário assista novamente o passo a passo

---

## Arquitetura da Solução

### 1. Criar Componente de Controles do Header

**Novo arquivo:** `src/components/header/HeaderControls.tsx`

Este componente terá dois botões:
- **Toggle de tema** (Sol/Lua) - Alterna entre modo claro e escuro
- **Botão de tutorial** (ícone de pergunta/ajuda) - Reinicia o tour de onboarding

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Menu Empresa]      [Logo Saldar]      [☀️] [❓] [🔔] [Avatar]    │
└─────────────────────────────────────────────────────────────────────┘
                                          ↑     ↑
                                         Tema  Tutorial
```

### 2. Implementar Sistema de Tema

O projeto já tem a biblioteca `next-themes` instalada e as variáveis CSS para modo `.dark` já estão definidas no `index.css` (linhas 84-139).

**Arquivo:** `src/App.tsx`
- Adicionar `ThemeProvider` do `next-themes` para gerenciar o tema globalmente

**Arquivo:** `src/components/header/HeaderControls.tsx`
- Usar hook `useTheme` do `next-themes` para alternar tema
- Botão com ícone de Sol (modo claro) ou Lua (modo escuro)

### 3. Implementar Botão de Rever Tutorial

**Arquivo:** `src/components/header/HeaderControls.tsx`
- Botão que chama a função `resetOnboardingTour()` (já existente)
- Após resetar, dispara callback para reiniciar o tour

**Arquivo:** `src/components/FinanceView.tsx`
- Passar prop `onRestartTour` para o Header
- Usar estado `forceRun` no OnboardingTour quando tutorial é reiniciado

---

## Arquivos a Modificar/Criar

| Arquivo | Alteração |
|---------|-----------|
| `src/components/header/HeaderControls.tsx` | **NOVO** - Botões de tema e tutorial |
| `src/components/Header.tsx` | Integrar HeaderControls ao lado direito |
| `src/App.tsx` | Adicionar ThemeProvider |
| `src/components/FinanceView.tsx` | Adicionar estado e callback para reiniciar tour |

---

## Detalhes Técnicos

### HeaderControls.tsx (Novo Componente)

```typescript
// Ícones: Sun, Moon, HelpCircle do lucide-react
// useTheme() do next-themes para alternar tema
// resetOnboardingTour() para reiniciar tutorial

export function HeaderControls({ onRestartTour }) {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="flex items-center gap-1">
      {/* Toggle Tema */}
      <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        {theme === 'dark' ? <Sun /> : <Moon />}
      </Button>
      
      {/* Rever Tutorial */}
      <Button onClick={() => {
        resetOnboardingTour();
        onRestartTour();
      }}>
        <HelpCircle />
      </Button>
    </div>
  );
}
```

### App.tsx (ThemeProvider)

```typescript
import { ThemeProvider } from "next-themes";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light">
      // ... resto do app
    </ThemeProvider>
  </QueryClientProvider>
);
```

### FinanceView.tsx (Estado do Tour)

```typescript
const [forceTourRun, setForceTourRun] = useState(false);

// No Header, passar callback
<Header onRestartTour={() => setForceTourRun(true)} />

// No OnboardingTour
<OnboardingTour 
  forceRun={forceTourRun} 
  onComplete={() => setForceTourRun(false)}
/>
```

---

## Resultado Esperado

- O tutorial aparece apenas na primeira vez que o usuário acessa (verificação via localStorage + onboarding_completed)
- Botão de Sol/Lua no header alterna entre tema claro e escuro
- Botão de Ajuda (?) permite rever o tutorial a qualquer momento
- Interface limpa e intuitiva no canto superior direito

