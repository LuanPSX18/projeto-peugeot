# Revisões Peugeot 2008

Checklist pessoal e priorizado de revisão para um Peugeot 2008 1.6 AT 2017 com ~147 mil km.

Projeto pessoal feito com **[Claude Code](https://claude.com/claude-code)** — do handoff de design ao deploy. Serve como item de portfólio e como ferramenta real de uso no carro.

**URL pública:** https://projeto-peugeot.vercel.app

![Tela principal](docs/screenshots/main-dark.png)

---

## O que faz

- **Checklist priorizado** — itens agrupados em blocos (segurança, motor, arrefecimento, câmbio, suspensão, extras) com estimativa de custo por bloco.
- **Marcar como feito** — registra o item com preço pago, oficina e a quilometragem do momento.
- **Editar KM na UI** — clica no odômetro, digita o novo valor, salva. Sem precisar abrir o Supabase.
- **Próximos serviços** — cálculo automático de troca de óleo, alinhamento, filtro de ar etc. com base no KM atual.
- **Histórico permanente** — cada serviço feito vira uma linha no histórico com data, km e preço. Marcar o mesmo item duas vezes gera duas entradas separadas.
- **Foto da nota fiscal** — anexa foto do recibo a qualquer entrada do histórico. Armazenado em bucket privado no Supabase Storage; visualizado via signed URL.
- **Filtros** por status (pendente / feito) e por prioridade.
- **Tema claro / escuro** e toggle de privacidade pra esconder valores em R$.
- **Feedback de rede** — indicador de "salvando" na TopBar e toast de erro com rollback automático em caso de falha.
- **Auth** — login com email/senha. Leitura pública para qualquer visitante; edição restrita ao dono.

---

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

O esquema completo das tabelas está documentado em [STACK.md](STACK.md#esquema-do-banco-supabase).

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Linguagem | [TypeScript](https://www.typescriptlang.org/) |
| UI | [React 19](https://react.dev/) + CSS plano com design tokens |
| Backend | Next.js API Routes (`app/api/*`) |
| Banco de dados | [Supabase](https://supabase.com/) (Postgres + Storage + Auth) |
| Hospedagem | [Vercel](https://vercel.com/) |
| Versionamento | Git + [GitHub](https://github.com/) |
| Ferramenta de desenvolvimento | [Claude Code](https://claude.com/claude-code) (Anthropic) |

Decisões técnicas detalhadas em [STACK.md](STACK.md).
