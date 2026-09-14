# Contact — Figma measurement review

Reference: [1686:60](https://www.figma.com/design/MQlbxyP66oN7tu4y8Q95vI/FLO---Website---Internal?node-id=1686-60), checked September 14, 2026.

The reference is a 1440px desktop frame. This is a source/code comparison, not a browser rendering verification. No development server or visual test was run.

| Element | Reference / implementation target |
| --- | --- |
| Hero | 465px section; title top 229px, PP Mori 52px / 58px, tracking -1.04px |
| Social asset | 157 × 19.783px; 30px below title box |
| Navigation | 86px logo, top 33px; 14px PP Mori links |
| Contact strip | 201px minimum height; 50px top padding; 105px desktop column gaps |
| Contact headings | PP Mori semibold 19.289px / 27.862px |
| Contact body | PP Telegraf 14px, normal line height |
| Inquiry section | 649px; top padding 57px, bottom padding 45px |
| Inquiry heading | PP Telegraf 52px / 46.553px; tracking -1.04px; 399px column |
| Form | 578 × 547px; left edge 753px at reference viewport; radius 10px |
| Form padding | top 29.21px, left 40.69px, right 37.559px, bottom 34px |
| Input grid | 245.181px columns, 9.39px horizontal gap, 9.848px vertical gap |
| Inputs | height 33.972px; padding 8.674px; border 0.361px |
| Form typography | PP Mori 12px per user clarification, including options and consent |
| Select | height 35.418px; arrow 17.348px |
| Radio grid | 17.348px column gap; 10.12px row gap; 13.011px controls |
| Textarea | 130.108px initial height; radius 10.433px; 38.216px preceding gap |
| Submit | 95 × 30px; PP Telegraf 14px / 22px; radius 5px |
| Footer | 599px minimum height; headings 16px / 22px, body 14px / 1.09335, legal 12px |
| Footer desktop columns | 236px, 190.667px, 190.667px; gaps 42px; top/side padding 31px |

## Preserved requirements and limits

- The exported 8.36px variable fallback is superseded by the user's explicit 12px correction.
- The current company address/config, separated TM, and previously requested certification placement are retained instead of restoring older Figma content/overlaps.
- Existing entrance animations and blue, zero-offset keyboard focus remain enabled.
- Contact uses no clamp-based sizing, including its override of the shared page padding token.
- Mobile uses responsive reflow and larger control hit areas; this desktop node supplies no mobile measurements.
- Fractional borders/font rasterization and final text wrapping still require the user's browser review.
