# Mobile motion measurements

Tested the development server with headless Chromium, touch enabled, device scale factor 3, mobile emulation and CDP touch scroll gestures. These are desktop browser emulations, not measurements on a physical phone or Safari.

- 390 × 844, CPU throttling 4×: one recorded frame interval above 25 ms (25.7 ms near the footer); no long tasks or layout shifts during the measured scroll.
- 375 × 812, CPU throttling 8× with CPU profiling: repeated intervals around 67 ms near Services → Results and 49 ms near the end of Projects. No long tasks above 50 ms. A layout shift of 0.00539 occurred around Testimonials.
- After retaining mobile split lines until resize/unmount: recorded layout shifts became zero. Intervals of 58–66 ms near Services → Results remained. This is not evidence of a general FPS improvement.

Changed TextReveal to clear animation styles at completion while retaining the mobile split structure. Resize and unmount still restore the original DOM. Desktop behavior is unchanged.

An earlier stress run with a screenshot immediately before measurement recorded larger initial stalls; the profiled repeat without that screenshot did not reproduce them. They are excluded from causal conclusions.

Potential remaining rendering costs include simultaneous text splitting and clip-path effects. The CPU profile alone does not isolate GPU/raster costs or establish which effect causes the remaining gaps. No 60/120 fps guarantee is made.
