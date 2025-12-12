# SOLUTION 1 : Utiliser server.ts (CORRIGÉ pour Windows/Docker)
# ================================================================

# --- Étape 1 : build TypeScript -> JavaScript ---
FROM node:22-alpine AS builder

# Installer les dépendances système
RUN apk add --no-cache openssl libc6-compat

WORKDIR /usr/src/app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie TOUT le code source
COPY . .

# Build TS -> dist/
RUN npm run build

# Vérifier que le build a fonctionné
RUN ls -la dist/ && \
    test -f dist/server.js || (echo "❌ dist/server.js manquant!" && exit 1)


# --- Étape 2 : image finale (runtime) ---
FROM node:22-alpine AS runner

# Installer OpenSSL + curl pour health check
RUN apk add --no-cache openssl libc6-compat curl

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Créer un utilisateur non-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressjs

# Copier package.json
COPY --chown=expressjs:nodejs package*.json ./

# Installer uniquement les deps de prod
RUN npm install --omit=dev && npm cache clean --force

# Copier le build depuis builder
COPY --from=builder --chown=expressjs:nodejs /usr/src/app/dist ./dist

# Copier les fichiers nécessaires
COPY --chown=expressjs:nodejs drizzle ./drizzle
COPY --chown=expressjs:nodejs drizzle.config.ts ./drizzle.config.ts

# Copier public/ seulement s'il existe (syntaxe compatible Docker)
COPY --from=builder --chown=expressjs:nodejs /usr/src/app/public ./public

# Passer à l'utilisateur non-root
USER expressjs

# Port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Utiliser server.js au lieu de bin/www.js
CMD ["node", "dist/server.js"]