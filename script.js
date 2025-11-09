// Product database
const products = {
    electronics: [
        { id: 1, name: "Wireless Headphones", price: 79.99, category: "electronics" },
        { id: 2, name: "Smartphone", price: 699.99, category: "electronics" },
        { id: 3, name: "Laptop", price: 999.99, category: "electronics" }
    ],
    clothing: [
        { id: 4, name: "T-Shirt", price: 24.99, category: "clothing" },
        { id: 5, name: "Jeans", price: 59.99, category: "clothing" },
        { id: 6, name: "Jacket", price: 129.99, category: "clothing" }
    ]
};

let cart = [];

function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    // Add user message to chat
    addMessage(message, true);
    userInput.value = '';
    
    // Process and generate bot response
    setTimeout(() => {
        processMessage(message);
    }, 500);
}

function addMessage(message, isUser = false) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function processMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        addMessage("Hello! I can help you shop for products. Try asking about electronics or clothing!");
    } else if (lowerMessage.includes('electron')) {
        showProducts('electronics');
    } else if (lowerMessage.includes('cloth')) {
        showProducts('clothing');
    } else {
        addMessage("I'm not sure I understand. You can ask me about products or say hello!");
    }
}

function showProducts(category) {
    const categoryProducts = products[category];
    let response = `Here are our ${category} products:<br><br>`;
    
    categoryProducts.forEach(product => {
        response += `<strong>${product.name}</strong> - $${product.price}<br>`;
    });
    
    addMessage(response);
}

// Allow pressing Enter to send message
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});