(() => {
    const FETCH_URL = "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json";

    let activeProduct = 0;
    const cardWidth = 290.5; //width + gap = 272.5 + 18
    const visibleCardsCount = 4;
    let items;

    const init = async () => {
        //code only runs in homepage
        if (!isHomePage()) {
            console.log("wrong page");
            return;
        }
        await loadJQuery();
        const products = await fetchProducts();
        buildHTML(products);
        items = document.getElementsByClassName("custom-carousel-item");
        buildCSS();
        setEvents();
    };

    const isHomePage = () => {
        return location.pathname === "/" || location.pathname === "/index.html";
    };

    const loadJQuery = async () => {
        return new Promise((resolve) => {
            if (window.jQuery) return resolve();
            const script = document.createElement("script");
            script.src = "https://code.jquery.com/jquery-3.7.1.min.js";
            script.onload = resolve;
            document.head.appendChild(script);
        });
    };

    

    const fetchProducts = async () => {
        //get products from localstorage if not, fetch it.
        const cached = localStorage.getItem("CAROUSEL_PRODUCTS");
        if (cached) {
            return JSON.parse(cached);
        } else {
            let response = await fetch(FETCH_URL);
            const data = await response.json();
            localStorage.setItem("CAROUSEL_PRODUCTS", JSON.stringify(data));
            return data;
        }
    };

    const getFavorites = () => {
        return JSON.parse(localStorage.getItem("CAROUSEL_FAVORITES") || "[]");
    };

    const saveFavorites = (favorites) => {
        localStorage.setItem("CAROUSEL_FAVORITES", JSON.stringify(favorites));
    };
    
    const moveCards = (amountToMove) => {
         for (let i = 0; i < items.length; i++) {
            items[i].style.transform = `translateX(${amountToMove}px)`;
        }
    };

    const buildHTML = (products) => {
        const favorites = getFavorites();
        let html = ` 
            <div class="custom-carousel-container">
                <div class="custom-title-container">
                    <h2 class="custom-title"> Beğenebileceğinizi düşündüklerimiz </h2>
                </div>
                <div class="custom-carousel">
        `;

        products.forEach(product => {
            //Check if product has been favorited
            const isFav = favorites.includes(product.id);
            //Product is on discount if price is different than original price (lower price is the current)
            const hasDiscount = product.price !== product.original_price;
            let currentPrice, oldPrice, discountPercent = 0;
            if(product.price < product.original_price){
                discountPercent = hasDiscount ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0;
                currentPrice = product.price;
                oldPrice = product.original_price;
            }
            else{
                discountPercent = hasDiscount ? Math.round(((product.price - product.original_price) / product.price) * 100) : 0;
                currentPrice = product.original_price;
                oldPrice = product.price;
            }
            html += `
                <div class="custom-carousel-item" data-id="${product.id}" data-url="${product.url}">
                    <div class="product-image-container">
                        <img class="product-image" src="${product.img}" alt="${product.title}">
                         ${isFav 
                                ? `<div class="heart active">
                                        <img id="default-favorite" src="assets/svg/default-favorite.svg" alt="heart" class="heart-icon">
                                    </div>`
                                :`<div class="heart">
                                    <img id="default-favorite" src="assets/svg/default-favorite.svg" alt="heart" class="heart-icon">
                                </div>`
                            }                    
                    </div>
                    <div class="product-info">
                        <h2 class="product-title">
                            <b>${product.brand} - </b>
                            <span>${product.name}</span>
                        </h2>
                        <div class="price-container">
                            ${hasDiscount 
                                ? `<div class="old-price-container">
                                        <span class="old-price">${oldPrice} TL</span>
                                        <span class="discount">%${discountPercent}</span>
                                        <i class="icon icon-decrease"></i>
                                   </div>
                                   <span class="current-price">${currentPrice} TL</span>`
                                : `<span class="price-text">${currentPrice} TL</span>`
                            }
                        </div>
                    </div>
                </div>
            `;
        });

        html += `</div>
                    <button aria-label="back" class="custom-swiper-back"></button>
                    <button aria-label="next" class="custom-swiper-next"></button>
                </div>`

        $('.Section1').after(html); 
    };

    const buildCSS = () => {
        const css = ` 
            .custom-carousel-container {
                box-sizing: border-box;
                padding: 20px 15px;
                max-width: 1180px;
                flex: 1;
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                flex-direction: column;
                position: relative;
            }
            .custom-title-container {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background-color: #fef6eb;
                padding: 25px 67px;
                border-top-left-radius: 35px;
                border-top-right-radius: 35px;
            }
            .custom-title {
                font-family: Quicksand-Bold;
                font-size: 3rem;
                font-weight: 700;
                line-height: 1.11;
                color: #f28e00;
                margin: 0;
            }
            .custom-carousel {
                display: flex;
                gap: 15px;
                width: 100%;
                overflow-x: hidden;
                overflow-y: hidden;
                flex-direction: row;
                box-shadow: 15px 15px 30px 0 #ebebeb80;
                margin-top: 20px;
                background-color: #fff;
                border-bottom-left-radius: 35px;
                border-bottom-right-radius: 35px;
                box-sizing: border-box;
            }
            .custom-carousel-item {
                width: 272.5px;
                z-index: 2;
                display: block;
                font-family: Poppins, "cursive";
                font-size: 12px;
                padding: 5px;
                color: #7d7d7d;
                margin: 2px 0 20px 3px;
                border: 1px solid #ededed;
                border-radius: 10px;
                position: relative;
                text-decoration: none;
                background-color: #fff;
                box-sizing: border-box;
                transition: border-color, box-shadow, transform 0.3s ease;
            }
            .custom-carousel-item:hover {
                border-color: #f28e00;
                box-shadow: 0 0 0 2px #f28e00;
                cursor: pointer;
            }
            .product-image-container {
                height: 203px;
                width: 261px;
                margin-bottom: 45px;
            }
            .product-image {
                display: block;
                width: 100%;
                height: 100%;
            }
            .product-info {
                font-family: Poppins, "cursive";
                font-size: 12px;
                margin: 0 13px 17px 17px;
            }
            .product-title {
                font-size: 1.2rem;
                height: 42px;
                overflow: hidden;
                margin-bottom: 10px;
            }
            .price-container {
                position: relative;
                display: flex;
                justify-content: flex-end;
                flex-direction: column;
                height: 43px;
                align-items: flex-start;
                margin-top: 70px;
            }
            .current-price {
                display: block;
                width: 100%;    
                font-size: 2.2rem;
                font-weight: 600;
                color: #00a365;
                font-family: Poppins, "cursive";
            }
            .old-price-container{
                align-items: center;
                gap: 8px;              
                height: auto
            }
            .old-price{
                font-size: 1.4rem;
                font-weight: 500;
                text-decoration: line-through;
            }
            .discount{
                color: #00a365;
                font-size: 18px;
                font-weight: 700;
                display: inline-flex;
                justify-content: center;
            }
            .icon-decrease{
                display: inline-block;
                height: 22px;
                font-size: 22px;
                margin-left: 3px;
                color: #00a365;
            }        
            .price-text {
                display: block;
                width: 100%;    
                font-size: 2.2rem;
                font-weight: 600;
                font-family: Poppins, "cursive";
            }
            .custom-swiper-back {
                background: url(/assets/svg/prev.svg) no-repeat;
                background-color: #fef6eb;
                background-position: 18px;
                left: -65px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                position: absolute;
                bottom: 50%;
                top: auto;
                border: 0px solid #fef6eb;
                transition: background-color, border-width;
            }
            .custom-swiper-back:hover {
                background-color: #fff;
                border-width: 1px;
                border-color: #f28e00;
            }
            .custom-swiper-next {
                background: url(/assets/svg/next.svg) no-repeat;
                background-color: #fef6eb;
                background-position: 18px;
                right: -65px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                position: absolute;
                bottom: 50%;
                top: auto;
                border: 0px solid #fef6eb;
                transition: background-color, border-width;
            }
            .custom-swiper-next:hover {
                background-color: #fff;
                border-width: 1px;
                border-color: #f28e00;
            }
            .heart {
                position: absolute;
                top: 10px;
                right: 15px;
                font-size: 20px;
                background-color: #fff;
                border-radius: 50%;
                box-shadow: 0 2px 4px 0 #00000024;
                width: 50px;
                height: 50px;
                cursor: pointer;
                color: #ccc;
                transition: background-color 0.3s;
            }
            .heart.active {
                background-color: #f28e00;
            }
            .heart-icon {
                filter: grayscale(1);
                transition: filter 0.3s;
            }
            .heart.active .heart-icon {
                filter: none;
                fill: #f28e00; /* example fill color */
            }
        `;

        $('<style>').addClass('carousel-style').html(css).appendTo('head'); 
    };

    const setEvents = () => {
        //open product page on new tab
        $(document).on("click", ".custom-carousel-item", function(e) {
            if ($(e.target).hasClass("heart")) return; // skip heart clicks
            const url = $(this).data("url");
            window.open(url, "_blank");
        });
        $(document).on("click", ".custom-swiper-back", () => {
             if (activeProduct > 0) {
                activeProduct -= 1;
                moveCards(-activeProduct * cardWidth);
            }
        });
        $(document).on("click", ".custom-swiper-next", () => {
            if (activeProduct < items.length - visibleCardsCount) {
            activeProduct += 1;
            moveCards(-activeProduct * cardWidth);
            }
        });
        $(document).on("click", ".heart", function(e) {
            e.stopPropagation();
            const parent = $(this).closest(".custom-carousel-item");
            const id = parent.data("id");
            let favorites = getFavorites();

            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                favorites = favorites.filter(fav => fav !== id);
            } else {
                $(this).addClass("active");
                favorites.push(id);
            }

            saveFavorites(favorites);
        });

    };
    

    init();
})();