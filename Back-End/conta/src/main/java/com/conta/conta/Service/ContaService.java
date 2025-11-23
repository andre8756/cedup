package com.conta.conta.Service;

import com.conta.conta.DTO.ContaUpdateRequest;
import com.conta.conta.Entity.Banco;
import com.conta.conta.Entity.Conta;
import com.conta.conta.Repository.ContaRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@Service
public class ContaService {

    private final ContaRepository contaRepository;
    private final PasswordEncoder passwordEncoder;

    public ContaService(ContaRepository contaRepository, PasswordEncoder passwordEncoder) {
        this.contaRepository = contaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Pega o ID do usuário logado de forma segura
    private Long getAuthenticatedUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !(auth.getPrincipal() instanceof Conta)) {
            throw new IllegalStateException("Usuário não autenticado");
        }

        Conta conta = (Conta) auth.getPrincipal();
        return conta.getId(); // Agora sim retorna o ID corretamente
    }


    // Listar todas as contas (para admins ou testes)
    public List<Conta> listarConta() {
        return contaRepository.findAll();
    }

    // Busca a conta do usuário logado
    public Conta buscarContaLogada() {
        Long userId = getAuthenticatedUserId();
        return contaRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Conta do usuário logado não encontrada"));
    }

    @Transactional
    public Conta atualizarContaLogada(ContaUpdateRequest dto) {
        Conta conta = buscarContaLogada();

        Optional.ofNullable(dto.getTitular()).filter(s -> !s.isBlank()).ifPresent(conta::setTitular);
        Optional.ofNullable(dto.getEmail()).filter(s -> !s.isBlank()).ifPresent(conta::setEmail);
        Optional.ofNullable(dto.getTelefone()).filter(s -> !s.isBlank()).ifPresent(conta::setTelefone);
        Optional.ofNullable(dto.getSenha()).filter(s -> !s.isBlank())
                .ifPresent(s -> conta.setSenha(passwordEncoder.encode(s)));
        Optional.ofNullable(dto.getStatus()).ifPresent(conta::setStatus);

        return contaRepository.save(conta);
    }


    // Busca uma conta pelo ID informado(admins)
    public Optional<Conta> buscarPorId(Long id) {
        return contaRepository.findById(id);
    }

    // Remove a conta do usuário logado
    @Transactional
    public void removerContaUsuario() {
        Long userId = getAuthenticatedUserId();
        Conta conta = contaRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Conta do usuário logado não encontrada"));
        contaRepository.delete(conta);
    }

    // Atualiza o saldo total da conta logada
    @Transactional
    public void atualizarSaldoTotal() {
        Long userId = getAuthenticatedUserId();

        Conta conta = contaRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Conta não encontrada"));

        float saldoTotal = conta.getBancos()
                .stream()
                .map(Banco::getSaldo)
                .reduce(0.0f, Float::sum);

        conta.setSaldoTotal(saldoTotal);
        // Com @Transactional, JPA atualiza automaticamente, não precisa do save
    }

    // Atualiza saldo total de qualquer conta (útil para transações entre contas)
    @Transactional
    public void atualizarSaldoTotal(Long contaId) {
        Conta conta = contaRepository.findById(contaId)
                .orElseThrow(() -> new EntityNotFoundException("Conta não encontrada"));

        float saldoTotal = conta.getBancos()
                .stream()
                .map(Banco::getSaldo)
                .reduce(0.0f, Float::sum);

        conta.setSaldoTotal(saldoTotal);
    }
}
