const productsContainer = document.getElementById("displayProducts");
const cartCountElement = document.querySelector(".fa-cart-plus + sup");
const wishlistCountElement = document.querySelector(".fa-heart + sup");

let allProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

updateCartCount();
updateWishlistCount();

// Fetch products
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

// Display products
function displayProducts(products) {
  productsContainer.innerHTML = "";
  products.forEach((product) => {
    productsContainer.appendChild(generateItemCard(product));
  });
}

// Generate product card
function generateItemCard(product) {
  const card = document.createElement("div");
  card.classList.add("product-card");

  const isInWishlist = wishlist.some((item) => item.id === product.id);

  card.innerHTML = `
    <div class="banner">${product.category}</div>
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

  // Add to Cart
  card.querySelector(".add-to-cart").addEventListener("click", (event) => {
    event.stopPropagation();
    addToCart(product);
  });

  // Add to Wishlist
  card.querySelector(".add-to-wishlist").addEventListener("click", (event) => {
    event.stopPropagation();
    addToWishlist(product, event.currentTarget);
  });

  return card;
}

// Add to Cart
function addToCart(product) {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  if (!activeUser) {
    showNotification("Please login before adding the products", "error");
    return;
  }

  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity = Number(existing.quantity) + 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: Number(product.price),
      images: product.images,
      quantity: 1,
    });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showNotification(`${product.title} added to cart`, "success");
}

// Add to Wishlist
function addToWishlist(product, btn) {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  if (!activeUser) {
    showNotification("Please login before adding the products", "error");
    return;
  }

  const exists = wishlist.find((item) => item.id === product.id);
  if (!exists) {
    wishlist.push(product);
    btn.querySelector("i").style.color = "red";
    showNotification(`${product.title} added to wishlist`, "success");
  } else {
    wishlist = wishlist.filter((item) => item.id !== product.id);
    btn.querySelector("i").style.color = "black";
    showNotification(`${product.title} removed from wishlist`, "warning");
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistCount();
}

// Update counts
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  if (cartCountElement) cartCountElement.textContent = totalItems;
}

function updateWishlistCount() {
  if (wishlistCountElement) wishlistCountElement.textContent = wishlist.length;
}

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

// Initial load
renderActiveUsers();


// ------------------- Toast Notification -------------------
function showNotification(message, type = "info") {
  let notification = document.createElement("div");
  notification.className = `toast ${type}`;
  notification.innerText = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}
