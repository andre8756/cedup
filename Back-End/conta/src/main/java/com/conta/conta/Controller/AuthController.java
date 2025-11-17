package com.conta.conta.Controller;

import com.conta.conta.DTO.AuthResponse;
import com.conta.conta.DTO.AuthenticationDTO;
import com.conta.conta.DTO.ContaRegisterDTO;
import com.conta.conta.Entity.Conta;
import com.conta.conta.Enums.UserRole;
import com.conta.conta.Repository.ContaRepository;
import com.conta.conta.Security.TokenBlacklistService;
import com.conta.conta.Security.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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

    // ===============================
    // Cadastro
    // ===============================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid ContaRegisterDTO dto) {
        if (userExists(dto)) {
            return ResponseEntity.badRequest().body("Usuário já cadastrado!");
        }

        Conta conta = new Conta();
        conta.setTitular(dto.getTitular());
        conta.setCpf(dto.getCpf());
        conta.setEmail(dto.getEmail());
        conta.setTelefone(dto.getTelefone());
        conta.setSenha(passwordEncoder.encode(dto.getSenha()));
        conta.setRole(UserRole.USER);
        conta.setSaldoTotal(0);
        conta.setStatus(true);
        conta.setBancos(null);
        conta.setRole(dto.getRole());
        conta.setSaldoTotal(0);
        conta.setStatus(true);
        conta.setBancos(null);
        contaRepository.save(conta);

        return ResponseEntity.ok("Usuário registrado com sucesso!");
    }

    private boolean userExists(ContaRegisterDTO dto) {
        return contaRepository.findByEmail(dto.getEmail()).isPresent()
                || contaRepository.findByCpf(dto.getCpf()).isPresent()
                || contaRepository.findByTelefone(dto.getTelefone()).isPresent();
    }

    // ===============================
    // Login
    // ===============================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationDTO loginRequest) {
        try {
            String identifier = loginRequest.identifier();
            Optional<Conta> contaOptional = Optional.empty();

            if (identifier.contains("@")) {
                contaOptional = contaRepository.findByEmail(identifier);
            } else {
                // Remove todos caracteres que não são dígitos
                String digits = identifier.replaceAll("\\D", "");

                if (digits.length() == 11) {
                    // Pode ser CPF ou telefone, tentamos ambos
                    contaOptional = contaRepository.findByCpf(digits);
                    if (contaOptional.isEmpty()) {
                        contaOptional = contaRepository.findByTelefone(digits);
                    }
                } else {
                    return ResponseEntity.badRequest().body("Identificador inválido!");
                }
            }

            if (contaOptional.isEmpty() || !passwordEncoder.matches(loginRequest.senha(), contaOptional.get().getSenha())) {
                return ResponseEntity.badRequest().body("Credenciais inválidas!");
            }

            String token = tokenService.generateToken(contaOptional.get());
            return ResponseEntity.ok(new AuthResponse(token));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro no login: " + e.getMessage());
        }
    }


    // ===============================
    // Logout
    // ===============================
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            tokenBlacklistService.add(token);
            return ResponseEntity.ok("Logout realizado com sucesso!");
        } else {
            return ResponseEntity.badRequest().body("Token não encontrado ou inválido!");
        }
    }
}
