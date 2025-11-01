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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

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

    // Registro de usuário
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

    // Verifica se usuário já existe
    private boolean userExists(Conta conta) {
        return contaRepository.findByEmail(conta.getEmail()).isPresent()
                || contaRepository.findByCpf(conta.getCpf()).isPresent()
                || contaRepository.findByTelefone(conta.getTelefone()).isPresent();
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationDTO loginRequest) {
        try {
            Optional<Conta> contaOptional = Optional.empty();

            // Identifica se é email, cpf ou telefone
            String identifier = loginRequest.identifier();
            if (identifier.contains("@")) {
                contaOptional = contaRepository.findByEmail(identifier);
            } else if (identifier.replaceAll("\\D", "").length() == 11) {
                // Pode ser CPF ou telefone
                String digits = identifier.replaceAll("\\D", "");
                if (identifier.contains(".")) {
                    contaOptional = contaRepository.findByCpf(digits);
                } else {
                    contaOptional = contaRepository.findByTelefone(digits);
                }
            }

            if (contaOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Credenciais inválidas!");
            }

            Conta conta = contaOptional.get();

            if (!passwordEncoder.matches(loginRequest.senha(), conta.getSenha())) {
                return ResponseEntity.badRequest().body("Credenciais inválidas!");
            }

            // Cria token JWT
            String token = tokenService.generateToken(conta);

            return ResponseEntity.ok(new AuthResponse(token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Credenciais inválidas!");
        }
    }

    // Logout
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
