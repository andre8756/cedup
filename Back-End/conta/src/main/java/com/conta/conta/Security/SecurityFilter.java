package com.conta.conta.Security;

import com.conta.conta.Repository.ContaRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final ContaRepository contaRepository;
    private final TokenBlacklistService tokenBlacklistService;

    public SecurityFilter(
            TokenService tokenService,
            ContaRepository contaRepository,
            TokenBlacklistService tokenBlacklistService
    ) {
        this.tokenService = tokenService;
        this.contaRepository = contaRepository;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String token = recoverToken(request);

        if (token != null) {

            // Verifica se o token foi revogado (logout)
            if (tokenBlacklistService.isBlacklisted(token)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            // ValidateToken agora retorna o SUBJECT → que é o ID
            String subjectId = tokenService.validateToken(token);

            if (subjectId != null && !subjectId.isBlank()) {

                try {
                    Long userId = Long.parseLong(subjectId);

                    var conta = contaRepository.findById(userId);

                    if (conta.isPresent()) {

                        var authentication = new UsernamePasswordAuthenticationToken(
                                userId,
                                null,
                                conta.get().getAuthorities()
                        );

                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }

                } catch (NumberFormatException e) {
                    // Caso o subject não seja um número válido
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    return;
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        return authHeader.substring(7);
    }
}