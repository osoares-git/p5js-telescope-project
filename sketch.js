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
  textSize(height / 35)
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

  fill(150, 0, 100) // Atribui cor ao letreiro
  text('\nPE160\n' + 'Date:' + date + '\n' + 'Hour:' + hour + '\n\n' + 'AH:' + ah + '\n' + 'DEC:' + dec + '\n', -260, 100)
  noFill()

  scale(.07)
  let DEC = dec_deg() // Chamada da funcao dec_deg
  let AH_deg = ah_deg() // Chamada da funcao ra_deg

  fill(45, 128, 217) // Atribui cor ao modelo
  stroke(1)
  rotateY(-150 * PI / 180) // Gira o conjunto
  rotateX(-202.53 * PI / 180) // Soma-se 22.53 graus (Latitude)
  model(base)

  rotateZ(-AH_deg * PI / 180) // Aqui configura o valor do Eixo RA
  translate(0, 0, 2397) //Coincidir os pivos da base e do eixo
  model(eixo)

  translate(-508, 0, 0) //Coincidir os pivos do eixo e do tubo
  rotateX(22.53 * PI / 180)  // Aqui configura a Latitude
  rotateX(-1 * (DEC + 22.53) * PI / 180)  // Configura o valor do DEC
  fill(255, 255, 255)// Atribui cor ao modelo
  model(tubo)
}

// Funcao que quebra a string e converte para graus
function ah_deg() {
  ra_result = float(abs(ah.split(" ")[0] * 15)) + float(ah.split(" ")[1] / 60 * 15) + float(ah.split(" ")[2] / 3600 * 15)

  if (ah.split(" ")[0] + 0.5 < 0) { // Detecta valor negativo
    ra_result = -ra_result
  }
  return ra_result
}

// Funcao que quebra a string e converte para graus
function dec_deg() {
  dec_result = float(abs(dec.split(" ")[0])) + float(dec.split(" ")[1] / 60) + float(dec.split(" ")[2] / 3600)

  if (dec.split(" ")[0] < 0) {
    dec_result = -dec_result
  }
  dec_result = dec_result + 22.53
  return dec_result
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

