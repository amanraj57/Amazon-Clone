import { cart } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";
import {formatCurrency} from '../utils/money.js';

export function paymentSummary()
{
    let cost=0;
    let totalQuantity=0;
    let shippingCharge=0;
    cart.forEach((cartItem) => {

        let matchingItem;
        products.forEach((product)=>{
            if(cartItem.productId===product.id)
                matchingItem=product;
        });
        cost+=matchingItem.priceCents*cartItem.quantity;
        totalQuantity+=cartItem.quantity;

        let deliveryOption;
        deliveryOptions.forEach((option)=>{
            if(cartItem.deliveryOptionId===option.id)
                deliveryOption=option;
        });
        shippingCharge+=deliveryOption.shippingCharge;
        
    });

    const totalBeforeTax=shippingCharge+cost;
    const tax=totalBeforeTax*0.1;
    const totalCost=totalBeforeTax+tax;

    document.querySelector('.js-return-to-home-link')
        .innerHTML = `${totalQuantity} items`;

    document.querySelector('.js-payment-summary')
        .innerHTML=`
            <div class="payment-summary-title">
                Order Summary
            </div>

            <div class="payment-summary-row">
                <div>Items (${totalQuantity}):</div>
                <div class="payment-summary-money">$${formatCurrency(cost)}</div>
            </div>

            <div class="payment-summary-row">
                <div>Shipping &amp; handling:</div>
                <div class="payment-summary-money">$${formatCurrency(shippingCharge)}</div>
            </div>

            <div class="payment-summary-row subtotal-row">
                <div>Total before tax:</div>
                <div class="payment-summary-money">$${formatCurrency(totalBeforeTax)}</div>
            </div>

            <div class="payment-summary-row">
                <div>Estimated tax (10%):</div>
                <div class="payment-summary-money">$${formatCurrency(tax)}</div>
            </div>

            <div class="payment-summary-row total-row">
                <div>Order total:</div>
                <div class="payment-summary-money">$${formatCurrency(totalCost)}</div>
            </div>

            <button class="place-order-button button-primary">
                Place your order
            </button>
        `;
}