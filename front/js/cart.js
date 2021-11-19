//Récupération des données stockées dans le local storage
let cartInStorage = JSON.parse(localStorage.getItem('product'));

//Si le panier est vide on affiche un message pour le signaler à l'utilisateur
if (cartInStorage === null||cartInStorage==0){
    let divEmpty=document.createElement("div");
    divEmpty.classList = ('cart__item');
    document.querySelector("#cart__items").appendChild(divEmpty);
    let textEmpty = document.createElement("h2");
    textEmpty.innerHTML = 'Votre panier est vide.';
    divEmpty.appendChild(textEmpty);

}
//Si il y a bien un panier on affiche le contenu
else{
    cartInStorage.forEach(item => {
        //stockage des données  récupérées depuis le local storage dans des variables
        let productID = item.iD;
        let productColor = item.color;
        let productQuantity = item.quantity;
       //appel de l'API pour récupérer les données manquantes
       fetch("http://localhost:3000/api/products/" + productID)
            .then((res) => res.json())
            .then(productsValues=>{
                let productPrice = productsValues.price;
                let productName = productsValues.name;
                let productImg = productsValues.imageUrl;
                let productAlt = productsValues.altTxt;

                //créations des éléments du dom et insertion des données récupérées
                let articleCart=document.createElement('article');
                articleCart.className = ("cart__item");  
                articleCart.setAttribute ('data-id',productID);
                articleCart.setAttribute ('data-color',productColor);
                document.querySelector("#cart__items").appendChild(articleCart);

                let divImg = document.createElement('div');
                divImg.classList = ('cart__item__img');
                articleCart.appendChild(divImg);
                let articleImg = document.createElement('img');
                articleImg.src = (productImg);
                articleImg.alt = (productAlt);
                divImg.appendChild(articleImg);

                let divContent=document.createElement('div');
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
                price.innerHTML = productPrice+(' €');
                divDescription.appendChild(price);

                let divSettings = document.createElement('div');
                divSettings.className = ('cart__item__content__settings')
                divContent.appendChild(divSettings);

                let divQuantity = document.createElement('div');
                divQuantity.className=('cart__item__content__settings__quantity');
                divSettings.appendChild(divQuantity);

                let Qté = document.createElement('p');
                Qté.innerHTML=('Qté :');
                divQuantity.appendChild(Qté);

                let inputQuantity = document.createElement('input');
                inputQuantity.type="number";
                inputQuantity.className="itemQuantity";
                inputQuantity.name="itemQuantity";
                inputQuantity.min="1";
                inputQuantity.max="100";
                inputQuantity.value=productQuantity;
                divQuantity.appendChild(inputQuantity);

                let divDelete=document.createElement('div');
                divDelete.className="cart__item__content__settings__delete";
                divSettings.appendChild(divDelete);

                let suppr=document.createElement('p');
                suppr.className="deleteItem";
                suppr.innerHTML=('Supprimer');
                divDelete.appendChild(suppr);

                function supprItem(){
                    //récupération du bouton supprimer
                    let supprButton = document.querySelectorAll('.deleteItem');
                    //Création d'une boucle pour parcourir le panier et cibler l'élément à supprimer
                    for(let a=0;a<supprButton.length;a++){
                    supprButton[a].addEventListener('click',()=>{
                        //Ciblage de l'élément
                        let productToSuppr=cartInStorage.indexOf(cartInStorage[a]);
                        //Demande de confirmation de l'utilisateur pour prévenir les suppression accidentelles
                        const confirmation =() =>{
                            //Si il y a confirmation suppression du produit du panier
                            //Renvoi du nouveau panier dans le localstorage
                            //Raffraichissement de la page pour que le produit ne soit plus affiché
                            if(window.confirm(`Vos produits ${cartInStorage[a].quantity} ${productName} ${cartInStorage[a].color} vont êtres supprimés de votre panier, cliquez sur OK pour confirmer`)){
                                    cartInStorage.splice(productToSuppr,1);
                                    localStorage.setItem('product',JSON.stringify(cartInStorage));
                                    location.reload();
                            }
                            
                            else{
                              window.location.href="#" ;
                            }
                          }
                       
                       confirmation()
                
                        
                    }
                    )};
                    
                }
                supprItem()




               
                
            }
                )
                

        
    });
    
   
    
};
