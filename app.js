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
    let condiments = sessionStorage.getItem('condiments') ? JSON.parse(sessionStorage.getItem('condiments')) : [];
    const index = condiments.indexOf(condiment);

    if (index > -1) {
        condiments.splice(index, 1); 
    } else {
        condiments.push(condiment);
    }

    sessionStorage.setItem('condiments', JSON.stringify(condiments)); 
    displayOrder(); 
}

function removeCondiment(index) {
    let condiments = JSON.parse(sessionStorage.getItem('condiments') || '[]');
    condiments.splice(index, 1); 
    sessionStorage.setItem('condiments', JSON.stringify(condiments)); 
    displayOrder(); 
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
        const orderDetails = document.getElementById('orderDetails');
        orderDetails.innerHTML = `
            <p><strong>Order ID:</strong> ${data.id}</p>
            <p><strong>Description:</strong> ${data.description}</p>
            <p><strong>Cost:</strong> ${data.cost}</p>
        `;

    })
    .catch((error) => {
        console.error('Error:', error);
        alert('There was an error submitting your order. Please try again.');
    });
}