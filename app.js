import express from 'express';
import {CategoryScale, Chart, LinearScale, LineController, LineElement, PointElement} from 'chart.js';
import {Canvas} from 'skia-canvas';
import fsp from 'node:fs/promises';

Chart.register([
  CategoryScale,
  LineController,
  LineElement,
  LinearScale,
  PointElement
]);

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.get('/api', (req, res) => {
  console.log("ciao");
  res.json({ message: 'Hello from server!' });
});

app.get('/api/grafico', async (req, res) => {
  const canvas = new Canvas(400, 300);

  const chart = new Chart(
    canvas, // TypeScript needs "as any" here
    {
      type: 'line',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          borderColor: 'red'
        }]
      }
    }
  );

  const pngBuffer = await canvas.toBuffer('png', {matte: 'white'});
  //const pngBuffer = await canvas.toBuffer('png', {matte: 'white'});
  await fsp.writeFile('output.png', pngBuffer);

  res.setHeader('Content-Type', 'image/png');
  //chart.destroy();
  res.send(pngBuffer);
});

//TODO togliere 0.0.0.0 per il docker altrimenti non si riesce a raggiungere

// app.listen(port, '127.0.0.1', () => {
//   console.log('Server in ascolto sulla porta 8080');
// });

app.listen(port, () => {
  console.log('Server in ascolto sulla porta 8080');
});


export default app;