#!/usr/bin/env bash
# Sube el video del hero a Cloudflare R2 (mismo bucket que Casa Gil / La Parota).
#   Uso:  scripts/subir-media.sh
#
# El video NO se sirve desde Pages como principal: Pages no soporta peticiones
# por rango (HTTP 206) y Safari/iPhone no reproduce video sin ellas. R2 sí.
# La copia en assets/ queda solo como respaldo (data-fallback en index.html).
#
# Requiere rclone y, en TU terminal (nunca en el repo ni en el chat):
#   export R2_ACCESS_KEY_ID="..."
#   export R2_SECRET_ACCESS_KEY="..."
set -euo pipefail

BUCKET="casa-la-parota-tiles"
ACCOUNT_ID="57350b337d100d70f6c38f9afec6bb0b"
PROYECTO="warner"
ORIGEN="$(cd "$(dirname "$0")/.." && pwd)/assets"

: "${R2_ACCESS_KEY_ID:?Define R2_ACCESS_KEY_ID}"
: "${R2_SECRET_ACCESS_KEY:?Define R2_SECRET_ACCESS_KEY}"

export RCLONE_CONFIG_R2_TYPE=s3
export RCLONE_CONFIG_R2_PROVIDER=Cloudflare
export RCLONE_CONFIG_R2_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
export RCLONE_CONFIG_R2_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
export RCLONE_CONFIG_R2_ENDPOINT="https://${ACCOUNT_ID}.r2.cloudflarestorage.com"
export RCLONE_CONFIG_R2_ACL=private
export RCLONE_CONFIG_R2_NO_CHECK_BUCKET=true

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$TMP/${PROYECTO}/media"
for f in "$ORIGEN"/hero-loop.mp4 "$ORIGEN"/hero-poster.jpg; do
  [ -f "$f" ] && ln -s "$f" "$TMP/${PROYECTO}/media/$(basename "$f")"
done

rclone copy "$TMP" "R2:${BUCKET}" --copy-links --progress \
  --header-upload "Cache-Control: public, max-age=604800"

echo "Listo. Prueba: curl -I -H 'Range: bytes=0-1' https://tiles.dariuzph.com/${PROYECTO}/media/hero-loop.mp4  (debe responder 206)"
