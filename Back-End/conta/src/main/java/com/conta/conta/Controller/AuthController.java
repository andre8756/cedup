package com.conta.conta.Controller;

import com.conta.conta.DTO.AuthResponse;
import com.conta.conta.DTO.AuthenticationDTO;
import com.conta.conta.Entity.Conta;
import com.conta.conta.Repository.ContaRepository;
import com.conta.conta.Service.CustomUserDetailsService;
import com.conta.conta.Security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private ContaRepository contaRepository; // <--- ESSE

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody Conta conta) {
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
            var userDetails = userDetailsService.loadUserByUsername(loginRequest.identifier());

            if (!passwordEncoder.matches(loginRequest.senha(), userDetails.getPassword())) {
                return ResponseEntity.badRequest().body("Credenciais inválidas!");
            }

            Conta contaAutenticada = (Conta) userDetails;
            String token = tokenService.generateToken(contaAutenticada);

            return ResponseEntity.ok(new AuthResponse(token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Credenciais inválidas!");
        }
    }
}

