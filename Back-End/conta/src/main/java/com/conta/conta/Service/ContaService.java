package com.conta.conta.Service;

import com.conta.conta.Entity.Banco;
import com.conta.conta.Entity.Conta;
import com.conta.conta.Repository.ContaRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContaService {

    @Autowired
    ContaRepository contaRepository;

    public Conta salvar(Conta conta) {
        return contaRepository.save(conta);
    }

    public List<Conta> listarConta(){
        return contaRepository.findAll();
    }

    public Optional<Conta> buscarPorId(Long id){
        return contaRepository.findById(id);
    }

    public void removerPorId(Long id){
        contaRepository.deleteById(id);
    }

    @Transactional
    public void atualizarSaldoTotal(Long contaId) {
        Conta conta = contaRepository.findById(contaId)
                .orElseThrow(() -> new EntityNotFoundException("Conta não encontrada"));
        float saldoTotal = conta.getBancos().stream()
                .map(Banco::getSaldo)
                .reduce(0.0f, Float::sum);
        conta.setSaldoTotal(saldoTotal);
        contaRepository.save(conta);
    }

}
