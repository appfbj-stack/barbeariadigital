# Configuração do GitHub Pages

## Passos para configurar o GitHub Pages:

### 1. Configurar Secrets no GitHub
Acesse: `Settings > Secrets and variables > Actions` no seu repositório e adicione:

- `VITE_SUPABASE_URL`: URL do seu projeto Supabase
- `VITE_SUPABASE_ANON_KEY`: Chave anônima do Supabase  
- `VITE_GEMINI_API_KEY`: Chave da API do Gemini (opcional)

### 2. Ativar GitHub Pages
1. Vá em `Settings > Pages` no repositório
2. Em "Source", selecione "GitHub Actions"
3. O workflow será executado automaticamente

### 3. Verificar Deploy
- O workflow roda automaticamente a cada push na branch `main`
- Verifique em `Actions` se o deploy foi bem-sucedido
- A aplicação estará disponível em: `https://appfbj-stack.github.io/barbeariadigital/`

### 4. Estrutura de Arquivos
```
dist/                    # Pasta de build (gerada automaticamente)
├── index.html          # Página principal
├── assets/             # JS e CSS compilados
├── manifest.webmanifest # PWA manifest
└── *.png, *.svg        # Ícones e imagens

.github/workflows/
└── deploy.yml          # Workflow de deploy automático
```

### 5. Comandos Úteis
```bash
npm run build          # Gerar build de produção
npm run preview        # Testar build localmente
```

## Troubleshooting

### Se o site não carregar:
1. Verifique se os secrets estão configurados
2. Confirme que o workflow executou sem erros
3. Aguarde alguns minutos para propagação do DNS
4. Limpe o cache do navegador

### Se houver erro 404:
- Confirme que a configuração `base: '/barbeariadigital/'` está no `vite.config.ts`
- Verifique se o repositório se chama exatamente `barbeariadigital`