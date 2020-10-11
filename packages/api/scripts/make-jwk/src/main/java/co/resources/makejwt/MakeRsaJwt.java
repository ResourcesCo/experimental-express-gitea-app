package co.resources.makejwt;

import java.util.*;
import java.io.File;
import java.io.FileWriter; 
import java.io.IOException;
import net.minidev.json.JSONObject;
import net.minidev.json.JSONArray;
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
        try {
            File privateKeyFile = new File("PrivateKeySet.json");
            FileWriter privateKeyFileWriter = new FileWriter(privateKeyFile);
            JSONArray privateKeyArray = new JSONArray();
            privateKeyArray.add(jwk.toJSONObject());
            JSONObject privateKeyObject = new JSONObject();
            privateKeyObject.put("keys", privateKeyArray);
            privateKeyFileWriter.write(privateKeyObject.toString());
            privateKeyFileWriter.close();
        } catch (IOException e) {
            System.out.println("Error writing private key");
            e.printStackTrace();
        }

        // Output the public RSA JWK parameters only
        try {
            File publicKeyFile = new File("PublicKeySet.json");
            FileWriter publicKeyFileWriter = new FileWriter(publicKeyFile);
            JSONArray publicKeyArray = new JSONArray();
            publicKeyArray.add(jwk.toPublicJWK().toJSONObject());
            JSONObject publicKeyObject = new JSONObject();
            publicKeyObject.put("keys", publicKeyArray);
            publicKeyFileWriter.write(publicKeyObject.toString());
            publicKeyFileWriter.write(jwk.toPublicJWK().toJSONObject().toString());
            publicKeyFileWriter.close();
        } catch (IOException e) {
            System.out.println("Error writing public key");
            e.printStackTrace();
        }
    }
}
