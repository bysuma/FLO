# Classname audit

Reviewed September 14, 2026. Source-level, line-by-line review of all JSX class declarations, conditional branches, shared class constants, theme tokens, and the styles passed through TextReveal. No browser or development server was used.

## Coverage

| File | Class declarations / constants reviewed |
| --- | --- |
| `src/components/about/About.tsx` | 2 |
| `src/components/about/AboutGallery.tsx` | 5 |
| `src/components/about/AboutHero.tsx` | 6 |
| `src/components/about/AboutLeadership.tsx` | 21 |
| `src/components/about/AboutOpportunities.tsx` | 8 |
| `src/components/about/AboutRecognitions.tsx` | 13 |
| `src/components/about/AboutStandards.tsx` | 17 |
| `src/components/about/AboutStory.tsx` | 12 |
| `src/components/contact/ContactDetails.tsx` | 9 |
| `src/components/contact/ContactForm.tsx` | 21 |
| `src/components/contact/ContactHero.tsx` | 6 |
| `src/components/contact/ContactInquiry.tsx` | 5 |
| `src/components/contact/ContactPage.tsx` | 2 |
| `src/components/count-up.tsx` | No authored class declarations; checked forwarding/runtime behavior |
| `src/components/home/Home.tsx` | 3 |
| `src/components/home/HomeAbout.tsx` | 17 |
| `src/components/home/HomeHero.tsx` | 10 |
| `src/components/home/HomeProjects.tsx` | 14 |
| `src/components/home/HomeResults.tsx` | 19 |
| `src/components/home/HomeServices.tsx` | 4 |
| `src/components/home/HomeTestimonials.tsx` | 15 |
| `src/components/home/HomeVideo.tsx` | 4 |
| `src/components/home/parallax-image.tsx` | 2 |
| `src/components/home/project-card.tsx` | 5 |
| `src/components/home/service-card.tsx` | 10 |
| `src/components/page-transition.tsx` | 1 |
| `src/components/route-feedback.tsx` | 9 |
| `src/components/shared/background-photo.tsx` | 2 |
| `src/components/shared/button-link.tsx` | 5 |
| `src/components/shared/contact.tsx` | 6 |
| `src/components/shared/decoration.tsx` | 2 |
| `src/components/shared/eyebrow.tsx` | 1 |
| `src/components/shared/footer.tsx` | 33 |
| `src/components/shared/hero-preparation.tsx` | No authored class declarations; checked forwarding/runtime behavior |
| `src/components/shared/mobile-menu.tsx` | 10 |
| `src/components/shared/navbar.tsx` | 9 |
| `src/components/shared/rollover.tsx` | 4 |
| `src/components/smooth-scroll.tsx` | No authored class declarations; checked forwarding/runtime behavior |
| `src/components/text-reveal.tsx` | No authored class declarations; checked forwarding/runtime behavior |
| `src/routes/__root.tsx` | 1 |
| `src/routes/about.tsx` | No authored class declarations; checked forwarding/runtime behavior |
| `src/routes/contact.tsx` | No authored class declarations; checked forwarding/runtime behavior |
| `src/routes/index.tsx` | No authored class declarations; checked forwarding/runtime behavior |

## Corrections

- Removed repeated footer breakpoint values for width, gaps, and default order/basis.
- Removed obsolete mobile height/margin/padding resets and ineffective alignment from AboutStory.
- Removed unused max-height and overflow resets from the leadership panel after checking its GSAP behavior.
- Removed a grid breakpoint that only applied while the desktop results grid was hidden.
- Used parent-relative sizing for the results card background instead of duplicating its dimensions.
- Removed testimonial mobile typography overrides equal to the global section token and a padding reset with no base padding.
- Removed duplicate desktop video dimensions; kept the aspect ratios needed for automatic height on smaller screens.
- Made project section top/bottom padding explicit instead of overlapping py and pb.
- Separated navbar background image selection from shared positioning/sizing, removing the important override.

## Deliberately retained

- Responsive overrides that change actual layout, image crop, touch targets, or scrolling.
- Width/height attributes on images alongside Tailwind dimensions: these serve intrinsic sizing and layout reservation.
- Textarea height plus minimum height: the latter limits user resizing.
- Invisible/opacity/pointer-event states referenced by GSAP and menu/slider behavior.
- Positioning and isolation used by sticky sections, the footer reveal, image masks, and backgrounds.
- Root-level document focus/touch defaults and the TextReveal selector for lines generated at runtime; these do not style unrelated page sections.
- No parent selectors targeting footer, main, or section inside page components.

## Verification

- TypeScript and all 10 existing tests passed.
- Tailwind canonicalization scan and source diff whitespace checks passed.
- Source review does not establish pixel equality or browser rendering correctness.
