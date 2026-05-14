//Elementos da página
let visorCamera = document.getElementById('visor-camera');
let quadroDetecao = document.getElementById('quadro-detecao');
let btnCaptura = document.getElementById('btn-captura');
let botoesZoom = document.querySelectorAll('.btn-zoom');
let btnGirar = document.getElementById('btn-girar');
let btnLanterna = document.getElementById('btn-lanterna');
let btnConfiguracoes = document.getElementById('btn-configuracoes');
let menuConfiguracoes = document.getElementById('menu-configuracoes');
let miniaturaPreview = document.getElementById('miniatura-preview');


let zoomAtual = 1;
let lanternaLigada = false;
let contadorCapturas = 0;
let menuAberto = false;

//Alertas visuais
function mostrarAlerta(titulo, mensagem) {
  let anterior = document.getElementById('alerta-jovi');
  if (anterior) {
    anterior.remove();
  }

  let template = document.getElementById('template-alerta');
  let el = template.content.cloneNode(true).querySelector('.alerta-jovi');
  el.id = 'alerta-jovi';
  el.querySelector('.alerta-titulo').textContent = titulo;
  el.querySelector('.alerta-msg').textContent = mensagem;

  document.querySelector('.tela-celular').appendChild(el);


  setTimeout(function () {
    if (el.parentNode) {
      el.classList.add('saindo');
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 300);
    }
  }, 3000);
}

//Seletor de Zoom
for (let i = 0; i < botoesZoom.length; i++) {
  botoesZoom[i].addEventListener('click', function () {

    for (let j = 0; j < botoesZoom.length; j++) {
      botoesZoom[j].classList.remove('zoom-ativo');
    }
    botoesZoom[i].classList.add('zoom-ativo');
    zoomAtual = parseFloat(botoesZoom[i].dataset.zoom);

    let tamanho = 110;
    if (zoomAtual === 0.5) tamanho = 72;
    if (zoomAtual === 1) tamanho = 110;
    if (zoomAtual === 2) tamanho = 160;
    if (zoomAtual === 5) tamanho = 220;

    quadroDetecao.style.width = tamanho + 'px';
    quadroDetecao.style.height = tamanho + 'px';
  });
}

//Botão Capturar
btnCaptura.addEventListener('click', function () {
  // Efeito de flash no visor
  visorCamera.classList.remove('flash');
  void visorCamera.offsetWidth; // Força o reflow para reiniciar a animação
  visorCamera.classList.add('flash');

  // Ativa a linha de scan se estiver no modo scan
  if (visorCamera.classList.contains('scan-ativo')) {
    visorCamera.classList.remove('em-leitura');
    void visorCamera.offsetWidth;
    visorCamera.classList.add('em-leitura');
    
    setTimeout(function() {
      visorCamera.classList.remove('em-leitura');
      document.getElementById('tela-resultado-scan').classList.add('ativa');
    }, 4000);
  }

  //alerta de confirmação
  let resAtiva = 'HD';
  let fpsAtivo = '24';

  let botoesRes = document.querySelectorAll('.opcao-config[data-group="res"]');
  for (let i = 0; i < botoesRes.length; i++) {
    if (botoesRes[i].classList.contains('active')) {
      resAtiva = botoesRes[i].dataset.val;
    }
  }

  let botoesFps = document.querySelectorAll('.opcao-config[data-group="fps"]');
  for (let j = 0; j < botoesFps.length; j++) {
    if (botoesFps[j].classList.contains('active')) {
      fpsAtivo = botoesFps[j].dataset.val;
    }
  }

  if (!visorCamera.classList.contains('modo-estudante')) {
    contadorCapturas++;
    let interna = miniaturaPreview.querySelector('.miniatura-interna');
    interna.innerHTML = '';
    let templateMin = document.getElementById('template-miniatura');
    let divContador = templateMin.content.cloneNode(true).querySelector('.miniatura-contador');
    divContador.textContent = contadorCapturas;
    interna.appendChild(divContador);
  }

  
  if (visorCamera.classList.contains('scan-ativo')) {
    mostrarAlerta('Analisando foto...');
  } else {
    mostrarAlerta('Foto salva!');
  }

  // Animação de piscar ao tirar a foto
  quadroDetecao.style.transform = 'scale(1.15)';
  setTimeout(function () {
    quadroDetecao.style.transform = 'scale(1)';
  }, 150);
});

//Botão Lanterna
let iconeLanternaLigada = document.getElementById('icone-lanterna-ligada');
let iconeLanternaDesligada = document.getElementById('icone-lanterna-desligada');

btnLanterna.addEventListener('click', function () {
  lanternaLigada = !lanternaLigada;

  if (lanternaLigada) {
    iconeLanternaLigada.style.display = 'none';
    iconeLanternaDesligada.style.display = '';
    btnLanterna.style.background = 'var(--cor-principal)';
    btnLanterna.style.color = '#ffffff';
    mostrarAlerta('Flash ativado');
  } else {
    iconeLanternaLigada.style.display = '';
    iconeLanternaDesligada.style.display = 'none';
    btnLanterna.style.background = '';
    btnLanterna.style.color = '';
    mostrarAlerta('Flash desativado');
  }
});

//Menu de Configurações
btnConfiguracoes.addEventListener('click', function (e) {
  e.stopPropagation();
  menuAberto = !menuAberto;

  if (menuAberto) {
    menuConfiguracoes.classList.add('open');
  } else {
    menuConfiguracoes.classList.remove('open');
  }
});

// Fecha o menu ao clicar fora
document.addEventListener('click', function (e) {
  if (menuAberto && e.target !== btnConfiguracoes) {
    menuAberto = false;
    menuConfiguracoes.classList.remove('open');
  }
});

// Seleciona opção dentro do menu
menuConfiguracoes.addEventListener('click', function (e) {
  let opcao = e.target;

  if (!opcao.classList.contains('opcao-config')) return;

  e.stopPropagation();
  let grupo = opcao.dataset.group;


  let todasDoGrupo = document.querySelectorAll('.opcao-config[data-group="' + grupo + '"]');
  for (let i = 0; i < todasDoGrupo.length; i++) {
    todasDoGrupo[i].classList.remove('active');
  }

  opcao.classList.add('active');
});

//Botão Girar Câmera
btnGirar.addEventListener('click', function () {

  btnGirar.style.transform = 'rotate(180deg)';
  setTimeout(function () {
    btnGirar.style.transform = '';
  }, 380);

  visorCamera.style.opacity = '0.3';
  setTimeout(function () {
    visorCamera.style.opacity = '1';
  }, 400);


});

//Seletor de Modo (Foto / Estudante)
let botoesDeModo = document.querySelectorAll('.botao-modo');
let modoAtual = 'foto';

for (let i = 0; i < botoesDeModo.length; i++) {
  botoesDeModo[i].addEventListener('click', function () {
    let modo = botoesDeModo[i].dataset.mode;
    if (modo === modoAtual) return;

    for (let j = 0; j < botoesDeModo.length; j++) {
      botoesDeModo[j].classList.remove('active');
    }
    botoesDeModo[i].classList.add('active');
    modoAtual = modo;

    if (modo === 'estudante') {
      visorCamera.classList.add('modo-estudante');
    } else {
      visorCamera.classList.remove('modo-estudante');
      visorCamera.classList.remove('scan-ativo');
    }
  });
}

// Modo Scan
let btnScan = document.querySelector('.card-estudante[data-acao="scan"]');
let btnVoltarScan = document.getElementById('btn-voltar-scan');

btnScan.addEventListener('click', function() {
  visorCamera.classList.add('scan-ativo');
});

btnVoltarScan.addEventListener('click', function() {
  visorCamera.classList.remove('scan-ativo');
});

//Relógio em tempo real
function atualizarRelogio() {
  let agora = new Date();
  let hora = agora.getHours().toString().padStart(2, '0');
  let min = agora.getMinutes().toString().padStart(2, '0');
  let el = document.querySelector('.hora-status');
  if (el) {
    el.textContent = hora + ':' + min;
  }
}

atualizarRelogio();
setInterval(atualizarRelogio, 10000);

// Fechar tela de resultado
let btnCancelarResultado = document.getElementById('btn-cancelar-resultado');
let btnSalvarResultado = document.getElementById('btn-salvar-resultado');

if (btnCancelarResultado) {
  btnCancelarResultado.addEventListener('click', function() {
    document.getElementById('tela-resultado-scan').classList.remove('ativa');
  });
}

if (btnSalvarResultado) {
  btnSalvarResultado.addEventListener('click', function() {
    document.getElementById('tela-resultado-scan').classList.remove('ativa');
  });
}