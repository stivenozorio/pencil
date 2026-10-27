# Da Pencil · notas para Claude

Sitio estático (HTML/CSS/JS sin build) para el artista Pencil. Se publica por FTP en `pencil.digicyus.com` (subdominio de pruebas).

## Prioridades del cliente
1. Muralismo y graffiti (actividad principal, siempre primero).
2. Tatuajes.
3. Garabatos y Mañas (futuro: eventos con cuenta regresiva y venta segura de entradas).

## Dirección de diseño (no negociable)
- **Ilustrativo, no “moderno”**: todo se ve como hojas de papel, lápiz y garabatos. Nada de glassmorphism, gradientes de SaaS ni tarjetas genéricas.
- Colores **del logo**: lápiz amarillo `--amarillo` #ecbd15, borrador rosa `--rosa` #f0ace6 (fuerte `--magenta` #da62c9), virola `--virola` #c3c3c3, tinta negra y fondo grafito. No inventar colores nuevos.
- Estilo underground: muro oscuro, afiches rasgados con sombra dura, aerosol, tags, cintas de peligro. El cursor es un lápiz.
- El **proceso creativo** es parte de la marca (garabato → línea → color → vida; sesión a sesión en tatuajes). Mostrarlo siempre que se pueda.
- Tipografías: Luckiest Guy (títulos), Patrick Hand / Patrick Hand SC (texto y rótulos).
- Sombras duras (sin blur) en botones, bordes temblorosos (`--borde-mano`), rotaciones pequeñas.
- Texto magenta sobre papel: usar `--magenta-txt` (contraste AA), no `--magenta`.
- Respetar `prefers-reduced-motion`, foco visible y objetivos táctiles de 44px+.

## Skill de diseño
`.claude/skills/ui-ux-pro-max` (UI UX Pro Max). Estilos aplicados de su base de datos: “Anti-Polish / Raw Aesthetic” y “Sketch Hand-Drawn”. Consultar `data/*.csv` y `references/quick-reference.md` antes de diseñar secciones nuevas.

## Contenido
- WhatsApp: +57 311 745 7444 (`https://wa.me/573117457444`), Instagram `@david_pencil`.
- Fotos de obra en `assets/img/obra/` (WebP, máx. 1200px). Añadir siempre `width`, `height`, `alt` y `loading="lazy"`.
