package co.resources.makejwt;

import java.util.*;

import com.nimbusds.jose.*;
import com.nimbusds.jose.jwk.*;
import com.nimbusds.jose.jwk.gen.*;

public class MakeRsaJwt {
    public static void main(String... myArgs) throws com.nimbusds.jose.JOSEException {
        // Generate 2048-bit RSA key pair in JWK format, attach some metadata
        RSAKey jwk = new RSAKeyGenerator(2048)
            .keyUse(KeyUse.SIGNATURE) // indicate the intended use of the key
            .keyID("devel") // give the key a unique ID
            .generate();

        // Output the private and public RSA JWK parameters
        System.out.println(jwk);

        // Output the public RSA JWK parameters only
        System.out.println(jwk.toPublicJWK());
    }
}
