package com.conta.conta.Service;

import com.conta.conta.Entity.Conta;
import com.conta.conta.Repository.ContaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private ContaRepository contaRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Conta conta = contaRepository.findByEmail(username)
                .or(() -> contaRepository.findByCpf(username))
                .or(() -> contaRepository.findByTelefone(username))
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        return conta;
    }
}
