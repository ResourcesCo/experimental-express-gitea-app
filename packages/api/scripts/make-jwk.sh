#!/bin/bash
set -e # fail on error

GITROOT=$(git rev-parse --show-toplevel)
cd $GITROOT/packages/api/scripts/make-jwk
mvn install
mvn compile exec:java -Dexec.mainClass=co.resources.makejwt.MakeRsaJwt
mv ./PrivateKeySet.json ./PublicKeySet.json ../../config/jwk/