FROM node:20

WORKDIR /app

COPY package.json ./
RUN npm install

COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build
RUN npm prune --omit=dev

RUN mkdir -p data

ENV PORT=3001
EXPOSE 3001

CMD ["node", "dist/index.js"]
