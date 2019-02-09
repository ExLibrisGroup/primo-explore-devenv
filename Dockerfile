FROM node:8.15.0-alpine

ENV INSTALL_PATH /app
ENV PATH $INSTALL_PATH/node_modules/.bin:${PATH}
ENV GULPFILE nyu-gulpfile.js
ENV VIEW NYU
ENV PROXY_SERVER http://bobcatdev.library.nyu.edu:80

# Install essentials
# RUN apt-get update -qq && apt-get install -y build-essential
RUN apk update && apk add build-base

# Install node_modules with yarn
ADD package.json yarn.lock /tmp/
RUN cd /tmp && yarn install --frozen-lockfile --ignore-optional
RUN mkdir -p $INSTALL_PATH \
  && cd $INSTALL_PATH \
  && cp -R /tmp/node_modules $INSTALL_PATH \
  && rm -r /tmp/* && yarn cache clean

WORKDIR $INSTALL_PATH

ADD . .

EXPOSE 8003 8004 3001

CMD VIEW=${VIEW} PROXY_SERVER=${PROXY_SERVER} yarn start:dev --host 0.0.0.0