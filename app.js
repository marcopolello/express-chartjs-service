import express from 'express';
import {CategoryScale, Chart, LinearScale, LineController, LineElement, PointElement, BarController, BarElement } from 'chart.js';
import 'chartjs-plugin-datalabels';
import {Canvas} from 'skia-canvas';
import fsp from 'node:fs/promises';

Chart.register({
  id: 'datalabels'
});
Chart.register([
  CategoryScale,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  BarController,
  BarElement,
]);

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.get('/api', (req, res) => {
  console.log("ciao");
  res.json({ message: 'Hello from server!' });
});

app.post('/api/grafico', async (req, res) => {
  try {
    //console.log(req);
    const dati_mattone = req.body.dati_mattone;
    console.log(dati_mattone);
    const date_grafico = req.body.date_grafico;
    //const lingua_chart_tabelle = req.body.lingua_chart_tabelle;
    //const attiva_layout_grafico_2 = req.body.attiva_layout_grafico_2;

    const lingua_chart_tabelle = 'it'; //per ora fisso italiano
    const attiva_layout_grafico_2 = {contenuto: '0'}; //per ora fisso a 0

    const canvas = new Canvas(400, 300);

    let dati_mattone_abbinati = date_grafico.map((elemento) => {
        //console.log(elemento);
        const elemento_corrispondente = dati_mattone.find((dato) => dato.periodo === elemento.periodo);
        if (elemento_corrispondente) {
            //https://enerp.atlassian.net/browse/DEV-1499
            if (attiva_layout_grafico_2.contenuto == '1' || attiva_layout_grafico_2.contenuto == 1) {
                const periodo = elemento_corrispondente.periodo;
                const mese = periodo.split(' ')[0].toUpperCase();
                const anno = elemento_corrispondente.data_competenza.split('-')[0]
                //cambio il periodo da stringa a array di stringhe con dentro mese e anno
                elemento_corrispondente.periodo = [mese, anno];
                //console.log(elemento_corrispondente);
            }                               
            return elemento_corrispondente;
        } else {
            let periodo = elemento?.periodo;
            //https://enerp.atlassian.net/browse/DEV-1499
            if (attiva_layout_grafico_2.contenuto == '1' || attiva_layout_grafico_2.contenuto == 1) {
                const mese = periodo.split(' ')[0].toUpperCase();
                const anno = elemento.data_completa.split('-')[0]
                periodo = [mese, anno];
            }
            return {
            "data_competenza": elemento?.data_completa,
            "periodo": periodo,
            "consumo_f1": "-",
            "consumo_f2": "-",
            "consumo_f3": "-",
            "potenza_fatturata": "-",
            "potenza_rilevata": "-",
            "id_tipo_consumo": "",
            "cosfi_f1": "-",
            "cosfi_f2": "-",
            "cosfi_f3": "-",
            };
        }
    });
    dati_mattone_abbinati.sort((a, b) => new Date(a.data_competenza) - new Date(b.data_competenza));
    let label_date_grafico = dati_mattone_abbinati.map(function(item) {
        var date = new Date(item.data_competenza);
        var month = date.toLocaleString(lingua_chart_tabelle, {
            month: 'short'
        }).slice(0, 3);
        var year = date.getFullYear().toString().slice(-2);
        return month + ' ' + year;
    });

    //console.log(dati_mattone_abbinati);

    const chart = new Chart(
      canvas,
      {
        type: 'bar',
        data: {
          labels: label_date_grafico,
          datasets: [
            {
            label: 'F1',
            data: dati_mattone_abbinati.map(function(item) {
              console.log(item.consumo_f1);
              return parseInt(item.consumo_f1)
            }),
            backgroundColor: 'red' // passare $colore_f1->contenuto
            },
            {
            label: 'F2',
            data: dati_mattone_abbinati.map(function(item) {
              return parseInt(item.consumo_f2)
            }),
            backgroundColor: 'green' // passare $colore_f1->contenuto
            },
            {
            label: 'F3',
            data: dati_mattone_abbinati.map(function(item) {
              return parseInt(item.consumo_f3)
            }),
            backgroundColor: 'blue' // passare $colore_f1->contenuto
            },
            {
            label: 'Totale',
            data: dati_mattone_abbinati.map(function(item) {
                item.altezzaTotale = (parseInt(item.consumo_f1) + parseInt(item.consumo_f2) + parseInt(item.consumo_f3)) * 0.2;
                return parseInt(item.altezzaTotale);
            }),
            backgroundColor: 'white'
            }
          ]
        }
      }
    );

    const pngBuffer = await canvas.toBuffer('png', {matte: 'white'});
    //const pngBuffer = await canvas.toBuffer('png', {matte: 'white'});
    await fsp.writeFile('output.png', pngBuffer);

    const base64Image = pngBuffer.toString('base64');

    res.setHeader('Content-Type', 'text/plain');
      //chart.destroy();
    res.send(base64Image);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }

});

//TODO togliere 0.0.0.0 per il docker altrimenti non si riesce a raggiungere

// app.listen(port, '127.0.0.1', () => {
//   console.log('Server in ascolto sulla porta 8080');
// });

app.listen(port, () => {
  console.log('Server in ascolto sulla porta 8080');
});


export default app;