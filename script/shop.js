const productsContainer = document.getElementById("displayProducts");
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// ================= FETCH CART PRODUCTS ================= //
async function fetchData() {
  try {
    const response = await fetch("https://dummyjson.com/carts");
    const data = await response.json();

    let allProducts = [];
    data.carts.forEach(c => {
      allProducts = allProducts.concat(c.products);
    });

    displayProducts(allProducts);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchData();

// ================= DISPLAY PRODUCTS ================= //
function displayProducts(products) {
  productsContainer.innerHTML = "";
  products.slice(0, 9).forEach((product) => {
    const isInWishlist = wishlist.some((item) => item.id === product.id);
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <div class="banner">Cart Product</div>
      <div class="image-container">
        <img src="${product.thumbnail}" alt="${product.title}">
      </div>
      <div class="Description">
        <div class="title">${product.title}</div>
        <div class="About">Quantity: ${product.quantity} | Discounted: $${product.discountedPrice}</div>
      </div>
      <div class="cta-container">
        <div class="price">$${product.price}</div>
        <button class="add-to-cart"><i class="fas fa-shopping-bag"></i></button>
        <button class="add-to-wishlist">
          <i class="fas fa-heart" style="color:${isInWishlist ? "red" : "black"}"></i>
        </button>
      </div>
    `;

    // Add to Cart
    card.querySelector(".add-to-cart").addEventListener("click", (event) => {
      event.stopPropagation();
      const activeUser = JSON.parse(localStorage.getItem("activeUser"));
      if (!activeUser) {
        showNotification("Please sign in to add items to cart!", "error");
        return;
      }
      addToCart(product);
    });

    // Add to Wishlist
    card.querySelector(".add-to-wishlist").addEventListener("click", (event) => {
      event.stopPropagation();
      const activeUser = JSON.parse(localStorage.getItem("activeUser"));
      if (!activeUser) {
        showNotification("Please sign in to add items to wishlist!", "error");
        return;
      }
      addToWishlist(product, event.currentTarget);
    });

    productsContainer.appendChild(card);
  });
  updateCartCount();
  updateWishlistCount();
}

// ================= CART FUNCTIONS ================= //
function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    showNotification("This product is already in your cart!", "error");
    return;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: 1
    });
    showNotification("Product added to your cart!", "success");
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// ================= WISHLIST FUNCTIONS ================= //
function addToWishlist(product, btn) {
  const exists = wishlist.find((item) => item.id === product.id);
  if (!exists) {
    wishlist.push(product);
    btn.querySelector("i").style.color = "red";
    showNotification("Product added to wishlist!", "success");
  } else {
    showNotification("This product is already in your wishlist!", "error");
    return;
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistCount();
}

// ================= COUNTERS ================= //
function updateCartCount() {
  const cartCountEl = document.getElementById("cartCount");
  if (cartCountEl) {
    cartCountEl.textContent = cart.length;
  }
}

function updateWishlistCount() {
  const wishCountEl = document.getElementById("wishlistCount");
  if (wishCountEl) {
    wishCountEl.textContent = wishlist.length;
  }
}

// ================= TOAST ================= //
function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `toast ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// ================= ACTIVE USER ================= //
const activeUsersContainer = document.getElementById("activeUsers");

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

function logoutUser() {
  const username = JSON.parse(localStorage.getItem("activeUser"));
  localStorage.removeItem("activeUser");

  renderActiveUsers(true);
  showNotification(`${username} logged out`, "error");
}

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

// ================= INIT ================= //
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  updateWishlistCount();
  renderActiveUsers();
});
