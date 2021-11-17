let cartInStorage= JSON.parse(localStorage.getItem('product'));
console.log(cartInStorage)
if (cartInStorage===null||cart==0){
    let divEmpty=document.createElement("div");
    divEmpty.classList=('cart__item');
    document.querySelector("#cart__items");
}