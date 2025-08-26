const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const chartjs = require('chartjs-node');
const chartjsCanvas = require('chartjs-node-canvas');
const base64 = require('base64-js');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server in ascolto sulla porta 8080');
});

app.get('/ciao', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/crea-grafico', (req, res) => {
  const dati = req.body;
  const tipoGrafico = dati.tipoGrafico;
  const datiGrafico = dati.datiGrafico;

  const chart = new chartjs.Chart({
    type: tipoGrafico,
    data: datiGrafico,
    options: {}
  });

  const canvas = chartjsCanvas.createCanvas(800, 600);
  chart.render(canvas);

  const imageBuffer = canvas.toBuffer();
  const imageBase64 = base64.fromByteArray(imageBuffer);

  res.send(imageBase64);
});

app.get('/api', (req, res) => {

  const width = 400; //px
  const height = 400; //px
  const backgroundColour = 'white'; 

  //const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour});
  // (async () => {
  //     const configuration = {
  //         type: 'bar',
  //         data: data,
  //         options: {}
  //     };
  //     const image = await chartJSNodeCanvas.renderToBuffer(configuration);
  //     const dataUrl = await chartJSNodeCanvas.renderToDataURL(configuration);
  //     const stream = chartJSNodeCanvas.renderToStream(configuration);
  // })();

  // const imageData = chart.toBuffer();
  // res.set("Content-Type", "image/png");
  // res.send(imageData);

  res.json({ message: 'Hello from server!' });
});

app.listen(port, () => {
  console.log('Server in ascolto sulla porta 8080');
});
