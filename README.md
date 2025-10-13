# BarberTime+ 💈

Sistema de agendamento digital para barbearias desenvolvido com React + TypeScript.

## 🚀 Funcionalidades

- ✅ **Agendamento Online**: Interface intuitiva para clientes
- ✅ **Seleção de Barbeiros**: Escolha seu profissional preferido
- ✅ **Catálogo de Serviços**: Cortes, barba, tratamentos e combos
- ✅ **Calendário Inteligente**: Visualização de horários disponíveis
- ✅ **Painel Administrativo**: Gestão completa para proprietários
- ✅ **Responsivo**: Funciona perfeitamente em mobile e desktop

## 🛠️ Tecnologias

- **React 19.2.0** - Interface moderna e reativa
- **TypeScript** - Tipagem estática para maior segurança
- **Vite** - Build tool ultra-rápido
- **Google Gemini AI** - Inteligência artificial integrada

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

## 🚀 Como executar

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/appfbj-stack/barbeariadigital.git
   cd barbeariadigital
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env.local
   ```
   Edite o arquivo `.env.local` e adicione sua chave da API do Gemini.

4. **Execute o projeto:**
   ```bash
   npm run dev
   ```

5. **Acesse:** http://localhost:3000

## 🔐 Configuração da API

Obtenha sua chave da API do Google Gemini em: https://makersuite.google.com/app/apikey

## 📁 Estrutura do Projeto

```
├── components/          # Componentes React
├── constants.ts         # Constantes da aplicação
├── types.ts            # Definições de tipos TypeScript
├── .env.example        # Exemplo de variáveis de ambiente
└── ...
```

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto está sob a licença MIT.
