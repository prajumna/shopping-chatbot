// Indian E-commerce Websites Configuration
const websites = {
    amazon: {
        name: "Amazon India",
        color: "#FF9900",
        icon: "📦",
        searchUrl: "https://www.amazon.in/s?k=QUERY",
        baseUrl: "https://www.amazon.in"
    },
    flipkart: {
        name: "Flipkart",
        color: "#047BD5", 
        icon: "📱",
        searchUrl: "https://www.flipkart.com/search?q=QUERY",
        baseUrl: "https://www.flipkart.com"
    },
    myntra: {
        name: "Myntra", 
        color: "#FF3F6C",
        icon: "👕",
        searchUrl: "https://www.myntra.com/QUERY",
        baseUrl: "https://www.myntra.com"
    },
    ajio: {
        name: "Ajio",
        color: "#000000",
        icon: "🛍️", 
        searchUrl: "https://www.ajio.com/search/?text=QUERY",
        baseUrl: "https://www.ajio.com"
    },
    snapdeal: {
        name: "Snapdeal",
        color: "#CB202D",
        icon: "🛒",
        searchUrl: "https://www.snapdeal.com/search?keyword=QUERY",
        baseUrl: "https://www.snapdeal.com"
    }
};

// Sample product database for recommendations (optional)
const sampleProducts = {
    electronics: [
        { name: "Wireless Headphones", category: "electronics", keywords: ["headphones", "earphones", "audio"] },
        { name: "Smartphone", category: "electronics", keywords: ["mobile", "phone", "android", "ios"] },
        { name: "Laptop", category: "electronics", keywords: ["notebook", "computer", "macbook", "windows"] }
    ],
    clothing: [
        { name: "T-Shirts", category: "clothing", keywords: ["tshirt", "tee", "cotton"] },
        { name: "Jeans", category: "clothing", keywords: ["denim", "pants", "trousers"] },
        { name: "Running Shoes", category: "clothing", keywords: ["sneakers", "sports", "athletic"] }
    ],
    home: [
        { name: "Kitchen Appliances", category: "home", keywords: ["kitchen", "cooking", "appliances"] },
        { name: "Home Decor", category: "home", keywords: ["decor", "furniture", "home"] }
    ]
};

// Shopping cart for tracking user interests
let cart = [];
let searchHistory = [];
let currentWebsiteFilter = null;

// Generate search URLs for any product
function generateProductSearchLinks(productName) {
    const encodedQuery = encodeURIComponent(productName);
    let links = {};
    
    for (const website in websites) {
        links[website] = websites[website].searchUrl.replace("QUERY", encodedQuery);
    }
    
    return links;
}

// Extract product name from user message
function extractProductName(message) {
    const lowerMessage = message.toLowerCase();
    
    // Remove search prefixes
    const prefixes = [
        'find', 'search', 'look for', 'show me', 'i want', 'need', 
        'looking for', 'buy', 'purchase', 'get', 'where can i find',
        'price of', 'cost of', 'shop for', 'find me'
    ];
    
    let productName = message;
    
    // Remove prefixes
    prefixes.forEach(prefix => {
        if (lowerMessage.startsWith(prefix)) {
            productName = productName.substring(prefix.length).trim();
        }
        const prefixIndex = lowerMessage.indexOf(prefix + ' ');
        if (prefixIndex > -1) {
            productName = productName.substring(prefixIndex + prefix.length).trim();
        }
    });
    
    // Remove question marks and common suffixes
    productName = productName.replace(/[?]/g, '').trim();
    productName = productName.replace(/(please|pls|thanks|thank you|on amazon|on flipkart|online)/gi, '').trim();
    
    return productName;
}

// Generate website buttons for any product
function generateWebsiteButtons(productName) {
    const searchLinks = generateProductSearchLinks(productName);
    let buttonsHTML = '<div class="website-buttons-container">';
    
    buttonsHTML += `<div class="website-buttons-header">🛍️ Search "${productName}" on:</div>`;
    buttonsHTML += '<div class="website-buttons-grid">';
    
    for (const website in websites) {
        const site = websites[website];
        buttonsHTML += `
            <a href="${searchLinks[website]}" target="_blank" class="website-btn" style="background: ${site.color}">
                ${site.icon} ${site.name}
            </a>
        `;
    }
    
    buttonsHTML += '</div></div>';
    return buttonsHTML;
}

// Get price comparison for a product
function generatePriceComparison(productName) {
    const searchLinks = generateProductSearchLinks(productName);
    
    let comparisonHTML = `
        <div class="price-comparison">
            <div class="comparison-header">💰 Price Comparison for "${productName}"</div>
            <div class="comparison-grid">
    `;
    
    for (const website in websites) {
        const site = websites[website];
        comparisonHTML += `
            <div class="comparison-card">
                <div class="website-icon" style="color: ${site.color}">${site.icon}</div>
                <div class="website-name">${site.name}</div>
                <div class="price-placeholder">Check website for price</div>
                <a href="${searchLinks[website]}" target="_blank" class="check-price-btn">Check Price</a>
            </div>
        `;
    }
    
    comparisonHTML += '</div></div>';
    return comparisonHTML;
}

// Smart product category detection
function detectProductCategory(productName) {
    const lowerName = productName.toLowerCase();
    
    const categories = {
        electronics: ['phone', 'mobile', 'laptop', 'headphone', 'earphone', 'tablet', 'camera', 'tv', 'smartwatch', 'charger', 'cable', 'electronic', 'tech'],
        clothing: ['shirt', 'tshirt', 'jeans', 'pant', 'dress', 'shoe', 'sneaker', 'jacket', 'hoodie', 'sweater', 'cloth', 'fashion', 'wear'],
        home: ['furniture', 'sofa', 'chair', 'table', 'bed', 'mattress', 'lamp', 'decor', 'kitchen', 'appliance', 'cookware', 'home'],
        books: ['book', 'novel', 'textbook', 'stationery', 'pen', 'notebook'],
        sports: ['sports', 'cricket', 'football', 'bat', 'ball', 'fitness', 'gym', 'yoga'],
        beauty: ['cosmetic', 'makeup', 'skincare', 'beauty', 'perfume', 'cream', 'lotion']
    };
    
    for (const category in categories) {
        if (categories[category].some(keyword => lowerName.includes(keyword))) {
            return category;
        }
    }
    
    return 'general';
}

// Get similar product suggestions
function getSimilarProducts(productName) {
    const category = detectProductCategory(productName);
    const similarProducts = sampleProducts[category] || [];
    
    if (similarProducts.length === 0) return '';
    
    let suggestionsHTML = '<div class="suggestions-container">';
    suggestionsHTML += '<div class="suggestions-header">💡 You might also like:</div>';
    suggestionsHTML += '<div class="suggestions-grid">';
    
    similarProducts.forEach(product => {
        suggestionsHTML += `
            <div class="suggestion-card" onclick="handleQuickReply('${product.name}')">
                <div class="suggestion-name">${product.name}</div>
                <div class="suggestion-category">${product.category}</div>
            </div>
        `;
    });
    
    suggestionsHTML += '</div></div>';
    return suggestionsHTML;
}

// Main message processing function
function processMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        addMessage("👋 Namaste! I'm your India shopping assistant. I can help you search for any product across Amazon, Flipkart, Myntra, Ajio, and Snapdeal! Just tell me what you're looking for." +
            addQuickReplies());
        return;
    }
    
    // Help command
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
        addMessage("🛍️ <strong>I can help you shop from Indian websites:</strong><br>" +
            "• <strong>Search any product</strong> across 5 major Indian sites<br>" +
            "• <strong>Price comparison</strong> between different websites<br>" +
            "• <strong>Product recommendations</strong> and suggestions<br>" +
            "• <strong>Track your searches</strong> and interests<br><br>" +
            "<strong>Supported websites:</strong> Amazon India, Flipkart, Myntra, Ajio, Snapdeal<br><br>" +
            "Just tell me what you want to buy!" + addQuickReplies());
        return;
    }
    
    // Show search history
    if (lowerMessage.includes('history') || lowerMessage.includes('previous') || lowerMessage.includes('searches')) {
        showSearchHistory();
        return;
    }
    
    // Clear history
    if (lowerMessage.includes('clear history')) {
        searchHistory = [];
        addMessage("🗑️ Your search history has been cleared." + addQuickReplies());
        return;
    }
    
    // Thank you
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        addMessage("You're welcome! 😊 Happy shopping! Let me know if you need help with anything else." + addQuickReplies());
        return;
    }
    
    // Handle product search
    handleProductSearch(message);
}

// Handle any product search
function handleProductSearch(message) {
    const productName = extractProductName(message);
    
    if (!productName || productName.length < 2) {
        addMessage("Please tell me what product you're looking for. For example: 'I want to buy a smartphone' or 'Find running shoes for me'." +
            addQuickReplies());
        return;
    }
    
    // Add to search history
    if (!searchHistory.includes(productName.toLowerCase())) {
        searchHistory.unshift(productName.toLowerCase());
        // Keep only last 10 searches
        if (searchHistory.length > 10) {
            searchHistory.pop();
        }
    }
    
    const category = detectProductCategory(productName);
    
    let response = `🔍 Searching for "<strong>${productName}</strong>"...<br>`;
    response += `<small>Category: ${category.charAt(0).toUpperCase() + category.slice(1)}</small><br><br>`;
    
    // Add website buttons
    response += generateWebsiteButtons(productName);
    
    // Add price comparison
    response += generatePriceComparison(productName);
    
    // Add similar products suggestions
    response += getSimilarProducts(productName);
    
    addMessage(response);
}

// Show search history
function showSearchHistory() {
    if (searchHistory.length === 0) {
        addMessage("You haven't searched for anything yet. Try searching for a product!" + addQuickReplies());
        return;
    }
    
    let response = "📋 <strong>Your Recent Searches:</strong><br><br>";
    
    searchHistory.forEach((search, index) => {
        response += `${index + 1}. <span class="history-item" onclick="handleQuickReply('${search}')">${search}</span><br>`;
    });
    
    response += `<br><div class="quick-replies">
        <button class="quick-reply" onclick="handleQuickReply('Clear history')">🗑️ Clear History</button>
        <button class="quick-reply" onclick="handleQuickReply('Start new search')">🔄 New Search</button>
    </div>`;
    
    addMessage(response);
}

// Quick replies for common products
function addQuickReplies() {
    const quickReplies = [
        'Smartphone',
        'Laptop',
        'Headphones',
        'Running Shoes',
        'Jeans',
        'T-Shirts',
        'Kitchen appliances',
        'Show search history'
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
    contentDiv.innerHTML = 'Searching across Indian websites<span class="typing-dots"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></span>';
    
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
        addMessage("👋 Namaste! Welcome to your personal India shopping assistant! 🇮🇳<br><br>I can help you search for <strong>any product</strong> across:<br>• Amazon India<br>• Flipkart<br>• Myntra<br>• Ajio<br>• Snapdeal<br><br>Just tell me what you want to buy!" + addQuickReplies());
    }, 1000);
});

// Allow pressing Enter to send message
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
