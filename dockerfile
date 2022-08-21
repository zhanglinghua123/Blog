FROM node:13.10.1-stretch
RUN npm install serve -g --registry=https://registry.npm.taobao.org && mkdir /project
VOLUME ["/project"]
CMD cd project
CMD npm run start