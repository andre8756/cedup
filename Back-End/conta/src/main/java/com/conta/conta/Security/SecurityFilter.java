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

    public SecurityFilter(TokenService tokenService,
                          ContaRepository contaRepository,
                          TokenBlacklistService tokenBlacklistService) {
        this.tokenService = tokenService;
        this.contaRepository = contaRepository;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String token = recoverToken(request);

        if (token != null) {

            // 🚫 Verifica se o token está na blacklist
            if (tokenBlacklistService.isBlacklisted(token)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            String email = tokenService.validateToken(token);

            if (email != null) {
                var contaOptional = contaRepository.findByEmail(email);

                if (contaOptional.isPresent()) {
                    var contaDetails = contaOptional.get();

                    var authentication = new UsernamePasswordAuthenticationToken(
                            contaDetails,
                            null,
                            contaDetails.getAuthorities()
                    );

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        return authHeader.substring(7);
    }
}
