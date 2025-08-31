let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const wishlistContainer = document.getElementById("wishlistItems");

const wishlistCount = document.querySelector(".fa-heart sup");
const cartCount = document.querySelector(".fa-cart-plus sup");

function updateCounts() {
  wishlistCount.innerText = wishlist.length;
  cartCount.innerText = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
}
updateCounts();

function showNotification(message) {
  const notif = document.createElement("div");
  notif.className = "side-notification";
  notif.innerText = message;
  document.body.appendChild(notif);
  setTimeout(() => { notif.classList.add("show"); }, 100);
  setTimeout(() => { notif.classList.remove("show"); setTimeout(() => notif.remove(), 300); }, 2000);
}

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
      <img src="${item.thumbnail || 'placeholder.jpg'}" alt="${item.title}" width="100">
      <h3>${item.title}</h3>
      <p>$${item.price}</p>
      <button class="add-to-cart">Add to Cart</button>
      <button class="remove">Remove</button>
    `;

    div.querySelector(".add-to-cart").addEventListener("click", () => {
      const existingIndex = cart.findIndex(c => c.id === item.id);
      if (existingIndex > -1) {
        cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
      } else {
        cart.push({ ...item, quantity: 1, images: item.images || [item.thumbnail || 'placeholder.jpg'] });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      wishlist.splice(index, 1);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      renderWishlist();
      updateCounts();
      showNotification(`${item.title} added to Cart!`);
    });

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


