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
function processMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        addMessage("Hello! 👋 I can help you find products. Try searching for specific items like 'headphones', 'shoes', or 'affordable electronics'!" +
            addQuickReplies());
        return;
    }
    
    // Product search
    if (lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('look for') || 
        lowerMessage.includes('show me') || lowerMessage.includes('i want') || lowerMessage.includes('need')) {
        
        // Extract search query from the message
        let searchQuery = extractSearchQuery(message);
        
        if (searchQuery) {
            performSearch(searchQuery);
        } else {
            addMessage("What would you like me to search for? Try something like 'search for headphones' or 'find running shoes'.");
        }
        return;
    }
    
    // Price-based searches
    if (lowerMessage.includes('under') || lowerMessage.includes('cheap') || lowerMessage.includes('budget') || 
        lowerMessage.includes('expensive') || lowerMessage.includes('affordable')) {
        performSearch(message);
        return;
    }
    
    // Category browsing
    if (lowerMessage.includes('electron') || lowerMessage.includes('tech')) {
        showProducts('electronics');
        return;
    }
    
    if (lowerMessage.includes('cloth') || lowerMessage.includes('fashion') || lowerMessage.includes('wear')) {
        showProducts('clothing');
        return;
    }
    
    if (lowerMessage.includes('home') || lowerMessage.includes('decor') || lowerMessage.includes('furniture')) {
        showProducts('home');
        return;
    }
    
    // Cart operations
    if (lowerMessage.includes('cart') || lowerMessage.includes('basket')) {
        showCart();
        return;
    }
    
    // Help
    if (lowerMessage.includes('help')) {
        addMessage("I can help you:<br>" +
            "• <strong>Search products</strong>: 'find headphones', 'search for running shoes'<br>" +
            "• <strong>Filter by price</strong>: 'products under $50', 'cheap electronics'<br>" +
            "• <strong>Browse categories</strong>: electronics, clothing, home<br>" +
            "• <strong>Manage cart</strong>: view cart, add items<br><br>" +
            "What would you like to do?" + addQuickReplies());
        return;
    }
    
    // Default - try to interpret as search
    performSearch(message);
}

// Helper function to extract search query
function extractSearchQuery(message) {
    const searchPrefixes = ['find', 'search', 'look for', 'show me', 'i want', 'need'];
    let query = message.toLowerCase();
    
    // Remove common prefixes to get the actual search term
    searchPrefixes.forEach(prefix => {
        if (query.startsWith(prefix)) {
            query = query.substring(prefix.length).trim();
        }
    });
    
    // Remove question marks and other punctuation
    query = query.replace(/[?]/g, '').trim();
    
    return query || message;
}

// Function to perform and display search
function performSearch(query) {
    const results = searchProducts(query);
    
    if (results.length === 0) {
        addMessage(`I couldn't find any products matching "${query}". Try different keywords or browse categories.` +
            addQuickReplies());
        return;
    }
    
    let response = `I found ${results.length} product(s) for "${query}":<br><br>`;
    
    results.forEach(product => {
        response += `
            <div class="product-card">
                <h4>${product.name}</h4>
                <div class="price">$${product.price}</div>
                <p>${product.description}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
    });
    
    response += `<br>Try searching for something else or browse categories!`;
    
    addMessage(response);
}

