# Informe de revisión técnica de CapitalClaro

Fecha de preparación: 26 de noviembre de 2026. Última actualización: 27 de noviembre de 2026.

## Comprobaciones completadas

- 12 guías publicadas. Hasta el 26 de noviembre solo 3 (fondo de emergencia, crear presupuesto y regla 50/30/20) tenían 700-1.000 palabras, fuentes y fecha de revisión; las otras 9 eran guías cortas. El 27 de noviembre se ampliaron esas 9 y ahora las 12 tienen entre unas 840 y 1.180 palabras de contenido editorial (calculadas sin navegación, metadatos de lectura ni aviso educativo).
- Las 12 guías incluyen una sección de fuentes oficiales, fecha de publicación y de última revisión (27 de noviembre de 2026 las ampliadas) y un tiempo de lectura calculado como palabras / 200, redondeado al minuto superior; las tarjetas del catálogo, de las categorías y de la portada usan los mismos minutos.
- Las 12 guías incluyen una sección de errores frecuentes, recomendaciones prácticas o comprobaciones, y enlaces relacionados.
- Catálogo: 12 tarjetas únicas. Categorías: 4 de ahorro y presupuesto, 3 de inversión y vivienda, 2 de educación financiera y 3 de emprendimiento y negocios.
- 5 calculadoras en la página de herramientas.
- Imágenes locales: todas las rutas comprobadas, con texto alternativo, dimensiones y versiones adaptables.
- Enlaces internos y anclas: no se detectaron destinos locales ausentes en la revisión estática.
- Sitemap XML: válido; `robots.txt` apunta al sitemap.
- JavaScript: `node --check` correcto para `app.js` y `hero3d.js`.
- CSS: análisis sintáctico sin errores.
- Imagen social: `og-image.jpg`, 1200 × 630 px.
- Peso del paquete completo: aproximadamente 0,53 MB sin vídeos.
- Los archivos `privacidad.html`, `cookies.html`, `aviso-legal.html` y `descargo.html` tienen el mismo SHA-256 que en el ZIP de entrada; se han conservado sin cambios.

## Límites de las pruebas

No se ha podido completar la emulación visual con navegador automatizado en este entorno. Por tanto, no se afirma que Lighthouse supere 90 ni que se haya certificado ausencia de desbordamiento en todas las combinaciones de pantalla. Debe hacerse una comprobación final en Chrome DevTools/Lighthouse tras publicar.

No se han añadido vídeos. Se han priorizado ilustraciones WebP originales de bajo peso para que el sitio no dependa de clips pesados ni de enlaces de descarga de vídeo cuya licencia o archivo no pudiera comprobarse aquí.

## Propuestas pendientes

Las cuatro guías nuevas sugeridas están descritas en `PROPUESTAS-GUIAS-PENDIENTES.md` y no se han publicado porque la instrucción inicial pedía aprobar los temas antes de redactarlas.

## Notas de la actualización del 27 de noviembre de 2026

- `og:image` y `twitter:card` presentes en todas las páginas; `Article` en JSON-LD (con fechas) en las 12 guías.
- Las fuentes citadas en las guías ampliadas se abrieron una a una durante la redacción. Los datos que no se pudieron respaldar con una fuente oficial (por ejemplo, el 30-35 % de tasa de esfuerzo, el 80 % de financiación o el 10 % de gastos de compra) se presentan como referencias o supuestos de ejemplo, no como normas.
- No se dan cuotas de autónomos, tipos de interés, Euríbor, IPC ni ayudas vigentes: las guías remiten a la fuente oficial.
- Pendiente: si se añade publicidad (p. ej. AdSense) o actividad económica, completar la identificación del titular (nombre completo, NIF y domicilio o medio de contacto exigible), sustituir el correo personal por uno del proyecto y revisar la web con Lighthouse y en móvil tras publicar.
