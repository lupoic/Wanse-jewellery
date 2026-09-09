let cart = [];

try {
  const savedCart = JSON.parse(localStorage.getItem("wanseCart"));

  if (Array.isArray(savedCart)) {
    cart = savedCart;
  }
} catch (error) {
  cart = [];
}

const cartCountElements = document.querySelectorAll(".cart-count");
const addToCartButton = document.querySelector(".add-to-cart");

function updateCartCount() {
  let totalQuantity = 0;

  cart.forEach(function (item) {
    totalQuantity += Number(item.quantity) || 0;
  });

  cartCountElements.forEach(function (element) {
    element.textContent = totalQuantity;
  });
}

function saveCart() {
  localStorage.setItem("wanseCart", JSON.stringify(cart));
  updateCartCount();
}

updateCartCount();

if (addToCartButton) {
  addToCartButton.addEventListener("click", function () {
    const nameElement = document.querySelector(
      ".product-information h1"
    );

    const priceElement = document.querySelector(".product-price");
    const imageElement = document.querySelector(".product-gallery img");

    if (!nameElement || !priceElement || !imageElement) {
      return;
    }

    const productPage = window.location.pathname.split("/").pop();
    const productName = nameElement.textContent.trim();

    const productPrice = Number(
      priceElement.textContent.replace(/[^\d.]/g, "")
    );

    const productImage = imageElement.getAttribute("src");

    const existingProduct = cart.find(function (item) {
      return item.page === productPage;
    });

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        page: productPage,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1
      });
    }

    saveCart();

    addToCartButton.textContent = "Added to Bag";
    addToCartButton.disabled = true;

    setTimeout(function () {
      addToCartButton.textContent = "Add to Bag";
      addToCartButton.disabled = false;
    }, 1200);
  });
}

const cartItemsContainer = document.querySelector("#cart-items");
const cartTotalElement = document.querySelector("#cart-total");

function renderCart() {
  if (!cartItemsContainer || !cartTotalElement) {
    return;
  }

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <p class="empty-cart-message">
        Your bag is currently empty.
      </p>
    `;

    cartTotalElement.textContent = "£0.00";
    return;
  }

  cartItemsContainer.innerHTML = "";

  cart.forEach(function (item, index) {
    const cartItem = document.createElement("article");
    cartItem.className = "cart-item";

    cartItem.innerHTML = `
      <a href="${item.page}">
        <img
          class="cart-item-image"
          src="${item.image}"
          alt="${item.name}"
        >
      </a>

      <div class="cart-item-information">
        <p class="cart-item-label">Wansé Jewellery</p>

        <h2>
          <a href="${item.page}">${item.name}</a>
        </h2>

        <p class="cart-item-price">
          £${Number(item.price).toFixed(2)}
        </p>

        <div class="cart-item-actions">
          <div class="quantity-controls">
            <button
              data-action="decrease"
              data-index="${index}"
            >−</button>

            <span>${item.quantity}</span>

            <button
              data-action="increase"
              data-index="${index}"
            >+</button>
          </div>

          <button
            class="remove-item"
            data-action="remove"
            data-index="${index}"
          >
            Remove
          </button>
        </div>
      </div>
    `;

    cartItemsContainer.appendChild(cartItem);
  });

  const totalPrice = cart.reduce(function (total, item) {
    return total + item.price * item.quantity;
  }, 0);

  cartTotalElement.textContent = `£${totalPrice.toFixed(2)}`;
}

if (cartItemsContainer) {
  cartItemsContainer.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");

    if (!button) {
      return;
    }

    const itemIndex = Number(button.dataset.index);
    const action = button.dataset.action;

    if (action === "increase") {
      cart[itemIndex].quantity += 1;
    }

    if (action === "decrease") {
      cart[itemIndex].quantity -= 1;

      if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
      }
    }

    if (action === "remove") {
      cart.splice(itemIndex, 1);
    }

    saveCart();
    renderCart();
  });

  renderCart();
}

const checkoutButton = document.querySelector(".checkout-button");
const demoModal = document.querySelector("#demo-modal");
const closeDemoButtons = document.querySelectorAll("[data-close-demo]");

function openDemoModal() {
  demoModal.classList.add("is-open");
  demoModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeDemoModal() {
  demoModal.classList.remove("is-open");
  demoModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (checkoutButton && demoModal) {
  checkoutButton.addEventListener("click", openDemoModal);

  closeDemoButtons.forEach(function (button) {
    button.addEventListener("click", closeDemoModal);
  });

  demoModal.addEventListener("click", function (event) {
    if (event.target === demoModal) {
      closeDemoModal();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeDemoModal();
    }
  });
}