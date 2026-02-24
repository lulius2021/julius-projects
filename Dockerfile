FROM node:22-alpine
WORKDIR /app
COPY api/package*.json ./api/
RUN cd api && npm install
COPY . .
EXPOSE 3747
CMD ["node", "api/server.js"]
