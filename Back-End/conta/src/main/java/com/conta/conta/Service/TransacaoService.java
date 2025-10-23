package com.conta.conta.Service;

import com.conta.conta.DTO.TransacaoFiltro;
import com.conta.conta.DTO.TransacaoRequestDto;
import com.conta.conta.Entity.Banco;
import com.conta.conta.Entity.Conta;
import com.conta.conta.Entity.Transacao;
import com.conta.conta.Repository.TransacaoRepository;
import com.conta.conta.Specification.TransacaoSpecifications;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
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


    // MeTODO PRINCIPAL - substitui todos os métodos de busca
    public List<TransacaoRequestDto> listarComFiltros(TransacaoFiltro filtro) {
        Specification<Transacao> spec = TransacaoSpecifications.comFiltros(filtro);
        return convertToListDTO(transacaoRepository.findAll(spec));
    }

    // MÉTODOS DE CONVENIÊNCIA (opcionais - para compatibilidade)
    public List<TransacaoRequestDto> listarPorContaIdNew(Long contaId) {
        TransacaoFiltro filtro = new TransacaoFiltro();
        filtro.setContaId(contaId);
        return listarComFiltros(filtro);
    }

    public List<TransacaoRequestDto> listarPorContasIds(List<Long> contasIds) {
        TransacaoFiltro filtro = new TransacaoFiltro();
        filtro.setContasIds(contasIds);
        return listarComFiltros(filtro);
    }

    public List<TransacaoRequestDto> listarPorBancosIds(List<Long> bancosIds) {
        TransacaoFiltro filtro = new TransacaoFiltro();
        filtro.setBancosIds(bancosIds);
        return listarComFiltros(filtro);
    }

    public List<TransacaoRequestDto> listarPorContaIdEDataNew(Long contaId, LocalDateTime dataInicio, LocalDateTime dataFim) {
        TransacaoFiltro filtro = new TransacaoFiltro();
        filtro.setContaId(contaId);
        filtro.setDataInicio(dataInicio);
        filtro.setDataFim(dataFim);
        return listarComFiltros(filtro);
    }

    public List<TransacaoRequestDto> listarPorBancoIdEData(Long bancoId, LocalDateTime dataInicio, LocalDateTime dataFim) {
        TransacaoFiltro filtro = new TransacaoFiltro();
        filtro.setBancosIds(List.of(bancoId));
        filtro.setDataInicio(dataInicio);
        filtro.setDataFim(dataFim);
        return listarComFiltros(filtro);
    }

    // Metodos antigos ----------------------------------------------------------------------------------------------------

    // Processar uma transação (transferência)
    @Transactional
    public TransacaoRequestDto processarTransacao(Long bancoOrigemId, Long bancoDestinoId, Transacao transacao) {
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

        //Settar Contas
        Conta contaOrigem = contaService.buscarPorId(bancoOrigem.getConta().getId())
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));
        Conta contaDestino = contaService.buscarPorId(bancoDestino.getConta().getId())
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));


        // Salvar alterações nos bancos
        bancoService.salvar(bancoOrigem);
        bancoService.salvar(bancoDestino);

        // Criar e salvar a transação
        Transacao transacaoFinal = new Transacao(transacao.getValor(), transacao.getDescricao(), contaOrigem, bancoOrigem, contaDestino, bancoDestino);

        //Atualizar o saldo total das contas após deletar a transacao
        contaService.atualizarSaldoTotal(transacaoFinal.getBancoDestino().getConta().getId());
        contaService.atualizarSaldoTotal(transacaoFinal.getBancoOrigem().getConta().getId());

        Transacao transacaoSalva = transacaoRepository.save(transacaoFinal);

        return convertToDTO(transacaoSalva);
    }

    // Listar todas as transações
    public List<TransacaoRequestDto> listarTransacoes() {
        return convertToListDTO(transacaoRepository.findAll());
    }

    // Buscar transação por ID
    public Optional<Transacao> buscarPorId(Long id) {
        return transacaoRepository.findById(id);
    }

    // Listar transações por conta origem
    public List<TransacaoRequestDto> listarPorContaOrigemId(Long contaId) {
        return convertToListDTO(transacaoRepository.findByContaOrigemId(contaId));
    }

    // Listar transações por conta destino
    public List<TransacaoRequestDto> listarPorContaDestinoId(Long contaId) {
        return convertToListDTO(transacaoRepository.findByContaDestinoId(contaId));
    }

    // Listar transações por conta ID independente se for por destino ou origem
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
        Transacao transacao = transacaoRepository.findById(id)
                        .orElseThrow(() -> new EntityNotFoundException("Transação não encontrada"));
        transacaoRepository.deleteById(id);
        //Atualizar o saldo total das contas após deletar a transacao
        contaService.atualizarSaldoTotal(transacao.getBancoDestino().getConta().getId());
        contaService.atualizarSaldoTotal(transacao.getBancoOrigem().getConta().getId());
    }
//--------------------------------------------------------------------------------------------


    private TransacaoRequestDto convertToDTO(Transacao transacao) {
        if (transacao == null) return null;

        TransacaoRequestDto transacaoRequestDto = new TransacaoRequestDto(transacao.getId(), transacao.getContaOringem().getId(), transacao.getBancoOrigem().getId(), transacao.getContaDestino().getId(),
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


