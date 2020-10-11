api: cd packages/api && npm start
jwk: cd packages/api/config/jwk && caddy file-server --listen 127.0.0.1:3099
gateway: cd packages/api && sleep 1 && krakend run --config gateway/api-development.json
app: cd packages/app && yarn dev
