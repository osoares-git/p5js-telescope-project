// Declaracao de variaveis globais
let base
let eixo
let tubo
let inconsolata
let data = {}
let date, hour, ah, dec

// Funcao assincrona
async function getJSONData() { 
  data = await loadJSON('assets/config.json')
}

// Funcao de pre-carregamento dos 'assets'
function preload() { 
  base = loadModel("assets/base.obj", false)
  eixo = loadModel("assets/eixo.obj", false)
  tubo = loadModel("assets/tubo.obj", false)
  inconsolata = loadFont('assets/inconsolata.otf')
  data = loadJSON('assets/config.json')
  setInterval(getJSONData, 1000)
}

// Funcao de configuracao geral do script
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL)
  textFont(inconsolata)
  textSize(height / 45)
  textAlign(CENTER, CENTER)
}

// Funcao ciclica do ambiente de desenho
function draw() {
  background(210)

  if (data['hour']) {  // Evita o 'UNDEFINED' como resultado
    hour = data['hour']
    ah = data['ah']
    dec = data['dec']
    date = data['date']
  }
  
  latitude = -22.5344 // latitude do telescopio PE160

  AzElev = getAzimuthElevation(ah_decimal(), dec_decimal(), latitude) 

  fill(150, 0, 100) // Atribui cor ao letreiro
  text('\nPE160\n' + 'Date:' + date + '\n' + 'Hour:' + hour + '\n\n' + 'AH:' + ah + '\n' + 'DEC:' + dec + '\n\n'+"AZ:"+ AzElev.azimuth+ '\n'+"ALT:"+ AzElev.elevation+ '\n' , -260, 100)
  noFill()

  scale(.06)  
  fill(45, 128, 217) // Atribui cor ao modelo
  stroke(1)
  rotateY(-150 * PI / 180) // Gira o conjunto
  
  rotateX((latitude-180) * PI / 180) // Correcao do pivo
  model(base)

  rotateZ(-ah_decimal()*15 * PI / 180) // Aqui configura o valor do Eixo RA
  translate(0, 0, 2397) //Coincidir os pivos da base e do eixo
  model(eixo)

  translate(-508, 0, 0) //Coincidir os pivos do eixo e do tubo
  rotateX(latitude * PI / 180)  // Correcao do pivo
  rotateX(-1 * (dec_decimal()) * PI / 180)  // Configura o valor do DEC
  fill(255, 255, 255)// Atribui cor ao modelo
  model(tubo)
}

// Funcao que quebra a string e converte para graus
function ah_decimal() {
  ra_result = float(abs(ah.split(" ")[0])) + float(ah.split(" ")[1] / 60) + float(ah.split(" ")[2] / 3600)

  if (ah.split(" ")[0] + 0.5 < 0) { // Detecta valor negativo
    ra_result = -ra_result
  }
  return ra_result
}

// Funcao que quebra a string e converte para graus
function dec_decimal() {
  dec_result = float(abs(dec.split(" ")[0])) + float(dec.split(" ")[1] / 60) + float(dec.split(" ")[2] / 3600)

  if (dec.split(" ")[0] < 0) {
    dec_result = -dec_result
  } 
  return dec_result
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function getAzimuthElevation(ha, dec, latitude) {
  // Constantes de conversão
  const DEG2RAD = Math.PI / 180;
  const RAD2DEG = 180 / Math.PI;

  const H = ha*15; //Converte ah_decimal em graus

  // Cálculo da elevação
  const sinElevation = (Math.sin(dec * DEG2RAD) * Math.sin(latitude * DEG2RAD)) +
                      (Math.cos(dec * DEG2RAD) * Math.cos(latitude * DEG2RAD) * Math.cos(H * DEG2RAD));
  let elevation = Math.asin(sinElevation) * RAD2DEG; // Altura em graus
  elevation = Math.round(elevation * 100) / 100; // Arredondamento para 2 casas decimais

  // Cálculo do azimute
  const cotgAzimute = Math.sin(latitude * DEG2RAD)*(1/Math.tan(H * DEG2RAD)) -  (( Math.cos(latitude * DEG2RAD) * Math.tan(dec * DEG2RAD)) / Math.sin(H * DEG2RAD))
   
  let azimuth = Math.atan2(1, cotgAzimute) * RAD2DEG;

  // Correcao do azimute dependendo do sinal de H
  if (H < 0){
    azimuth =  Math.round((azimuth)*100)/100 // Arredondamento
  }
  else{
    azimuth = Math.round((azimuth+180)*100) / 100 // Correcao do lado e Arredondamento
  }
  
  return {azimuth, elevation};
}

