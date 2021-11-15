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
    
    

    //initialisation local storage
    //let productsRegistered=JSON.parse(localStorage.getItem('product'));
    //récupération du bouton
    let addToCartButton = document.getElementById('addToCart');
    //déclenchement des événement au clic

    let cart = localStorage.getItem ('product') == null ?[] : JSON.parse (localStorage.getItem('product'));
    
  
    addToCartButton.addEventListener('click',()=>{
        
      let selectedProduct={
          
          iD:productUrlId,
          quantity:Number(parseInt(document.getElementById('quantity').value)),
          color: document.getElementById('colors').value,
          name:document.getElementById('title').textContent,
          price: Number(parseInt (document.getElementById('price').textContent)),
          
         
          
      }
        
        
       
      if(localStorage.product!=null){
          let find=false;
          for ( let i = 0; i < cart.length; i++) {
              if(selectedProduct.iD === cart[i].iD && selectedProduct.color === cart[i].color){
               find=true;
              let newQuantity=parseInt(cart[i].quantity)+parseInt(selectedProduct.quantity);
              cart[i].quantity=newQuantity;
              cart.push(selectedProduct);
              localStorage.setItem('product',JSON.stringify(cart));
              break;
              
              

            
            
              
             
            
            
              } 
              else if(find=false){
              
              
              
       
              cart.push(selectedProduct);
              localStorage.setItem('product',JSON.stringify(cart));
              };
              
            }   
              
        
      }
      
        
      
      
      

      
      else{
       
        cart.push(selectedProduct);
        localStorage.setItem('product',JSON.stringify(cart));
      }
      

        
        
      

        
       
         
         

         
         
       
        
        
        
        


            
      
        


        

    });
    
