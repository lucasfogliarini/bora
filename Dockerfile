# Use a imagem base do Node.js
FROM node:22-alpine as builder

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie todos os arquivos da aplicação para o diretório de trabalho
COPY . .

# Instale as dependências
RUN npm install

# Compila a aplicação Angular
RUN npm run build --prod

# Use uma imagem de servidor da Web
FROM nginx:alpine

# Copie os arquivos de build do Angular para o diretório de publicação do Nginx
COPY --from=builder /app/dist/* /usr/share/nginx/html/
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/nginx.conf

# Exponha a porta 80 para que o Nginx possa servir a aplicação
EXPOSE 80

# Comando para iniciar o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
