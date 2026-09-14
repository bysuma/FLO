#!/usr/bin/env bash
# Requires ffmpeg. Keep the original as the source for both web renditions.
set -euo pipefail
cd "$(dirname "$0")/.."
for rendition in mobile desktop; do
  width=640
  if [ "$rendition" = desktop ]; then width=960; fi
  ffmpeg -hide_banner -loglevel error -i public/hero/landscape.mp4 \
    -vf "scale=$width:-2" -an -c:v libx264 -preset slow -crf 30 \
    -movflags +faststart -y "public/hero/landscape-$rendition.mp4"
done
