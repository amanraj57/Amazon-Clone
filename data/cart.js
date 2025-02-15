export let cart=JSON.parse(localStorage.getItem('cart')) || [];

export function addToCart(productId)
{
    let matchingItem;
    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) 
        {
            matchingItem = cartItem;
        }
    });
    const quantity = Number(document.querySelector(
        `.js-quantity-selector-${productId}`).value);

    if (matchingItem) 
    {
        matchingItem.quantity += quantity;
    } 
    else 
    {
        cart.push({
            productId: productId,
            quantity: quantity,
            deliveryOptionId:'1'
        });
    }
}
export function removeFromCart(productId)
{
    let newCart=[];
    cart.forEach((cartItem)=>{
        if(cartItem.productId!==productId)
            newCart.push(cartItem);
    cart=newCart;
    saveToStorage();
    const cartQuantity = calculateCartQuantity();
    document.querySelector('.js-return-to-home-link')
        .innerHTML = `${cartQuantity} items`;
    });
}

export function calculateCartQuantity()
{
    let cartQuantity = 0;
    cart.forEach((item) => {
        cartQuantity += item.quantity;
    });
    
    return cartQuantity;
}


export function saveToStorage() 
{
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function updateQuantity(productId, newQuantity) 
{
    let matchingItem;
  
    cart.forEach((cartItem) => {
      if (productId === cartItem.productId) 
      {
        matchingItem = cartItem;
      }
    });
  
    matchingItem.quantity = newQuantity;
  
    saveToStorage();
  }
export function updateDeliveryOption(productId,deliveryOptionId)
{
    let matchingItem;

    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) 
        {
        matchingItem = cartItem;
        }
    });
    matchingItem.deliveryOptionId=deliveryOptionId;
    saveToStorage();
}
