import {cart, addToCart, saveToStorage,calculateCartQuantity} from '../data/cart.js';
import {products} from '../data/products.js';
import { formatCurrency } from './utils/money.js';
let gridhtml=``;
    products.forEach((value)=>{
        gridhtml+=`
        <div class="product-container">
        <div class="product-image-container">
          <img class="product-image"
            src="${value.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${value.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="${value.getStarSImage()}">
          <div class="product-rating-count link-primary">
            ${value.rating.count}
          </div>
        </div>

        <div class="product-price">
          ${value.getPrice()}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-selector-${value.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>
        ${value.extraInfoHTML()}
        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-${value.id}">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="js-add-to-cart add-to-cart-button button-primary" data-product-id="${value.id}">
          Add to Cart
        </button>
      </div>

        `;
    });

    document.querySelector('.products-grid').innerHTML=gridhtml;

    function displayCartQuantity()
    {
        const cartQuantity = calculateCartQuantity();
        if(cartQuantity<=99)
            document.querySelector('.js-cart-quantity').innerHTML = `${cartQuantity}`;
        else
            document.querySelector('.js-cart-quantity').innerHTML = `99+`;
    }

    displayCartQuantity();
    
    document.querySelectorAll('.js-add-to-cart')
    .forEach((button) => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;

            const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);

            addedMessage.classList.add('added-to-cart-visible');

            setTimeout(()=>{
                addedMessage.classList.remove('added-to-cart-visible');
            },1500);

            addToCart(productId);
            saveToStorage();
            displayCartQuantity();
        });
    });
    
    