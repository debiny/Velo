# Velô Sprint

## Comunicação
- Responda sempre em português (pt-BR).
- Ao concluir uma tarefa, explique detalhadamente o que foi feito e onde (arquivos, linhas e motivo).

## Testes E2E (Playwright)
- Casos de teste funcionais documentados em [docs/tests/velo-test-cases.md](docs/tests/velo-test-cases.md) (CT01–CT11).
- Testes em `playwright/e2e/*.spec.ts`, com Page Objects/actions em `playwright/support/actions/`.
- Os testes de checkout/análise de crédito dependem de um banco Postgres local via Supabase (`npx supabase start`, requer Docker rodando). Sem isso, `deleteOrderByEmail` falha com `AggregateError` de conexão.
