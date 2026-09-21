# Transporte El Casereño S.A. — Resumen de entrega del sitio web

Sitio: https://elcasereno.com.ar

---

## 1. Qué incluye el sitio

- **Home** con hero (video de portada desde YouTube, editable), historia de la
  empresa con línea de tiempo, galería de fotos, flota, sedes con mapa
  interactivo, clientes, contacto y sección de postulación laboral.
- **Página de Novedades** (`/noticias`) con 3 novedades editables.
- **Panel de administración** integrado en el propio sitio (sin necesidad de
  un sistema externo) para mantener contenido actualizado sin tocar código.

## 2. Panel de administración — qué puede hacer el cliente

**Acceso:** botón "A" discreto en el pie de página del sitio → login con
usuario y contraseña (las credenciales ya las tiene el cliente; no se
incluyen en este documento por seguridad).

Una vez logueado y en modo edición, se puede:

- Cambiar el **video de portada** (pegando cualquier link de YouTube).
- Reemplazar las **fotos de flota** (Tractores / Semirremolques Térmicos /
  Chasis-Acoplados).
- Reemplazar las **4 fotos de la galería de historia** (debajo de la línea
  de tiempo, con efecto zoom y ampliar al hacer clic).
- **Agregar, editar, cambiar foto y eliminar logos de clientes**, desde un
  panel dedicado.
- Editar las **3 novedades**: foto, categoría, fecha, título y resumen
  (cantidad fija, no se agregan/eliminan).

Todo lo que se edita queda guardado en el servidor y se ve para **todos los
visitantes**, no solo en el navegador de quien lo edita.

## 3. SEO — qué se implementó

- Título y descripción propios en cada página (antes el sitio no tenía
  ningún `<title>`).
- Encabezado principal (`h1`) en la home (antes no tenía ninguno).
- Open Graph y Twitter Card: al compartir el link por WhatsApp/Facebook
  ahora se ve una vista previa prolija con imagen, título y descripción.
- `robots.txt` y `sitemap.xml` generados automáticamente.
- Datos estructurados (JSON-LD) con nombre, dirección, teléfono y redes de
  la empresa, para mejorar cómo se muestra en resultados de Google.
- El panel de administración (`/admin`) está bloqueado para buscadores
  (no debe aparecer indexado).

### Por qué al buscar "Transporte Casereño" en Google no aparece primero el sitio propio

Antes de esta entrega, el dominio `elcasereno.com.ar` nunca había sido
indexado por Google — por eso aparecían primero páginas de terceros
(directorios de CUIT, notas de prensa del sector) que ya tenían años de
antigüedad indexada. Esto es normal para cualquier sitio nuevo o recién
migrado, y se soluciona dándolo de alta manualmente en Google (paso 4).

## 4. Pendiente — alta en Google Search Console (5 minutos, lo hace el cliente)

1. Entrar a https://search.google.com/search-console con la cuenta de
   Google de la empresa.
2. Agregar propiedad → **"Prefijo de URL"** → `https://elcasereno.com.ar`
3. Verificar por **"Etiqueta HTML"** — el sitio ya tiene el código cargado:
   ```
   kXgXmj54Ka6GiPVeCYh7c6gs35O3pdjZpFmCOmGEGbQ
   ```
   Si Search Console pide un código distinto, avisar al desarrollador para
   actualizarlo en el sitio.
4. Una vez verificado: menú **"Sitemaps"** → cargar `sitemap.xml` → Enviar.
5. Inspección de URLs → pegar `https://elcasereno.com.ar/` → **"Solicitar
   indexación"**.

No es instantáneo: puede tardar de algunos días a un par de semanas en
reflejarse en los resultados de búsqueda.

## 5. Recomendaciones a futuro (fuera del alcance actual)

- Crear/reclamar un perfil de **Google Business** a nombre de la empresa —
  es lo que más rápido mejora el posicionamiento por marca + ubicación, y
  hace aparecer el negocio en el panel de Google Maps.
- Backups periódicos del contenido subido (imágenes y datos del panel).
- Multi-usuario / roles distintos de administrador.

---

## Apéndice técnico (para el desarrollador)

- **Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS.
- **Repositorio:** GitHub — `marcoscastillo0586/elcasereno`.
- **Hosting:** VPS propio (no Vercel/Netlify — el sitio escribe imágenes y
  contenido del panel directamente al disco del servidor).
- **Contenido editable:** persistido en `data/site-content.json` en el
  servidor (fuera de git, se genera solo).
- **Variables de entorno** (`.env.local`, no versionado): `ADMIN_USER`,
  `ADMIN_PASS`, `SITE_URL`.
- **Deploy:**
  ```bash
  cd /var/www/elcasereno
  git pull origin main
  npm install
  npm run build
  pm2 restart casereno
  ```
