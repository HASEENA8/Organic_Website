let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartContainer = document.getElementById("cartItems");
const totalPriceContainer = document.getElementById("totalPrice");

function renderCart() {
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty</p>";
    totalPriceContainer.innerText = "Total: $0";
    localStorage.setItem("cart", JSON.stringify(cart));
    return;
  }

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");

    div.innerHTML = `
      <img src="${item.images[0]}" width="80">
      <h3>${item.title}</h3>
      <p>Price: $${item.price}</p>
      <div class="quantity-controls">
        <button onclick="decreaseQuantity(${index})">-</button>
        <span>${item.quantity}</span>
        <button onclick="increaseQuantity(${index})">+</button>
      </div>
      <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
      <button onclick="removeFromCart(${index})">Remove</button>
    `;

    cartContainer.appendChild(div);
  });

  calculateTotal();
}

function increaseQuantity(index) {
  cart[index].quantity += 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function calculateTotal() {
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
  });
  totalPriceContainer.innerText = `Total: $${total.toFixed(2)}`;
}

renderCart();
