# Warner 18-XVIII — Despliegue (demo privado)

Sitio estático (HTML/CSS/JS + GSAP por CDN). Sin build.
Demo: **https://warner18demo.dariuzph.com** (alias de warner-18-xviii.pages.dev).
Repo conectado a Cloudflare Pages: `dariuzcesar-cyber/warner-18-xviii-` (con guion final).

## Video en R2
`hero-loop.mp4` se sirve desde `https://tiles.dariuzph.com/warner/` porque
Pages no soporta Range/206 y iPhone/Safari lo exige. `assets/hero-loop.mp4` es solo
respaldo (`data-fallback`). Para subirlo o reemplazarlo:
```bash
export R2_ACCESS_KEY_ID="..."
export R2_SECRET_ACCESS_KEY="..."
scripts/subir-media.sh
curl -I -H 'Range: bytes=0-1' https://tiles.dariuzph.com/warner/hero-loop.mp4   # 206
```
Nunca guardes claves de R2 en el repo ni las pegues en chats.

## Publicar el sitio (una sola vez)
1. `git push -u origin main`
2. Cloudflare → Workers & Pages → Create → Pages → conectar el repo.
   Sin build command; directorio de salida `/`.
3. Pages → Custom domains → `warner18demo.dariuzph.com`.

## Después
Los pushes a GitHub NO disparan deploy: usar el Deploy Hook `publicar`
(Pages → Settings → Builds → Deploy hooks; `curl -X POST <hook>`).
No usar "Retry" en deploys viejos: republica el commit viejo.

## Privacidad
Demo no indexable: `<meta robots>`, `robots.txt` y `X-Robots-Tag` en `_headers`.
