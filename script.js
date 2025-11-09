// Enhanced Product Database
const products = {
    electronics: [
        { 
            id: 1, 
            name: "Wireless Bluetooth Headphones", 
            price: 79.99, 
            category: "electronics",
            description: "Noise-cancelling wireless headphones with 30hr battery life",
            tags: ["audio", "headphones", "wireless", "bluetooth", "music"]
        },
        { 
            id: 2, 
            name: "Smartphone Pro", 
            price: 699.99, 
            category: "electronics",
            description: "Latest smartphone with advanced camera and 5G connectivity",
            tags: ["phone", "mobile", "smartphone", "5g", "camera"]
        },
        { 
            id: 3, 
            name: "Gaming Laptop", 
            price: 1299.99, 
            category: "electronics",
            description: "High-performance gaming laptop with RGB keyboard",
            tags: ["laptop", "gaming", "computer", "gaming laptop", "rgb"]
        },
        { 
            id: 4, 
            name: "Smart Watch", 
            price: 199.99, 
            category: "electronics",
            description: "Fitness tracker with heart rate monitor and GPS",
            tags: ["watch", "smartwatch", "fitness", "health", "gps"]
        },
        { 
            id: 5, 
            name: "Tablet", 
            price: 399.99, 
            category: "electronics",
            description: "10-inch tablet with stylus support",
            tags: ["tablet", "ipad", "drawing", "entertainment"]
        }
    ],
    clothing: [
        { 
            id: 6, 
            name: "Cotton T-Shirt", 
            price: 24.99, 
            category: "clothing",
            description: "100% cotton crew neck t-shirt in various colors",
            tags: ["tshirt", "shirt", "cotton", "casual", "basic"]
        },
        { 
            id: 7, 
            name: "Denim Jeans", 
            price: 59.99, 
            category: "clothing",
            description: "Slim fit denim jeans with stretch comfort",
            tags: ["jeans", "denim", "pants", "slim fit", "casual"]
        },
        { 
            id: 8, 
            name: "Winter Jacket", 
            price: 129.99, 
            category: "clothing",
            description: "Waterproof winter jacket with thermal insulation",
            tags: ["jacket", "winter", "coat", "waterproof", "warm"]
        },
        { 
            id: 9, 
            name: "Running Shoes", 
            price: 89.99, 
            category: "clothing",
            description: "Lightweight running shoes with cushion support",
            tags: ["shoes", "running", "sneakers", "athletic", "sports"]
        },
        { 
            id: 10, 
            name: "Summer Dress", 
            price: 45.99, 
            category: "clothing",
            description: "Light floral summer dress with comfortable fit",
            tags: ["dress", "summer", "floral", "casual", "fashion"]
        }
    ],
    home: [
        { 
            id: 11, 
            name: "Ceramic Coffee Mug Set", 
            price: 29.99, 
            category: "home",
            description: "Set of 4 ceramic coffee mugs with modern design",
            tags: ["mug", "coffee", "ceramic", "kitchen", "drinkware"]
        },
        { 
            id: 12, 
            name: "Desk Lamp", 
            price: 34.99, 
            category: "home",
            description: "LED adjustable desk lamp with touch controls",
            tags: ["lamp", "desk", "led", "lighting", "office"]
        },
        { 
            id: 13, 
            name: "Throw Pillow", 
            price: 19.99, 
            category: "home",
            description: "Decorative velvet throw pillow for sofa",
            tags: ["pillow", "decor", "home", "sofa", "comfort"]
        },
        { 
            id: 14, 
            name: "Kitchen Blender", 
            price: 49.99, 
            category: "home",
            description: "High-speed blender for smoothies and food prep",
            tags: ["blender", "kitchen", "smoothie", "appliance", "cooking"]
        }
    ],
    books: [
        { 
            id: 15, 
            name: "JavaScript Programming Guide", 
            price: 34.99, 
            category: "books",
            description: "Comprehensive guide to modern JavaScript programming",
            tags: ["book", "javascript", "programming", "coding", "web"]
        },
        { 
            id: 16, 
            name: "Cookbook: Healthy Recipes", 
            price: 24.99, 
            category: "books",
            description: "Collection of healthy and easy-to-make recipes",
            tags: ["cookbook", "recipes", "cooking", "healthy", "food"]
        }
    ]
};

// Shopping cart
let cart = [];

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
            
            if ((lowerQuery.includes('cheap') || lowerQuery.includes('budget') || lowerQuery.includes('affordable')) && product.price < 50) {
                score += 3;
            }
            
            if ((lowerQuery.includes('expensive') || lowerQuery.includes('premium') || lowerQuery.includes('luxury')) && product.price > 100) {
                score += 3;
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
        .slice(0, 6) // Limit to top 6 results
        .map(item => item.product);
}

// Helper function to extract search query
function extractSearchQuery(message) {
    const searchPrefixes = ['find', 'search', 'look for', 'show me', 'i want', 'need', 'looking for'];
    let query = message.toLowerCase();
    
    // Remove common prefixes to get the actual search term
    searchPrefixes.forEach(prefix => {
        if (query.startsWith(prefix)) {
            query = query.substring(prefix.length).trim();
        }
        // Also check if prefix appears in the middle
        const prefixIndex = query.indexOf(prefix);
        if (prefixIndex > -1) {
            query = query.substring(prefixIndex + prefix.length).trim();
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
    
    let response = `🔍 I found ${results.length} product(s) for "${query}":<br><br>`;
    
    results.forEach(product => {
        response += `
            <div class="product-card">
                <h4>${product.name}</h4>
                <div class="price">$${product.price}</div>
                <p>${product.description}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">🛒 Add to Cart</button>
            </div>
        `;
    });
    
    response += `<br>Try searching for something else or browse categories!`;
    
    addMessage(response);
}

// Show products by category
function showProducts(category) {
    const categoryProducts = products[category];
    let response = `🏷️ Here are our ${category} products:<br><br>`;
    
    categoryProducts.forEach(product => {
        response += `
            <div class="product-card">
                <h4>${product.name}</h4>
                <div class="price">$${product.price}</div>
                <p>${product.description}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">🛒 Add to Cart</button>
            </div>
        `;
    });
    
    response += `<br>Want to see more? Try searching for specific items!`;
    
    addMessage(response);
}

// Add to cart functionality
function addToCart(productId) {
    // Find product in all categories
    let product = null;
    for (const category in products) {
        product = products[category].find(p => p.id === productId);
        if (product) break;
    }
    
    if (product) {
        cart.push(product);
        addMessage(`✅ Added <strong>${product.name}</strong> to your cart! 🛒<br><br>` +
            `<div class="quick-replies">` +
            `<button class="quick-reply" onclick="handleQuickReply('Show cart')">View Cart (${cart.length})</button>` +
            `<button class="quick-reply" onclick="handleQuickReply('Continue shopping')">Continue Shopping</button>` +
            `</div>`);
    } else {
        addMessage("❌ Sorry, I couldn't find that product. Please check the product number and try again.");
    }
}

// Show cart contents
function showCart() {
    if (cart.length === 0) {
        addMessage("🛒 Your cart is empty. Browse our categories to add items!" +
            addQuickReplies());
        return;
    }
    
    let response = "<strong>🛒 Your Shopping Cart</strong><br><br>";
    let total = 0;
    
    cart.forEach((item, index) => {
        response += `• ${item.name} - $${item.price}<br>`;
        total += item.price;
    });
    
    response += `<br><strong>💰 Total: $${total.toFixed(2)}</strong><br><br>` +
        "<div class='quick-replies'>" +
        `<button class='quick-reply' onclick='handleQuickReply("Checkout")'>💳 Checkout</button>` +
        `<button class='quick-reply' onclick='handleQuickReply("Clear cart")'>🗑️ Clear Cart</button>` +
        `<button class='quick-reply' onclick='handleQuickReply("Continue shopping")'>🛍️ Continue Shopping</button>` +
        "</div>";
    
    addMessage(response);
}

// Clear cart
function clearCart() {
    cart = [];
    addMessage("🗑️ Your cart has been cleared." + addQuickReplies());
}

// Checkout process
function checkout() {
    if (cart.length === 0) {
        addMessage("Your cart is empty. Add some items first!");
        return;
    }
    
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    
    addMessage(`💳 Checkout Complete!<br><br>` +
        `You purchased ${cart.length} item(s) for $${total.toFixed(2)}.<br>` +
        `Thank you for your order! 🎉<br><br>` +
        `<div class="quick-replies">` +
        `<button class="quick-reply" onclick="handleQuickReply('Start new order')">🛍️ Start New Order</button>` +
        `</div>`);
    
    cart = []; // Clear cart after checkout
}

// Quick replies
function addQuickReplies() {
    const quickReplies = [
        'Find headphones',
        'Search for shoes',
        'Show electronics',
        'Budget products',
        'View cart',
        'Help'
    ];
    
    let buttonsHTML = '<div class="quick-replies">';
    quickReplies.forEach(reply => {
        buttonsHTML += `<button class="quick-reply" onclick="handleQuickReply('${reply}')">${reply}</button>`;
    });
    buttonsHTML += '</div>';
    
    return buttonsHTML;
}

function handleQuickReply(text) {
    document.getElementById('userInput').value = text;
    sendMessage();
}

// Main message processing
function processMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        addMessage("👋 Hello! I'm your shopping assistant. I can help you find products, compare prices, and manage your cart!" +
            addQuickReplies());
        return;
    }
    
    // Product search
    if (lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('look for') || 
        lowerMessage.includes('show me') || lowerMessage.includes('i want') || lowerMessage.includes('need') ||
        lowerMessage.includes('looking for')) {
        
        let searchQuery = extractSearchQuery(message);
        
        if (searchQuery && searchQuery.length > 1) {
            performSearch(searchQuery);
        } else {
            addMessage("What would you like me to search for? Try something like 'search for headphones' or 'find running shoes'.");
        }
        return;
    }
    
    // Price-based searches
    if (lowerMessage.includes('under') || lowerMessage.includes('cheap') || lowerMessage.includes('budget') || 
        lowerMessage.includes('expensive') || lowerMessage.includes('affordable') || lowerMessage.includes('price')) {
        performSearch(message);
        return;
    }
    
    // Category browsing
    if (lowerMessage.includes('electron') || lowerMessage.includes('tech') || lowerMessage.includes('gadget')) {
        showProducts('electronics');
        return;
    }
    
    if (lowerMessage.includes('cloth') || lowerMessage.includes('fashion') || lowerMessage.includes('wear') || lowerMessage.includes('dress')) {
        showProducts('clothing');
        return;
    }
    
    if (lowerMessage.includes('home') || lowerMessage.includes('decor') || lowerMessage.includes('furniture') || lowerMessage.includes('kitchen')) {
        showProducts('home');
        return;
    }
    
    if (lowerMessage.includes('book') || lowerMessage.includes('read')) {
        showProducts('books');
        return;
    }
    
    // Cart operations
    if (lowerMessage.includes('cart') || lowerMessage.includes('basket')) {
        showCart();
        return;
    }
    
    if (lowerMessage.includes('clear cart') || lowerMessage.includes('empty cart')) {
        clearCart();
        return;
    }
    
    if (lowerMessage.includes('checkout') || lowerMessage.includes('buy') || lowerMessage.includes('purchase')) {
        checkout();
        return;
    }
    
    if (lowerMessage.includes('continue shopping') || lowerMessage.includes('start new order')) {
        addMessage("🛍️ Great! What would you like to browse?" + addQuickReplies());
        return;
    }
    
    // Help
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
        addMessage("🛍️ <strong>I can help you with:</strong><br>" +
            "• <strong>Search products</strong>: 'find headphones', 'search for running shoes'<br>" +
            "• <strong>Filter by price</strong>: 'products under $50', 'cheap electronics'<br>" +
            "• <strong>Browse categories</strong>: electronics, clothing, home, books<br>" +
            "• <strong>Manage cart</strong>: view cart, add items, checkout<br><br>" +
            "What would you like to do?" + addQuickReplies());
        return;
    }
    
    // Thank you
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        addMessage("You're welcome! 😊 Is there anything else I can help you with?" + addQuickReplies());
        return;
    }
    
    // Default - try to interpret as search
    if (message.length > 2) {
        performSearch(message);
    } else {
        addMessage("I'm here to help with your shopping! Try searching for products or asking for help." + addQuickReplies());
    }
}

// Chat functions
function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    addMessage(message, true);
    userInput.value = '';
    
    // Show typing indicator
    const typingIndicator = showTypingIndicator();
    
    // Simulate processing delay
    setTimeout(() => {
        hideTypingIndicator();
        processMessage(message);
    }, 800 + Math.random() * 800);
}

function addMessage(message, isUser = false) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = message;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot';
    typingDiv.id = 'typingIndicator';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content typing-indicator';
    contentDiv.innerHTML = 'Thinking<span class="typing-dots"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></span>';
    
    typingDiv.appendChild(contentDiv);
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return typingDiv;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Initialize chat
document.addEventListener('DOMContentLoaded', function() {
    // Add welcome message after a short delay
    setTimeout(() => {
        addMessage("👋 Welcome to your personal shopping assistant! I can help you find products, compare prices, and manage your cart. What would you like to do?" + addQuickReplies());
    }, 1000);
});

// Allow pressing Enter to send message
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
