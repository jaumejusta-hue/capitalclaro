# Informe de revisión técnica de CapitalClaro

Fecha de preparación: 26 de noviembre de 2026.

## Comprobaciones completadas

- 12 guías publicadas; todas tienen entre 700 y 1.000 palabras de contenido editorial, calculadas sin navegación, metadatos de lectura, imágenes ni aviso educativo.
- Las 12 guías incluyen una sección de fuentes oficiales, una fecha de última revisión y un tiempo de lectura calculado como palabras / 200, redondeado al minuto superior.
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
