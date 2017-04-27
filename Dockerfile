FROM node:7.7.2

ENV INSTALL_PATH /home/app
ENV PROXY_SERVER http://bobcatdev.library.nyu.edu:80
ENV VIEW NYU

RUN apt-get update -qq && apt-get install -y vim

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p $INSTALL_PATH && cp -a /tmp/node_modules $INSTALL_PATH

ADD . $INSTALL_PATH

WORKDIR $INSTALL_PATH

EXPOSE 8003 3001

RUN npm install gulp -g
RUN sed -ie 's@http:\/\/your-server:your-port@'"$PROXY_SERVER"'@g' $INSTALL_PATH/gulp/config.js

#VOLUME $INSTALL_PATH/primo-explore/custom

CMD [ "/bin/bash", "-c", "gulp run --gulpfile=nyu-gulpfile.js --view $VIEW" ]
