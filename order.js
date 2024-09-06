document.addEventListener("DOMContentLoaded", function () {
    const cartTableBody = document.querySelector("#cart-table tbody");
    const customerNameInput = document.querySelector('#customerName');
    const addressInput = document.querySelector('#address');
    const zipInput = document.querySelector('#zipcode'); // Fixed here
    const emailInput = document.querySelector('#email');
    const cityInput = document.querySelector('#city');
    const stateInput = document.querySelector('#state');
    const cardNameInput = document.querySelector('#cardName');
    const cardNumberInput = document.querySelector('#cardNumber');
    const cvvInput = document.querySelector('#cvv');
    const monthInput = document.querySelector('#month');
    const yearInput = document.querySelector('#year');
    const payBtn = document.getElementById('pay');
    const favBtn = document.getElementById('save');
    const loadBtn = document.getElementById('load');

    const totalPriceElement = document.querySelector('.total-price');

    function calculateTotalPrice() {
        let totalPrice = 0;

        // Loop through each row in the cart table and sum the prices
        const priceCells = cartTableBody.querySelectorAll("td:nth-child(4)");
        priceCells.forEach(priceCell => {
            const price = parseFloat(priceCell.textContent);
            totalPrice += price;
        });

        return totalPrice.toFixed(2); 
    }

    function showEmptyCartMessage() {
        const emptyMessageRow = cartTableBody.insertRow();
        const emptyMessageCell = emptyMessageRow.insertCell(0);
        emptyMessageCell.colSpan = 5;
        emptyMessageCell.innerText = 'Your cart is empty';
    }

    function updateTotalPrice() {
        const totalPrice = calculateTotalPrice();
        totalPriceElement.textContent = `Total Price: ${totalPrice} LKR`;
    }

    function populateCartTable(){
        const cartItems = JSON.parse(localStorage.getItem("cartItems"));
        if (cartItems && cartItems.length > 0) {
            cartItems.forEach(item => {
                const cartRow = document.createElement("tr");
    
                // Image Cell
                const imageCell = document.createElement("td");
                const img = document.createElement("img");
                img.src = item.image;
                img.alt = item.name;
                img.style.width = "60px"; 
                imageCell.appendChild(img);
                cartRow.appendChild(imageCell);
    
                // Name Cell
                const nameCell = document.createElement("td");
                nameCell.textContent = item.name;
                cartRow.appendChild(nameCell);
    
                // Quantity Cell
                const quantityCell = document.createElement("td");
                quantityCell.textContent = item.quantity;
                cartRow.appendChild(quantityCell);
    
                // Price Cell
                const priceCell = document.createElement("td");
                priceCell.textContent = item.price;
                cartRow.appendChild(priceCell);
    
                // Remove Button Cell
                const removeCell = document.createElement("td");
                const removeButton = document.createElement("button");
                removeButton.textContent = "Remove";
                removeButton.className = "remove-button";
                removeButton.addEventListener("click", function () {
                    cartRow.remove();
                    updateTotalPrice(); // Recalculate the total after an item is removed
                });
                removeCell.appendChild(removeButton);
                cartRow.appendChild(removeCell);
    
                // Append the row to the cart table
                cartTableBody.appendChild(cartRow);
            });
        } else {
            showEmptyCartMessage(); // Show message if cart is empty
        }
    }

    function saveToFavorites() {
        const cartItems = [];
        cartTableBody.querySelectorAll('tr').forEach(row => {
            const productImg = row.cells[0].querySelector('img').src;
            const productName = row.cells[1].innerText;
            const productQuantity = row.cells[2].innerText;
            const totalPrice = row.cells[3].innerText;
            cartItems.push({ image: productImg, name: productName, quantity: productQuantity, price: totalPrice });
        });
    
        // Saving Personal and Payment info
        const billData = {
            customerName: customerNameInput.value,
            address: addressInput.value,
            email: emailInput.value,
            city: cityInput.value,
            state: stateInput.value,
            zipcode: zipInput.value, // Fixed here
            cardName: cardNameInput.value,
            cardNumber: cardNumberInput.value,
            cvv: cvvInput.value,
            expMonth: monthInput.value,
            expYear: yearInput.value,
            cartItems: cartItems
        };
    
        // Save to localStorage
        localStorage.setItem('favoriteOrder', JSON.stringify(billData));
    }

    function loadFavorites() {
        const savedData = JSON.parse(localStorage.getItem('favoriteOrder'));
        if (savedData && savedData.cartItems) {

            // Clearing Cart
            cartTableBody.innerHTML = '';

            // Populate personal and payment info fields
            customerNameInput.value = savedData.customerName;
            addressInput.value = savedData.address;
            emailInput.value = savedData.email;
            cityInput.value = savedData.city;
            stateInput.value = savedData.state;
            zipInput.value = savedData.zipcode; // Fixed here
            cardNameInput.value = savedData.cardName;
            cardNumberInput.value = savedData.cardNumber;
            cvvInput.value = savedData.cvv;
            monthInput.value = savedData.expMonth;
            yearInput.value = savedData.expYear;

            savedData.cartItems.forEach(item => {
                const cartRow = document.createElement('tr');

                // Image Cell
                const imageCell = document.createElement('td');
                const img = document.createElement('img');
                img.src = item.image; // Fixed property name
                img.alt = item.name;
                img.style.width = "60px"; 
                imageCell.appendChild(img);
                cartRow.appendChild(imageCell);

                // Name Cell
                const nameCell = document.createElement('td');
                nameCell.textContent = item.name;
                cartRow.appendChild(nameCell);

                // Quantity Cell
                const quantityCell = document.createElement('td');
                quantityCell.textContent = item.quantity;
                cartRow.appendChild(quantityCell);

                // Price Cell
                const priceCell = document.createElement('td');
                priceCell.textContent = item.price;
                cartRow.appendChild(priceCell);

                // Remove Button Cell
                const removeCell = document.createElement('td');
                const removeButton = document.createElement('button');
                removeButton.textContent = "Remove";
                removeButton.className = "remove-button";
                removeButton.addEventListener('click', function () {
                    cartRow.remove();
                    updateTotalPrice(); // Recalculate the total after an item is removed
                });
                removeCell.appendChild(removeButton);
                cartRow.appendChild(removeCell);

                // Append the row to the cart table
                cartTableBody.appendChild(cartRow);
            });

            updateTotalPrice();

            alert("Favourite Order Loaded")

        } else {
            alert("No saved favorites found.");
        }
    }

    function validateForm() {
        // Validating billing details input
        if (cardNameInput.value === '' || addressInput.value === '' || emailInput.value === '' || cityInput.value === '' || stateInput.value === '' || zipInput.value === '') {
            alert('Please provide all required billing details.');
            return false;
        }

        // Validating payment details
        if (cardNameInput.value === '' || cardNumberInput.value === '' || cvvInput.value === '' || monthInput.value === '' || yearInput.value === '') {
            alert('Please provide all required payment details.');
            return false;
        }

        return true;
    }


    //function to handle payment

    function handlePayment() {
        const cartRows = cartTableBody.querySelectorAll('tr');

        if (cartRows.length === 0) {
            alert('Your cart is empty. Add items to the cart before attempting to pay.');
        } else {
            if (validateForm()) {
                let userName = customerNameInput.value;
                let orderSummary = 'Order Summary:\n\n';
                cartRows.forEach(row => {
                    const productName = row.cells[1].textContent;
                    const productQuantity = row.cells[2].textContent;
                    const productPrice = row.cells[3].textContent;
                    orderSummary += `Item: ${productName}\nQuantity: ${productQuantity}\nPrice: ${productPrice}\n\n`;
                });
                const today = new Date();
                const deliveryDate = new Date();
                deliveryDate.setDate(today.getDate() + 7);
                
                // Format the delivery date as a readable string (e.g., September 12, 2024)
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDeliveryDate = deliveryDate.toLocaleDateString(undefined, options);
                const totalPrice = calculateTotalPrice();
                orderSummary += `Total Price: ${totalPrice} LKR\n\n`;
                orderSummary += `Billing Information:\nName: ${userName}\nAddress: ${addressInput.value}\nEmail: ${emailInput.value}\nCity: ${cityInput.value}\nState: ${stateInput.value}\nZip Code: ${zipInput.value}\n\nDelivery Date:${formattedDeliveryDate}`;
                alert(orderSummary);
                cartTableBody.innerHTML = ''; // Clear cart table
                updateTotalPrice();
            }
        }
    }

    populateCartTable();
    updateTotalPrice(); // Initialize total price

    payBtn.addEventListener('click', function(event){
        event.preventDefault();
        handlePayment();
    } );
    favBtn.addEventListener('click', function(event){
        event.preventDefault();
        saveToFavorites();
        alert('Order details saved to favourites.');
    });
    loadBtn.addEventListener('click', function(event){
        event.preventDefault();
        loadFavorites();
    });
});
