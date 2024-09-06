document.addEventListener("DOMContentLoaded", function () {
    const cartTableBody = document.querySelector(".cart-table tbody");

    // Function to handle the Add to Cart action
    function addToCart(event) {
        const medCard = event.target.closest(".med-card");
        const medName = medCard.querySelector(".medname").textContent;
        const medImageSrc = medCard.querySelector(".medimage").src;
        const medPrice = parseFloat(medCard.querySelector(".price").textContent.trim()); // Convert price to a number
        const medQuantity = parseInt(medCard.querySelector(".quantity").value); 

        // Check if the quantity is greater than 0
        if (medQuantity > 0) {
            // Check if the item is already in the cart
            const existingRow = Array.from(cartTableBody.querySelectorAll("tr")).find(row => 
                row.querySelector("td:nth-child(2)").textContent === medName
            );

            if (existingRow) {
                // Update the quantity and price of the existing item
                const quantityCell = existingRow.querySelector("td:nth-child(3)");
                const priceCell = existingRow.querySelector("td:nth-child(4)");

                const existingQuantity = parseInt(quantityCell.textContent);
                const newQuantity = existingQuantity + medQuantity;
                const newTotalPrice = medPrice * newQuantity;

                quantityCell.textContent = newQuantity;
                priceCell.textContent = `${newTotalPrice.toFixed(2)} LKR`;
            } else {
                // Add a new row for the item if it doesn't already exist
                const cartRow = document.createElement("tr");

                // Add Image
                const imageCell = document.createElement("td");
                const img = document.createElement("img");
                img.src = medImageSrc;
                img.alt = medName;
                img.style.width = "50px"; // Adjust the image size if needed
                imageCell.appendChild(img);
                cartRow.appendChild(imageCell);

                // Add Name
                const nameCell = document.createElement("td");
                nameCell.textContent = medName;
                cartRow.appendChild(nameCell);

                // Add Quantity
                const quantityCell = document.createElement("td");
                quantityCell.textContent = medQuantity;
                cartRow.appendChild(quantityCell);

                // Add Price
                const priceCell = document.createElement("td");
                priceCell.textContent = `${(medPrice * medQuantity).toFixed(2)} LKR`; // Display total price
                cartRow.appendChild(priceCell);

                // Add Remove Button
                const removeCell = document.createElement("td");
                const removeButton = document.createElement("button");
                removeButton.textContent = "Remove";
                removeButton.className = "remove-button";
                removeButton.addEventListener("click", function () {
                    cartRow.remove();
                });
                removeCell.appendChild(removeButton);
                cartRow.appendChild(removeCell);

                // Append the row to the cart table
                cartTableBody.appendChild(cartRow);
            }

            // Optionally, reset the quantity input field to 0
            medCard.querySelector(".quantity").value = 0;
        } else {
            alert("Please enter a valid quantity.");
        }
    }

    // Attach event listeners to all Add to Cart buttons
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    addToCartButtons.forEach(button => {
        button.addEventListener("click", addToCart);
    });


    document.getElementById("confirm").addEventListener("click", function () {
        const cartTableBody = document.querySelector(".cart-table tbody");
        const cartItems = [];
        
        // Check if the cart is empty
        if (cartTableBody.querySelectorAll("tr").length === 0) {
            alert("Your cart is empty. Please add items to the cart before confirming your order.");
            return; // Exit the function to prevent further execution
        }
    
        cartTableBody.querySelectorAll("tr").forEach(row => {
            const item = {
                image: row.querySelector("td:nth-child(1) img").src,
                name: row.querySelector("td:nth-child(2)").textContent,
                quantity: row.querySelector("td:nth-child(3)").textContent,
                price: row.querySelector("td:nth-child(4)").textContent
            };
            cartItems.push(item);
        });
    
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    
        // Redirect to the order page
        window.location.href = "order.html";
    });
    



});
