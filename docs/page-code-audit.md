# Auditoria estática da homepage

Escopo: código atual, sem navegador, build ou execução de testes. Nenhum componente foi alterado nesta auditoria. As conclusões de layout são deduzidas das restrições CSS; não constituem comparação visual nova com Figma.

## Prioridade alta

1. **Galeria do About pode permanecer invisível.** `about.tsx:6` observa `.about-gallery min-w-0 > img`: `min-w-0` é interpretado como elemento descendente, não como classe. Não corresponde ao JSX. `motion-bootstrap.ts:4` esconde `.about-gallery > img`; nenhum observer marca esses elementos como prontos. Corrigir o seletor e evitar que classes de layout entrem em seletores de animação.

2. **Hero não cabe entre 1101 e aproximadamente 1440px.** `hero.tsx:20` usa margem esquerda de 142px e coluna de 500px sem shrink; `hero-image.tsx` fixa 797.847px sem shrink. Necessidade total: 1439.847px. A disposição horizontal começa em 1101px, e o header tem overflow-clip. O excedente é cortado. Adotar um estágio intermediário ou permitir dimensionamento até a largura de referência.

3. **Fallback de visibilidade é global, mas a inicialização é local.** `use-entrance.ts` define `html.dataset.motion='ready'` ao terminar qualquer seção. O timeout de `motion-bootstrap.ts` só libera elementos se ainda estiver em `boot`. Uma seção pronta desarma a proteção para todas as outras, inclusive elementos com seletor errado. A prontidão deve ser por elemento/escopo, com fail-open independente.

## Layout e responsividade

4. **Testimonials ganha espaço vertical artificial em tablets.** Em `testimonials.tsx`, a seção é coluna até 1024px, mas o cabeçalho recebe `basis-80` entre 768 e 1100px. Em flex-col, isso reserva 320px de altura, não de largura. Usar basis-auto na composição vertical e aplicar basis somente na horizontal.

5. **Breakpoints de composição e decoração da hero divergem.** A hero empilha até 1100px, mas sua wave só muda de top fixo para bottom abaixo de 768px (`decoration.tsx:16`). Entre 768 e 1100px, a decoração permanece ancorada em 588.035px em uma seção de altura variável. Coordenar a âncora com a composição da hero.

6. **A altura mobile da citação não foi aplicada ao elemento pretendido.** `testimonials.tsx:19` combina `[&_blockquote]:min-h-70` com `max-md:min-h-56` no figure. O blockquote continua com mínimo de 280px; a regra mobile muda o card, não a citação. Usar variante descendente no breakpoint correto.

7. **Gaps e espaçamentos não têm uma escala explícita de seção.** Services usa gap 6px e margem superior 48px; Projects usa gap 14px e margem 28px; Testimonials usa gap 10px. Essas diferenças podem vir do design e não devem ser normalizadas cegamente. Porém, o padding inferior de Projects continua 120px no mobile, contra 64px em Testimonials e 24px no About. Documentar as diferenças intencionais e definir os espaçamentos mobile por seção.

8. **Medidas de galeria perderam diferenças do desenho.** About aplica largura 220px e flex:1 aos três elementos, embora os atributos de origem indiquem 219/220/226px. Não é um problema de overflow por si só, mas a proporção relativa não corresponde àquelas medidas. A decisão entre colunas iguais e larguras originais precisa ser explícita.

## Animações e configuração

9. **Mesmo trigger não significa coreografia sincronizada.** TextReveal e useEntrance criam observers independentes. As máscaras desktop duram 1200ms; textos começam com delay 0 ou 80ms e duram 1000ms. Texto pode avançar enquanto ainda está recortado pela superfície. Declarar uma sequência por card/seção, em vez de assumir sincronismo apenas pelo threshold.

10. **Configurações declaradas não correspondem ao valor efetivo.** `animations.entrance.stagger` é 170ms, mas useEntrance limita a 100ms e no máximo dois incrementos. `--reveal-threshold:.01` dos cards é ignorado por TextReveal quando encontra um owner: o valor passa a .08. `animations.interaction.ease` não é usado por Rollover, que fixa power2.inOut e 300ms. Tempos de menu e faixas SVG também permanecem parcialmente locais. Centralizar apenas parâmetros efetivamente consumidos e remover overrides mortos.

11. **Slides dependem do estado de hover para avançar.** Testimonials pausa quando o ponteiro fica na área dos cards. Isso pode ser confundido com delay maior que os 2.5s configurados. A diferença é comportamental, não uma falha de duração. Confirmar se pausa por hover faz parte da interação desejada.

12. **Regras mobile não são uniformes.** Navbar muda em 768px; animação simplificada em 1024px ou pointer:coarse; hero em 1100px; parallax exige hover+fine, enquanto slides exigem apenas fine. Parte é intencional por capacidade do dispositivo, mas a política está espalhada. Nomear separadamente breakpoints de layout e condições de movimento.

## Manutenção

13. **Teste de bootstrap está desatualizado.** `tests/motion-bootstrap.test.ts:4` importa motionGroups, que foi removido de motion-bootstrap.ts. A incompatibilidade é verificável pelo código; o teste não foi executado.

14. **Classes semânticas continuam acopladas à lista global de ocultação.** Cada seção escolhe seus alvos, mas motionInitialCSS mantém uma segunda lista manual. Isso permitiu a divergência do About. Preferir um atributo explícito de entrada nos próprios componentes, compartilhado por CSS inicial e animação.

## Ordem sugerida

Corrigir primeiro a galeria e o fail-open; depois a faixa intermediária da hero e a altura de Testimonials; em seguida alinhar coreografia e configurações. Ajustes estéticos de gaps devem preservar as diferenças confirmadas no Figma.
