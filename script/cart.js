let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const cartContainer = document.getElementById("cartItems");
const totalPriceContainer = document.getElementById("totalPrice");

const cartCountElement = document.querySelector(".fa-cart-plus sup");
const wishlistCountElement = document.querySelector(".fa-heart sup");

function updateNavbarCounts() {
  let cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  let wishlistCount = wishlist.length;
  if (cartCountElement) cartCountElement.innerText = cartCount;
  if (wishlistCountElement) wishlistCountElement.innerText = wishlistCount;
}

function renderCart() {
  cartContainer.innerHTML = "";

  if (!cart || cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty</p>";
    totalPriceContainer.innerText = "Total: $0";
    updateNavbarCounts();
    return;
  }

  cart.forEach((item, index) => {
    if (!item.quantity) item.quantity = 1;
    if (!item.images || item.images.length === 0) item.images = ["placeholder.jpg"];

    const div = document.createElement("div");
    div.classList.add("cart-item");

    div.innerHTML = `
      <img src="${item.images[0]}" width="80" alt="${item.title}">
      <h3>${item.title}</h3>
      <p>Price: $${item.price}</p>
      <div class="quantity-controls">
        <button onclick="decreaseQuantity(${index})">-</button>
        <span>${item.quantity}</span>
        <button onclick="increaseQuantity(${index})">+</button>
      </div>
      <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
      <button onclick="removeFromCart(${index})">Remove</button>
      <button class="add-to-wishlist">Add to Wishlist</button>
    `;

    cartContainer.appendChild(div);

    div.querySelector(".add-to-wishlist").addEventListener("click", () => {
      wishlist.push(item);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });
  });

  calculateTotal();
  updateNavbarCounts();
}

function increaseQuantity(index) {
  cart[index].quantity = (cart[index].quantity || 1) + 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function decreaseQuantity(index) {
  cart[index].quantity = cart[index].quantity || 1;
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
    total += (item.quantity || 1) * item.price;
  });
  totalPriceContainer.innerText = `Total: $${total.toFixed(2)}`;
}

renderCart();


