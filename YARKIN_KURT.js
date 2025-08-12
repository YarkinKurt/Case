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
            <div class="container">
                <h1></h1>
            </div>
        `;

        $('.product-detail').append(html); 
    };

    const buildCSS = () => {
        const css = ` 
            .container {
                background-color: red;
                height: 100px;
                width: 100px;
            }
        `;

        $('style').addClass('carousel-style').html(css).appendTo('head'); 
    };

    const setEvents = () => {
        $('').on('click', () => {
            console.log('clicked');
        });
    };

    init();
})();