// ADICIONAR AO CARRINHO
function addToCart(nome, preco, inputId) {

    const quantidade = parseInt(document.getElementById(inputId).value);
    if (quantidade < 1) return alert('Quantidade inválida');

    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.push({ nome, preco, quantidade});
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    alert(`${nome} adicionado ao carrinho!`);

    const alertaCarrinho = document.querySelector('.alerta');
alertaCarrinho.classList.remove('d-none'); 
}
// FIM

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
      const nome = row[2] || 'Sem nome';
      const preco = row[3] || 'Sem preço';
      const img = row[4] || 'Sem imagem';

      const div = document.createElement('div');
      div.className = 'produto';
      div.innerHTML = `
          <div class="modelo-produto">
  <div class="card border-0 mb-3" style="width: 14rem;">
    <img src="${img}" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title fw-bold fst-italic">${nome}</h5>
      <p class="card-text text-preco fs-5">R$${preco}</p>
      <input type="number" name="" id="qtd${nome}" min="1" value="1">
      <button onclick="addToCart('${nome}', '${preco}', 'qtd${nome}')" class="btn btn-sm rounded-pill btn-car mt-3">Adicionar ao carrinho</button>
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
