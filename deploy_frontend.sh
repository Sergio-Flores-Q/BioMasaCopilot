#!/usr/bin/env bash
set -e

# Clonar tu repo si no existe
if [ ! -d "BioMasaCopilot" ]; then
  git clone https://github.com/Sergio-Flores-Q/BioMasaCopilot.git
fi

cd BioMasaCopilot

# Crear carpeta docs y copiar frontend
rm -rf docs
mkdir docs
cp -r ../biomasa-mvp-frontend/* docs/

# Commit y push
git add docs
git commit -m "Add frontend MVP to docs for GitHub Pages"
git push origin main

echo "Frontend copiado a docs/ y enviado al repo."
echo "Ahora activa GitHub Pages en Settings → Pages → Branch: main, Folder: /docs"
