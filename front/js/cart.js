//Récupération des données stockées dans le local storage
let cartInStorage = JSON.parse(localStorage.getItem('product'));

//Si le panier est vide on affiche un message pour le signaler à l'utilisateur
if (cartInStorage === null || cartInStorage == 0) {
    let divEmpty = document.createElement("div");
    divEmpty.classList = ('cart__item');
    document.querySelector("#cart__items").appendChild(divEmpty);
    let textEmpty = document.createElement("h2");
    textEmpty.innerHTML = 'Votre panier est vide.';
    divEmpty.appendChild(textEmpty);

}
//Si il y a bien un panier on affiche le contenu
else {
    cartInStorage.forEach(item => {
        //stockage des données  récupérées depuis le local storage dans des variables
        let productID = item.iD;
        let productColor = item.color;
        let productQuantity = item.quantity;
        //appel de l'API pour récupérer les données manquantes
        fetch("http://localhost:3000/api/products/" + productID)
            .then((res) => res.json())
            .then(productsValues => {
                let productPrice = productsValues.price;
                let productName = productsValues.name;
                let productImg = productsValues.imageUrl;
                let productAlt = productsValues.altTxt;

                //créations des éléments du dom et insertion des données récupérées
                let articleCart = document.createElement('article');
                articleCart.className = ("cart__item");
                articleCart.setAttribute('data-id', productID);
                articleCart.setAttribute('data-color', productColor);
                document.querySelector("#cart__items").appendChild(articleCart);

                let divImg = document.createElement('div');
                divImg.classList = ('cart__item__img');
                articleCart.appendChild(divImg);
                let articleImg = document.createElement('img');
                articleImg.src = (productImg);
                articleImg.alt = (productAlt);
                divImg.appendChild(articleImg);

                let divContent = document.createElement('div');
                divContent.classList = ('cart__item__content');
                articleCart.appendChild(divContent);

                let divDescription = document.createElement('div');
                divDescription.className = ('cart__item__content__description');
                divContent.appendChild(divDescription);
                let title = document.createElement('h2');
                title.innerHTML = productName;
                divDescription.appendChild(title);

                let color = document.createElement('p');
                color.innerHTML = productColor;
                divDescription.appendChild(color);

                let price = document.createElement('p');
                price.innerHTML = productPrice + (' €');
                divDescription.appendChild(price);

                let divSettings = document.createElement('div');
                divSettings.className = ('cart__item__content__settings')
                divContent.appendChild(divSettings);

                let divQuantity = document.createElement('div');
                divQuantity.className = ('cart__item__content__settings__quantity');
                divSettings.appendChild(divQuantity);

                let Qté = document.createElement('p');
                Qté.innerHTML = ('Qté :');
                divQuantity.appendChild(Qté);

                let inputQuantity = document.createElement('input');
                inputQuantity.type = "number";
                inputQuantity.className = "itemQuantity";
                inputQuantity.name = "itemQuantity";
                inputQuantity.min = "1";
                inputQuantity.max = "100";
                inputQuantity.value = productQuantity;
                divQuantity.appendChild(inputQuantity);

                let divDelete = document.createElement('div');
                divDelete.className = "cart__item__content__settings__delete";
                divSettings.appendChild(divDelete);

                let suppr = document.createElement('p');
                suppr.className = "deleteItem";
                suppr.innerHTML = ('Supprimer');
                divDelete.appendChild(suppr);
                ///
                ///Fonction pour changer la quantité d'un produit en utilisant la valeure affichée par l'input
                function changeQuantity() {
                    let quantityElem = document.querySelectorAll(".itemQuantity");
                    for (let b = 0; b < quantityElem.length; b++) {
                        quantityElem[b].addEventListener('change', () => {
                            cartInStorage[b].quantity = Number(quantityElem[b].value);
                            localStorage.setItem('product', JSON.stringify(cartInStorage))
                            calculTotal();
                            location.reload;
                        });
                    }
                }
                //Fonction de supression d'un produit//
                function supprProduct() {
                    //récupération du bouton supprimer
                    let supprButton = document.querySelectorAll('.deleteItem');
                    //Création d'une boucle pour parcourir le panier et cibler l'élément à supprimer
                    for (let a = 0; a < supprButton.length; a++) {
                        supprButton[a].addEventListener('click', () => {
                            //Ciblage de l'élément
                            let productToSuppr = cartInStorage.indexOf(cartInStorage[a]);
                            //Demande de confirmation de l'utilisateur pour prévenir les suppressions accidentelles
                            const confirmation = () => {

                                //Si il y a confirmation suppression du produit du panier
                                //Renvoi du nouveau panier dans le localstorage
                                //Raffraichissement de la page pour que le produit ne soit plus affiché
                                if (window.confirm(`Vos produits ${cartInStorage[a].quantity} ${productName} ${productColor} vont êtres supprimés de votre panier, cliquez sur OK pour confirmer`)) {
                                    cartInStorage.splice(productToSuppr, 1);
                                    localStorage.setItem('product', JSON.stringify(cartInStorage));
                                    calculTotal();
                                    location.reload();
                                }
                                //Si l'utilisateur ne confirme pas il reste sur la page
                                else {
                                    window.location.href = "./cart.html";
                                }
                            }
                            confirmation();
                        })
                    };
                }
                //Fonction de calcul de la quantité totale et du prix total
                function calculTotal() {
                    ///récupération du panier depuis le localstorage
                    let panier = JSON.parse(localStorage.getItem('product'));
                    let Total = 0;
                    let quantity = 0;
                    panier.forEach(product => {
                        fetch("http://localhost:3000/api/products/" + product.iD)
                            .then((res) => res.json())
                            .then(item => {
                                //Calcul du prix total du panier
                                Total += product.quantity * item.price;
                                document.querySelector('#totalPrice').textContent = Total;
                                ///récupération du nombre d'articles
                                quantity += product.quantity;
                                document.querySelector('#totalQuantity').textContent = quantity;
                            })
                    });
                }
                //////
                calculTotal();
                changeQuantity();
                supprProduct();
            });
    });
};
// empecher le formulaire de se valider
document.querySelector('.cart__order__form').addEventListener('submit', (e) => {
    e.preventDefault();
})
///fonctions vérification du formulaire
document.querySelector("#order").addEventListener('click', () => {
    let NameRegExp = new RegExp("^[a-zA-ZÀ-ÿ]+(\\s?\\.?,?'?-?[a-zA-ZÀ-ÿ])+$");
    let addressRegExp = new RegExp("^[0-9a-zA-ZÀ-ÿ]+(\\s?\\.?,?'?-?°?/?[0-9a-zA-ZÀ-ÿ])+$");
    let cityRegExp = new RegExp("^[a-zA-ZÀ-ÿ]+(\\s?\\.?,?'?-?\\/?[a-zA-ZÀ-ÿ])+$");
    let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');
    /* REGEXP Prénom */
    let firstName = document.querySelector('#firstName').value
    let firstNameErrorMsg = document.querySelector('#firstNameErrorMsg');
    if (NameRegExp.test(firstName)) {
        firstNameErrorMsg.innerHTML = '';
    } else {
        firstNameErrorMsg.innerHTML = 'Veuillez entrer votre Prénom .';
    }
    /* REGEXP Nom */
    let lastName = document.querySelector('#lastName').value
    let lastNameErrorMsg = document.querySelector('#lastNameErrorMsg');
    if (NameRegExp.test(lastName)) {
        lastNameErrorMsg.innerHTML = '';
    } else {
        lastNameErrorMsg.innerHTML = 'Veuillez entrer votre Nom .';
    }
    /* REGEXP Adresse */
    let address = document.querySelector('#address').value
    let addressErrorMsg = document.querySelector('#addressErrorMsg');
    if (addressRegExp.test(address)) {
        addressErrorMsg.innerHTML = '';
    } else {
        addressErrorMsg.innerHTML = 'Veuillez entrer votre Adresse .';
    }
    /* REGEXP City */
    let city = document.querySelector('#city').value
    let cityErrorMsg = document.querySelector('#cityErrorMsg');
    if (cityRegExp.test(city)) {
        cityErrorMsg.innerHTML = '';
    } else {
        cityErrorMsg.innerHTML = 'Veuillez entrer votre Ville .';
    }
    /* REGEXP City */
    let email = document.querySelector('#email').value
    let emailErrorMsg = document.querySelector('#emailErrorMsg');
    if (emailRegExp.test(email)) {
        emailErrorMsg.innerHTML = '';
    } 
    else {
        emailErrorMsg.innerHTML = 'Veuillez entrer votre E-mail .';
    }
    if(
        NameRegExp.test(firstName) &&
        NameRegExp.test(lastName) &&
        addressRegExp.test(address) &&
        cityRegExp.test(city) &&
        emailRegExp.test(email)
    ){
        //si le formulaire est validé alors on récupére les données de celui ci  
        let contact = {
            firstName: firstName,
            lastName: lastName,
            address: address,
            city: city,
            email: email,
        };
        //récupération des id des produits sélectionnés
        let products = [];
        cartInStorage.forEach(item=>{
            products.push(item.iD)});
            console.log(products)
        //envoi des infos nécessaires à notre requête post dans une variable
        let order={
            contact,products,
        }
        console.log(order)
        //requête post
        fetch("http://localhost:3000/api/products/order",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order),
        })
            .then((response) =>response.json())
            .then((data)=>{
                //redirection vers la page de confirmation
                window.location.href = "confirmation.html?"+data.orderId;
            })
            .catch(err => {
            console.error(err);
                });
    }
});