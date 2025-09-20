const allProducts = document.getElementsByClassName("all-products")[0];
let products = JSON.parse(localStorage.getItem("cart")) || [];
let selectedProduct = JSON.parse(localStorage.getItem("selectedProdcet")) || [];
const countOfCatogry = document.getElementsByClassName("count-card")[0];
const asid = document.getElementsByClassName("prodcuts-avtive")[0];
const TotlePrice = document.getElementById("total-price");
const emptyLayout = document.getElementsByClassName("empty")[0];
const notEmptyLayout = document.getElementsByClassName("not-empty")[0];
const btnCallOrder = document.querySelector("aside .comfim-btn");
// order var

let orderMenu = document.getElementsByClassName("order")[0];
let totlepriceOrder = document.querySelector(".check .totel-price");
let orderCards = document.getElementsByClassName("content")[0];
let newOrder = document.querySelector(".order .order-btn");

// alert
const myAlertContainer = document.getElementsByClassName("alert-container")[0];

function displayAlert(title, text, status) {
  let myAlert = document.createElement("div");
  myAlert.classList.add("active",'alert' , status);
  let alertTitel = document.createElement("h4");
  alertTitel.classList.add("masage-title");
  let alertText = document.createElement("p");
  alertText.classList.add("masage-text");
  
  let titleAlert = document.createTextNode(title);
  let textAlert = document.createTextNode(text);

  myAlert.appendChild(alertTitel);
  alertTitel.appendChild(titleAlert)
  myAlert.appendChild( alertText);
  alertText.appendChild(textAlert)
  myAlertContainer.appendChild(myAlert)

  myAlert.addEventListener("click", () => {
    myAlert.classList.remove("active");
  });
  setTimeout(() => {
    myAlert.classList.remove("active", status);
    myAlert.addEventListener('transitionend' , ()=>{
      myAlert.remove()
    })
  }, 1500);
}


// catogry layout
function layout() {
  if (selectedProduct.length != 0) {
    emptyLayout.style.display = "none";
    notEmptyLayout.style.display = "block";
  } else {
    notEmptyLayout.style.display = "none";
    emptyLayout.style.display = "block";
  }
}

layout();

// get product
async function getAllProducts() {
    if (products.length == 0) {
      let api = await fetch(`./assets/data.json`);
      let data = await api.json();
      products = data.map((product) => {
        return {
          ...product,
          count: product.count || 1,
          selected: product.selected || false,
        };
      });
    }
    callAllFun();
  
}
getAllProducts();

// display product in page

function displayProduct() {
  let data = ``;
  for (let i = 0; i < products.length; i++) {
    data += `
    <article class="card" data-index='${i}'>
    <section class="card-header ${products[i].selected ? "active" : ""}">
    <img src="${products[i].image["desktop"]}" alt="" class="card-img">
         <button class="btn ${products[i].selected ? "active" : ""}">
         <p class="main-btn"> <img src="assets/images/icon-add-to-cart.svg" alt=""> Add to Cart</p>
         <div class="ler">
         <p class="ngtve">-</p>
         <p class="count">${products[i].count}</p>
         <p class="plus">+</p>
         </div>
         </button>
         </section>
         <section class="card-body">
         <p class="type">${products[i].category}</p>
         <p class="card-titel"> ${products[i].name}</p>
         <p class="price">$ ${products[i].price}</p>
         </section>
         </article>
         `;
  }
  allProducts.innerHTML = data;
}
// display product to asid
function displayMyCat() {
  let data = ``;
  for (let i = 0; i < selectedProduct.length; i++) {
    data += `
          <section class="cart">
            <span onclick='deleteOfCat("${i}")' class="closed"><img src="assets/images/icon-remove-item.svg" alt=""></span>
            <p class="card-titel">${selectedProduct[i].name}</p>
            <p class="detais">
            <span class="count">${
              selectedProduct[i].count
            }</span><span class='x'>x<span/>
              <span class="price">$ ${selectedProduct[i].price}</span>
              <span class="total-pric">${
                selectedProduct[i].price * selectedProduct[i].count
              }</span>
              </p>
              </section>
              `;
  }
  asid.innerHTML = data;
}

document.addEventListener("click", (event) => {
  // add prodct to asid
  if (event.target.classList.contains("btn")) {
    const btn = event.target;
    // accsses to card
    const card = btn.parentElement.parentElement;
    // card index
    const indexProdcut = card.getAttribute("data-index");
    const product = products[indexProdcut];

    btn.classList.add("active");

    //  search the prodect if it selected in the past
    let isFind = selectedProduct.find((p) => p.name == product.name);
    if (!isFind) {
      product.selected = true;
      selectedProduct.push(product);
      displayAlert(
        "add product",
        `the ${product.name} is add to Category`,
        "success"
      );
      saveData();
    }
    const cardHeader = card.getElementsByClassName("card-header")[0];
    cardHeader.classList.add("active");
    callAllFun();
  }
  if (event.target.closest(".plus")) {
    const ler = event.target.parentElement;
    // تحديد رقم الكارت في القائمه الاساسيه
    indexProdcut =
      ler.parentElement.parentElement.parentElement.getAttribute("data-index");
    //  تحديد العنصر لزياده في القائمه الثانيه
    let index = selectedProduct.findIndex(
      (p) => p.name == products[indexProdcut].name
    );
    const count = ler.getElementsByClassName("count")[0];
    count.classList.add("add");
    setTimeout(() => {
      count.classList.remove("add");
    }, 300);

    products[indexProdcut].count++;
    selectedProduct[index].count = products[indexProdcut].count;
    count.innerHTML = products[indexProdcut].count;
    update();
    saveData();
    displayMyCat();
  }

  if (event.target.closest(".ngtve")) {
    const ler = event.target.parentElement;
    indexProdcut =
      ler.parentElement.parentElement.parentElement.getAttribute("data-index");
    let index = selectedProduct.findIndex(
      (p) => p.name == products[indexProdcut].name
    );
    const count = ler.getElementsByClassName("count")[0];

    if (products[indexProdcut].count > 1) {
      products[indexProdcut].count--;
      selectedProduct[index].count = products[indexProdcut].count;
      count.innerHTML = products[indexProdcut].count;
      count.classList.add("decr");
      setTimeout(() => {
        count.classList.remove("decr");
      }, 300);
      update();
      saveData();
      displayMyCat();
    } else {
      displayAlert("Warning", `I reached the minimum`, "warrning");
    }
  }
});

// delete product of asid
function deleteOfCat(index) {
  let indexProd = products.findIndex(
    (p) => p.name == selectedProduct[index].name
  );
  products[indexProd].selected = false;
  products[indexProd].count = 1;
  selectedProduct.splice(index, 1);
  displayAlert(
    "remove product",
    `the ${products[indexProd].name} has been removed from the cart`,
    "error"
  );
  callAllFun();
}
displayMyCat();

// updata totel pric and count of prdcut
function update() {
  // var to sum totle price
  let price;
  let cat;
  if (selectedProduct.length != 0) {
    price =
      selectedProduct.reduce((arr, item) => {
        return arr + item.count * item.price;
      }, 0) || 0;
    cat = selectedProduct.reduce((arr, item) => {
      return arr + item.count;
    }, 0);
  } else {
    price = 0;
    cat = 0;
  }
  totlepriceOrder.innerHTML = price;
  TotlePrice.innerHTML = price;
  countOfCatogry.innerHTML = cat;
}

function saveData() {
  localStorage.setItem("cart", JSON.stringify(products));
  localStorage.setItem("selectedProdcet", JSON.stringify(selectedProduct));
}
function callAllFun() {
  saveData();
  update();
  displayProduct();
  layout();
  displayMyCat();
}
update();

// order fun

// display order product

function displayOrderProd() {
  let data = ``;
  for (let i = 0; i < selectedProduct.length; i++) {
    data += `
    <div class="order-card">
            <img src="${selectedProduct[i].image["thumbnail"]}" alt="">
            <div class="card-body">
              <p class="titel">${selectedProduct[i].name}</p>
              <div class="detalis">
                <p class="order-count">${selectedProduct[i].count}X</p>
                <p class="order-mainPrice">$${selectedProduct[i].price}</p>
              </div>
            </div>
            <p class="order-price">${
              selectedProduct[i].count * selectedProduct[i].price
            }</p>
          </div>
    `;
  }
  orderCards.innerHTML = data;
}
displayOrderProd();
btnCallOrder.addEventListener("click", function () {
  orderMenu.classList.add("active");
  displayOrderProd();
});

newOrder.addEventListener("click", function () {
  products.forEach((element) => {
    element.selected = false;
    element.count = 1;
  });
  selectedProduct = [];
  displayAlert(
    `Order confirmed`,
    "Your order has been placed successfully!!",
    "success"
  );
  callAllFun();
  orderMenu.classList.remove("active");
});
orderMenu.addEventListener("click", function (e) {
  if (e.target == orderMenu) {
    orderMenu.classList.remove("active");
  }
});
