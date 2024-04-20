import express from 'express'
import PptxGenJS from'pptxgenjs'
import cors from 'cors'
const app = express();

app.use(cors());
app.use(express.json());

app.post('/generate-pptx', express.json(), (req, res) => {
  const pptx = new PptxGenJS();
  const data = req.body; 

  pptx.layout = 'LAYOUT_WIDE';
  data.scenes.forEach(scene => {
    const slide = pptx.addSlide();
    slide.addText(scene.name, { x: 0.5, y: 0.5, fontSize: 18, color: '363636' });
    scene.layers.forEach(layer => {
        switch (layer.type) {
          case "Background":
            slide.background = { color: layer.fill || 'FFFFFF' }
            break;
          case "StaticText":
            slide.addText(layer.text, {
              x: `${layer.left} px` , 
              y: `${layer.top}px`, 
              w: `${layer.width}px`, 
              h: `${layer.height}px`,
              fontSize: `${layer.fontSize}px`, 
              color: layer.fill,
              align: layer.textAlign.toLowerCase()
            });
            break;
          case "StaticImage":
            slide.addImage({
              path: layer.src,
              x: `${layer.left}` , 
              y: `${layer.top}`, 
              w: `${layer.width}`, 
              h: `${layer.height}`
            });
            break;
          case "StaticPath":
           
            break;
          default:
           
            break;
        }
    });
  });

  pptx.writeFile('Design-Presentation.pptx')
    .then(() => res.download('Design-Presentation.pptx'))
    .catch(err => res.status(500).send('Error generating PPTX'));
});




app.listen(3000, () => console.log('Server started on port 3000'));
