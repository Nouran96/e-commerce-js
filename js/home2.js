const divProducts=document.querySelector("#section");
const continerDiv=document.querySelector("#continer");
const btn=document.querySelector("#btn");
let row = document.createElement("div");//to add each product to a div
row.className='row';//to give it a class
let count=1;//page count
let cartCount=0;//cart count to add it to the key in session storage

const searchBtn = document.querySelector('#searchBtn');
let products;
// let filteredProducts;

renderPage(); // Render first Page

searchBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    const inputField = ev.path[1].elements[0];
    const searchVal = inputField.value; //const
    // var result = searchVal.split(' ').join('')
    
    renderPage(searchVal);
    // renderPage(searchVal);
})


//function to render html
function htmlEl(products, search=false){

    divProducts.innerHTML = "";
    btn.innerHTML = "";

    // console.log(products.length)
    
    for (let i=0; i< products.length; i++){//render html to each product

        if(i == 0 || i % 3 == 0) {
            row = document.createElement('div');
            row.classList.add('row', 'justify-content-center');
        }

        const col=document.createElement("div");
        col.className='col-lg-3 col-md-5 card p-4 m-1';
        const img=document.createElement("img");
        // const curruncyCode=document.createElement("span");
        const contView=document.createElement("a");
        const imageCont = document.createElement('figure');
        const priceCont = document.createElement('div');
        priceCont.className = 'row justify-content-between';
        // contView.className = 'col-md-12';
        // const cartDiv=document.createElement("div");//div for cart button
        const price=document.createElement("p");
        const name=document.createElement("h5");
        const cartBtn=document.createElement("button");
        name.textContent=products[i].Name;
        img.setAttribute("src",products[i].ProductPicUrl);
        // curruncyCode.innerHTML= '&euro;';
        price.innerHTML='<span>&euro;</span>'+products[i].Price;
        cartBtn.className='fa fa-shopping-cart';
        contView.setAttribute('href', `details.html?ProductId=${products[i].ProductId}`);//to add view page
        // price.appendChild(curruncyCode);

        // col.appendChild(name);
        // col.appendChild(img);
        // col.appendChild(price);
        // contView.appendChild(col);
        imageCont.appendChild(img);
        priceCont.append(price, cartBtn);
        contView.append(name, imageCont);
        col.append(contView, priceCont);
        // cartDiv.appendChild(cartBtn)
        // contView.appendChild(col);
        row.appendChild(col);
        // row.appendChild(cartDiv);
        // row.appendChild(cartBtn)
        
        divProducts.appendChild(row);
        
        
        cartBtn.addEventListener("click", (e)=>{//adding product to session storage
            // console.log(products);
            // e.stopPropagation();
            cartCount++;
            sessionStorage.setItem(cartCount,JSON.stringify(products[i]));
        })
    }
    
    if(!search) { // Don't show this if from search result
        //adding next , previous button and page number
        const nextBtn=document.createElement("button");
        nextBtn.textContent='NEXT';
        nextBtn.className="btn btn-outline-dark mx-3";
        //justify-content-end p-2 
        nextBtn.addEventListener("click", (e)=>getNextPage());
        

        const prevBtn=document.createElement("button");
        prevBtn.textContent='PREVIOUS';
        prevBtn.className=" btn btn-outline-dark mx-3";
        //justify-content-start p-2
        prevBtn.addEventListener("click", (e)=>getPrevPage());


        const pageNum=document.createElement("span");
        pageNum.textContent="Page "+count;
        // pageNum.className="align-middle";

        //check whether to show next , previous or both
        if (count ===1){
            btn.append( pageNum,nextBtn);  
        }else if(count ===13){
            btn.append(prevBtn, pageNum);
        }else{
            btn.append(prevBtn,pageNum,nextBtn);
        }
    }

}

function renderPage(search = '') {

    if(!search) {
        //rendering the first page
        $.ajax({
            method:"GET",
            url:"https://afternoon-falls-30227.herokuapp.com/api/v1/products"
        })
        .done(function(response){
            products=response.data;
            htmlEl(products);
        }) 

    } else {
        $.ajax({
            method:"GET",
            url:`https://afternoon-falls-30227.herokuapp.com/api/v1/products?q=${search}`
        })
        .done(function(response){
            products=response.data;
            console.log(products.Name);
            htmlEl(products, true);
        })
    }
}

          


//to get the next page
function getNextPage(){
    // divProducts.innerHTML="";
    row.innerHTML="";
    btn.innerHTML="";

    count++;
    $.ajax({
        method:"GET",
        url:`https://afternoon-falls-30227.herokuapp.com/api/v1/products?page=${count}`
    })
    .done(function(response){
        // console.log(response);
        
        const products=response.data;
        // console.log(products);
        
        htmlEl(products);
    }) 
}



//previous page
function getPrevPage(){
    // divProducts.innerHTML="";
    row.innerHTML="";
    btn.innerHTML="";
    count--;
    $.ajax({
        method:"GET",
        url:`https://afternoon-falls-30227.herokuapp.com/api/v1/products?page=${count}`
    })
    .done(function(response){
        const products=response.data;
        htmlEl(products);
    }) 
}