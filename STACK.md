# STACK — decisões técnicas

Este arquivo complementa o [README.md](README.md) (que é o handoff de design do Claude Design e cobre UI/UX/dados). Aqui ficam só as escolhas de **stack, ferramentas e infraestrutura** que o handoff propositalmente deixou em aberto.

## Stack

| Camada | Escolha | Por quê |
|---|---|---|
| Framework | Next.js 16 (App Router) | Frontend + backend num projeto só. Roda direto na Vercel. |
| Linguagem | TypeScript | Pega erros antes de rodar. Bom para iniciante aprender com segurança. |
| Estilo | CSS plano (`app/globals.css`) | O design já foi escrito em CSS variables no protótipo — porte direto, sem Tailwind. |
| Banco | Supabase (Postgres) | Substitui o `localStorage` do protótipo. Free tier basta. |
| Hospedagem | Vercel | Integração nativa com Next.js, deploy a cada push no GitHub. |
| Versionamento | Git + GitHub | Histórico + gatilho de deploy. |

**Não usado:** monorepo, Tailwind, ORMs (Prisma/Drizzle), state managers (Redux/Zustand). Projeto pessoal pequeno — sem necessidade.

## Estrutura de pastas

```
projeto-peugeot/
├── app/                    # rotas Next.js (App Router)
│   ├── page.tsx            # tela única do app
│   ├── layout.tsx          # shell HTML + fontes
│   ├── globals.css         # CSS com tokens do design
│   └── api/                # endpoints de backend
│       ├── items/route.ts  # GET/PUT estado dos itens
│       └── car/route.ts    # GET info do carro
├── components/             # componentes React (TopBar, Cluster, PriorityCard, etc)
├── lib/
│   ├── supabase.ts         # cliente Supabase
│   ├── data.ts             # dataset estático (prioridades, schedule)
│   └── types.ts            # tipos compartilhados
├── public/                 # assets estáticos
├── design-reference/       # protótipo HTML original (referência visual)
├── .env.local              # chaves Supabase — NUNCA versionar
├── README.md               # handoff de design (Claude Design)
└── STACK.md                # este arquivo
```

## Variáveis de ambiente

Em `.env.local` (criado quando configurarmos o Supabase):

```
NEXT_PUBLIC_SUPABASE_URL=...        # URL do projeto
NEXT_PUBLIC_SUPABASE_ANON_KEY=...   # chave pública (ok expor no browser)
SUPABASE_SERVICE_ROLE_KEY=...       # chave admin — só no servidor
```

## Esquema do banco (Supabase)

```sql
CREATE TABLE items (
  id          TEXT        PRIMARY KEY,    -- "p1-1", "p2-3", etc — corresponde ao id em data.ts
  done        BOOLEAN     NOT NULL DEFAULT false,
  price       NUMERIC,                    -- preço pago em R$
  shop        TEXT,                       -- nome da oficina
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE car (
  id               INT         PRIMARY KEY DEFAULT 1,
  km               INT         NOT NULL,
  alert_dismissed  BOOLEAN     NOT NULL DEFAULT false,
  CHECK (id = 1)              -- só 1 linha (um carro)
);

INSERT INTO car (id, km) VALUES (1, 147612);
```

## Comandos

```bash
npm run dev      # roda em http://localhost:3000
npm run build    # build de produção
npm run start    # roda o build localmente
npm run lint     # checa código
```

## Fluxo de deploy

1. `git push` para o GitHub.
2. Vercel detecta o push e faz build + deploy automático.
3. URL pública: `<projeto>.vercel.app`.

Variáveis de ambiente são configuradas no painel da Vercel (Project → Settings → Environment Variables), não vão pro git.
