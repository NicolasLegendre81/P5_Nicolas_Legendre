///récupération des paramètres de l'url
let params = (new URL(document.location)).searchParams;
let productUrlId = params.get('id');
///modification de l'url et Affichage des données selon le produit sélectionné
let url=(`http://localhost:3000/api/products/${productUrlId}`);
fetch (url)
    .then ((response) => response.json())

    .then (product =>{
      //création des élément dans le DOM
        let productImg=document.createElement("img");
        productImg.src=product.imageUrl;
        productImg.alt=product.altTxt;
        document.querySelector('.item__img').appendChild(productImg); 
        let title =document.createTextNode(product.name); 
        document.getElementById('title').appendChild(title);
        let price =document.createTextNode(product.price); 
        document.getElementById('price').appendChild(price);
        let description =document.createTextNode(product.description); 
        document.getElementById('description').appendChild(description);
        const colors=product.colors;
        colors.forEach((item,i)=> {
           
            let option=document.createElement('option')
            option.value=item
            option.textContent=item
            document.querySelector('select').appendChild(option);
        });
    })


    //récupération du bouton
    let addToCartButton = document.getElementById('addToCart');
    
    //initialisation du local storage:si il est vide on crée une clé sinon on récupére les données
    let cart = localStorage.getItem ('product') == null ?[] : JSON.parse (localStorage.getItem('product'));
    
    //déclenchement des événements au click
    addToCartButton.addEventListener('click',()=>{
  
      let selectedProduct = {
          
          iD : productUrlId,
          quantity : Number(parseInt(document.getElementById('quantity').value)),
          color : document.getElementById('colors').value,

      }

      //Ajout d'un pop up de confirmation redirigeant vers la page panier si l'utilisateur confirme
      const confirmation = () => {
        if(window.confirm(`Vos produits  sont ajoutés
            à votre panier, cliquez sur OK pour accéder a votre panier.`)){
            window.location.href = "./cart.html";
        }
        else{
          window.location.href = `` ;
        }
      }

      //Si l'utilisateur n'a pas renseigné la couleur ou la quantité on lui envoie un message d'erreur
      if (selectedProduct.quantity == "" || selectedProduct.color == "") {
        alert('Nous vous prions de sélectionner la quantité et la couleur désirée pour ce produit.')
        
      } 
      else {
        
      
        //Si le panier n'est pas vide on vérifie ce qu'il contient
        if(cart.lenght != 0){
            let newCart = []
            let find = false;
            cart.forEach(item=> {
                //Le produit sélectionné est déja dans le panier on incrémente la quantité
                if(selectedProduct.iD === item.iD && selectedProduct.color === item.color)
                {
                find = true;
                item.quantity = parseInt(item.quantity)+parseInt(selectedProduct.quantity)
                newCart.push(item);
                } 
                //sinon on le push vers notre variable
                else {
                  newCart.push(item);
                };
              
            })  
            if(find == false){
              newCart.push(selectedProduct);
            }
            //envoi des produits vers le local storage aprés vérification
            localStorage.setItem('product',JSON.stringify(newCart));
            cart = newCart;  
            
            }
        
        //Si le panier est vide on envoi notre produit vers le local storage
        else{
          cart.push(selectedProduct);
          localStorage.setItem('product',JSON.stringify(cart));
          
        };
        confirmation()
      };
  });
    
