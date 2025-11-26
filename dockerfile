# Imagem base
FROM node:22-alpine

# Diretório de trabalho
WORKDIR /usr/src/app

# Copia só os arquivos de dependência primeiro (cache melhor)
COPY package.json yarn.lock ./

# Instala TODAS as dependências (incluindo dev, pq vamos compilar)
RUN yarn install --frozen-lockfile

# Copia o restante do código
COPY . .

# Build do Nest (gera /dist)
RUN yarn build

# Comando padrão do container:
# 1) roda migrations em cima do dist
# 2) sobe a aplicação em prod
CMD sh -c "yarn migrate:run && yarn start:prod"
