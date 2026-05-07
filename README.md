# Revisões Peugeot 2008

Checklist pessoal e priorizado de revisão para um Peugeot 2008 1.6 AT 2017 com ~147 mil km. Lista os itens agrupados por prioridade (segurança, motor, arrefecimento, câmbio, suspensão, extras), permite marcar como feito e registrar o preço pago + oficina, e mostra próximos serviços programados com base na quilometragem atual.

Projeto pessoal feito com **[Claude Code](https://claude.com/claude-code)** — do handoff de design ao deploy. Serve como item de portfólio e como ferramenta real de uso no carro.

## O que faz

- Lista de itens por prioridade com estimativa de custo por bloco.
- Marcar item como feito + registrar preço pago e nome da oficina.
- Cluster com KM atual, total de itens concluídos e próximos serviços (troca de óleo, alinhamento, filtro de ar, etc.) calculados a partir do KM.
- Filtros por status (pendente / feito) e por prioridade.
- Tema claro / escuro e toggle de privacidade pra esconder valores em R$.
- Estado persiste no Supabase — marca no celular, vê no notebook.

## Rodar local

```bash
npm install
npm run dev
```

Criar `.env.local` (não versionado) com as chaves do seu projeto Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://<seu-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

O esquema das tabelas (`items`, `car`) está documentado em [STACK.md](STACK.md#esquema-do-banco-supabase).

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Linguagem | [TypeScript](https://www.typescriptlang.org/) |
| UI | [React 19](https://react.dev/) + CSS plano com design tokens |
| Backend | Next.js API Routes (`app/api/*`) |
| Banco de dados | [Supabase](https://supabase.com/) (Postgres) |
| Hospedagem | [Vercel](https://vercel.com/) |
| Versionamento | Git + [GitHub](https://github.com/) |
| Ferramenta de desenvolvimento | [Claude Code](https://claude.com/claude-code) (Anthropic) |
| Assistente de design (protótipo) | [Claude](https://claude.ai/) |

Decisões técnicas detalhadas em [STACK.md](STACK.md).
