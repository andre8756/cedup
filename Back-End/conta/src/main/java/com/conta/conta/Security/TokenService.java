package com.conta.conta.Security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.conta.conta.Entity.Conta;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.issuer}")
    private String issuer;

    @Value("${jwt.expiration-hours}")
    private int expirationHours;

    public String generateToken(Conta conta) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer(issuer)
                    .withSubject(conta.getId().toString()) // ID como subject
                    .withClaim("email", conta.getEmail())
                    .withClaim("cpf", conta.getCpf())
                    .withClaim("telefone", conta.getTelefone())
                    .withClaim("role", conta.getRole().name())
                    .withExpiresAt(generateExpirationDate())
                    .sign(algorithm);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar token: " + e.getMessage());
        }
    }


    public String validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer(issuer)
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException e) {
            return "";
        }
    }

    private Instant generateExpirationDate() {
        return LocalDateTime.now()
                .plusHours(expirationHours)
                .toInstant(ZoneOffset.of("-03:00"));
    }

    public Long extractUserId(String token) {
        try {
            return JWT.decode(token).getClaim("id").asLong();
        } catch (Exception e) {
            return null;
        }
    }

    public String extractRole(String token) {
        return JWT.decode(token).getClaim("role").asString();
    }

}
