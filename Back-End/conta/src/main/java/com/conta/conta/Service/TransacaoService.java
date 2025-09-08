package com.conta.conta.Service;

import com.conta.conta.DTO.TransacaoRequestDto;
import com.conta.conta.Entity.Banco;
import com.conta.conta.Entity.Conta;
import com.conta.conta.Entity.Transacao;
import com.conta.conta.Repository.TransacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TransacaoService {

    @Autowired
    private TransacaoRepository transacaoRepository;

    @Autowired
    private ContaService contaService;

    @Autowired
    private BancoService bancoService;


    // Processar uma transação (transferência)
    @Transactional
    public Transacao processarTransacao(Long contaId, Long bancoOrigemId, Long bancoDestinoId, Transacao transacao) {
        // Buscar a conta, banco de origem e banco de destino
        Conta conta = contaService.buscarPorId(contaId)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));
        Banco bancoOrigem = bancoService.buscarPorId(bancoOrigemId)
                .orElseThrow(() -> new RuntimeException("Banco de origem não encontrado"));
        Banco bancoDestino = bancoService.buscarPorId(bancoDestinoId)
                .orElseThrow(() -> new RuntimeException("Banco de destino não encontrado"));

        // Verificar saldo do banco de origem
        if (bancoOrigem.getSaldo() < transacao.getValor()) {
            throw new RuntimeException("Saldo insuficiente no banco de origem");
        }

        // Atualizar saldos
        bancoOrigem.setSaldo(bancoOrigem.getSaldo() - transacao.getValor());
        bancoDestino.setSaldo(bancoDestino.getSaldo() + transacao.getValor());

        // Atualizar saldo total da conta (opcional, dependendo da regra de negócio)
        conta.setSaldoTotal(conta.getSaldoTotal() - transacao.getValor()); // Ou ajuste conforme necessário

        // Salvar alterações nos bancos
        bancoService.salvar(bancoOrigem);
        bancoService.salvar(bancoDestino);
        contaService.salvar(conta);

        // Criar e salvar a transação
        Transacao transacaoFinal = new Transacao(transacao.getValor(), transacao.getDescricao(), conta, bancoOrigem, bancoDestino);
        return transacaoRepository.save(transacaoFinal);
    }



    // Listar todas as transações
    public List<TransacaoRequestDto> listarTransacoes() {
        return convertToListDTO(transacaoRepository.findAll());
    }

    // Buscar transação por ID
    public Optional<Transacao> buscarPorId(Long id) {
        return transacaoRepository.findById(id);
    }

    // Listar transações por conta ID
    public List<TransacaoRequestDto> listarPorContaId(Long contaId) {
        return convertToListDTO(transacaoRepository.findByContaId(contaId));
    }

    // Listar transações por banco de origem
    public List<TransacaoRequestDto> listarPorBancoOrigem(Long bancoOrigemId) {
        return convertToListDTO(transacaoRepository.findByBancoOrigemId(bancoOrigemId));
    }

    // Listar transações por banco de destino
    public List<TransacaoRequestDto> listarPorBancoDestino(Long bancoDestinoId) {
        return convertToListDTO(transacaoRepository.findByBancoDestinoId(bancoDestinoId));
    }

    // Listar transações por intervalo de datas
    public List<TransacaoRequestDto> listarPorData(LocalDateTime dataInicio, LocalDateTime dataFim) {
        return convertToListDTO(transacaoRepository.findByDataTransacaoBetween(dataInicio, dataFim));
    }

    // Listar transações por conta ID e intervalo de datas
    public List<TransacaoRequestDto> listarPorContaIdEData(Long contaId, LocalDateTime dataInicio, LocalDateTime dataFim) {
        return convertToListDTO(transacaoRepository.findByContaIdAndDataTransacaoBetween(contaId, dataInicio, dataFim));
    }

    public void removerPorId(Long id){
        transacaoRepository.deleteById(id);
    }
//--------------------------------------------------------------------------------------------


    private TransacaoRequestDto convertToDTO(Transacao transacao) {
        if (transacao == null) return null;

        TransacaoRequestDto transacaoRequestDto = new TransacaoRequestDto(transacao.getId(), transacao.getConta().getId(), transacao.getBancoOrigem().getId(),
                transacao.getBancoDestino().getId(), transacao.getValor(), transacao.getDescricao(),
                transacao.getDataTransacao());

        return transacaoRequestDto;
    }

    private List<TransacaoRequestDto> convertToListDTO(List<Transacao> transacoes) {
        return transacoes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

}


