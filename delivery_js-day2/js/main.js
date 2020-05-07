'use strict'

//day1 
const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth')
const modalAuth = document.querySelector('.modal-auth')
const closeAuth = document.querySelector('.close-auth')
const logInForm = document.querySelector('#logInForm')
const loginInput = document.querySelector('#login')
const userName = document.querySelector('.user-name')
const buttonOut = document.querySelector('.button-out')
const cardsRestaurants = document.querySelector('.cards-restaurants')
const containerPromo = document.querySelector('.container-promo')
const restaurants = document.querySelector('.restaurants')
const menu = document.querySelector('.menu')
const logo = document.querySelector('.logo')
const cardsMenu = document.querySelector('.cards-menu')



let login = localStorage.getItem('Delivery');

const getData = async function(url){
  const responce = await fetch(url)

  if (!responce.ok) {
    throw  new Error(`ошибка по адресу ${url}, статус ошибки ${responce.status}`)
  }
  return await responce.json()

}

getData('./db/partners.json')


function toggleModal() {
  modal.classList.toggle("is-open");
}
function toggleModalAuth (){
  modalAuth.classList.toggle('is-open')
  loginInput.style.borderColor = ''
}



function autorized (){
  function logOut(){
    login = ''
    localStorage.removeItem('Delivery')
    checkAuth()
    buttonAuth.style.display =""
    userName.style.display = ""
    buttonOut.style.display = ""
    buttonOut.removeEventListener('click', logOut)
  }
  userName.textContent = login;
  buttonAuth.style.display ="none"
  userName.style.display = "inline"
  buttonOut.style.display = "block"
  buttonOut.addEventListener('click', logOut)
  
}
function notAutorized (){
  function logIn(event){
    event.preventDefault();
    
    if (loginInput.value ){

      login = loginInput.value
      localStorage.setItem('Delivery', login)
      toggleModalAuth()
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn)
      logInForm.reset();
      checkAuth()
    } else {
      loginInput.style.borderColor = 'red'
    }
  }
  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn)
}
function checkAuth(){
  if (login) {
    autorized()
  } else {
    notAutorized()
  }}



  function createCardRestaurant({ image, kitchen, name, price, stars, products, time_of_delivery: timeOfDelivery }) {
    const card = `
    <a class="card card-restaurant" data-products='${products}'>
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
        <div class="card-heading">
        <h3 class="card-title">${name}</h3>
          <span class="card-tag tag">${timeOfDelivery} мин</span>
          </div>
        <div class="card-info">
        <div class="rating">
        ${stars}
        </div>
        <div class="price">${price}р</div>
          <div class="category">${kitchen}</div>
          </div>
          </div>
    </a>`
    
    cardsRestaurants.insertAdjacentHTML('beforeend', card)
  }
  




function createCardGood({ description, image, name, price }){


  const card = document.createElement('div')
  card.className = 'card'
  card.insertAdjacentHTML('beforeend', `
  <img src="${image}" alt="image" class="card-image"/>
  <div class="card-text">
  <div class="card-heading">
  <h3 class="card-title card-title-reg">${name}</h3>
  </div>
  <div class="card-info">
  <div class="ingredients">${description}
  </div>
  </div>
  <div class="card-buttons">
  <button class="button button-primary button-add-cart">
  <span class="button-card-text">В корзину</span>
  <span class="button-cart-svg"></span>
  </button>
  <strong class="card-price-bold">${price}₽</strong>
  </div>
  </div>
  `
  )
  
  
  
  cardsMenu.insertAdjacentElement("beforeend",card)
}


function openGoods(event){
  const target = event.target
  
  const restaurant = target.closest('.card-restaurant');
  console.log(restaurant);
  if (restaurant) {

    
    
    cardsMenu.textContent = ""
    containerPromo.classList.add('hide')
    restaurants.classList.add('hide')
    menu.classList.remove('hide')
    
    getData(`./db/${restaurant.dataset.products}`).then(function (data){
      data.forEach(createCardGood);
    })  
    createCardGood()
  }

  
}
function init (){
  
  getData('./db/partners.json').then(function (data){
    data.forEach(createCardRestaurant);
  })
  
  
  cardsRestaurants.addEventListener('click', openGoods)
  
  cartButton.addEventListener("click", toggleModal);
  close.addEventListener("click", toggleModal);
  
  logo.addEventListener('click', () => {
      containerPromo.classList.remove('hide')
      restaurants.classList.remove('hide')
      menu.classList.add('hide')
  })
  checkAuth()

} 
init()