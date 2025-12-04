package com.conta.conta.Service;

import com.conta.conta.DTO.TransacaoResponseDto;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class PdfService {

    private final TemplateEngine templateEngine;

    public PdfService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public byte[] generateTransacoesPdf(List<TransacaoResponseDto> transacoes) {
        try {
            // Preparar dados para o template
            Context context = new Context();
            context.setVariable("transacoes", transacoes);

            // Processar template HTML com Thymeleaf
            String htmlContent = templateEngine.process("relatorio-transacoes", context);

            // Converter HTML para PDF
            ByteArrayOutputStream target = new ByteArrayOutputStream();
            ConverterProperties converterProperties = new ConverterProperties();
            converterProperties.setCharset("UTF-8");
            converterProperties.setBaseUri("src/main/resources/templates/");

            HtmlConverter.convertToPdf(htmlContent, target, converterProperties);

            return target.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar PDF: " + e.getMessage(), e);
        }
    }
}
