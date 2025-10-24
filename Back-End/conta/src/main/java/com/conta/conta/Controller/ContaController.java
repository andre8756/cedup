package com.conta.conta.Controller;

import com.conta.conta.DTO.TransacaoFiltro;
import com.conta.conta.DTO.TransacaoRequestDto;
import com.conta.conta.Entity.Banco;
import com.conta.conta.Entity.Conta;
import com.conta.conta.Entity.Transacao;
import com.conta.conta.Service.BancoService;
import com.conta.conta.Service.ContaService;
import com.conta.conta.Service.TransacaoService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/conta")
@PreAuthorize("hasRole('USER')")

public class ContaController {

    @Autowired
    private ContaService contaService;

    @Autowired
    private BancoService bancoService;

    @Autowired
    private TransacaoService transacaoService;

    @Autowired
    private ModelMapper modelMapper;


    // Conta Principal -------------------------------------------------------------------------
    //-------------------------------------------------------------------------


    @GetMapping()
    @ResponseStatus(HttpStatus.OK)
    public List<Conta> listaConta(){
        return contaService.listarConta();
    }

    //Buscar conta específica
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Conta buscarConta(@PathVariable("id") Long id){
        return contaService.buscarPorId(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta não encontrada"));
    }

    // Método PUT para atualização
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void atualizarConta(@PathVariable("id") Long id, @RequestBody Conta conta){
        contaService.buscarPorId(id)
                .map(contaBase -> {
                    modelMapper.map(conta, contaBase);
                    contaService.salvar(contaBase);
                    return Void.TYPE;
                }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente nao encontrado"));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerCliente(@PathVariable("id") Long id){
        contaService.buscarPorId(id).map(conta -> {
            contaService.removerPorId(conta.getId());
            return Void.TYPE;
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta não encontrada!"));
    }


    // Outras contas bancárias -------------------------------------------------------------------------
    // -------------------------------------------------------------------------


    //Get para buscar todas as contas bancárias
    @GetMapping("/banco")
    @ResponseStatus(HttpStatus.OK)
    public List<Banco> listaBanco(){
        return bancoService.listarBancos();
    }

    //Get para buscar todas as contas bancárias de um determinado usuário
    @GetMapping("/{id}/banco")
    @ResponseStatus(HttpStatus.OK)
    public List<Banco> listarBancoPorConta2(@PathVariable("id") Long contaId) {
        return bancoService.listarBancoPorContaId(contaId);
    }

    //Buscar banco específico
    @GetMapping("/banco/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Banco buscarBanco(@PathVariable("id") Long id){
        return bancoService.buscarPorId(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Banco não encontrada"));
    }

    //Metodo Post para criação de banco
    @PostMapping("/{contaId}/banco") //Identifica que metodo a API deve executar ao fazer um POST
    @ResponseStatus(HttpStatus.CREATED) //Responde o resultado do post 201
    public Banco salvar(@PathVariable("contaId") Long contaId, @RequestBody Banco banco){

        Conta conta = contaService.buscarPorId(contaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta não encontrada")); // Aqui ele confere se a conta que o usuário apontou existe

        banco.setConta(conta);
        return bancoService.salvar(banco);
    }

    // Metodo PUT para atualização do banco pelo id
    @PutMapping("/banco/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void atualizarBanco(@PathVariable("id") Long id, @RequestBody Banco banco){
        bancoService.buscarPorId(id)
                .map(bancoBase -> {
                    modelMapper.map(banco, bancoBase);
                    bancoService.salvar(bancoBase);
                    return Void.TYPE;
                }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Banco nao encontrado"));
    }

    // Metodo DELETE para deletar um banco pelo id
    @DeleteMapping("/banco/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerBanco(@PathVariable("id") Long id){
        bancoService.buscarPorId(id).map(banco -> {
            bancoService.removerPorId(banco.getId());
            return Void.TYPE;
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Banco não encontrada!"));
    }


    // Transacao  -------------------------------------------------------------------------
    // -------------------------------------------------------------------------

    //Metodo Post para criação da transacao
    @PostMapping("banco/{bancoOrigemId}/{bancoDestinoId}/transacao")
    @ResponseStatus(HttpStatus.CREATED) //Responde o resultado do post 201
    public TransacaoRequestDto salvarTransacao(@PathVariable("bancoOrigemId") Long bancoOrigemId,
                                     @PathVariable("bancoDestinoId") Long bancoDestinoId, @RequestBody Transacao transacao){
        return transacaoService.processarTransacao(bancoOrigemId, bancoDestinoId, transacao);
    }

    // Metodo PUT para atualização da transacao pelo id
    @PutMapping("/banco/transacao/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void atualizarTransacao(@PathVariable("id") Long id, @RequestBody Transacao transacao){
        transacaoService.buscarPorId(id)
                .map(transacaoBase -> {
                    modelMapper.map(transacao, transacaoBase);
                    transacaoService.processarTransacao(transacaoBase.getBancoOrigem().getId(), transacaoBase.getBancoDestino().getId(), transacaoBase);
                    return Void.TYPE;
                }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transacao nao encontrada"));
    }

    // Metodo DELETE para deletar um banco pelo id
    @DeleteMapping("/banco/transacao/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerTransacao(@PathVariable("id") Long id){
        transacaoService.buscarPorId(id).map(transacao -> {
            transacaoService.removerPorId(transacao.getId());
            return Void.TYPE;
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transacao não encontrada!"));
    }


    // ENDPOINT ÚNICO PARA TODAS AS BUSCAS
    @GetMapping("banco/transacao/filtros")
    public List<TransacaoRequestDto> listarComFiltros(
            @RequestParam(required = false) Long contaId,
            @RequestParam(required = false) Long contaOrigemId,
            @RequestParam(required = false) Long contaDestinoId,
            @RequestParam(required = false) Long bancoOrigemId,
            @RequestParam(required = false) Long bancoDestinoId,
            @RequestParam(required = false) List<Long> bancosIds,
            @RequestParam(required = false) List<Long> contasIds,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim,
            @RequestParam(required = false) Float valor,
            @RequestParam(required = false) String descricao) {

        TransacaoFiltro filtro = new TransacaoFiltro();
        filtro.setContaId(contaId);
        filtro.setContaOrigemId(contaOrigemId);
        filtro.setContaDestinoId(contaDestinoId);
        filtro.setBancoOrigemId(bancoOrigemId);
        filtro.setBancoDestinoId(bancoDestinoId);
        filtro.setBancosIds(bancosIds);
        filtro.setContasIds(contasIds);
        filtro.setDataInicio(dataInicio);
        filtro.setDataFim(dataFim);
        filtro.setValor(valor);
        filtro.setDescricao(descricao);

        return transacaoService.listarComFiltros(filtro);
    }

    // Metodos Antigoos (serao excluido)----------------------------------------------------------------------------------

    @GetMapping("banco/transacao")
    @ResponseStatus(HttpStatus.OK)
    public List<TransacaoRequestDto> listarTransacoes(){
        return transacaoService.listarTransacoes();
    }

    // Buscar transação por ID
    @GetMapping("banco/transacao/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Transacao buscarTransacao(@PathVariable Long id) {
        return transacaoService.buscarPorId(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transação não encontrada"));
    }

    // Buscar transação por id da conta
    @GetMapping("/{contaId}/banco/transacao")
    @ResponseStatus(HttpStatus.OK)
    public List<TransacaoRequestDto> listarTransacoesPorconta(@PathVariable("contaId") Long contaId) {
        return transacaoService.listarPorContaId(contaId);
    }

    // Listar transações por conta de origem
    @GetMapping("/origem/{contaOrigemId}/banco/transacao")
    @ResponseStatus(HttpStatus.OK)
    public List<TransacaoRequestDto> listarPorContaOrigem(@PathVariable Long contaOrigemId) {
        return transacaoService.listarPorContaOrigemId(contaOrigemId);
    }

    // Listar transações por banco de origem
    @GetMapping("banco/origem/{bancoOrigemId}/transacao")
    @ResponseStatus(HttpStatus.OK)
    public List<TransacaoRequestDto> listarPorBancoOrigem(@PathVariable Long bancoOrigemId) {
        return transacaoService.listarPorBancoOrigem(bancoOrigemId);
    }

    // Listar trancacoes por conta destino
    @GetMapping("/destino/{contaDestinoId}/banco/transacao")
    @ResponseStatus(HttpStatus.OK)
    public List<TransacaoRequestDto> listarPorContaDestino(@PathVariable Long contaDestinoId) {
        return transacaoService.listarPorContaDestinoId(contaDestinoId);
    }

    // Listar transações por banco de destino
    @GetMapping("/banco/destino/{bancoDestinoId}/transacao")
    @ResponseStatus(HttpStatus.OK)
    public List<TransacaoRequestDto> listarPorBancoDestino(@PathVariable Long bancoDestinoId) {
        return transacaoService.listarPorBancoDestino(bancoDestinoId);
    }

    // Listar transações por intervalo de datas
    @GetMapping("/banco/transacao/{dataInicio}/{dataFim}")
    @ResponseStatus(HttpStatus.OK)
    public List<TransacaoRequestDto> listarPorData(
            @PathVariable("dataInicio") LocalDateTime dataInicio,
            @PathVariable("dataFim") LocalDateTime dataFim) {
        return transacaoService.listarPorData(dataInicio, dataFim);
    }

    // Listar transações da conta por intervalo de datas
    @GetMapping("{contaId}/banco/transacao/{dataInicio}/{dataFim}")
    @ResponseStatus(HttpStatus.OK)
    public List<TransacaoRequestDto> listarPorContaIdEData(
            @PathVariable("contaId") Long contaId,
            @PathVariable("dataInicio") LocalDateTime dataInicio,
            @PathVariable("dataFim") LocalDateTime dataFim) {
        return transacaoService.listarPorContaIdEData(contaId, dataInicio, dataFim);
    }
}
