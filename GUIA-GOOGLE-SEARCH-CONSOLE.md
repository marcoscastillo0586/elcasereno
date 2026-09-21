# Cómo dar de alta el sitio en Google (5 minutos)

Este paso hace que `elcasereno.com.ar` empiece a aparecer en las búsquedas
de Google. Lo tiene que hacer la persona que maneja la cuenta de Google de
la empresa (Gmail, la misma que usan para otras cosas del negocio).

## Paso 1 — Entrar a Search Console

Ir a: **https://search.google.com/search-console**

Iniciar sesión con la cuenta de Google de la empresa.

## Paso 2 — Agregar el sitio

Va a aparecer una pantalla para agregar una propiedad, con dos opciones
(una a la izquierda, otra a la derecha). Usar la de la **derecha**, donde
dice **"Prefijo de URL"**.

Escribir ahí:
```
https://elcasereno.com.ar
```

Y tocar "Continuar".

## Paso 3 — Verificar que el sitio es de la empresa

Google va a mostrar varias formas de verificar. Elegir la que dice
**"Etiqueta HTML"** (HTML tag).

Va a mostrar un código — no hace falta copiarlo ni tocar nada más, ese
código **ya está cargado en el sitio**. Directamente tocar el botón
**"Verificar"**.

Si dice que verificó correctamente: listo, seguir al paso 4.

Si da error: sacarle una captura de pantalla al código que muestra Google
en ese paso y pasárselo al desarrollador.

## Paso 4 — Cargar el mapa del sitio

Una vez verificado, en el menú de la izquierda buscar **"Sitemaps"**.

En el campo que aparece, escribir:
```
sitemap.xml
```

Y tocar **"Enviar"**.

## Paso 5 — Pedir que revisen la página principal

Arriba de todo hay una barra de búsqueda que dice algo como "Inspeccionar
cualquier URL". Ahí pegar:
```
https://elcasereno.com.ar/
```

Apretar Enter, esperar unos segundos a que la analice, y tocar el botón
**"Solicitar indexación"**.

---

Listo, ya está todo hecho. Google puede tardar entre unos días y un par de
semanas en mostrar el sitio en los resultados de búsqueda — no es
instantáneo, pero no hace falta hacer nada más.
