package com.conta.conta.Service;

import com.conta.conta.Entity.Banco;
import com.conta.conta.Entity.Conta;
import com.conta.conta.Repository.BancoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BancoService {

    @Autowired
    private BancoRepository bancoRepository;

    @Autowired
    private ContaService contaService;

    // =========================================
    // SALVAR (sempre ligado ao usuário logado)
    // =========================================
    public Banco salvar(Banco banco){
        Conta conta = contaService.buscarContaLogada(); // pega automaticamente a conta logada
        banco.setConta(conta);

        Banco bancoSalvo = bancoRepository.save(banco);

        contaService.atualizarSaldoTotal(conta.getId());

        return bancoSalvo;
    }

    // =========================================
    // LISTAR TODOS (normalmente só admin)
    // =========================================
    public List<Banco> listarBancos(){
        return bancoRepository.findAll();
    }

    // =========================================
    // LISTAR SOMENTE OS DO USUÁRIO LOGADO
    // =========================================
    public List<Banco> listarBancoPorContaId(){
        Conta conta = contaService.buscarContaLogada();
        return bancoRepository.findByContaId(conta.getId());
    }

    // =========================================
    // BUSCAR POR ID COM VERIFICAÇÃO DE DONO
    // =========================================
    public Optional<Banco> buscarPorId(Long bancoId){
        Banco banco = bancoRepository.findById(bancoId)
                .orElseThrow(() -> new EntityNotFoundException("Banco não encontrado"));

        Conta conta = contaService.buscarContaLogada();

        if (!banco.getConta().getId().equals(conta.getId())) {
            throw new EntityNotFoundException("Você não tem permissão para acessar este banco");
        }

        return Optional.of(banco);
    }

    // =========================================
    // BUSCAR CHAVE PIX DO USUÁRIO LOGADO
    // =========================================
    public Optional<Banco> buscarPorChavePix(String chavePix){
        Banco banco = bancoRepository.findByChavePix(chavePix)
                .orElseThrow(() -> new EntityNotFoundException("Chave PIX não encontrada"));

        Conta conta = contaService.buscarContaLogada();

        if (!banco.getConta().getId().equals(conta.getId())) {
            throw new EntityNotFoundException("Você não tem permissão para acessar esta chave PIX");
        }

        return Optional.of(banco);
    }

    // =========================================
    // REMOVER COM VERIFICAÇÃO DE DONO
    // =========================================
    public void removerPorId(Long bancoId) {
        Banco banco = bancoRepository.findById(bancoId)
                .orElseThrow(() -> new EntityNotFoundException("Banco não encontrado"));

        Conta conta = contaService.buscarContaLogada();

        if (!banco.getConta().getId().equals(conta.getId())) {
            throw new EntityNotFoundException("Você não tem permissão para remover este banco");
        }

        bancoRepository.delete(banco);

        contaService.atualizarSaldoTotal(conta.getId());
    }
}
