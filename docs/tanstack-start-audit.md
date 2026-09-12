# Auditoria TanStack Start — 2026-09-11

Escopo: código atual da homepage, configurações, dependências instaladas, skills carregadas via Intent e documentação oficial. Sem alteração do código da aplicação, execução de testes ou validação visual nesta auditoria. Os efeitos de desempenho abaixo são hipóteses de otimização, não medições de FPS.

## Problemas prioritários

### P1 — O fallback do HTML oculto pode ser desativado prematuramente

`src/lib/motion-bootstrap.ts:8` só revela a página após seis segundos se `data-motion` ainda for `boot`. `src/components/home/use-entrance.ts:139` muda esse estado global para `ready` assim que qualquer seção registra seus observers. Isso não comprova que todos os textos/componentes foram preparados. Uma falha posterior de preparação pode deixar elementos SSR ocultos indefinidamente. O estado deve ser por elemento/componente; o watchdog deve liberar alvos não preparados sem invalidar os reveals corretamente registrados. Não resolver desabilitando SSR nem ampliando `suppressHydrationWarning`.

### P2 — Metadados da homepage incompletos

`src/routes/__root.tsx:11` possui charset, viewport e título, mas não description, Open Graph ou canonical. `src/routes/index.tsx` não tem `head`. Colocar metadados específicos no `head` da homepage e manter metadados realmente globais no root. Canonical e URLs sociais exigem o domínio final verificado, não localhost. Também não há robots.txt/sitemap no public nem rotas correspondentes.

### P2 — Falta tratamento próprio para erros e URLs inexistentes

`src/routes/__root.tsx:9` e `src/router.tsx:5` não configuram `errorComponent`/`notFoundComponent` nem defaults correspondentes. O framework tem fallbacks: não significa ausência total de tratamento, mas o usuário recebe uma experiência genérica, sem recuperação/contexto da FLO. Adicionar 404 com Link para home e erro com ação de recuperação apropriada. Não adicionar pendingComponent só por convenção: hoje não há loaders assíncronos.

### P2 — Menu intercepta também cliques modificados

`src/components/home/mobile-menu.tsx:70,82` chama preventDefault incondicionalmente e navega após fechar o dialog. Isso cancela a semântica padrão dos Links para Cmd/Ctrl/Shift+clique, relevante inclusive no menu em janela estreita de desktop. Interceptar somente clique primário sem modificadores; deixar o Link/browser tratar os demais.

## Oportunidades, não defeitos comprovados

### Hidratação abaixo da dobra

`src/routes/index.tsx` importa e monta todas as seções imediatamente. Os observers adiam a animação, mas não a hidratação/montagem dos componentes nem a instalação dos efeitos. A API experimental `Hydrate` e a estratégia `visible` estão disponíveis no pacote instalado. Testimonials e footer são candidatos para um experimento com margem de antecipação; hero e navbar devem permanecer imediatas. Antes disso, corrigir o fallback de motion: o HTML adiado não pode ficar invisível por depender de efeitos ainda não hidratados. Medir startup e interação antes/depois; não tratar essa API experimental como exigência universal.

### Prerender da homepage

`vite.config.ts:16` usa tanstackStart() sem prerender. Como a homepage não tem loader, personalização ou dados privados, gerar HTML estático no build é uma opção adequada ao conteúdo atual. Confirmar a hospedagem/preset e a atualização de conteúdo antes de ativar. Isso pode reduzir trabalho por request, mas não reduz sozinho o custo das animações ou da hidratação.

### Política de preload do router

`src/router.tsx:9` define defaultPreloadStaleTime: 0, embora não haja integração com cache externo como TanStack Query. Hoje não há loaders, então não há requisição duplicada demonstrada. Se loaders forem adicionados, revisar/remover esse override para não descartar a janela padrão de freshness dos preloads sem motivo.

### Dependências e runner

`package.json` usa latest para vários pacotes TanStack e contém configuração pnpm, enquanto o lockfile é bun.lock. O lockfile atual fixa a resolução, portanto instalações frozen continuam reproduzíveis. Fixar uma política de versões/atualização, declarar packageManager e usar bun install --frozen-lockfile no CI reduz mudanças inesperadas ao regenerar o lockfile. A configuração pnpm pode ser removida se Bun for oficialmente o único gerenciador.

### Assets da home no root

O preload do poster em `src/routes/__root.tsx:28` é específico da home. Funciona hoje com uma única página; movê-lo para o head da index evita baixar a mídia da hero em futuras rotas ou páginas 404. Os preloads de fontes globais podem continuar no root.

## O que está correto

- getRouter() cria uma instância por chamada, evitando singleton compartilhado entre requests SSR.
- Register declara o tipo do router.
- shellComponent é suportado na versão instalada; não falta Outlet nessa configuração.
- HeadContent e Scripts estão nos locais corretos.
- tanstackStart vem antes de viteReact, e devtools é o primeiro plugin.
- Start já configura code splitting de rotas; a falta de .lazy.tsx não é um problema por si só.
- Links internos usam TanStack Link; mailto pode continuar como anchor HTML.
- Uso de DOM/GSAP está predominantemente em efeitos e handlers. Não há necessidade de colocar toda a página dentro de ClientOnly.
- Não há backend/loader que justifique adicionar server functions, middleware ou TanStack Query neste momento.
- Devtools está condicionado a import.meta.env.DEV. Não foi demonstrado vazamento para produção nesta auditoria.
- O pacote instalado @tanstack/devtools-vite 0.8.5 declara suporte a Vite 8. A skill que menciona apenas Vite 6/7 está desatualizada nesse ponto; não recomendo downgrade.

## Fontes

Skills via Intent: react-start; start-core/execution-model; router-core/ssr; router-core/not-found-and-errors; start-core/deployment; devtools-vite-plugin. Quando a skill divergiu do pacote instalado, conferi o código e os peerDependencies locais.

- https://tanstack.com/start/latest/docs/framework/react/guide/deferred-hydration
- https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering
- https://tanstack.com/start/latest/docs/framework/react/guide/execution-model
- https://tanstack.com/start/latest/docs/framework/react/guide/hydration-errors

## Aplicação da auditoria

Aplicado após aprovação: readiness por alvo e watchdog independente, description/Open Graph no head da home, poster movido ao head da home, 404/erro próprios, cliques modificados preservados no menu, remoção de defaultPreloadStaleTime: 0, versões exatas e packageManager Bun, CI frozen, prerender da home com Nitro node-server, hidratação normal em todas as seções (Hydrate adiado removido por preferência do usuário). Pipeline Sharp e srcSet/sizes também adicionados às imagens locais.

Domínio ainda não disponível segundo o usuário: canonical, og:url/og:image absolutos e sitemap são emitidos somente quando VITE_SITE_URL estiver configurado. Robots é gerado sem referência a sitemap enquanto não houver domínio.

Validação: TypeScript, testes automatizados, build/prerender e respostas HTTP do servidor de produção. Sem teste visual ou promessa de FPS; desempenho deverá ser avaliado em dispositivo real.
