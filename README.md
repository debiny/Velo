# Velô Sprint - Configurador de Veículo Elétrico

Aplicação web em React para configuração e compra do veículo elétrico **Velô Sprint**.

## Sobre o Projeto

Uma SPA (Single Page Application) que permite:
- Personalizar cores, rodas e opcionais do veículo
- Calcular preços em tempo real
- Realizar pedidos com análise de crédito
- Consultar status de pedidos

**Especificações do Velô Sprint:** 450 km de autonomia | 0-100 km/h em 3.2s | 500 cv

---

## Stack Tecnológica

| Categoria | Tecnologias |
|-----------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| **Estado** | Zustand (global), React Hook Form (formulários) |
| **Validação** | Zod |
| **Data Fetching** | TanStack Query |
| **Backend** | Supabase (PostgreSQL + Edge Functions) |

---

## Instalação

INSTALAÇÃO DO NODE
Permite rodar o javascript fora do navegadr, react depende do node para rodar. React e feito em node. 

https://nodejs.org/pt-br
baixe uma versão pré-compilada do Node.js

vai abrir uma janela
tecla enter 
yes

tecla enter

abre o terminal
roda node -v
npm -v

abre o prompt como admin
corepack enable

abre o terminal normal
yarn --version
Yes
yarn --version

INSTALAR WINDOWS TERMINAL E GITBASH
https://gitforwindows.org/
Na instalação selecionar Add gitbash profile no Windows terminal
abrir o Windows terminal , na setinha do lado da janela abrir configurações e definir perfil padrão Git bash

GIT BASH
cd /c/Projetos
cd velo-v1

BAIXAR O PROJETO
https://www.dropbox.com/scl/fi/wmpmdncj7lta14ddwlnpc/velo-v1.zip?dl=0&e=1&rlkey=vqhxk691mcsgsxj5yhd1xzq0f&st=7967dcjw

no terminal rodar 

yarn install para instalar as dependências
yarn dev - para subir o projeto







```bash
# Instalar dependências
yarn install

# Rodar em desenvolvimento
yarn run dev
```

Acesse: `http://localhost:5173`

---

## Configuração do Supabase

### 1. Criar Projeto

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Clique em **New Project**
3. Escolha um nome e senha para o banco
4. Aguarde a criação (~2 minutos)

### 2. Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_PROJECT_ID="seu_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="sua_chave_anon_publica"
VITE_SUPABASE_URL="https://seu_project_id.supabase.co"
```

> Encontre essas informações em: **Project Settings → API**

### 3. Deploy (banco + functions)

```bash
# Instalar CLI
yarn add supabase -D

# Login e vincular projeto
yarn supabase login
yarn supabase link --project-ref qjvrogrsyhxvktpvamch

# Aplicar migrações (cria tabelas e RLS)
yarn supabase db push

# Deploy das Edge Functions
yarn supabase functions deploy
```
### Instalar o playwrite
```
npx playwright install
npx playwright test --ui (abre a interface) 

```

Pronto! O banco e as functions estarão configurados.

---

## Estrutura Principal

```
src/
├── pages/           # Páginas da aplicação
├── components/      # Componentes React
│   ├── configurator/   # Configurador do carro
│   ├── landing/        # Landing page
│   └── ui/             # Componentes shadcn/ui
├── store/           # Estado global (Zustand)
├── hooks/           # Hooks customizados
└── integrations/    # Cliente Supabase
```

---

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page |
| `/configure` | Configurador do veículo |
| `/order` | Checkout/Pedido |
| `/success` | Confirmação do pedido |
| `/lookup` | Consulta de pedidos |

---

## Modelo de Preços

- **Preço base:** R$ 40.000
- **Rodas Sport:** +R$ 2.000
- **Precision Park:** +R$ 5.500
- **Flux Capacitor:** +R$ 5.000
- **Financiamento:** 12x com juros de 2% a.m.

---

## Banco de Dados

**Tabela `orders`** — campos principais:
- `order_number` — Formato: VLO-XXXXXX
- `color`, `wheel_type`, `optionals` — Configuração
- `customer_name`, `customer_email`, `customer_cpf` — Cliente
- `payment_method`, `total_price` — Pagamento
- `status` — pending, approved, rejected, analysis

---

## Análise de Crédito

| Score | Resultado |
|-------|-----------|
| > 700 | Aprovado |
| 501-700 | Em análise |
| ≤ 500 | Reprovado |

*Se entrada ≥ 50% do total, aprova mesmo com score < 700*

---

## Fluxo Principal

```
Landing → Configurador → Checkout → Análise de Crédito → Confirmação
```

---

## Scripts

```bash
npm run dev      # Desenvolvimento
npm run build    # Build de produção
npm run lint     # Verificar código
```

## Comandos

```bash
yarn dev      # Sobe a aplicação em desenvolvimento
yarn test     # Roda os testes unitários
yarn build    # Gera o pacote de produção na pasta dist
```

## Playwright

```bash
# Instalar os navegadores usados pelo Playwright (só na primeira vez)
npx playwright install

# Rodar todos os testes e2e (já sobe a aplicação, conforme configurado no playwright.config)
npx playwright test

# Executar os testes unitários
yarn test

# Executar os testes E2E localmente (localhost:5173)
yarn playwright test

# Executar os testes E2E na URL de preview da Vercel (sem sujar o terminal)
npx cross-env BASE_URL="https://velo-3jpciamix-debiny1.vercel.app" yarn playwright test

# Caso tenha usado $env:BASE_URL no PowerShell e queira voltar ao localhost:
Remove-Item env:BASE_URL

# Rodar com a interface visual (ver os testes passo a passo)
npx playwright test --ui

# Rodar com o navegador visível (sem headless)
npx playwright test --headed

# Rodar um arquivo de teste específico
npx playwright test playwright/e2e/configurator.spec.ts

# Rodar em modo debug (pausa e permite inspecionar cada passo)
npx playwright test --debug

# Gravar um teste navegando manualmente (gera o código automaticamente)
npx playwright codegen http://localhost:5173

# Abrir o relatório HTML da última execução
npx playwright show-report
```

## Git

### Fluxo para subir alterações (do dia a dia)

```bash
# 1. Criar uma branch nova a partir da main (só na primeira vez da tarefa)
git checkout main
git pull
git checkout -b nome-da-branch

# 2. Ver o que foi alterado/criado
git status
git diff

# 3. Adicionar os arquivos que vão para o commit
git add caminho/do/arquivo
# ou, para adicionar tudo que foi alterado:
git add .

# 4. Criar o commit com uma mensagem
git commit -m "mensagem do commit"

# 5. Enviar os commits para o repositório remoto (primeira vez na branch)
git push -u origin nome-da-branch
# nas próximas vezes, com a branch já configurada, basta:
git push
```

### Trazer a branch atualizada com a main / mergear

```bash
# Atualizar a main local com o remoto
git checkout main
git pull

# Voltar para a sua branch e trazer as novidades da main para dentro dela
git checkout nome-da-branch
git merge main

# Se preferir abrir Pull Request no GitHub em vez de merge local (recomendado):
# 1. Suba a branch com "git push -u origin nome-da-branch"
# 2. Abra o Pull Request no GitHub da sua branch para a main
# 3. Após aprovado, faça o merge por lá

# Depois do merge, se quiser apagar a branch que não é mais usada:
git branch -d nome-da-branch          # local
git push origin --delete nome-da-branch  # remota
```
git reset --soft HEAD~1  # para apagar o ultimo commit mas manter os arquivos
git checkout -- nome-da-branch #apaga os arquivos modificados

### Outros comandos úteis

```bash
# Ver o histórico de commits (resumido)
git log --oneline

# Trocar de branch já existente
git checkout nome-da-branch

# Descartar alterações locais de um arquivo (não commitadas)
git checkout -- caminho/do/arquivo
```

### Outros comandos úteis

``` Executar os testes no amboente local
 yarn playwright test
```
``` Executar os testes passando a url de preview
$env:BASE_URL="https://velo-3jpciamix-debiny1.vercel.app"; yarn playwright test
```
``` Para rodar os testes unitarios 
yarn test
```