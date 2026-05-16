// Elementos principais da página
const visorCamera = document.getElementById('visor-camera');
const quadroDetecao = document.getElementById('quadro-detecao');
const btnCaptura = document.getElementById('btn-captura');
const btnGirar = document.getElementById('btn-girar');
const btnLanterna = document.getElementById('btn-lanterna');
const btnConfiguracoes = document.getElementById('btn-configuracoes');
const menuConfiguracoes = document.getElementById('menu-configuracoes');
const miniaturaPreview = document.getElementById('miniatura-preview');

// Variáveis de estado globais
let zoomAtual = 1;
let lanternaLigada = false;
let contadorCapturas = 0;
let menuAberto = false;
let modoCaptura = null;

// Função simples para mostrar os alerts
function mostrarAlerta(titulo) {
  alert(titulo);

  const anterior = document.getElementById('alerta-jovi');
  if (anterior) {
    anterior.parentNode.removeChild(anterior);
  }

  const alerta = document.createElement('div');
  alerta.id = 'alerta-jovi';
  alerta.className = 'alerta-jovi';

  let html = '<div class="alerta-icone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>';
  html += '<div class="alerta-textos"><strong class="alerta-titulo">' + titulo + '</strong></div>';

  alerta.innerHTML = html;

  const celular = document.querySelector('.tela-celular');
  celular.appendChild(alerta);

  setTimeout(function () {
    if (alerta.parentNode) {
      alerta.parentNode.removeChild(alerta);
    }
  }, 3000);
}

// Relógio simples
function atualizarRelogio() {
  const agora = new Date();
  let hora = agora.getHours();
  let min = agora.getMinutes();

  if (hora < 10) { hora = '0' + hora; }
  if (min < 10) { min = '0' + min; }

  const el = document.querySelector('.hora-status');
  if (el) {
    el.innerHTML = hora + ':' + min;
  }
}

// Botoes de zoom
const botoesZoom = document.querySelectorAll('.btn-zoom');
if (botoesZoom.length > 0 && quadroDetecao) {
  for (let i = 0; i < botoesZoom.length; i++) {
    botoesZoom[i].onclick = function () {
      for (let j = 0; j < botoesZoom.length; j++) {
        botoesZoom[j].className = 'btn-zoom';
      }
      this.className = 'btn-zoom zoom-ativo';

      const zoomValue = this.getAttribute('data-zoom');
      zoomAtual = parseFloat(zoomValue);

      let tamanho = 110;
      if (zoomAtual == 0.5) tamanho = 72;
      if (zoomAtual == 1) tamanho = 110;
      if (zoomAtual == 2) tamanho = 160;
      if (zoomAtual == 5) tamanho = 220;

      quadroDetecao.style.width = tamanho + 'px';
      quadroDetecao.style.height = tamanho + 'px';
    };
  }
}

// Botao capturar
if (btnCaptura && visorCamera && quadroDetecao) {
  btnCaptura.onclick = function () {
    const classesVisor = visorCamera.className;

    if (classesVisor.indexOf('scan-ativo') !== -1) {
      modoCaptura = 'scan';
    } else if (classesVisor.indexOf('flashcard-ativo') !== -1) {
      modoCaptura = 'flashcard';
    } else if (classesVisor.indexOf('math-ativo') !== -1) {
      modoCaptura = 'math';
    } else {
      modoCaptura = null;
    }

    if (modoCaptura !== null) {
      visorCamera.className += ' em-leitura';
      mostrarAlerta('ANALISANDO...');

      setTimeout(function () {
        visorCamera.className = visorCamera.className.replace(' em-leitura', '');

        if (modoCaptura == 'math') {
          window.location.href = 'pages/equacao.html';
        } else if (modoCaptura == 'flashcard') {
          window.location.href = 'pages/flashcard.html';
        } else {
          window.location.href = 'pages/scan.html';
        }
        modoCaptura = null;
      }, 4000);
    } else {
      contadorCapturas++;
      mostrarAlerta('FOTO SALVA!');

      if (miniaturaPreview) {
        const interna = miniaturaPreview.querySelector('.miniatura-interna');
        if (interna) interna.innerHTML = '<div class="miniatura-contador">' + contadorCapturas + '</div>';
      }
    }

    quadroDetecao.style.transform = 'scale(1.15)';
    setTimeout(function () {
      quadroDetecao.style.transform = 'scale(1)';
    }, 150);
  };
}

// Lanterna
const iconeLanternaLigada = document.getElementById('icone-lanterna-ligada');
const iconeLanternaDesligada = document.getElementById('icone-lanterna-desligada');

if (btnLanterna && iconeLanternaLigada && iconeLanternaDesligada) {
  btnLanterna.onclick = function () {
    if (lanternaLigada == false) {
      lanternaLigada = true;
      iconeLanternaLigada.style.display = 'none';
      iconeLanternaDesligada.style.display = '';
      btnLanterna.style.background = '#FFC107';
      btnLanterna.style.color = '#ffffff';
      mostrarAlerta('FLASH ATIVADO');
    } else {
      lanternaLigada = false;
      iconeLanternaLigada.style.display = '';
      iconeLanternaDesligada.style.display = 'none';
      btnLanterna.style.background = '';
      btnLanterna.style.color = '';
      mostrarAlerta('FLASH DESATIVADO');
    }
  };
}

// Configuracoes
if (btnConfiguracoes && menuConfiguracoes) {
  btnConfiguracoes.onclick = function () {
    if (menuAberto == false) {
      menuAberto = true;
      menuConfiguracoes.className = 'menu-configuracoes open';
    } else {
      menuAberto = false;
      menuConfiguracoes.className = 'menu-configuracoes';
    }
  };
}

// Girar Câmera
if (btnGirar && visorCamera) {
  btnGirar.onclick = function () {
    btnGirar.style.transform = 'rotate(180deg)';
    visorCamera.style.opacity = '0.3';

    setTimeout(function () {
      btnGirar.style.transform = 'rotate(0deg)';
      visorCamera.style.opacity = '1';
    }, 400);
  };
}

// Seleção de modo (Arrastável e Clicável)
const botoesDeModo = document.querySelectorAll('.botao-modo');
if (botoesDeModo.length > 0 && visorCamera) {
  for (let m = 0; m < botoesDeModo.length; m++) {
    botoesDeModo[m].onclick = function () {
      // Remove active de todos
      for (let n = 0; n < botoesDeModo.length; n++) {
        botoesDeModo[n].classList.remove('active');
      }
      // Adiciona no atual
      this.classList.add('active');

      // Centraliza o botão no scroll
      this.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

      const modo = this.getAttribute('data-mode');

      const btnCapturaInterna = document.querySelector('.captura-interna');

      if (modo == 'estudante') {
        visorCamera.className = 'visor-camera modo-estudante';
        if (btnCapturaInterna) btnCapturaInterna.style.background = '';
      } else if (modo == 'video') {
        visorCamera.className = 'visor-camera';
        if (btnCapturaInterna) btnCapturaInterna.style.background = '#ff3b30'; // Vermelho iOS/Video
      } else {
        // Foto, Retrato, Pro
        visorCamera.className = 'visor-camera';
        if (btnCapturaInterna) btnCapturaInterna.style.background = '';
      }
    };
  }
}

// Botoes do estudante
const btnScan = document.querySelector('.card-estudante[data-acao="scan"]');
const btnFlashcard = document.querySelector('.card-estudante[data-acao="flashcard"]');
const btnMath = document.querySelector('.card-estudante[data-acao="math"]');
const btnVoltarScan = document.getElementById('btn-voltar-scan');
const badgeVisor = document.getElementById('estudante-badge-visor');

if (btnScan) {
  btnScan.onclick = function () {
    visorCamera.className = 'visor-camera modo-estudante scan-ativo';
    badgeVisor.innerHTML = '&bull; Scan';
  };
}
if (btnFlashcard) {
  btnFlashcard.onclick = function () {
    visorCamera.className = 'visor-camera modo-estudante flashcard-ativo';
    badgeVisor.innerHTML = '&bull; Flashcard';
  };
}
if (btnMath) {
  btnMath.onclick = function () {
    visorCamera.className = 'visor-camera modo-estudante math-ativo';
    badgeVisor.innerHTML = '&bull; Math';
  };
}
if (btnVoltarScan) {
  btnVoltarScan.onclick = function () {
    visorCamera.className = 'visor-camera modo-estudante';
    badgeVisor.innerHTML = '&bull; Modo estudante';
  };
}

// Lógica da tela de salvar matéria
const cardsMaterias = document.querySelectorAll('.card-materia');
if (cardsMaterias.length > 0) {
  for (let i = 0; i < cardsMaterias.length; i++) {
    // Pula se for o botão de criar nova matéria
    if (cardsMaterias[i].classList.contains('btn-nova-materia')) continue;

    cardsMaterias[i].onclick = function () {
      const todosOsCards = document.querySelectorAll('.card-materia');
      for (let j = 0; j < todosOsCards.length; j++) {
        todosOsCards[j].classList.remove('selecionado');
      }
      this.classList.add('selecionado');
    };
  }

  const btnConfirmarSalvar = document.getElementById('btn-confirmar-salvar');
  if (btnConfirmarSalvar) {
    btnConfirmarSalvar.onclick = function () {
      const nomeSelecionado = document.querySelector('.card-materia.selecionado .materia-nome');
      let nome = 'Matéria';
      if (nomeSelecionado) {
        nome = nomeSelecionado.innerHTML;
      }
      mostrarAlerta('SALVO EM ' + nome.toUpperCase() + '!');
      setTimeout(function () {
        window.history.back();
      }, 1500);
    };
  }
}

// Virar flashcard
function virarFlashcard(btn) {
  const card = btn.closest('.card-flashcard');
  if (card) {
    const frente = card.querySelector('.card-flashcard-frente');
    const verso = card.querySelector('.card-flashcard-verso');
    if (frente && verso) {
      if (frente.style.display === 'none') {
        frente.style.display = 'flex';
        verso.style.display = 'none';
        btn.style.color = '#666';
      } else {
        frente.style.display = 'none';
        verso.style.display = 'flex';
        btn.style.color = 'var(--cor-principal)';
      }
    }
  }
}

// Carrossel Matemática
let slideMathAtual = 0;
function mudarSlideMath(direcao) {
  const slides = document.querySelectorAll('.slide-equacao');
  if (slides.length === 0) return;

  slides[slideMathAtual].classList.remove('ativo');
  slideMathAtual += direcao;

  if (slideMathAtual < 0) slideMathAtual = 0;
  if (slideMathAtual >= slides.length) slideMathAtual = slides.length - 1;

  slides[slideMathAtual].classList.add('ativo');

  // Atualiza controles
  const btnAnterior = document.getElementById('btn-math-anterior');
  const btnProximo = document.getElementById('btn-math-proximo');
  const contador = document.getElementById('contador-math');

  if (slideMathAtual === 0) {
    if (btnAnterior) btnAnterior.style.display = 'none';
    if (contador) contador.style.display = 'none';
    if (btnProximo) {
      btnProximo.style.display = 'flex';
      btnProximo.innerHTML = 'Mais exemplos <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>';
    }
    const container = document.querySelector('.controles-slideshow');
    if (container) container.style.justifyContent = 'flex-end';
  } else {
    if (btnAnterior) btnAnterior.style.display = 'flex';
    if (contador) {
      contador.style.display = 'block';
      contador.innerText = (slideMathAtual + 1) + " de " + slides.length;
    }
    if (btnProximo) {
      btnProximo.innerHTML = 'Próximo <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>';
      // Se for o último slide, esconde o próximo
      if (slideMathAtual === slides.length - 1) {
        btnProximo.style.display = 'none';
      } else {
        btnProximo.style.display = 'flex';
      }
    }
    const container = document.querySelector('.controles-slideshow');
    if (container) container.style.justifyContent = 'space-between';
  }
}

// Inicia relogio
atualizarRelogio();
setInterval(atualizarRelogio, 10000);

// Função para criar nova matéria
function novaMateria() {
  let nome = "";

  while (true) {
    nome = prompt("Digite o nome da nova disciplina:");

    if (nome === null)
      return;
    if (nome.trim() !== "")
      break;

    alert("Dê um nome a disciplina!");
  }

  const template = document.getElementById('molde-materia');
  const lista = document.querySelector('.lista-materias');
  const btnNova = document.querySelector('.btn-nova-materia');

  if (template && lista && btnNova) {
    const clone = template.content.cloneNode(true);
    const novoCard = clone.querySelector('button');

    novoCard.querySelector('.materia-nome').innerText = nome.trim();

    novoCard.onclick = function () {
      const todos = document.querySelectorAll('.card-materia');
      for (let j = 0; j < todos.length; j++) {
        todos[j].classList.remove('selecionado');
      }
      this.classList.add('selecionado');
    };

    lista.insertBefore(novoCard, btnNova);
    mostrarAlerta("MATÉRIA " + nome.trim().toUpperCase() + " CRIADA!");
    novoCard.click();
  }
}

// Centraliza o modo ativo no início
const modoAtivo = document.querySelector('.botao-modo.active');
if (modoAtivo) {
  modoAtivo.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
}

// Login para Galeria
const telaLogin = document.getElementById('tela-login');
const formLogin = document.getElementById('form-login');
const btnCancelarLogin = document.getElementById('btn-cancelar-login');

if (miniaturaPreview && telaLogin) {
  miniaturaPreview.onclick = function () {
    telaLogin.classList.add('ativa');
  };
}

if (btnCancelarLogin) {
  btnCancelarLogin.onclick = function () {
    telaLogin.classList.remove('ativa');
  };
}

if (formLogin) {
  formLogin.onsubmit = function (e) {
    e.preventDefault();
    const user = document.getElementById('usuario').value;
    const pass = document.getElementById('senha').value;

    // Validação simples
    if (user === 'admin' && pass === '1234') {
      mostrarAlerta('ACESSO LIBERADO!');
      setTimeout(function () {
        telaLogin.classList.remove('ativa');
        abrirGaleria();
      }, 1000);
    } else {
      mostrarAlerta('USUÁRIO OU SENHA INCORRETOS');

      const container = document.querySelector('.login-container');
      container.style.animation = 'none';
      void container.offsetWidth;
      container.style.animation = 'alerta-erro 0.4s ease-in-out';

      document.getElementById('senha').value = '';
      document.getElementById('usuario').focus();
    }
  };
}

// Galeria
const telaGaleria = document.getElementById('tela-galeria');
const galeriaWrapper = document.getElementById('galeria-wrapper');
const galeriaPrev = document.getElementById('galeria-prev');
const galeriaNext = document.getElementById('galeria-next');
const galeriaIndicadores = document.getElementById('galeria-indicadores');
const btnFecharGaleria = document.getElementById('btn-fechar-galeria');

const fotosGaleria = ['img/math.png', 'img/email.png']; // Imagens da pasta img
let slideAtual = 0;

function abrirGaleria() {
  gerarSlides();
  telaGaleria.classList.add('ativa');
  atualizarSlide();
}

function gerarSlides() {
  if (galeriaWrapper.children.length > 0) return;

  galeriaWrapper.innerHTML = '';
  galeriaIndicadores.innerHTML = '';
  for (let i = 0; i < fotosGaleria.length; i++) {
    let foto = fotosGaleria[i];

    // Criar Slide
    const slide = document.createElement('div');
    slide.className = 'galeria-slide';
    slide.innerHTML = '<img src="' + foto + '" alt="Foto ' + (i + 1) + '">';
    galeriaWrapper.appendChild(slide);

    // Criar Indicador
    const ponto = document.createElement('div');
    ponto.className = 'ponto-indicador';
    if (i === 0) {
      ponto.classList.add('ativo');
    }
    galeriaIndicadores.appendChild(ponto);
  }
}

function atualizarSlide() {
  galeriaWrapper.style.transform = 'translateX(-' + (slideAtual * 100) + '%)';
  // Atualizar pontos
  const pontos = document.querySelectorAll('.ponto-indicador');
  for (let j = 0; j < pontos.length; j++) {
    let ponto = pontos[j];
    if (j === slideAtual) {
      ponto.classList.add('ativo');
    } else {
      ponto.classList.remove('ativo');
    }
  }
}

if (galeriaPrev) {
  galeriaPrev.onclick = () => {
    slideAtual = (slideAtual > 0) ? slideAtual - 1 : fotosGaleria.length - 1;
    atualizarSlide();
  };
}

if (galeriaNext) {
  galeriaNext.onclick = () => {
    slideAtual = (slideAtual < fotosGaleria.length - 1) ? slideAtual + 1 : 0;
    atualizarSlide();
  };
}

if (btnFecharGaleria) {
  btnFecharGaleria.onclick = () => {
    telaGaleria.classList.remove('ativa');
    slideAtual = 0;
  };
}

// Gestos
let touchStartX = 0;
telaGaleria.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
telaGaleria.addEventListener('touchend', e => {
  let touchEndX = e.changedTouches[0].screenX;
  if (touchStartX - touchEndX > 50) galeriaNext.click();
  if (touchEndX - touchStartX > 50) galeriaPrev.click();
});

// Adiciona animação de erro ao CSS (via JS para simplificar este bloco)
const style = document.createElement('style');
style.innerHTML = `
@keyframes alerta-erro {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}
`;
document.head.appendChild(style);