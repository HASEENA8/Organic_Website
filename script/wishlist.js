// Get wishlist and cart from localStorage
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const wishlistContainer = document.getElementById("wishlistItems");

// Header counters
const wishlistCount = document.querySelector(".fa-heart sup");
const cartCount = document.querySelector(".fa-cart-plus sup");

// Update counts
function updateCounts() {
  wishlistCount.innerText = wishlist.length;
  cartCount.innerText = cart.length;
}
updateCounts();

// Show notification
function showNotification(message) {
  const notif = document.createElement("div");
  notif.className = "side-notification";
  notif.innerText = message;

  document.body.appendChild(notif);

  setTimeout(() => {
    notif.classList.add("show");
  }, 100);

  setTimeout(() => {
    notif.classList.remove("show");
    setTimeout(() => notif.remove(), 300);
  }, 2000);
}

// Render wishlist
function renderWishlist() {
  wishlistContainer.innerHTML = "";

  if (wishlist.length === 0) {
    wishlistContainer.innerHTML = "<p>Your wishlist is empty.</p>";
    return;
  }

  wishlist.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "wishlist-item";
    div.innerHTML = `
      <img src="${item.thumbnail}" alt="${item.title}" width="100">
      <h3>${item.title}</h3>
      <p>$${item.price}</p>
      <button class="add-to-cart">Add to Cart</button>
      <button class="remove">Remove</button>
    `;

    // Add to cart
    div.querySelector(".add-to-cart").addEventListener("click", () => {
      cart.push(item);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCounts();
      showNotification(`${item.title} added to Cart!`);
    });

    // Remove from wishlist
    div.querySelector(".remove").addEventListener("click", () => {
      wishlist.splice(index, 1);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      renderWishlist();
      updateCounts();
      showNotification(`${item.title} removed from Wishlist!`);
    });

    wishlistContainer.appendChild(div);
  });
}

renderWishlist();
