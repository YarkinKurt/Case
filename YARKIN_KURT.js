(() => {
    const FETCH_URL = "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json";

    const init = async () => {
        //code only runs in homepage
        if (!isHomePage()) {
            console.log("wrong page");
            return;
        }
        await loadJQuery();
        const products = await fetchProducts();
        buildHTML();
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

    const buildHTML = () => {
        const html = ` 
            <div class="custom-carousel-container">
                <div class="custom-title-container">
                    <h2> Beğenebileceğinizi düşündüklerimiz </h2>
                </div>
                <div class= "custom-carousel"></div>
            </div>
        `;

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
            .custom-carousel-container h2 {
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
                overflow-x: auto;
                flex-direction: row;
            }
        `;

        $('<style>').addClass('carousel-style').html(css).appendTo('head'); 
    };

    const setEvents = () => {
        $('').on('click', () => {
            console.log('clicked');
        });
    };

    init();
})();