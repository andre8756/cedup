package com.conta.conta.Controller;

import com.conta.conta.DTO.AuthResponse;
import com.conta.conta.Entity.Conta;
import com.conta.conta.Repository.ContaRepository;
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

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody Conta conta) {
        if (contaRepository.findByEmail(conta.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email já cadastrado!");
        }

        conta.setSenha(passwordEncoder.encode(conta.getSenha()));
        contaRepository.save(conta);
        return ResponseEntity.ok("Usuário registrado com sucesso!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Conta loginRequest) {
        try {
            var authToken = new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getSenha());

            var auth = authenticationManager.authenticate(authToken);


            Conta contaAutenticada = (Conta) auth.getPrincipal();

            // gera token JWT para o usuário autenticado
            String token = tokenService.generateToken(contaAutenticada);

            // retorna token na resposta JSON
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Credenciais inválidas!");
        }
    }
}
