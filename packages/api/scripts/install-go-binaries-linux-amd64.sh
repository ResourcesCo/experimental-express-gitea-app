#!/bin/bash
set -e # fail on error
GITROOT=$(git rev-parse --show-toplevel)
cd $GITROOT/packages/api/bin

echo "Installing gojq"
curl -L https://github.com/itchyny/gojq/releases/download/v0.11.2/gojq_v0.11.2_linux_amd64.tar.gz | tar xz
mv gojq_v0.11.2_linux_amd64/gojq gojq
rm -r gojq_v0.11.2_linux_amd64

echo "Installing migrate"
curl -L https://github.com/golang-migrate/migrate/releases/download/v4.13.0/migrate.linux-amd64.tar.gz | tar xz
mv migrate.linux-amd64 migrate

echo "Installing krakend"
KRAKEND_CHECKSUM=f7cf988411531f289364715c914e048ffba502f813d00aff934acbe903d59062
mkdir krakend-install
cd krakend-install
curl -L http://repo.krakend.io/bin/krakend_1.2.0_amd64.tar.gz > krakend.tar.gz
echo "${KRAKEND_CHECKSUM}  krakend.tar.gz" | shasum -a 256 -c
if [ $? != 0 ]; then
  echo 'Krakend checksum is not valid' # Should not get here, but here in case set -e is removed
  exit 1
fi
tar xzf krakend.tar.gz
cd ..
mv krakend-install/usr/bin/krakend krakend
rm -r krakend-install

echo "Installing caddy"
mkdir caddy-install
cd caddy-install
curl -L https://github.com/caddyserver/caddy/releases/download/v2.2.0/caddy_2.2.0_linux_amd64.tar.gz | tar xz
cd ..
mv caddy-install/caddy caddy
rm -r caddy-install


