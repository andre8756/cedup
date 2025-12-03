package com.conta.conta.Service;

import com.conta.conta.DTO.ContaResponse;
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

    private Long getAuthenticatedUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof Long)) {
            throw new IllegalStateException("Usuário não autenticado");
        }
        return (Long) auth.getPrincipal();
    }

    // ===============================
    // BUSCAR CONTA LOGADA (ENTIDADE)
    // ===============================
    public Conta buscarContaLogada() {
        Long userId = getAuthenticatedUserId();
        return contaRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Conta do usuário logado não encontrada"));
    }

    // ===============================
    // BUSCAR CONTA LOGADA (DTO)
    // ===============================
    public ContaResponse buscarContaAtual() {
        Conta conta = buscarContaLogada();
        return ContaResponse.fromEntity(conta);
    }

    // ===============================
    // ATUALIZAR CONTA LOGADA
    // ===============================
    @Transactional
    public ContaResponse atualizarContaLogada(ContaUpdateRequest dto) {
        Conta conta = buscarContaLogada();

        Optional.ofNullable(dto.getTitular()).filter(s -> !s.isBlank()).ifPresent(conta::setTitular);
        Optional.ofNullable(dto.getEmail()).filter(s -> !s.isBlank()).ifPresent(conta::setEmail);
        Optional.ofNullable(dto.getTelefone()).filter(s -> !s.isBlank()).ifPresent(conta::setTelefone);
        Optional.ofNullable(dto.getSenha()).filter(s -> !s.isBlank())
                .ifPresent(s -> conta.setSenha(passwordEncoder.encode(s)));
        Optional.ofNullable(dto.getStatus()).ifPresent(conta::setStatus);

        Conta contaAtualizada = contaRepository.save(conta);
        return ContaResponse.fromEntity(contaAtualizada);
    }

    // ===============================
    // LISTAR TODAS AS CONTAS (ENTIDADE)
    // ===============================
    public List<Conta> listarConta() {
        return contaRepository.findAll();
    }

    // ===============================
    // BUSCAR POR ID (ENTIDADE)
    // ===============================
    public Optional<Conta> buscarPorId(Long id) {
        return contaRepository.findById(id);
    }

    // ===============================
    // REMOVER CONTA DO USUÁRIO LOGADO
    // ===============================
    @Transactional
    public void removerContaUsuario() {
        Long userId = getAuthenticatedUserId();
        Conta conta = contaRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Conta do usuário logado não encontrada"));
        contaRepository.delete(conta);
    }

    // ===============================
    // ATUALIZAR SALDO TOTAL
    // ===============================
    @Transactional
    public void atualizarSaldoTotal(Long userId) {
        Conta conta = contaRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Conta não encontrada"));

        float saldoTotal = conta.getBancos()
                .stream()
                .map(Banco::getSaldo)
                .reduce(0.0f, Float::sum);

        conta.setSaldoTotal(saldoTotal);
    }

}
