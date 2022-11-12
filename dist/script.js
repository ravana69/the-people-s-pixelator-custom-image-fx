window.CP && (window.CP.PenTimer.MAX_TIME_IN_LOOP_WO_EXIT = 60000);
let grid = document.querySelector('#grid');
let body = document.querySelector("body");
let myURL = "https://assets.codepen.io/1197275/lincWebUpload.png";
let pal;

var x = c.getContext("2d");
var hidden = document.createElement('canvas');
var hiddenX = hidden.getContext('2d');

let colors = { /*dark/trim1/trim2/light/stroke*/
  "politico": ["#03253e","#ea1c26","#5092a0","#f9de8d","#03253e"],
  "vapor":["#2c3552","#b252a1","#66a1d2","#dcd5d5","#2c0452"],
  "Warhol":["#2606e7", "#f72e00","#fcfd02","#3cf7fc"],
  "Che Guevara":["#060606", "#b61d1d","#a39b90", "#6c1617", "#050102"],
  "camo":["#28292d","#bbaf73","#507a4a","#66563c","#292a2e",]
}

palette.onchange = (e)=>{
  paletteChange(e)
  main()
}

hide.onchange = (ev)=>{
  controls.style.display = ev.target.checked ? "none" : "block"
}
scale.onchange = main
lineWidth.onchange = main
colorMix.onchange = main
stroke.onchange = main
dots.onchange = main
invert.onchange = main
lightColor.onchange = main
darkColor.onchange = main
blueColor.onchange = main
redColor.onchange = main
dark.onchange = main
strokeColor.onchange = main
bright.onchange = main
pSize.onchange = main
image.addEventListener('change', main)
paletteChange()
main()

function main(ev) { 
  
  x.clearRect(0, 0, c.width, c.height);
  var img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = function () {
   
    hidden.width = img.naturalWidth
    hidden.height = img.naturalHeight
    hidden.getContext('2d').clearRect(0,0,hidden.width,hidden.height)
    hiddenX.drawImage(img, 0, 0);    
    c.width = img.naturalWidth * Math.max(1,scale.value)
    c.height = img.naturalHeight * Math.max(1, scale.value)
    buildGrid(img);
  };

  img.src = image.files[0] ? URL.createObjectURL(image.files[0]) : myURL;

}
function paletteChange(ev){
 pal = colors[document.querySelector('#palette option:checked').value];
 darkColor.value = pal[0];
 redColor.value = pal[1];
 blueColor.value = pal[2];
 lightColor.value = pal[3];
 strokeColor.value = pal[4];
 }

function buildGrid(img) {  
  
  let size = pSize.value;
  let adjSize = Math.max(1,Math.floor(size * scale.value))
  const ROWS = Math.floor(img.naturalHeight / size);
  const COLS = Math.floor(img.naturalWidth / size);

  for(let pass=0;pass<(stroke.checked?2:1);pass++) {
      for (let i = 0; i < ROWS * COLS; i++) {

      let row = Math.floor(i / COLS);
      let col = i % COLS;
      let buffer = hiddenX.getImageData(col * size, row * size, size, size);

      let blockSize = 4
      let rgb = { "r": 0, "g": 0, "b": 0 };
      let count = 0;let j = -4;
      while ((j += (blockSize)) < buffer.data.length) {
        ++count;
        rgb.r += buffer.data[j];
        rgb.g += buffer.data[j + 1];
        rgb.b += buffer.data[j + 2];
      }

      let aveBright = (rgb.r / count + rgb.g / count + rgb.b / count) / 3;
      let isBright = aveBright > (256-bright.value)
      let isDark = aveBright < dark.value
      let useRed = aveBright > 256 * colorMix.value
      if(invert.checked) useRed = !useRed

      let aveRed = Math.floor(rgb.r / count);
      let aveGreen = Math.floor(rgb.g / count);
      let aveBlue = Math.floor(rgb.b / count);

      let c1 = isDark ? darkColor.value : isBright ? lightColor.value : useRed ? redColor.value : blueColor.value;
      
      x.fillStyle = c1        
      x.strokeStyle = strokeColor.value /*could be outside of loop if static*/

      
      let X = adjSize * col
      let Y = adjSize * row
      x.lineWidth = Math.floor(lineWidth.value*adjSize)    

      if(!dots.checked){
        x[stroke.checked&&pass==1?"strokeRect":"fillRect"](X,Y, adjSize, adjSize); 
      } else {     
        x.moveTo(X,Y)
        x.beginPath()
        x.arc(X,Y,adjSize/2,0,2*Math.PI)
        x[stroke.checked&&pass==1?"stroke":"fill"]()
      }
        
    }//end for each pixel
  }//end for pass
}//end main