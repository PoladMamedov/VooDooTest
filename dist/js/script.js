//! products list fethcing, rendering and pagination setup
let totalPages = 16;
let page = 1;
renderProductsList(totalPages, page);

async function getProducts(page) {
  try {
    const response = await fetch(`https://voodoo-sandbox.myshopify.com/products.json?page=${page}`);
    if (response.ok) {
      const products = await response.json();
      return products;
    }
  } catch (e) {
    console.log(e);
  }
}

function createProductItem(item) {
  const { title, variants, images } = item;
  const listItem = document.createElement("li");
  listItem.className = "text-sm flex flex-col gap-3 justify-between max-w-lg relative overflow-hidden";
  listItem.innerHTML = `<div class="p-2 bg-black rounded-md text-white text-xs absolute top-3 left-3">USED</div>
  <img class="p-3 border border-black rounded-md h-80 w-full object-cover" src=${images[0]?.src} alt="item">
  <div class="flex justify-between">
      <div class="font-bold">
        <p>${title}</p>
        <p>${variants[0].price} UAH</p>
      </div>
      <div>
      <p class="text-end font-bold">condition</p>
      <p class="text-end">slightly used</p>
      </div>
  </div>
  <button class="addToCartBtn p-4 bg-black rounded-md text-white hover:bg-gray-700">ADD TO CART</button>
  <div id="adding-confirm" class="w-full flex justify-center items-center absolute transition-all -bottom-10">
    <span class="bg-green-500 text-white text-2xl w-10 h-10 rounded-full flex justify-center items-center">&#10003;</span>
  </div>
  `;
  listItem.addEventListener("click", (e) => {
    if (e.target.classList.contains("addToCartBtn")) addToCart(listItem, item);
  });
  return listItem;
}

async function appendProducts(list, page) {
  const { products } = await getProducts(page);
  products.forEach((product) => {
    const item = createProductItem(product);
    list.appendChild(item);
  });
}

function renderPagination(totalPages, page) {
  let liTag = "";
  const liTagClasses =
    "flex justify-center items-center p-3 w-11 h-11 border border-black rounded-full text-lg cursor-pointer hover:bg-black hover:text-white";
  let active;
  let beforePage = page - 1;
  let afterPage = page + 1;

  if (page > 2) {
    liTag += `<li class="${liTagClasses}" onclick="renderProductsList(${totalPages}, 1)">1</li>`;
    if (page > 3) {
      liTag += `<li class="p-3">...</li>`;
    }
  }
  if (page == totalPages) {
    beforePage = beforePage - 2;
  } else if (page == totalPages - 1) {
    beforePage = beforePage - 1;
  }
  if (page == 1) {
    afterPage = afterPage + 2;
  } else if (page == 2) {
    afterPage = afterPage + 1;
  }
  for (let plength = beforePage; plength <= afterPage; plength++) {
    if (plength > totalPages) {
      continue;
    }
    if (plength == 0) {
      plength = plength + 1;
    }
    if (page == plength) {
      active = "bg-black text-white";
    } else {
      active = "";
    }
    liTag += `<li class="${liTagClasses} ${active}" onclick="renderProductsList(${totalPages}, ${plength})">${plength}</li>`;
  }
  if (page < totalPages - 1) {
    if (page < totalPages - 2) {
      liTag += `<li class="p-3">...</li>`;
    }
    liTag += `<li class="${liTagClasses}" onclick="renderProductsList(${totalPages}, ${totalPages})">${totalPages}</li>`;
  }
  return liTag;
}

function renderProductsList(totalPages, page) {
  const productList = document.querySelector("#products-list");
  productList.innerHTML = "";
  appendProducts(productList, page);
  const paginationBlock = document.querySelector(".pagination ul");
  paginationBlock.innerHTML = renderPagination(totalPages, page);
}

//! cart opening/closing
const cartOpenBtn = document.querySelector("#cart-open-btn");
const cartCloseBtn = document.querySelector("#cart-close-btn");
const cart = document.querySelector("#cart");
const cartBg = document.querySelector("#cart-bg");
function cartOpenCloseHandle() {
  window.scrollTo(0, 0);
  cart.classList.toggle("-right-full");
  cart.classList.toggle("right-0");
  cartBg.classList.toggle("hidden");
  document.body.classList.toggle("overflow-hidden");
}
cartOpenBtn.addEventListener("click", cartOpenCloseHandle);
cartCloseBtn.addEventListener("click", cartOpenCloseHandle);
cartBg.addEventListener("click", cartOpenCloseHandle);

//! cart render and logic

const cartItemsList = document.querySelector("#cart-items-list");
let cartItems = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
appendCartItems(cartItemsList);

function createCartItem(item) {
  const { title, variants, images, quantity } = item;
  const listItem = document.createElement("li");
  listItem.className = "flex justify-center items-center gap-5 font-bold";
  listItem.innerHTML = `<img class="w-16 h-16 object-cover border border-light-sand rounded-md p-1" src=${images[0]?.src} alt="cart item">
  <div class="flex-auto">
      <p>${title}</p>
      <p>${variants[0].price}</p>
      <div class="flex gap-4">
          <button id="decrease-btn" type="button">-</button>
          <span>${quantity}</span>
          <button id="increase-btn" type="button">+</button>
      </div>
  </div>
  <button id="remove-item-btn" type="button">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <g clip-path="url(#clip0_2720_971)">
              <path
                  d="M7 4V2H17V4H22V6H20V21C20 21.2652 19.8946 21.5196 19.7071 21.7071C19.5196 21.8946 19.2652 22 19 22H5C4.73478 22 4.48043 21.8946 4.29289 21.7071C4.10536 21.5196 4 21.2652 4 21V6H2V4H7ZM6 6V20H18V6H6ZM9 9H11V17H9V9ZM13 9H15V17H13V9Z"
                  fill="#FCF7E6" />
          </g>
          <defs>
              <clipPath id="clip0_2720_971">
                  <rect width="24" height="24" fill="white" />
              </clipPath>
          </defs>
      </svg>
  </button>`;
  listItem.addEventListener("click", (e) => {
    if (e.target.closest("button")?.id === "remove-item-btn") removeFromCart(item);
    if (e.target.id === "increase-btn") increaseQuantity(item);
    if (e.target.id === "decrease-btn") decreaseQuantity(item);
  });
  return listItem;
}

function appendCartItems(list) {
  list.innerHTML = "";
  document.querySelector("#total-price")?.remove();
  const items = cartItems.map((item) => {
    return createCartItem(item);
  });
  if (cartItems.length) {
    items.forEach((item) => {
      list.appendChild(item);
    });
  } else {
    list.insertAdjacentHTML("afterbegin", "<li class='text-center'>Empty</li>");
  }
  const totalPrice = cartItems.reduce((acc, curr) => acc + +curr.variants[0].price * curr.quantity, 0);
  list.insertAdjacentHTML(
    "afterend",
    `<div id="total-price" class="flex justify-between mt-3 mb-3 font-bold">
      <p>TOTAL</p>
      <p>${totalPrice.toFixed(2)} UAH</p>
    </div>`
  );
}

function showSuccesIcon(listItem) {
  const message = listItem.querySelector("#adding-confirm");
  message.classList.remove("-bottom-10");
  message.classList.add("bottom-20");
  setTimeout(() => {
    message.classList.remove("bottom-20");
    message.classList.add("-bottom-10");
  }, 1000);
}

function addToCart(listItem, item) {
  const hasItem = cartItems.find((elem) => elem.id === item.id);
  if (hasItem) {
    hasItem.quantity++;
    appendCartItems(cartItemsList);
    showSuccesIcon(listItem);
    return;
  }
  item.quantity = 1;
  cartItems.push(item);
  appendCartItems(cartItemsList);
  showSuccesIcon(listItem);
  localStorage.setItem("cart", JSON.stringify(cartItems));
}

function removeFromCart(item) {
  cartItems = cartItems.filter((elem) => elem.id !== item.id);
  appendCartItems(cartItemsList);
  localStorage.setItem("cart", JSON.stringify(cartItems));
}

function increaseQuantity(item) {
  const itemToDecrease = cartItems.find((elem) => elem.id === item.id);
  itemToDecrease.quantity++;
  appendCartItems(cartItemsList);
  localStorage.setItem("cart", JSON.stringify(cartItems));
}

function decreaseQuantity(item) {
  const itemToDecrease = cartItems.find((elem) => elem.id === item.id);
  if (itemToDecrease.quantity === 1) {
    removeFromCart(item);
    return;
  }
  itemToDecrease.quantity--;
  appendCartItems(cartItemsList);
  localStorage.setItem("cart", JSON.stringify(cartItems));
}
