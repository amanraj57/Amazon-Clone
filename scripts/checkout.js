import{
    cart, 
    removeFromCart,
    updateQuantity,
    updateDeliveryOption
} from '../data/cart.js';
import { deliveryOptions } from '../data/deliveryOptions.js';
import{products} from '../data/products.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { paymentSummary } from './checkout-page/paymentSummary.js';
import { formatCurrency } from './utils/money.js';

export function renderOrderSummary()
{
    let checkoutHTML='';

    cart.forEach((cartItem)=>{

        let matchingItem;

        products.forEach((product)=>{
            if(cartItem.productId===product.id)
                matchingItem=product;
        });

        let deliveryOption;
        deliveryOptions.forEach((option)=>{
            if(cartItem.deliveryOptionId===option.id)
                deliveryOption=option;
        });
        const today=dayjs();
        const deliveryDate=today.add(deliveryOption.deliveryDays,'days');
        const dateString=deliveryDate.format('dddd, MMMM D');

        checkoutHTML+=`
            <div class="cart-item-container js-cart-item-container-${matchingItem.id}">
                <div class="delivery-date">
                    Delivery date: ${dateString}
                </div>

                <div class="cart-item-details-grid">
                <img class="product-image"
                    src="${matchingItem.image}">

                <div class="cart-item-details">
                    <div class="product-name">
                        ${matchingItem.name}
                    </div>
                    <div class="product-price">
                        $${(matchingItem.priceCents/100).toFixed(2)}
                    </div>
                    <div class="product-quantity">
                        <span>
                            Quantity: <span class="quantity-label js-quantity-label-${matchingItem.id}">${cartItem.quantity}</span>
                        </span>
                        <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${matchingItem.id}">
                            Update
                        </span>
                        <input type="number" class="quantity-input      js-quantity-input-${matchingItem.id}">
                        <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingItem.id}">Save</span>
                        <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id="${matchingItem.id}">
                            Delete
                        </span>
                    </div>
                </div>

                <div class="delivery-options">
                    <div class="delivery-options-title">
                        Choose a delivery option:
                    </div>
                    ${generateDeleveryOptions(cartItem)}
                </div>
                </div>
            </div>
        `;
    });

    function generateDeleveryOptions(cartItem)
    {
        let deliveryOptionsHTML='';
        deliveryOptions.forEach((option)=>{
            const today=dayjs();
            const deliveryDate=today.add(option.deliveryDays,'days');
            const dateString=deliveryDate.format('dddd, MMMM D');
            const shippingCharge=option.shippingCharge===0?'FREE':`$${formatCurrency(option.shippingCharge)} -`;

            const isChecked=option.id===cartItem.deliveryOptionId;

            deliveryOptionsHTML+=`
                <div class="delivery-option js-delivery-option"
                data-product-id="${cartItem.productId}"
                data-delivery-option-id="${option.id}">
                    <input type="radio"
                        ${isChecked?'checked':''}
                        class="delivery-option-input"
                        name="delivery-option-${cartItem.productId}">
                    <div>
                        <div class="delivery-option-date">
                            ${dateString}
                        </div>
                        <div class="delivery-option-price">
                            ${shippingCharge} Shipping
                        </div>
                    </div>
                </div>
            `;
        });
        return deliveryOptionsHTML;
    }

    document.querySelector('.js-order-summary').innerHTML=checkoutHTML;

    document.querySelectorAll('.js-delete-quantity-link')
        .forEach((link)=>{
            link.addEventListener('click',()=>{
                const productId = link.dataset.productId;
                removeFromCart(productId);

                const container = document.querySelector(`.js-cart-item-container-${productId}`);
                container.remove();
                paymentSummary();
            });
        });


    document.querySelectorAll('.js-update-quantity-link')
        .forEach((link)=>{
            link.addEventListener('click',()=>{
                const productId=link.dataset.productId;

                const container=document.querySelector(`.js-cart-item-container-${productId}`);
                container.classList.add('is-editing-quantity');
            });
    });

    document.querySelectorAll('.js-save-link')
        .forEach((link)=>{

            const productId=link.dataset.productId;

            link.addEventListener('click',()=>{
                checkoutChangeQuantity(productId);
            });
            document.querySelector(`.js-quantity-input-${productId}`).addEventListener('keydown',(event)=>{
                if(event.key==="Enter")
                    checkoutChangeQuantity(productId);
            });
    });
    function checkoutChangeQuantity (productId)
    {
        
        const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
        const newQuantity = Number(quantityInput.value);

        if (newQuantity < 0 || newQuantity >= 1000) 
        {
            alert('Quantity must be at least 0 and less than 1000');
            return;
        }

        updateQuantity(productId, newQuantity);

        const container=document.querySelector(`.js-cart-item-container-${productId}`);
        container.classList.remove('is-editing-quantity');

        const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
        
        quantityLabel.innerHTML = newQuantity;

        paymentSummary();
    }

    document.querySelectorAll('.js-delivery-option')
        .forEach((element)=>{
            element.addEventListener('click',()=>{
                const {productId,deliveryOptionId}=element.dataset;
                updateDeliveryOption(productId,deliveryOptionId);
                renderOrderSummary();
                paymentSummary();
            });
        });
}