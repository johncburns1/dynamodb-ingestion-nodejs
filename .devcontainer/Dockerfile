# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.145.1/containers/ubuntu/.devcontainer/base.Dockerfile

# [Choice] Ubuntu version: bionic, focal
FROM ubuntu

# Install utils
RUN apt-get update && apt-get install -y \
    curl \
    g++ \
    gcc \
    make \
    nano \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install node
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install required global node packages
RUN npm install -g \
    react \
    react-scripts
RUN npm install -g aws-sdk

# Install AWS CLI
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install \
    && rm -rf ./aws \
    && rm -f awscliv2.zip

# Set env variables
ENV NODE_PATH=/usr/lib/node_modules
ENV REGION=us-west-2
ENV CREDIT_SECURE_IP_ADDRESS_TABLE=credit-secure-ip-address-dev
ENV CREDIT_SERVERS_INFO_TABLE=credit-servers-info-dev
ENV CREDIT_USER_ROLE_TABLE=credit-user-role-dev