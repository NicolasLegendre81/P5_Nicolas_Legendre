///récupération des paramètres de l'url
let params = (new URL(document.location)).searchParams;
let productUrlId = params.get('id');
///modification de l'url et Affichage des données selon le produit sélectionné
let url=(`http://localhost:3000/api/products/${productUrlId}`);
fetch (url)
    .then ((response) => response.json())
    .then (product =>{
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
    function quantity() {
        let quantity =document.getElementById('quantity').value;
        return quantity;

    }
    function color(){
    let color = document.getElementById('colors').value;
     
     return color;
     }

    //initialisation local storage
    let productsRegistered=JSON.parse(localStorage.getItem('product'));
    //récupération du bouton
    let addToCartButton = document.getElementById('addToCart');
    //déclenchement des événement au clic
    addToCartButton.addEventListener('click',()=>{
        
        let selectedProduct={
          color:color(),
          iD:productUrlId,
          Quantity: Number (quantity()),
          
        };
        //fonction ajout de produit
        const addProductToLocalStorage = () => {
          productsRegistered.push(selectedProduct);
        localStorage.setItem('product',JSON.stringify(productsRegistered));
        console.table(productsRegistered);
        };

      if (productsRegistered) {
        
         const productAlreadyInStorage= productsRegistered.find(
           (el)=>el.iD===productUrlId && el.color===color()
         );
         console.log(productAlreadyInStorage)
        if(productAlreadyInStorage){
          let newQuantity= parseInt(selectedProduct.Quantity)+ parseInt(productAlreadyInStorage.Quantity);
          productAlreadyInStorage.Quantity = newQuantity;
          productsRegistered.push(selectedProduct.Quantity);
          localStorage.setItem('product',JSON.stringify(productsRegistered));
          console.table(productsRegistered);
          

        }
        else{
          addProductToLocalStorage();

        };
       
        
        
          
      } 
      else {
        productsRegistered=[];
        addProductToLocalStorage();
          
        


            
      }
        


        

    })
    
