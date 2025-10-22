package com.conta.conta.Controller;

import com.conta.conta.Entity.Conta;
import com.conta.conta.Repository.ContaRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    @PostMapping("/register")
    public String register(@RequestBody Conta conta) {
        if (contaRepository.findByEmail(conta.getEmail()).isPresent()) {
            return "Email já cadastrado!";
        }

        conta.setSenha(passwordEncoder.encode(conta.getSenha()));
        contaRepository.save(conta);
        return "Usuário registrado com sucesso!";
    }

    @PostMapping("/login")
    public String login(@RequestBody Conta loginRequest) {
        try {
            var authToken = new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(), loginRequest.getSenha()
            );

            authenticationManager.authenticate(authToken);
            return "Login bem-sucedido!";
        } catch (Exception e) {
            return "Credenciais inválidas!";
        }
    }
}
