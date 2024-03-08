document.addEventListener('DOMContentLoaded', () => {
    const startOrderButton = document.getElementById('startOrder');
    startOrderButton.addEventListener('click', () => {
        location.href = 'selectBeverage.html';
    });
});

function selectBeverage(beverage) {
    sessionStorage.setItem('beverage', beverage);
    location.href = 'addCondiments.html';
    displayOrder();
}

function addCondiment(condiment) {
    // Retrieve the current list of condiments from sessionStorage, or initialize an empty array if none exist.
    let condiments = sessionStorage.getItem('condiments') ? JSON.parse(sessionStorage.getItem('condiments')) : [];
    const index = condiments.indexOf(condiment);

    // If the condiment is already in the array, remove it. Otherwise, add it.
    if (index > -1) {
        condiments.splice(index, 1); // Remove the condiment
    } else {
        // Add the condiment
        condiments.push(condiment);
    }

    sessionStorage.setItem('condiments', JSON.stringify(condiments)); // Update sessionStorage with the new list of condiments
    displayOrder(); // Refresh the order summary display
}

function removeCondiment(index) {
    let condiments = JSON.parse(sessionStorage.getItem('condiments') || '[]');
    condiments.splice(index, 1); 
    sessionStorage.setItem('condiments', JSON.stringify(condiments)); // Update sessionStorage
    displayOrder(); // Refresh the order summary display
}

function removeBeverage() {
    sessionStorage.removeItem('beverage'); 
    sessionStorage.removeItem('condiments');
    location.href = 'selectBeverage.html'; 
}

function displayOrder() {
    const orderSummary = document.getElementById('orderSummary');
    const beverage = sessionStorage.getItem('beverage');
    const condiments = JSON.parse(sessionStorage.getItem('condiments') || '[]');

    // Initialize the order summary with the beverage information
    let displayHtml = `<strong>Order Summary:</strong><br>`;
    if (beverage) {
        displayHtml += `<span class="clickable" onclick="removeBeverage()">${beverage}</span><br>`;
    } else {
        displayHtml += "No beverage selected.<br>"; 
    }

    if (condiments.length > 0) {
        displayHtml += `Condiments:<br>`;
        condiments.forEach((condiment, index) => {
            displayHtml += `<span class="clickable" onclick="removeCondiment(${index})">${condiment}</span><br>`;
        });
    }

    orderSummary.innerHTML = displayHtml;
}

function confirmOrder() {
    const beverage = sessionStorage.getItem('beverage');
    const condiments = JSON.parse(sessionStorage.getItem('condiments') || '[]');

    // Prepare the order data
    const orderData = {
        beverage: beverage,
        condiments: condiments,
    };

    fetch('http://localhost:8080/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        sessionStorage.setItem('orderConfirmation', JSON.stringify(data));
        window.location.href = 'orderConfirmation.html'; 
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('There was an error submitting your order. Please try again.');
    });
}