# =============================================================================
# Stage 1: build (full dev deps, produces .next/ artifacts)
# =============================================================================
FROM node:20.17.0-alpine AS builder
RUN npm install -g npm@10.8.2

WORKDIR /app
RUN chown -R node:node /app

USER node

COPY --chown=node:node ./package*.json ./
RUN npm install
COPY --chown=node:node . .

ARG BASE_PATH
ARG IS_TEST_MODE
ARG DARK_MODE_IN_TEST_MODE
ARG ANALYZE
ENV BASE_PATH=$BASE_PATH
ENV IS_TEST_MODE=$IS_TEST_MODE
ENV DARK_MODE_IN_TEST_MODE=$DARK_MODE_IN_TEST_MODE
ENV ANALYZE=$ANALYZE

RUN npm run build

# =============================================================================
# Stage 2: runtime (only prod deps + build artifacts)
# =============================================================================
FROM node:20.17.0-alpine AS runner
RUN npm install -g npm@10.8.2

WORKDIR /app
RUN chown -R node:node /app

USER node

COPY --chown=node:node --from=builder /app/package*.json ./
RUN npm install --omit=dev

COPY --chown=node:node --from=builder /app/.next ./.next
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/next.config.js ./

EXPOSE 3000
ENV PORT=3000
CMD ["npm", "run", "start"]
