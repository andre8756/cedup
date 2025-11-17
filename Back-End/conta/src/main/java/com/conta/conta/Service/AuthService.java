package com.conta.conta.Service;

import com.conta.conta.Entity.Conta;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    public Long getAuthenticatedContaId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getPrincipal() == null) {
            throw new RuntimeException("Usuário não autenticado");
        }

        return (Long) auth.getPrincipal();
    }
}

