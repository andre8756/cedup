package com.conta.conta.Controller;

import com.conta.conta.DTO.TransacaoFiltro;
import com.conta.conta.DTO.TransacaoRequestDto;
import com.conta.conta.Entity.Banco;
import com.conta.conta.Entity.Conta;
import com.conta.conta.Entity.Transacao;
import com.conta.conta.Service.BancoService;
import com.conta.conta.Service.ContaService;
import com.conta.conta.Service.PdfService;
import com.conta.conta.Service.TransacaoService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/conta")
@PreAuthorize("hasRole('USER')")
public class ContaController {

    @Autowired private ContaService contaService;
    @Autowired private BancoService bancoService;
    @Autowired private TransacaoService transacaoService;
    @Autowired private ModelMapper modelMapper;
    @Autowired private PdfService pdfService;

    // ================================
    // CONTA
    // ================================
    @GetMapping
    public List<Conta> listaConta() {
        return contaService.listarConta();
    }

    @GetMapping("/{id}")
    public Conta buscarConta(@PathVariable Long id) {
        return contaService.buscarPorId(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta não encontrada"));
    }

    @PutMapping("/{id}")
    public void atualizarConta(@PathVariable Long id, @RequestBody Conta conta) {
        Conta contaBase = contaService.buscarPorId(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta não encontrada"));
        modelMapper.map(conta, contaBase);
        contaService.salvar(contaBase);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerConta(@PathVariable Long id) {
        contaService.buscarPorId(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta não encontrada"));
        contaService.removerContaUsuario();
    }

    // ================================
    // BANCOS
    // ================================
    @GetMapping("/banco")
    public List<Banco> listaBanco() {
        return bancoService.listarBancos();
    }

    @GetMapping("/{id}/banco")
    public List<Banco> listarBancoPorConta(@PathVariable Long id) {
        return bancoService.listarBancoPorContaId();
    }

    @GetMapping("/banco/id/{id}")
    public Banco buscarBanco(@PathVariable Long id) {
        return bancoService.buscarPorId(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Banco não encontrado"));
    }

    @GetMapping("/banco/chave-pix/{chavePix}")
    public Banco buscarBancoPorChavePix(@PathVariable String chavePix) {
        return bancoService.buscarPorChavePix(chavePix)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Banco não encontrado"));
    }

    @PostMapping("/{contaId}/banco")
    @ResponseStatus(HttpStatus.CREATED)
    public Banco salvarBanco(@PathVariable Long contaId, @RequestBody Banco banco) {
        Conta conta = contaService.buscarPorId(contaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta não encontrada"));
        banco.setConta(conta);
        return bancoService.salvar(banco);
    }

    @PutMapping("/banco/{id}")
    public void atualizarBanco(@PathVariable Long id, @RequestBody Banco banco) {
        Banco bancoBase = bancoService.buscarPorId(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Banco não encontrado"));
        modelMapper.map(banco, bancoBase);
        bancoService.salvar(bancoBase);
    }

    @DeleteMapping("/banco/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerBanco(@PathVariable Long id) {
        Banco banco = bancoService.buscarPorId(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Banco não encontrado"));
        bancoService.removerPorId(banco.getId());
    }

    // ================================
    // TRANSAÇÕES
    // ================================
    @PostMapping("/banco/{bancoOrigemChavePix}/{bancoDestinoChavePix}/transacao")
    @ResponseStatus(HttpStatus.CREATED)
    public TransacaoRequestDto salvarTransacao(
            @PathVariable String bancoOrigemChavePix,
            @PathVariable String bancoDestinoChavePix,
            @RequestBody Transacao transacao) {
        return transacaoService.processarTransacao(bancoOrigemChavePix, bancoDestinoChavePix, transacao);
    }

    @PutMapping("/banco/transacao/{id}")
    public void atualizarTransacao(@PathVariable Long id, @RequestBody Transacao transacao) {
        Transacao transacaoBase = transacaoService.buscarPorId(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transação não encontrada"));
        modelMapper.map(transacao, transacaoBase);
        transacaoService.processarTransacao(
                transacaoBase.getBancoOrigem().getChavePix(),
                transacaoBase.getBancoDestino().getChavePix(),
                transacaoBase
        );
    }

    @DeleteMapping("/banco/transacao/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerTransacao(@PathVariable Long id) {
        transacaoService.buscarPorId(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transação não encontrada"));
        transacaoService.removerPorId(id);
    }

    // ================================
    // FILTROS
    // ================================
    @GetMapping("/banco/transacao/filtros")
    public List<TransacaoRequestDto> listarComFiltros(TransacaoFiltro filtro) {
        return transacaoService.listarComFiltros(filtro);
    }

    @GetMapping("/banco/transacao/filtros/pdf")
    public ResponseEntity<byte[]> downloadPdfComFiltros(TransacaoFiltro filtro) {
        List<TransacaoRequestDto> transacoesFiltradas = transacaoService.listarComFiltros(filtro);
        byte[] pdfBytes = pdfService.generateTransacoesPdf(transacoesFiltradas);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename("relatorio-transacoes-" + System.currentTimeMillis() + ".pdf")
                .build());
        headers.setContentLength(pdfBytes.length);

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    // ================================
    // RESUMOS
    // ================================
    @GetMapping("/{id}/banco/transacao/receita")
    public float receitaMensal(@PathVariable Long id){
        return transacaoService.calcularReceitaMensal(id);
    }

    @GetMapping("/{id}/banco/transacao/despesa")
    public float despesaMensal(@PathVariable Long id){
        return transacaoService.calcularDespesaMensal(id);
    }

}
