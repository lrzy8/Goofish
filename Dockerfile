#
# GoofishCredentialsBot - Dockerfile
# - Build frontend (Angular) -> copy to /app/public
# - Build backend (TypeScript) -> /app/dist
# - Run production server: node dist/index.js
#

FROM node:20-bookworm-slim AS build
WORKDIR /app

# Root deps
COPY package*.json ./
RUN npm install --no-audit --no-fund --verbose

# Frontend deps & build
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci
COPY frontend ./frontend
RUN cd frontend && npm run build

# Backend build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Copy built frontend into public
RUN node -e "const fs=require('fs');const path=require('path');function copyDir(s,d){fs.mkdirSync(d,{recursive:true});for(const f of fs.readdirSync(s)){const sp=path.join(s,f),dp=path.join(d,f);fs.statSync(sp).isDirectory()?copyDir(sp,dp):fs.copyFileSync(sp,dp)}} copyDir('frontend/dist/frontend/browser','public');"


FROM node:20-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Only prod deps
COPY package*.json ./
RUN npm install --production --no-audit --no-fund --verbose

COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public

# Data & logs are expected to be persisted
RUN mkdir -p /app/data /app/logs

EXPOSE 3000
CMD ["node","dist/index.js"]

