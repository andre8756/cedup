import axios from "axios";
import './DownloadTransacaoPDF.css';


export default function DownloadReceitaPDF() {
  const baixarPdf = async () => {
    const res = await axios.get('/banco/transacao/filtros/pdf', {
      responseType: 'blob'
    });

    const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(pdfBlob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'receita.pdf');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <button className="download-button" onClick={baixarPdf}>
      Imprimir Extrato 
    </button>
  );
}
