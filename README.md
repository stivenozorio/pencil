# Da Pencil · sitio web

Sitio de **Pencil, “el de los muñequitos”**: muralismo y graffiti (lo principal), tatuajes, y la futura sección de encuentros **Garabatos y Mañas**.

- Pruebas: `https://pencil.digicyus.com`
- Proyecto de [Digicy](https://digicyus.com)

## Concepto visual

Un muro de calle con afiches rasgados pegados encima. Cada sección es un papel distinto:

| Sección | Papel |
|---|---|
| Portada | Libreta de bocetos con espiral |
| Murales (principal) | Hoja con ladrillos dibujados a lápiz + polaroids con cinta |
| El proceso | Papel de boceto: el lápiz pasa de garabato a línea, color y “¡vida!” |
| Tatuajes | Papel de calco (transfer) |
| Trayectoria | Cartulina negra con stickers y chinches |
| Garabatos y Mañas | Cuaderno rayado con margen magenta |
| Contacto | Nota amarilla con avión de papel |

Detalles: el cursor es un lápiz (amarillo con borrador magenta) y en enlaces se voltea al borrador; el cursor deja un rastro de aerosol que se borra solo; un lápiz arriba “escribe” el progreso al bajar; los subrayados, estrellas y el avión se dibujan solos al aparecer. Todo respeta `prefers-reduced-motion`.

Tipografías: **Luckiest Guy** (títulos, parecida al letrero PENCIL), **Patrick Hand** y **Patrick Hand SC** (rotulación de cómic, como el documento de ilustración).
Colores tomados del logo: lápiz `#ecbd15` (brillo `#fcdb78`), borrador `#f0ace6` (fuerte `#da62c9`, texto `#801e72`), virola `#c3c3c3`, tinta `#1b1b1b`, fondo grafito `#141414`.

## Estructura

```
index.html            Página única
assets/css/main.css   Estilos (tokens en :root)
assets/js/main.js     Menú, apariciones, lápiz de progreso, trazo del cursor, visor, cuenta regresiva
assets/img/           Mascota, caricatura, letrero, cursores y fotos de obra (WebP)
data/evento.json      Evento de Garabatos y Mañas (activa la cuenta regresiva)
.htaccess             Cabeceras de seguridad y caché (Apache)
```

No hay paso de build: es HTML, CSS y JS estáticos.

## Ver en local

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Publicar

Cada push a `main` (o a una rama `claude/**`) sube el sitio por FTP con `.github/workflows/deploy.yml`.
Secretos del repositorio que usa:

| Secreto | Valor |
|---|---|
| `FTP_SERVER` | Host FTP (p. ej. `ftp.digicyus.com`) |
| `FTP_USERNAME` | Usuario FTP |
| `FTP_PASSWORD` | Contraseña FTP |
| `FTP_SERVER_DIR` | Opcional. Carpeta remota terminada en `/` (por defecto `./`) |

Al pasar a producción (p. ej. `dapencil.com`), quitar `<meta name="robots" content="noindex, nofollow">` de `index.html`.

## Activar un evento de Garabatos y Mañas

Editar `data/evento.json`:

```json
{
  "activo": true,
  "nombre": "Garabatos y Mañas · Edición 1",
  "descripcion": "Charla y taller de creación de personajes.",
  "fecha": "2026-12-12T15:00:00-05:00",
  "lugar": "Casa de la Cultura Ciudad Bolívar",
  "urlEntradas": "https://..."
}
```

- `fecha` en formato ISO con zona horaria de Bogotá (`-05:00`).
- Con `activo: false` o sin fecha se muestra “Próximamente”.
- Sin `urlEntradas` el botón dice “Entradas muy pronto” y queda desactivado.
- Al llegar la fecha la cuenta se detiene y el botón se desactiva.

## Fase 2 · venta de entradas (pendiente)

Según los requerimientos, la venta se hará con una pasarela reconocida (recomendada: **Wompi** o **Mercado Pago**, ambas operan en Colombia y tienen modo sandbox), sin construir pagos desde cero:

1. La pasarela cobra; su webhook firmado confirma el pago en nuestro backend.
2. Por cada entrada se genera un ID aleatorio y un QR firmado (HMAC); se envía por correo.
3. Panel de validación (con login) que escanea el QR y marca la entrada como usada una sola vez (transacción en base de datos).
4. Control de aforo y registro de entradas vendidas.
5. Todo se prueba primero en `pencil.digicyus.com` con pagos de prueba antes de abrir la venta.

## Proceso creativo

Las etapas de `assets/img/proceso-*.webp` se generaron a partir del logo (garabato, entintado y color) como demostración. Cuando David entregue fotos o videos reales de boceto → muro / diseño → tatuaje, reemplazarlas por esas.
