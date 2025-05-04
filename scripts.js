
document.addEventListener("DOMContentLoaded", function() {
  var slogan = document.getElementById("texto-slogan"); 
  slogan.classList.remove('d-none');
  slogan.classList.add("animate__backInUp animate__delay-5s")
});
// ADICIONAR AO CARRINHO
function addToCart(nome, preco, inputId) {

    const quantidade = parseInt(document.getElementById(inputId).value);
    if (quantidade < 1) return alert('Quantidade inválida');

    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.push({ nome, preco, quantidade});
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    // CHAMANDO A FUNÇÃO DE EXIBIR ALERTA E PASSANDO OS PARÂMETROS
    exibirToast(`${nome} adicionado a sacola!`, 'success');


    const alertaCarrinho = document.querySelector('.alerta');
    alertaCarrinho.classList.remove('d-none'); 
}
// FIM
// FUNÇÃ DE EXIBIR ALERT
function exibirToast(mensagem, tipo = 'success') {
  const toastMensagem = document.getElementById('mensagemAlerta');
  const toastEl = document.getElementById('toastCarrinho');

  // MOSTRANDO A MENSAGEM
  toastMensagem.textContent = mensagem;
  toastEl.className = `toast align-items-center text-bg-${tipo} border-0`; // EXIBINDO COM O TIPO 'SUCCESS' 

  // MOSTRA O TOAST
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}
// FIM DA FUNÇÃO DE EXIBIR ALERTA

// CONEXÃO COM A PLANILHA DA GOOGLE SHEETS
const SPREADSHEET_ID = '1_oGHGUaZN1R7OknwnMLNzU6_JyT8Xu0LN_nZb6UveRU';
const API_KEY = 'AIzaSyAotIWBpB3Cj2aLCzaKDFl2p8YYFGaRwbc';
const SHEET_NAME = 'Página1'; // Exatamente como está na planilha

const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}?key=${API_KEY}`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('produtos');
    container.innerHTML = ''; // limpa "Carregando..."

    const rows = data.values;

    if (!rows || rows.length <= 1) {
      container.textContent = 'Nenhum produto encontrado.';
      return;
    }

    // Percorre as linhas, ignorando o cabeçalho
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const desc = row[1] || 'Sem descrição';
      const nome = row[2] || 'Sem nome';
      const preco = row[3].toString().replace(',', '.') || 'Sem preço';
      const img = row[4] || 'Sem imagem';
      

      const div = document.createElement('div');
      div.className = 'produto col-md-6 col-lg-4 d-flex justify-content-center mb-4';
      div.innerHTML = `
          <div class="modelo-produto">
  <div class="card border-0 mb-3" style="width: 15.5rem;">
    <img src="${img}" class="card-img-top" alt="..." width="400px" height="200px">
    <div class="card-body">
      <h5 class="card-title titulo-card fw-bold fst-italic  text-center">${nome}</h5>
      <p class="card-text text-preco fs-5">R$${preco}</p>
      <p class="d-inline-flex gap-1">
  <a class="text-danger p-0 m-0 text-decoration-none fw-semibold" data-bs-toggle="collapse" href="#collapseExample${i}" role="button" aria-expanded="false" aria-controls="collapseExample">
    Ver mais... 
  </a>
</p>
<div class="collapse" id="collapseExample${i}">
  <div class="card card-body">
  ${desc}
  </div>
</div><br>
      <input type="number" name="" id="qtd${nome}" min="1" value="1" class="">
      <div class="d-flex align-items-end justify-content-center">
      <button onclick="addToCart('${nome}', '${preco}', 'qtd${nome}')" class="btn-sm border-0 rounded-pill m-1 p-1  btn-car " id="liveToastBtn">Adicionar à sacola</button>
      </div>
    </div>
  </div>
</div>
      `;
      container.appendChild(div);
    }
  })
  .catch(error => {
    console.error('Erro ao carregar dados:', error);
    document.getElementById('produtos').textContent = 'Erro ao carregar os produtos.';
  });
//   FIM

// SISTEMA DE ENVIO DE FORMULÁRIO E PRODUTOS - CARRINHO
const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
const lista = document.getElementById('lista');
const cliente = document.getElementById('clienteNome').value; 
let total = 0;
let mensagem = `Olá! me chamo ${cliente} Gostaria de fazer um pedido:\n`;



const tb = document.getElementById('tabela');
  
  const div = document.createElement('table');
  div.className = 'table table-hover table-sm table-borderless mt-4 ';
  div.innerHTML = `
      <table class="">
            <thead class="tab-cabecalho">
              <tr>
                <th scope="col">produtos</th>
                <th scope="col">Preço</th>
                <th scope="col">Subtotal</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
  `;
  const tbody = div.querySelector('tbody');


  carrinho.forEach((item, i) => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;
    mensagem += `• ${item.quantidade}x ${item.nome} - R$ ${subtotal.toFixed(2)}\n`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.quantidade}x ${item.nome}</td>
      <td>R$${item.preco}</td>
      <td>R$${subtotal.toFixed(2)}</td>
    `;
    tbody.appendChild(tr)
  });
  tb.appendChild(div);

const texto = document.createElement('h5');
texto.textContent = `\nR$ ${total.toFixed(2)}`;
lista.appendChild(texto)

mensagem += `\nTotal: R$ ${total.toFixed(2)}`;

function enviarPedido() {
  const nome = document.getElementById('clienteNome').value;
  const endereco = document.getElementById('clienteEndereco').value;
  const pagamento = document.getElementById('pagamento').value;
  const obs = document.getElementById('observacoes').value;
  const entregaDiv = document.getElementById("entrega");
  const checkboxes = entregaDiv.querySelectorAll("input[type='radio']");
  let selecionados = [];

  checkboxes.forEach((checkbox) => {
        if(checkbox.checked) {
            selecionados.push(checkbox.value);
        }
      }
      );

  let mensagem = `Olá! Me chamo ${nome} e gostaria de fazer um pedido:\n\n`;

  carrinho.forEach(item => {
    const subtotal = item.preco * item.quantidade;
    mensagem += `• ${item.quantidade}x ${item.nome} - R$ ${subtotal.toFixed(2)}\n`;
  });

  mensagem += `\n*Forma de pagamento:* ${pagamento}`;
  mensagem += `\n*Entrega:* ${selecionados}`;
  if (endereco) mensagem += `\n*Endereço:* ${endereco}`;
  if (obs) mensagem += `\n*Observações:* ${obs}`;
  mensagem += `\n*Total: R$* ${total.toFixed(2)}`;


  const numero = "5511954196792"; // Substitua pelo número da doceira
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");
}

function limparCarrinho(){
  localStorage.removeItem('carrinho');
    const toastMensagemCarrinho = document.getElementById('mensagemAlertaLimpo');
    const toastElemento = document.getElementById('toastCarrinhoLimpo');

  // MOSTRANDO A MENSAGEM
  toastMensagemCarrinho.textContent = 'Sacola vazia!';
  toastElemento.className = `toast align-items-center border-0 bg-danger text-light`; // EXIBINDO COM O TIPO 'SUCCESS' 

  // MOSTRA O TOAST
  const toastTeste = new bootstrap.Toast(toastElemento);
  toastTeste.show();
    setTimeout(() => {
      location.reload();
    }, 800);
}

// TESTE
const swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 20,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    768: {
      slidesPerView: 3,
    },
  },
});

// Instagram embed
window.instgrm.Embeds.process();
