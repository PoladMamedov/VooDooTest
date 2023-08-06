export async function getProducts(page) {
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

export function createProductItem(item) {
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

export async function appendProducts(list, page) {
  const { products } = await getProducts(page);
  const items = products.map((item) => {
    return createProductItem(item);
  });
  items.forEach((item) => {
    list.appendChild(item);
  });
}

export function createPaginationAndList(list, totalPages, page) {
  list.innerHTML = "";
  appendProducts(list, page);
  let liTag = "";
  const liTagClasses =
    "flex justify-center items-center p-3 w-11 h-11 border border-black rounded-full text-lg cursor-pointer hover:bg-black hover:text-white";
  let active;
  let beforePage = page - 1;
  let afterPage = page + 1;

  if (page > 2) {
    liTag += `<li class="${liTagClasses}" onclick="createPaginationAndList(${list}, ${totalPages}, 1)">1</li>`;
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
    liTag += `<li class="${liTagClasses} ${active}" onclick="createPaginationAndList(${list}, ${totalPages}, ${plength})">${plength}</li>`;
  }
  if (page < totalPages - 1) {
    if (page < totalPages - 2) {
      liTag += `<li class="p-3">...</li>`;
    }
    liTag += `<li class="${liTagClasses}" onclick="createPaginationAndList(${list}, ${totalPages}, ${totalPages})">${totalPages}</li>`;
  }

  paginationBlock.innerHTML = liTag;
  return liTag;
}
