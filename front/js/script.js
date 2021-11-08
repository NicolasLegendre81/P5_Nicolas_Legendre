///Création d'une classe Product afin de pouvoir manipuler les données renvoyées par l'api
class Product{
    constructor(products){
        products && Object.assign(this,products);
    }

}
////récupération des données depuis l'api
let url = 'http://localhost:3000/api/products/';
fetch(url)
    .then((response) => response.json()
    .then((productsList) => {
        for(let products of productsList){
            let product = new Product(products);
            ///insertion dans le dom
            let productAnchor=document.createElement('a');
            productAnchor.href=`./product.html?id=${product._id}`;
            document.getElementById('items').appendChild(productAnchor);

            let article=document.createElement('article');
            productAnchor.appendChild(article);

            let img=document.createElement("img");
            img.src=product.imageUrl;
            img.alt=product.altTxt;
            article.appendChild(img);

            let name=document.createElement('h3');
            name.classList=('productName');
            name.innerHTML=product.name;
            article.appendChild(name);

            let description=document.createElement('p');
            description.classList=('productDescription');
            description.innerHTML=product.description;
            article.appendChild(description);
          
        }
        
        
    })
   
    
    
);



    




