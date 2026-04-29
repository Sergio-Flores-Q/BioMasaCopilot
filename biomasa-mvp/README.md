# BioMasa - Frontend MVP

## Ejecutar local (rápido)
- Opción A (Live Server extension en VS Code):
  1. Abre la carpeta `biomasa-mvp` en VS Code.
  2. Instala la extensión Live Server.
  3. Haz clic derecho en `frontend/index.html` → "Open with Live Server".

- Opción B (servidor estático Python):
  1. Abre terminal en `frontend/`.
  2. Ejecuta: `python -m http.server 8000`
  3. Abre: `http://localhost:8000`

## Notas
- Esta versión usa `localStorage` para persistencia (prototipo).
- Para conectar un backend REST, modifica `app.js` para usar `API_BASE` y desplegar el backend.
