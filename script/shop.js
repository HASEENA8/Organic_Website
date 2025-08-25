const productsContainer = document.getElementById("displayProducts");
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// Fetch products
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayProducts(data.products);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchData("https://dummyjson.com/products");

// Display products
function displayProducts(products) {
  productsContainer.innerHTML = "";
  products.slice(0, 9).forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <div class="banner">${product.category}</div>
      <div class="image-container">
        <img src="${product.images[0]}" alt="${product.title}">
      </div>
      <div class="Description">
        <div class="title">${product.title}</div>
        <div class="About">${product.description}</div>
      </div>
      <div class="cta-container">
        <div class="price">$${product.price}</div>
        <button class="add-to-cart"><i class="fas fa-shopping-bag"></i> Add to cart</button>
        <button class="add-to-wishlist"><i class="fas fa-heart"></i></button>
      </div>
    `;
    
    // Add to Cart button
    card.querySelector(".add-to-cart").addEventListener("click", (event) => {
      event.stopPropagation();
      addToCart(product);
    });

    // Add to Wishlist button
    card.querySelector(".add-to-wishlist").addEventListener("click", (event) => {
      event.stopPropagation();
      addToWishlist(product, event.currentTarget);
    });

    productsContainer.appendChild(card);
  });
  updateCartCount();
  updateWishlistCount();
}

// Add to Cart
function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      images: product.images,
      quantity: 1
    });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Add to Wishlist
function addToWishlist(product, btn) {
  const exists = wishlist.find((item) => item.id === product.id);
  if (!exists) {
    wishlist.push(product);
    btn.querySelector("i").style.color = "red";
  } else {
    wishlist = wishlist.filter((item) => item.id !== product.id);
    btn.querySelector("i").style.color = "black";
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistCount();
}

// Update counts
const cartCountElement = document.querySelector(".fa-cart-plus + sup");
const wishlistCountElement = document.querySelector(".fa-heart + sup");

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  if (cartCountElement) cartCountElement.textContent = totalItems;
}

function updateWishlistCount() {
  if (wishlistCountElement) wishlistCountElement.textContent = wishlist.length;
}
