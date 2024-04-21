document.addEventListener('DOMContentLoaded', function () {
    fetchProductData();
    const cartButton = document.getElementById('cartToggle');
    const miniCart = document.querySelector('.mini-cart');

    let selectedSize = null;
    const cart = {};

    cartButton.addEventListener('click', function() {
        if (miniCart.style.display === 'none' || miniCart.style.display === '') {
            miniCart.style.display = 'block'; 
        } else {
            miniCart.style.display = 'none'; 
        }
    });

    document.getElementById('addToCart').addEventListener('click', function () {
        if (!selectedSize) {
            document.getElementById('error-message').textContent = 'Please select a size';
            return;
        }
        if (!cart[selectedSize]) {
            cart[selectedSize] = { count: 0, price: document.getElementById('price').textContent };
        }
        cart[selectedSize].count++;
        updateCart();
    });

    function updateCart() {
        const cartItems = document.getElementById('cartItems');
        cartItems.innerHTML = '';
        let itemCount = 0;
        for (let size in cart) {
            itemCount += cart[size].count;
            const item = document.createElement('div');
            item.textContent = `${cart[size].count}x Classic Tee (${size}) at ${cart[size].price}`;
            cartItems.appendChild(item);
        }
        document.getElementById('itemCount').textContent = itemCount;
    }

    function fetchProductData() {
        const apiUrl = 'https://3sb655pz3a.execute-api.ap-southeast-2.amazonaws.com/live/product';
        fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data) {
                document.getElementById('title').textContent = data.title;
                document.getElementById('price').textContent = `$${data.price}`;
                document.getElementById('description').textContent = data.description;  
                document.querySelector('.product-details img').src = data.imageURL;
                setupSizes(data.sizeOptions);
            }
        })
        .catch(error => console.error('Error fetching product data:', error));
    }
    

    function setupSizes(sizes) {
        const sizesContainer = document.getElementById('sizes');
        sizesContainer.innerHTML = '';
        sizes.forEach(size => {
            const button = document.createElement('button');
            button.className = 'size';
            button.setAttribute('data-size', size.label);
            button.textContent = size.label;
            button.addEventListener('click', function () {
                selectedSize = this.getAttribute('data-size');
                document.querySelectorAll('.size').forEach(btn => btn.style.borderColor = '#CCCCCC');
                this.style.borderColor = '#222222';
                document.getElementById('error-message').textContent = '';
            });
            sizesContainer.appendChild(button);
        });
    }
});
