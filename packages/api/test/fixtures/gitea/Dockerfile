FROM gitea/gitea

ENV USER git

ENV RUN_MODE prod

COPY ./setup-entrypoint /usr/bin/setup-entrypoint
RUN chmod +x /usr/bin/setup-entrypoint
ENTRYPOINT /usr/bin/setup-entrypoint