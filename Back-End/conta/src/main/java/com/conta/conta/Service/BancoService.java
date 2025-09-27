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
    BancoRepository bancoRepository;

    @Autowired
    ContaService contaService;

    public Banco salvar(Banco banco){
        Banco bancoSalvo = bancoRepository.save(banco);
        //Atualiza o saldoTotal da conta
        contaService.atualizarSaldoTotal(bancoSalvo.getConta().getId());
        return bancoSalvo;
    }

    public List<Banco> listarBancos(){
        return bancoRepository.findAll();
    }

    public List<Banco> listarBancoPorContaId(Long contaid){
        return bancoRepository.findByContaId(contaid);
    }

    public Optional<Banco> buscarPorId(Long id){
        return bancoRepository.findById(id);
    }

    public void removerPorId(Long bancoId) {
        Banco banco = bancoRepository.findById(bancoId)
                .orElseThrow(() -> new EntityNotFoundException("Banco não encontrado"));
        Long contaId = banco.getConta().getId();
        bancoRepository.delete(banco);
        // Atualizar o saldo total da conta após deletar
        contaService.atualizarSaldoTotal(contaId);
    }

}
