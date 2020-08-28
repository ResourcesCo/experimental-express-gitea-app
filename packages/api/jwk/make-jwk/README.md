# Make JWT

This requires having Maven installed.

# Installing the packages

```
mvn install
```

# Running

This both compiles and runs it:

```
❯ mvn compile  exec:java -Dexec.mainClass=co.resources.makejwt.MakeRsaJwt
[INFO] Scanning for projects...
[INFO]
[INFO] ----------------------< co.resources.jwt:MakeJwt >----------------------
[INFO] Building MakeJwt 1.0-SNAPSHOT
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- maven-resources-plugin:2.6:resources (default-resources) @ MakeJwt ---
[WARNING] Using platform encoding (UTF-8 actually) to copy filtered resources, i.e. build is platform dependent!
[INFO] skip non existing resourceDirectory /Users/bat/projects/resources/jwk/src/main/resources
[INFO]
[INFO] --- maven-compiler-plugin:3.1:compile (default-compile) @ MakeJwt ---
[INFO] Changes detected - recompiling the module!
[WARNING] File encoding has not been set, using platform encoding UTF-8, i.e. build is platform dependent!
[INFO] Compiling 1 source file to /Users/bat/projects/resources/jwk/target/classes
[INFO]
[INFO] --- exec-maven-plugin:3.0.0:java (default-cli) @ MakeJwt ---
{"p":"4nb9lxojRsDFNcvK9sPbbPS5OHvw6jQRyTMCmZ2r3eLFTUC_70STYykX1hUuFWK2VuGR9eyFWE3395AMr-1XerRyp3rr1yeR5s1g-iVU81LcHi9Exuw6nRualFqyiKSvfgrxvpl9i5-B9zRALAOBdcM83FcN3jab9xUp3QDfJYk","kty":"RSA","q":"1AmD5CzaOWsvVW8UMHlasdVIPwdje0Q5kO1yHO7heNg6z0cVUDozAm-ax_PbSKrkeT2DuIOSkgB7gxOQoP4zrTugXcgVvH_XCIdrio1ECUs5S7Mf6wbw1i7SeH-Z2_AySmOq7pGE9WJVyJzfSOs4vKI2rYJAGuf5XQcKCt2hPaE","d":"VcWNUqiDK-ktXB3-zsALZo4qKCtbJxDvSlTL7oVi-HWgDJjmVyAe65O9oajnXox5uvtO4cHZ5bGEYoF5iNagjUhQTw7wf6Zz9NNlAxMdTrRzW1QipoQESC45ZgV5u-ZOZexJeZS93F_Bn8Vkzyu0OvBzO4QZGhzWygBfxadnJ17_lWRN2uRHCr3K0kMXCP8_48SiKHHYn9ygTZFEWsUEn_-G-43BBOJMvGatgFtUCe6OrZ0NzQ86GkPT4jLFYiEfGF_6ixWCC4ecRZJacebjOirFhfQg1KXHD0sbzg8jViX42EPrHUOLGJ8ltek_aahxVd1wOXNOHNCA8uEY5A3QAQ","e":"AQAB","use":"sig","kid":"devel","qi":"y_VtQDVV0-m86DO9W3Ipz3AUqLADdfb4tcZFI5LhwhpkWIZIIegTOVANCAe0qVk1fSUkI8osCfrIBDVTpHhHbTqxegzqzvJM8drfO0GD_zYbA2K-wpSgVMwWb-p5OoOOXTldmp9Bk5O61aD2hhO1wWoc6UprmkAJ5RODXV5ZNdw","dp":"mcnGcktMs2qLQfoP7b2ZkAcslQAN3W3YujJKzLj3EqpB5DFZZgnCsS8hwb8GWX18Z8mtDj09XHcuMk7_XqUlp-1MgxGFgMmdWggUmCqr4sVdN55P7WpUb4ZkVeS1ovd7OXQDMLUZPaznXFF-VqVWz_rypIr1nvakuYkEsdE6uEk","dq":"QwcC_2VCUrZUTzB-9FfYWLDwVqRSSUwm2m6FDSpich4AcTeqQCM1rsZy6lRm9FC5Sq4sbm6BLdAjOys7I_lXgqJ_rkWqwVy0MAkG8NR5NmrmIMzuARC_nyVL-TV1ALasXyGkjifIHP3J2lHkr5tT4yVwHWc4NokwJb0s6oRnDSE","n":"u5L03Mlgzn2v84XD-FYO0VZjJX9G0graGXUNA0qjuSMQAqxgoeIecVRo4QeYMAHY-TWGmpchRwiyZo80taXfOvwEBtPZTslb8dkhZ6wVEGqgmJkQOBhrzq4kh5N5hP03u51y_00mjZRHnaampp3BuydZFJCCYGjXMP4Iho21f9qunLHkyWZ8nBLMJywL3q7iRBlMtR114s_upbtBhJFvGiohrrC5tXmY1w109Hk1XiGD9VxxJ8PIN76jAszO-ug-tSheD52AzRRCrnLbY3jGOm1urJ_MZ2dHdcWTj1rkjvKV-4AjrczcRq4MQ4OwI7BzKvEy19TNqBIY9P5KmHFAKQ"}
{"kty":"RSA","e":"AQAB","use":"sig","kid":"devel","n":"u5L03Mlgzn2v84XD-FYO0VZjJX9G0graGXUNA0qjuSMQAqxgoeIecVRo4QeYMAHY-TWGmpchRwiyZo80taXfOvwEBtPZTslb8dkhZ6wVEGqgmJkQOBhrzq4kh5N5hP03u51y_00mjZRHnaampp3BuydZFJCCYGjXMP4Iho21f9qunLHkyWZ8nBLMJywL3q7iRBlMtR114s_upbtBhJFvGiohrrC5tXmY1w109Hk1XiGD9VxxJ8PIN76jAszO-ug-tSheD52AzRRCrnLbY3jGOm1urJ_MZ2dHdcWTj1rkjvKV-4AjrczcRq4MQ4OwI7BzKvEy19TNqBIY9P5KmHFAKQ"}
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  3.882 s
[INFO] Finished at: 2020-08-27T18:05:01-04:00
[INFO] ------------------------------------------------------------------------
```

The keys appear as two JSON objects. The larger one is first and is the private key.
The smaller one is second and is the public key. The private key can be used for
issuing keys. The public key can be used for signing keys.

# Adding the keys to files

Create a file called `jwk-private.json` inside `/packages/api/config/jwk` wrapped in the following JSON, and paste the large JavaScript object inside the square brackets:

```json
{
  "keys": []
}
```

Create a file called `jwk-public.json` inside `/packages/api/config/jwk` wrapped in the following JSON (same as above), and paste the large JavaScript object inside the square brackets:

```json
{
  "keys": []
}
```
