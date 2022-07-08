FROM node:16.14

ENV USER=evobot

# install python and make
RUN apt-get update && \
	apt-get install -y python3 build-essential && \
	apt-get purge -y --auto-remove

# create evobot user
RUN groupadd -r ${USER} && \
	useradd --create-home --home /home/evobot -r -g ${USER} ${USER}

# set up volume and user
USER ${USER}
WORKDIR /home/evobot

COPY --chown=${USER}:${USER} package*.json ./
COPY --chown=${USER}:${USER} package.json ./
RUN npm install
RUN npm install discord.js
# VOLUME [ "/home/evobot" ]

COPY --chown=${USER}:${USER}  . .

ENTRYPOINT [ "node", "index.js" ]
