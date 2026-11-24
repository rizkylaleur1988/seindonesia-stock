FROM node:24
WORKDIR /src
ENV NEXT_TELEMETRY_DISABLED=1

COPY apps/frontend/package.json apps/frontend/package-lock.json ./
RUN npm ci

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0", "-p", "3000"]