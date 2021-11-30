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
                ///
               
                ///Fonction pour changer la quantité d'un produit en utilisant la valeure affichée par l'input
                function changeQuantity(){
                    let quantityElem = document.querySelectorAll(".itemQuantity");
                    
                   for(let b=0;b<quantityElem.length;b++){
                       quantityElem[b].addEventListener('change',() => {
                           cartInStorage[b].quantity = Number (quantityElem[b].value);  
                           localStorage.setItem('product',JSON.stringify(cartInStorage))
                           calculTotal();
                           location.reload;
                       });      
                 }
                }

                //Fonction de supression d'un produit//
                function supprProduct(){
                    //récupération du bouton supprimer
                    let supprButton = document.querySelectorAll('.deleteItem');

                    //Création d'une boucle pour parcourir le panier et cibler l'élément à supprimer
                    for(let a=0;a<supprButton.length;a++){
                    supprButton[a].addEventListener('click',()=>{

                        //Ciblage de l'élément
                        let productToSuppr=cartInStorage.indexOf(cartInStorage[a]);

                        //Demande de confirmation de l'utilisateur pour prévenir les suppressions accidentelles
                        const confirmation =() => {

                            //Si il y a confirmation suppression du produit du panier
                            //Renvoi du nouveau panier dans le localstorage
                            //Raffraichissement de la page pour que le produit ne soit plus affiché
                            if(window.confirm(`Vos produits ${cartInStorage[a].quantity} ${productName} ${productColor} vont êtres supprimés de votre panier, cliquez sur OK pour confirmer`)){
                                    cartInStorage.splice(productToSuppr,1);
                                    localStorage.setItem('product',JSON.stringify(cartInStorage));
                                    calculTotal();
                                    location.reload();
                            }

                            //Si l'utilisateur ne confirme pas il reste sur la page
                            else{
                              window.location.href="./cart.html" ;
                            }
                          }
                       confirmation();
                    }
                    )};         
                }
                //Fonction de calcul de la quantité totale et du prix total
                function calculTotal(){
                    ///récupération du panier depuis le localstorage
                    let panier= JSON.parse(localStorage.getItem('product'));
                    let Total=0;
                    let quantity=0;
                    panier.forEach(product => {
                        fetch("http://localhost:3000/api/products/" + product.iD)
                        .then((res) => res.json())
                        .then (item =>{
                            //Calcul du prix total du panier
                            Total+=product.quantity*item.price;
                            document.querySelector('#totalPrice').textContent=Total;
                            ///récupération du nombre d'articles
                            quantity+=product.quantity;
                            document.querySelector('#totalQuantity').textContent=quantity;
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
///fonction vérification du formulaire
function formvalidation(){
let form=document.querySelector('.cart__order__form');
let NameRegExp= new RegExp ("^[a-zA-ZÀ-ÿ]+(\\s?\\.?,?'?-?[a-zA-ZÀ-ÿ])+$");
    function firstNameOK(){
        form.firstName.addEventListener('change',function(){
            firstNameValidation(this)
        });
        const firstNameValidation = function(controlFirstname){
            let firstNameErrorMsg=document.querySelector('#firstNameErrorMsg');
            
            if (NameRegExp.test(controlFirstname.value)) {
                firstNameErrorMsg.innerHTML=''
                return true;
                
            } 
            else {
                firstNameErrorMsg.innerHTML='Veuillez entrer votre Prénom .'
                return false;
                
            }
        }
    }
    function lastNameOK(){
        form.lastName.addEventListener('change',function(){
            lastNameValidation(this)
        });
        const lastNameValidation = function(controlLastName){
            let lastNameErrorMsg=document.querySelector('#lastNameErrorMsg');
            
            if (NameRegExp.test(controlLastName.value)) {
                lastNameErrorMsg.innerHTML=''
                return true;
                
            } 
            else {
                lastNameErrorMsg.innerHTML='Veuillez entrer votre Nom de famille .'
                return false;
            }
        }
    }
    function addressOK(){
        form.address.addEventListener('change',function(){
            addressValidation(this)
        });
        const addressValidation = function(controlAddress){
            let addressErrorMsg=document.querySelector('#addressErrorMsg');
            let addressRegExp= new RegExp("^[0-9a-zA-ZÀ-ÿ]+(\\s?\\.?,?'?-?°?/?[0-9a-zA-ZÀ-ÿ])+$");
            if (addressRegExp.test(controlAddress.value)) {
                addressErrorMsg.innerHTML=''
                return true;
                
            } 
            else {
                addressErrorMsg.innerHTML='Veuillez entrer votre Adresse .'
                return false;
                
            }
        }
    }
    function cityOK(){
        form.city.addEventListener('change',function(){
            cityValidation(this)
        });
        const cityValidation = function(controlCity){
            let cityErrorMsg=document.querySelector('#cityErrorMsg');
            let cityRegExp= new RegExp ("^[a-zA-ZÀ-ÿ]+(\\s?\\.?,?'?-?\\/?[a-zA-ZÀ-ÿ])+$");;
            if (cityRegExp.test(controlCity.value)) {
                cityErrorMsg.innerHTML=''
                return true;
                
            } 
            else {
                cityErrorMsg.innerHTML='Veuillez saisir votre ville de résidence .'
                return false;
            }
        }
    }

    function mailOk(){
    form.email.addEventListener('change',function(){
        emailValidation(this)
    });
    const emailValidation = function(controlMail){
        let mailErrorMesg=document.querySelector('#emailErrorMsg');
        console.log(mailErrorMesg)
        let emailRegExp= new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');
        if (controlMail.value!='' && emailRegExp.test(controlMail.value)) {
            mailErrorMesg.innerHTML=''
            return true;
            
        } else {        
            mailErrorMesg.innerHTML='Veuillez renseigner un email valide.'
            return false;
        }
    }}
    firstNameOK()
    lastNameOK()
    addressOK()
    cityOK()
    mailOk()

    if(!firstNameOK()==true&&
    !lastNameOK()==true&&
    !addressOK()==true&&
    !cityOK()==true&&
    !mailOk()==true
    ){console.log('tout est ok')}
    else{console.log('shit')}
};
formvalidation()
// function sendForm(){
//     let orderButtn = document.getElementById("order"),
// }
