//récupération de la partie de l'url contenant l'id de commande
let queryString = window.location.search;
//suppression du point d'interogation
let iD= queryString.split("?");
//récupération de l'id
let orderId= iD[1];
console.log(orderId)
document.querySelector("#orderId").innerHTML = orderId;
localStorage.clear();


