FROM node:14-alpine AS builder

COPY ./ /root/centerview/
WORKDIR /root/centerview
RUN yarn config set network-timeout 300000 \
  # && yarn config set registry https://registry.npmmirror.com/ \
  && yarn install \
  && yarn run build

# Step2. Put into nginx
FROM nginx:1.21.1-alpine

ARG REPO_URL
ARG BRANCH
ARG COMMIT_REF
LABEL repo-url=$REPO_URL
LABEL branch=$BRANCH
LABEL commit-ref=$COMMIT_REF

RUN mkdir /etc/nginx/centerview
COPY --from=builder /root/centerview/dist /var/www/centerview
COPY ./deploy/init_env.sh /init_env.sh
WORKDIR /
CMD ["sh", "init_env.sh"]
