// Seletores principais
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const closeModalBtn = document.getElementById("close-modal-btn");
const menu = document.querySelector(".menu");
const cartBtn = document.getElementById("cart-btn");
const cartCount = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const checkoutBtn = document.getElementById("checkout-btn");

// Estado do carrinho
let cart = [];

// Função para fechar o modal do carrinho
closeModalBtn.addEventListener("click", () => {
  cartModal.style.display = "none";
});

// Função para abrir o modal do carrinho
cartBtn.addEventListener("click", () => {
  cartModal.style.display = "block";
});

// Função para adicionar ao carrinho ao clicar em um botão
menu.addEventListener("click", (event) => {
  const parentButton = event.target.closest(".add-to-cart-btn");
  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    addToCart(name, price);
  }
});

// Função para adicionar ao carrinho
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    // Se o item já existe, aumenta a quantidade
    existingItem.quantity += 1;
  } else {
    // Adiciona um novo item ao carrinho
    cart.push({ name, price, quantity: 1 });
  }

  updateCartModal(); // Atualiza o modal do carrinho
}

// Função para atualizar o modal do carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = ""; // Limpa o conteúdo atual
  let total = 0;

  cart.forEach((item, index) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("cart-item");

    cartItemElement.innerHTML = `
      <div>
        <p><strong>Produto:</strong> ${item.name}</p>
        <p><strong>Quantidade:</strong> ${item.quantity}</p>
        <p><strong>Preço:</strong> R$ ${(item.price * item.quantity).toFixed(2)}</p>
      </div>
      <div>
        <button class="remove-from-cart-btn" data-index="${index}">
          <i class="fas fa-trash-alt"></i> Remover
        </button>
      </div>
    `;

    cartItemsContainer.appendChild(cartItemElement);
    total += item.price * item.quantity;
  });

  cartTotal.textContent = `R$ ${total.toFixed(2)}`;
  cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
}

// Função para remover itens do carrinho
cartItemsContainer.addEventListener("click", (event) => {
  if (event.target.closest(".remove-from-cart-btn")) {
    const index = parseInt(event.target.closest(".remove-from-cart-btn").getAttribute("data-index"));
    cart.splice(index, 1);
    updateCartModal();
  }
});

// Função para finalizar o pedido e enviar para o WhatsApp
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  const address = addressInput.value.trim();
  if (!address) {
    alert("Por favor, insira seu endereço antes de finalizar o pedido!");
    return;
  }

  const cartItems = cart
    .map(
      (item) =>
        `${item.name} - Quantidade: ${item.quantity} - Preço: R$ ${(item.price * item.quantity).toFixed(2)}`
    )
    .join("\n");

  const message = encodeURIComponent(
    `Pedido:\n${cartItems}\n\nEndereço de entrega: ${address}`
  );

  const phone = "67996123728"; // Número de telefone para envio
  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

  // Limpa o carrinho após envio
  cart = [];
  addressInput.value = "";
  updateCartModal();
});

// Atualiza contagem do carrinho
function updateCartCount() {
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartCount.textContent = count;
}

// Atualização automática ao digitar endereço
addressInput.addEventListener("input", () => {
  if (addressInput.value.trim() !== "") {
    addressInput.classList.remove("border-red-500");
  }
});
