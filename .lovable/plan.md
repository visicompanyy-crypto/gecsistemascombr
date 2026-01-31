
## Plano: Adicionar Google Analytics (gtag.js)

### O que será feito

Adicionar o código de rastreamento do Google Analytics (Google Tag) ao site com o ID **G-F03PGF91L4**, conforme mostrado na imagem.

### Alteração Necessária

**Arquivo:** `index.html`

Adicionar o código do Google Tag logo após a abertura do `<head>`, antes dos outros scripts. O código será inserido na seguinte ordem:

1. Script externo do gtag.js
2. Script de configuração com o ID de medição

#### Código a ser adicionado (após linha 5, antes das meta tags):

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-F03PGF91L4"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-F03PGF91L4');
</script>
```

### Estrutura Final do Head

```
<head>
  ├── Meta charset e viewport
  ├── Title
  ├── 🆕 Google Analytics (gtag.js) - G-F03PGF91L4
  ├── Meta description e author
  ├── Favicon
  ├── Google Fonts
  ├── Open Graph / Twitter meta tags
  ├── Meta Pixel (Facebook) - já existente
</head>
```

### Resultado Esperado

- Google Analytics ativo em todas as páginas do site
- Rastreamento automático de PageViews
- Dados disponíveis no Google Analytics 4 (GA4) com o ID G-F03PGF91L4
- Funciona junto com o Meta Pixel já existente (não há conflito)
