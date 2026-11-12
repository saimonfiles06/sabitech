FROM node:22-bookworm-slim

WORKDIR /app

# Al arrancar: instala dependencias sin modificar package.json ni package-lock.json
# y lanza Vite
CMD ["sh", "-c", "npm install --no-save && npm run dev -- --host 0.0.0.0"]