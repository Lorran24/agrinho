// Configurações do jogo
let fazendeiro;
let alimentos = [];
let mercados = [];
let obstaculos = [];
let dinheiro = 0;
let nivel = 1;
let velocidadeJogo = 3;
let fundoCampo, fundoCidade, imgFazendeiro, imgCaminhao;

function preload() {
  // Carregar imagens (substitua por URLs ou assets locais)
  fundoCampo = loadImage('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800');
  fundoCidade = loadImage('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800');
  imgFazendeiro = loadImage('https://cdn-icons-png.flaticon.com/512/3069/3069172.png');
  imgCaminhao = loadImage('https://cdn-icons-png.flaticon.com/512/185/185738.png');
}

function setup() {
  createCanvas(800, 400);
  
  // Inicializa o fazendeiro
  fazendeiro = {
    x: 50,
    y: height / 2,
    velocidade: 50,
    carga: [],
    capacidadeMax: 3,
    usandoCaminhao: false
  };
  
  // Cria alimentos na fazenda
  criarAlimentos();
  
  // Cria mercados na cidade
  criarMercados();
  
  // Cria obstáculos (carros, buracos, etc.)
  criarObstaculos();
}

function draw() {
  // Desenha o fundo (campo ou cidade)
  if (fazendeiro.x < width / 2) {
    image(fundoCampo, 0, 0, width, height);
  } else {
    image(fundoCidade, 0, 0, width, height);
  }
  
  // Mostra informações do jogo
  fill(255);
  textSize(16);
  text(`Nível: ${nivel} | Dinheiro: $${dinheiro}`, 20, 30);
  text("Seta: Mover | Espaço: Pegar/Entregar | C: Usar caminhão", 20, 60);
  
  // Desenha alimentos na fazenda
  for (let alimento of alimentos) {
    fill(alimento.cor);
    ellipse(alimento.x, alimento.y, 20, 20);
    textSize(12);
    fill(0);
    text(alimento.tipo, alimento.x - 15, alimento.y + 25);
  }
  
  // Desenha mercados na cidade
  for (let mercado of mercados) {
    fill(255, 200, 0);
    rect(mercado.x, mercado.y, 40, 40);
    fill(0);
    text(mercado.tipo, mercado.x - 10, mercado.y + 60);
  }
  
  // Desenha obstáculos
  for (let obstaculo of obstaculos) {
    fill(obstaculo.cor);
    rect(obstaculo.x, obstaculo.y, obstaculo.largura, obstaculo.altura);
    
    // Movimento dos obstáculos
    obstaculo.x -= obstaculo.velocidade;
    if (obstaculo.x < -50) {
      obstaculo.x = width + random(100);
      obstaculo.y = random(100, height - 100);
    }
    
    // Verifica colisão
    if (colisao(fazendeiro.x, fazendeiro.y, 40, 40, obstaculo.x, obstaculo.y, obstaculo.largura, obstaculo.altura)) {
      perdeuCarga();
    }
  }
  
  // Desenha o fazendeiro (ou caminhão)
  if (fazendeiro.usandoCaminhao) {
    image(imgCaminhao, fazendeiro.x, fazendeiro.y, 60, 40);
  } else {
    image(imgFazendeiro, fazendeiro.x, fazendeiro.y, 40, 40);
  }
  
  // Desenha a carga
  for (let i = 0; i < fazendeiro.carga.length; i++) {
    fill(fazendeiro.carga[i].cor);
    ellipse(fazendeiro.x + i * 15, fazendeiro.y - 20, 15, 15);
  }
  
  // Verifica se chegou a um mercado
  verificarEntrega();
  
  // Verifica se passou de nível
  if (dinheiro >= nivel * 50 && nivel < 5) {
    nivel++;
    proximoNivel();
  }
}

function keyPressed() {
  // Movimento
  if (keyCode === UP_ARROW) fazendeiro.y -= 10;
  if (keyCode === DOWN_ARROW) fazendeiro.y += 10;
  if (keyCode === LEFT_ARROW) fazendeiro.x -= fazendeiro.velocidade;
  if (keyCode === RIGHT_ARROW) fazendeiro.x += fazendeiro.velocidade;
  
  // Pegar/entregar alimentos (Barra de Espaço)
  if (key === ' ') {
    // Se estiver na fazenda, pega alimentos
    if (fazendeiro.x < 200 && fazendeiro.carga.length < fazendeiro.capacidadeMax) {
      for (let i = 0; i < alimentos.length; i++) {
        if (dist(fazendeiro.x, fazendeiro.y, alimentos[i].x, alimentos[i].y) < 30) {
          fazendeiro.carga.push(alimentos[i]);
          alimentos.splice(i, 1);
          break;
        }
      }
    }
  }
  
  // Ativa/desativa caminhão (Tecla C)
  if (key === 'c' || key === 'C') {
    fazendeiro.usandoCaminhao = !fazendeiro.usandoCaminhao;
    fazendeiro.velocidade = fazendeiro.usandoCaminhao ? 8 : 5;
    fazendeiro.capacidadeMax = fazendeiro.usandoCaminhao ? 6 : 3;
  }
}

// Cria alimentos na fazenda
function criarAlimentos() {
  const tipos = ["Maçã", "Milho", "Trigo", "Ovo", "Leite"];
  const cores = ["#FF0000", "#FFFF00", "#D2B48C", "#FFFFFF", "#F0F8FF"];
  
  for (let i = 0; i < 5; i++) {
    alimentos.push({
      tipo: tipos[i],
      cor: color(cores[i]),
      x: random(50, 150),
      y: random(100, height - 100)
    });
  }
}

// Cria mercados na cidade
function criarMercados() {
  for (let i = 0; i < 3; i++) {
    mercados.push({
      tipo: ["Feira", "Supermercado", "Restaurante"][i],
      x: width - 150 + i * 60,
      y: height / 2 - 20
    });
  }
}

// Cria obstáculos (carros, buracos, etc.)
function criarObstaculos() {
  for (let i = 0; i < 4; i++) {
    obstaculos.push({
      x: random(width, width + 200),
      y: random(100, height - 100),
      largura: random(30, 70),
      altura: random(20, 50),
      velocidade: random(2, 5),
      cor: color(random(150, 255), random(50, 150), random(50, 150))
    });
  }
}

// Verifica colisão
function colisao(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

// Perde carga se bater em obstáculo
function perdeuCarga() {
  if (fazendeiro.carga.length > 0) {
    alimentos.push(fazendeiro.carga.pop());
  }
}

// Verifica se entregou no mercado
function verificarEntrega() {
  for (let mercado of mercados) {
    if (dist(fazendeiro.x, fazendeiro.y, mercado.x, mercado.y) < 50 && fazendeiro.carga.length > 0) {
      dinheiro += fazendeiro.carga.length * 10;
      fazendeiro.carga = [];
      // Recria alimentos se acabaram
      if (alimentos.length === 0) criarAlimentos();
    }
  }
}

// Aumenta dificuldade no próximo nível
function proximoNivel() {
  velocidadeJogo += 1;
  for (let obstaculo of obstaculos) {
    obstaculo.velocidade += 1;
  }
}