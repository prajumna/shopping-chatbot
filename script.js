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
// Smart product search function
function searchProducts(query) {
    const lowerQuery = query.toLowerCase().trim();
    const results = [];
    
    // If query is empty, return some featured products
    if (!lowerQuery) {
        return [
            products.electronics[0],
            products.clothing[0], 
            products.home[0]
        ];
    }
    
    // Search through all products
    for (const category in products) {
        products[category].forEach(product => {
            let score = 0;
            
            // Exact name match (highest priority)
            if (product.name.toLowerCase().includes(lowerQuery)) {
                score += 10;
            }
            
            // Description match
            if (product.description.toLowerCase().includes(lowerQuery)) {
                score += 5;
            }
            
            // Tag matches
            product.tags.forEach(tag => {
                if (tag.toLowerCase().includes(lowerQuery)) {
                    score += 3;
                }
            });
            
            // Category match
            if (product.category.toLowerCase().includes(lowerQuery)) {
                score += 2;
            }
            
            // Price search (e.g., "under 50", "cheap", "expensive")
            if (lowerQuery.includes('under') || lowerQuery.includes('less than') || lowerQuery.includes('below')) {
                const priceMatch = lowerQuery.match(/(\d+)/);
                if (priceMatch && product.price <= parseInt(priceMatch[1])) {
                    score += 4;
                }
            }
            
            if (lowerQuery.includes('cheap') || lowerQuery.includes('budget') || lowerQuery.includes('affordable')) {
                if (product.price < 50) score += 3;
            }
            
            if (lowerQuery.includes('expensive') || lowerQuery.includes('premium') || lowerQuery.includes('luxury')) {
                if (product.price > 100) score += 3;
            }
            
            // Add to results if score is above threshold
            if (score > 0) {
                results.push({
                    product: product,
                    score: score
                });
            }
        });
    }
    
    // Sort by score (highest first) and return only products
    return results
        .sort((a, b) => b.score - a.score)
        .slice(0, 5) // Limit to top 5 results
        .map(item => item.product);
} 
