package com.ticketease.api.Components;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.SignedJWT;
import java.text.ParseException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class TokenUtils {

  @Value("${api.security.token.secret}")
  private String SECRET_KEY;

  public Long extractUserId(String token) throws JOSEException, ParseException {
    token = token.replace("Bearer ", "");

    SignedJWT decodedJWT = SignedJWT.parse(token);

    JWSVerifier verifier = new MACVerifier(SECRET_KEY);
    if (!decodedJWT.verify(verifier)) {
      throw new IllegalArgumentException("Token inválido ou assinatura incorreta");
    }

    var claims = decodedJWT.getJWTClaimsSet();

    return claims.getLongClaim("id");
  }
}
