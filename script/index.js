const productsContainer = document.getElementById("displayProducts");
const cartCountElement = document.querySelector(".fa-cart-plus + sup");
const wishlistCountElement = document.querySelector(".fa-heart + sup");
const filterButtons = document.querySelectorAll(".options-container .options");

let allProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

updateCartCount();
updateWishlistCount();

// ✅ Unified Toast Notification System
function showNotification(message, type = "info") {
  let container = document.getElementById("toast-container");

  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  container.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

async function fetchProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products?limit=20");
    const data = await response.json();
    allProducts = data.products;
    displayProducts(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

function displayProducts(products) {
  productsContainer.innerHTML = "";
  products.forEach((product) => {
    productsContainer.appendChild(generateItemCard(product));
  });
}

function generateItemCard(product) {
  const card = document.createElement("div");
  card.classList.add("product-card");

  const isInWishlist = wishlist.some((item) => item.id === product.id);

  card.innerHTML = `
    <div class="image-container">
      <img src="${product.images[0]}" alt="${product.title}">
    </div>
    <div class="title">${product.title}</div>
    <div class="description">${product.description.substring(0, 80)}...</div>
    <div class="cta-container">
      <div class="price">$${product.price}</div>
      <div class="actions">
        <button class="add-to-cart"><i class="fas fa-shopping-bag"></i></button>
        <button class="add-to-wishlist">
          <i class="fas fa-heart" style="color:${isInWishlist ? "red" : "black"}"></i>
        </button>
      </div>
    </div>
  `;

  // ✅ Cart
  card.querySelector(".add-to-cart").addEventListener("click", (event) => {
    event.stopPropagation();
    const activeUser = JSON.parse(localStorage.getItem("activeUser"));
    if (!activeUser) {
      showNotification("Please sign in to add items to cart", "error");
      return;
    }
    addToCart(product);
  });

  // ✅ Wishlist
  card.querySelector(".add-to-wishlist").addEventListener("click", (event) => {
    event.stopPropagation();
    const activeUser = JSON.parse(localStorage.getItem("activeUser"));
    if (!activeUser) {
      showNotification("Please sign in to add items to wishlist", "error");
      return;
    }
    addToWishlist(product, event.currentTarget);
  });

  return card;
}

function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    showNotification("Product already in cart", "error");
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: Number(product.price),
      images: product.images,
      quantity: 1,
    });
    showNotification("Product added to cart", "success");
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function addToWishlist(product, btn) {
  const exists = wishlist.find((item) => item.id === product.id);
  if (!exists) {
    wishlist.push(product);
    btn.querySelector("i").style.color = "red";
    showNotification("Product added to wishlist", "success");
  } else {
    showNotification("Product already in wishlist", "error");
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistCount();
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  if (cartCountElement) cartCountElement.textContent = totalItems;
}

function updateWishlistCount() {
  if (wishlistCountElement) wishlistCountElement.textContent = wishlist.length;
}

// ✅ Filter functionality
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const category = button.textContent.toLowerCase();
    if (category === "all products") {
      displayProducts(allProducts);
    } else {
      const filtered = allProducts.filter(p => p.category.toLowerCase() === category);
      displayProducts(filtered);
    }
  });
});

fetchProducts();

const activeUsersContainer = document.getElementById("activeUsers");

// Render active user
function renderActiveUsers(triggeredByLogout = false) {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  activeUsersContainer.innerHTML = "";

  if (!activeUser) {
    activeUsersContainer.innerHTML = "<p>No active user.</p>";

    if (triggeredByLogout) {
      showNotification("No active user.", "error");
    }
    return;
  }

  // Show active user card
  const div = document.createElement("div");
  div.classList.add("user-card");
  div.innerHTML = `
      <span>${activeUser}</span>
      <button onclick="logoutUser()">Logout</button>
    `;
  activeUsersContainer.appendChild(div);
}

// Logout user
function logoutUser() {
  const username = JSON.parse(localStorage.getItem("activeUser"));
  localStorage.removeItem("activeUser");

  renderActiveUsers(true);
  showNotification(`${username} logged out`, "error");
}

// Login user
function loginUser(username) {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));

  if (!activeUser) {
    localStorage.setItem("activeUser", JSON.stringify(username));
    renderActiveUsers();
    showNotification(`${username} logged in`, "success");
  } else {
    showNotification(`${activeUser} is already logged in`, "warning");
  }
}

renderActiveUsers();
