FROM node:lts

WORKDIR /home/app
ENV NODE_ENV prod
COPY ./ ./
RUN npm install \
    && npm run build

CMD npm run start
