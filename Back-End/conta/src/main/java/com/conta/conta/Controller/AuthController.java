package com.conta.conta.Controller;

import com.conta.conta.DTO.AuthResponse;
import com.conta.conta.DTO.AuthenticationDTO;
import com.conta.conta.Entity.Conta;
import com.conta.conta.Repository.ContaRepository;
import com.conta.conta.Security.TokenBlacklistService;
import com.conta.conta.Security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private ContaRepository contaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Conta conta) {
        if (userExists(conta)) {
            return ResponseEntity.badRequest().body("Usuário já cadastrado!");
        }

        conta.setSenha(passwordEncoder.encode(conta.getSenha()));
        conta.setRole(com.conta.conta.Enums.UserRole.USER);
        contaRepository.save(conta);

        return ResponseEntity.ok("Usuário registrado com sucesso!");
    }

    private boolean userExists(Conta conta) {
        return contaRepository.findByEmail(conta.getEmail()).isPresent()
                || contaRepository.findByCpf(conta.getCpf()).isPresent()
                || contaRepository.findByTelefone(conta.getTelefone()).isPresent();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationDTO loginRequest) {
        try {
            // Cria token de autenticação com Spring Security
            var authToken = new UsernamePasswordAuthenticationToken(
                    loginRequest.getIdentifier(), loginRequest.getSenha()
            );
            var auth = authenticationManager.authenticate(authToken);

            // Pega usuário autenticado
            Conta contaAutenticada = (Conta) auth.getPrincipal();

            // Gera token JWT
            String token = tokenService.generateToken(contaAutenticada);

            return ResponseEntity.ok(new AuthResponse(token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Credenciais inválidas!");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            tokenBlacklistService.add(token); // adiciona token à blacklist
            return ResponseEntity.ok("Logout realizado com sucesso!");
        } else {
            return ResponseEntity.badRequest().body("Token não encontrado ou inválido!");
        }
    }
}
