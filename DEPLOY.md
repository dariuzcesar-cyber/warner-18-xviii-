# Warner 18-XVIII — Despliegue (demo privado)

Sitio estático (HTML/CSS/JS + GSAP por CDN). Sin build.
Demo: **https://warnerdemo.dariuzph.com** (Cloudflare Pages, conectado a este repo).

## Video en R2
`hero-loop.mp4` se sirve desde `https://tiles.dariuzph.com/warner/media/` porque
Pages no soporta Range/206 y iPhone/Safari lo exige. `assets/hero-loop.mp4` es solo
respaldo (`data-fallback`). Para subirlo o reemplazarlo:
```bash
export R2_ACCESS_KEY_ID="..."
export R2_SECRET_ACCESS_KEY="..."
scripts/subir-media.sh
curl -I -H 'Range: bytes=0-1' https://tiles.dariuzph.com/warner/media/hero-loop.mp4   # 206
```
Nunca guardes claves de R2 en el repo ni las pegues en chats.

## Publicar el sitio (una sola vez)
1. `git push -u origin main`
2. Cloudflare → Workers & Pages → Create → Pages → conectar el repo.
   Sin build command; directorio de salida `/`.
3. Pages → Custom domains → `warnerdemo.dariuzph.com`.

## Después
Los pushes a GitHub no disparaban deploy en Casa Gil: usar el Deploy Hook
(`curl -X POST <hook>`). No usar "Retry" en deploys viejos.

## Privacidad
Demo no indexable: `<meta robots>`, `robots.txt` y `X-Robots-Tag` en `_headers`.
