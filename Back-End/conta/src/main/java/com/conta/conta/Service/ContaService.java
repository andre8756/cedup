package com.conta.conta.Service;

import com.conta.conta.Entity.Banco;
import com.conta.conta.Entity.Conta;
import com.conta.conta.Repository.ContaRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@Service
public class ContaService {

    @Autowired
    private ContaRepository contaRepository;

    // Pega o ID do usuário logado de forma segura
    private Long getAuthenticatedUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Object principal = auth.getPrincipal();

        if (principal instanceof Long) {
            return (Long) principal;
        }

        throw new IllegalStateException("Usuário não autenticado ou tipo de principal inválido");
    }

    // Salvar ou atualizar conta
    public Conta salvar(Conta conta) {
        return contaRepository.save(conta);
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

    // Busca uma conta pelo ID informado
    public Optional<Conta> buscarPorId(Long id) {
        return contaRepository.findById(id);
    }

    // Remove a conta do usuário logado
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
