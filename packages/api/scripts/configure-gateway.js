// generate config/jwk.json with a secure random username and password for jwk
// copy the krakend configuration and replace the jwk username and password with
// generated ones
// make express read in config/jwk.json and validate against the username and password,
// and that the request is coming from localhost (actually, use a different local-only port
// and express server too)