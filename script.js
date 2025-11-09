// Advanced AI Shopping Assistant with Real-time Interaction
class ShoppingAI {
    constructor() {
        this.conversationState = 'greeting';
        this.userPreferences = {
            budget: null,
            brand: null,
            size: null,
            color: null,
            category: null,
            features: []
        };
        this.currentProduct = null;
        this.searchResults = [];
        this.conversationHistory = [];
    }

    // Indian E-commerce Websites Configuration
    websites = {
        amazon: {
            name: "Amazon India",
            color: "#FF9900",
            icon: "📦",
            searchUrl: "https://www.amazon.in/s?k=QUERY&rh=PARAMS",
            baseUrl: "https://www.amazon.in",
            params: {
                price_low: "p_36%3Aprice-low-",
                price_high: "p_36%3Aprice-high-",
                brand: "p_89%3A"
            }
        },
        flipkart: {
            name: "Flipkart",
            color: "#047BD5",
            icon: "📱",
            searchUrl: "https://www.flipkart.com/search?q=QUERY&PARAMS",
            baseUrl: "https://www.flipkart.com",
            params: {
                price_low: "p%5B%5D=facets.price_range.from%3D",
                price_high: "p%5B%5D=facets.price_range.to%3D",
                brand: "p%5B%5D=facets.brand%255B%255D%3D"
            }
        },
        myntra: {
            name: "Myntra",
            color: "#FF3F6C",
            icon: "👕",
            searchUrl: "https://www.myntra.com/QUERY?rawQuery=QUERY&PARAMS",
            baseUrl: "https://www.myntra.com",
            params: {
                price_low: "pl=",
                price_high: "ph=",
                brand: "p%5B%5D=brand%3A"
            }
        },
        ajio: {
            name: "Ajio",
            color: "#000000",
            icon: "🛍️",
            searchUrl: "https://www.ajio.com/search/?text=QUERY&PARAMS",
            baseUrl: "https://www.ajio.com",
            params: {
                price_low: "minPrice=",
                price_high: "maxPrice=",
                brand: "brand="
            }
        },
        snapdeal: {
            name: "Snapdeal",
            color: "#CB202D",
            icon: "🛒",
            searchUrl: "https://www.snapdeal.com/search?keyword=QUERY&PARAMS",
            baseUrl: "https://www.snapdeal.com",
            params: {
                price_low: "sort=plrty&",
                brand: "&brand%5B%5D="
            }
        }
    };

    // Product categories and attributes
    categories = {
        electronics: {
            name: "Electronics",
            attributes: ['brand', 'price', 'features', 'color', 'storage', 'ram'],
            questions: [
                "What's your budget for this device?",
                "Any preferred brand? (Samsung, Apple, OnePlus, etc.)",
                "Any specific features you need? (camera quality, battery life, etc.)"
            ]
        },
        clothing: {
            name: "Clothing",
            attributes: ['brand', 'price', 'size', 'color', 'material', 'occasion'],
            questions: [
                "What's your budget range?",
                "What size are you looking for?",
                "Any preferred color or style?"
            ]
        },
        home: {
            name: "Home & Kitchen",
            attributes: ['brand', 'price', 'color', 'material', 'features'],
            questions: [
                "What's your budget for this item?",
                "Any specific brand preferences?",
                "What features are important to you?"
            ]
        }
    };

    // Initialize the AI
    init() {
        this.addToConversation("bot", "👋 Namaste! I'm your advanced AI shopping assistant! I can help you find the perfect products across Indian websites. What would you like to shop for today?");
        this.showPreferencePanel();
    }

    // Process user message with AI-like interaction
    async processUserMessage(message) {
        this.addToConversation("user", message);
        this.conversationHistory.push({ role: "user", content: message });

        // Show typing indicator
        this.showTypingIndicator();

        // Simulate AI processing time
        await this.delay(1000 + Math.random() * 1000);

        this.hideTypingIndicator();

        const response = await this.generateAIResponse(message);
        this.addToConversation("bot", response);
        this.conversationHistory.push({ role: "bot", content: response });

        // Update preference panel
        this.updatePreferencePanel();
    }

    // AI Response Generation
    async generateAIResponse(message) {
        const lowerMessage = message.toLowerCase();

        switch (this.conversationState) {
            case 'greeting':
                return this.handleGreeting(lowerMessage);
            
            case 'identifying_product':
                return this.handleProductIdentification(lowerMessage);
            
            case 'gathering_preferences':
                return this.handlePreferenceGathering(lowerMessage);
            
            case 'showing_results':
                return this.handleResultsInteraction(lowerMessage);
            
            default:
                return this.handleGeneralQuery(lowerMessage);
        }
    }

    // Handle greeting phase
    handleGreeting(message) {
        this.conversationState = 'identifying_product';
        return "Great! Let me help you find the perfect product. What are you looking for? You can say things like 'I want a smartphone', 'Looking for running shoes', or 'Need a kitchen mixer'.";
    }

    // Handle product identification
    handleProductIdentification(message) {
        const productInfo = this.extractProductInfo(message);
        
        if (!productInfo.category) {
            return "I want to make sure I find the right products for you. Could you tell me more specifically what you're looking for? For example: 'gaming laptop', 'wireless headphones', or 'winter jacket'.";
        }

        this.currentProduct = productInfo;
        this.userPreferences.category = productInfo.category;
        this.conversationState = 'gathering_preferences';

        const categoryInfo = this.categories[productInfo.category];
        return `Perfect! You're looking for ${productInfo.name}. ${categoryInfo.questions[0]}`;
    }

    // Handle preference gathering with smart follow-up questions
    handlePreferenceGathering(message) {
        const lowerMessage = message.toLowerCase();
        const category = this.categories[this.userPreferences.category];

        // Extract preferences from message
        this.extractPreferences(message);

        // Check what preferences we still need
        const missingPreferences = this.getMissingPreferences();

        if (missingPreferences.length > 0) {
            const nextQuestion = this.getNextPreferenceQuestion(missingPreferences[0]);
            return nextQuestion;
        } else {
            // All preferences gathered, show results
            this.conversationState = 'showing_results';
            const results = this.generateSmartSearchResults();
            return this.formatResultsResponse(results);
        }
    }

    // Handle interactions while showing results
    handleResultsInteraction(message) {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('change') || lowerMessage.includes('different')) {
            if (lowerMessage.includes('budget')) {
                this.userPreferences.budget = null;
                this.conversationState = 'gathering_preferences';
                return "Sure! What's your new budget range?";
            }
            if (lowerMessage.includes('brand')) {
                this.userPreferences.brand = null;
                this.conversationState = 'gathering_preferences';
                return "What brand would you prefer instead?";
            }
            if (lowerMessage.includes('size') || lowerMessage.includes('color')) {
                this.conversationState = 'gathering_preferences';
                return "What specific size/color are you looking for?";
            }
        }

        if (lowerMessage.includes('more') || lowerMessage.includes('other') || lowerMessage.includes('another')) {
            const results = this.generateSmartSearchResults(true);
            return this.formatResultsResponse(results, true);
        }

        if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
            return "You're welcome! 😊 I'm glad I could help. Is there anything else you'd like to shop for?";
        }

        return "I can help you refine your search further. You can ask to change your budget, brand preference, or see more options. What would you like to do?";
    }

    // Extract product information from user message
    extractProductInfo(message) {
        const lowerMessage = message.toLowerCase();
        
        // Detect category
        let category = 'general';
        for (const [cat, info] of Object.entries(this.categories)) {
            if (info.attributes.some(attr => lowerMessage.includes(attr)) || 
                lowerMessage.includes(cat) || 
                info.name.toLowerCase().includes(lowerMessage)) {
                category = cat;
                break;
            }
        }

        // Extract product name (simple NLP)
        const words = message.split(' ');
        const productWords = words.filter(word => 
            !['i', 'want', 'need', 'looking', 'for', 'a', 'an', 'the', 'to', 'buy', 'shop'].includes(word.toLowerCase())
        );

        return {
            name: productWords.join(' ') || message,
            category: category,
            originalMessage: message
        };
    }

    // Extract user preferences from message
    extractPreferences(message) {
        const lowerMessage = message.toLowerCase();

        // Extract budget
        const budgetMatch = lowerMessage.match(/(\d+)\s*-\s*(\d+)/) || 
                           lowerMessage.match(/(under|below|less than)\s*(\d+)/) ||
                           lowerMessage.match(/(over|above|more than)\s*(\d+)/);
        
        if (budgetMatch) {
            if (budgetMatch[1] && budgetMatch[2]) {
                this.userPreferences.budget = {
                    min: parseInt(budgetMatch[1]),
                    max: parseInt(budgetMatch[2])
                };
            } else if (budgetMatch[2]) {
                if (lowerMessage.includes('under') || lowerMessage.includes('below') || lowerMessage.includes('less than')) {
                    this.userPreferences.budget = { max: parseInt(budgetMatch[2]) };
                } else {
                    this.userPreferences.budget = { min: parseInt(budgetMatch[2]) };
                }
            }
        }

        // Extract brand
        const brands = {
            electronics: ['samsung', 'apple', 'oneplus', 'xiaomi', 'realme', 'oppo', 'vivo', 'nokia'],
            clothing: ['nike', 'adidas', 'puma', 'reebok', 'levis', 'allen solly', 'h&m', 'zara'],
            home: ['prestige', 'milton', 'philips', 'bajaj', 'havells', 'butterfly']
        };

        const categoryBrands = brands[this.userPreferences.category] || [];
        for (const brand of categoryBrands) {
            if (lowerMessage.includes(brand)) {
                this.userPreferences.brand = brand;
                break;
            }
        }

        // Extract size (for clothing)
        if (this.userPreferences.category === 'clothing') {
            const sizeMatch = lowerMessage.match(/(size|sizes)\s*(\w+)/) || 
                             lowerMessage.match(/(\b(xl|l|m|s)\b)/i);
            if (sizeMatch) {
                this.userPreferences.size = sizeMatch[2] || sizeMatch[1];
            }
        }

        // Extract color
        const colors = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'pink', 'purple', 'gray', 'silver', 'gold'];
        for (const color of colors) {
            if (lowerMessage.includes(color)) {
                this.userPreferences.color = color;
                break;
            }
        }
    }

    // Get missing preferences
    getMissingPreferences() {
        const category = this.categories[this.userPreferences.category];
        const missing = [];

        if (!this.userPreferences.budget) missing.push('budget');
        if (!this.userPreferences.brand && category.attributes.includes('brand')) missing.push('brand');
        if (!this.userPreferences.size && category.attributes.includes('size')) missing.push('size');
        if (!this.userPreferences.color && category.attributes.includes('color')) missing.push('color');

        return missing;
    }

    // Get next preference question
    getNextPreferenceQuestion(preference) {
        const questions = {
            budget: "What's your budget range? (e.g., under ₹15000, ₹10000-₹20000)",
            brand: "Any specific brand preference?",
            size: "What size are you looking for?",
            color: "What color would you prefer?"
        };

        return questions[preference] || "Is there anything specific you're looking for in this product?";
    }

    // Generate smart search results with preferences
    generateSmartSearchResults(loadMore = false) {
        const productName = this.currentProduct.name;
        const preferences = this.userPreferences;

        // Generate search URLs with preferences
        const searchResults = [];
        
        for (const [site, config] of Object.entries(this.websites)) {
            let searchUrl = config.searchUrl.replace("QUERY", encodeURIComponent(productName));
            
            // Add preference parameters
            const params = [];
            
            if (preferences.budget) {
                if (preferences.budget.min && config.params.price_low) {
                    params.push(`${config.params.price_low}${preferences.budget.min}`);
                }
                if (preferences.budget.max && config.params.price_high) {
                    params.push(`${config.params.price_high}${preferences.budget.max}`);
                }
            }
            
            if (preferences.brand && config.params.brand) {
                params.push(`${config.params.brand}${encodeURIComponent(preferences.brand)}`);
            }

            if (params.length > 0) {
                searchUrl = searchUrl.replace("PARAMS", params.join('&'));
            } else {
                searchUrl = searchUrl.replace("&PARAMS", "").replace("?PARAMS", "");
            }

            searchResults.push({
                website: site,
                name: config.name,
                color: config.color,
                icon: config.icon,
                url: searchUrl,
                relevance: this.calculateRelevance(site, preferences)
            });
        }

        // Sort by relevance
        searchResults.sort((a, b) => b.relevance - a.relevance);

        if (!loadMore) {
            this.searchResults = searchResults;
        }

        return searchResults;
    }

    // Calculate relevance score for websites based on preferences
    calculateRelevance(website, preferences) {
        let score = 50; // Base score

        // Different websites are better for different categories
        const websiteStrengths = {
            amazon: ['electronics', 'home', 'general'],
            flipkart: ['electronics', 'home', 'clothing'],
            myntra: ['clothing'],
            ajio: ['clothing'],
            snapdeal: ['electronics', 'home']
        };

        if (websiteStrengths[website]?.includes(preferences.category)) {
            score += 30;
        }

        // Budget considerations
        if (preferences.budget) {
            if (preferences.budget.max && preferences.budget.max < 10000) {
                // Lower budget - Snapdeal might be better
                if (website === 'snapdeal') score += 20;
            } else {
                // Higher budget - Amazon/Flipkart might be better
                if (['amazon', 'flipkart'].includes(website)) score += 20;
            }
        }

        return score;
    }

    // Format results response
    formatResultsResponse(results, isMore = false) {
        let response = `🎯 Based on your preferences, here are the best places to search for ${this.currentProduct.name}:<br><br>`;

        response += '<div class="smart-results">';
        
        results.forEach((result, index) => {
            const relevanceStars = '★'.repeat(Math.floor(result.relevance / 20));
            
            response += `
                <div class="smart-result-card" style="border-left: 4px solid ${result.color}">
                    <div class="result-header">
                        <span class="website-icon">${result.icon}</span>
                        <strong>${result.name}</strong>
                        <span class="relevance">${relevanceStars}</span>
                    </div>
                    <div class="result-actions">
                        <a href="${result.url}" target="_blank" class="search-btn" style="background: ${result.color}">
                            🔍 Search Now
                        </a>
                        <button class="preview-btn" onclick="shoppingAI.previewWebsite('${result.website}')">
                            👀 Preview
                        </button>
                    </div>
                </div>
            `;
        });

        response += '</div>';

        response += `<br><div class="results-actions">
            <button class="action-btn" onclick="shoppingAI.refineSearch()">🎛️ Refine Search</button>
            <button class="action-btn" onclick="shoppingAI.startNewSearch()">🔄 New Search</button>
        </div>`;

        if (!isMore) {
            response += `<br><div class="preference-summary">
                <strong>Your Preferences:</strong><br>
                ${this.formatPreferenceSummary()}
            </div>`;
        }

        return response;
    }

    // Format preference summary
    formatPreferenceSummary() {
        const prefs = this.userPreferences;
        let summary = '';

        if (prefs.budget) {
            summary += `💰 Budget: ${prefs.budget.min ? `₹${prefs.budget.min}` : 'Any'} - ${prefs.budget.max ? `₹${prefs.budget.max}` : 'Any'}<br>`;
        }
        if (prefs.brand) {
            summary += `🏷️ Brand: ${prefs.brand}<br>`;
        }
        if (prefs.size) {
            summary += `📏 Size: ${prefs.size}<br>`;
        }
        if (prefs.color) {
            summary += `🎨 Color: ${prefs.color}<br>`;
        }

        return summary || 'No specific preferences set';
    }

    // Preview website in the panel
    previewWebsite(website) {
        const siteConfig = this.websites[website];
        const productName = this.currentProduct.name;
        const searchUrl = siteConfig.searchUrl
            .replace("QUERY", encodeURIComponent(productName))
            .replace("&PARAMS", "")
            .replace("?PARAMS", "");

        document.getElementById('websiteFrame').src = searchUrl;
        document.getElementById('currentWebsite').textContent = `Currently Viewing: ${siteConfig.name}`;
        
        // Highlight active website
        document.querySelectorAll('.website-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-website="${website}"]`).classList.add('active');
    }

    // Refine search
    refineSearch() {
        this.conversationState = 'gathering_preferences';
        this.addToConversation("bot", "Let's refine your search. What would you like to change?");
        this.showPreferencePanel();
    }

    // Start new search
    startNewSearch() {
        this.conversationState = 'identifying_product';
        this.userPreferences = {
            budget: null,
            brand: null,
            size: null,
            color: null,
            category: null,
            features: []
        };
        this.currentProduct = null;
        this.searchResults = [];
        
        this.addToConversation("bot", "Okay, let's start fresh! What would you like to shop for?");
        this.showPreferencePanel();
    }

    // Show preference panel
    showPreferencePanel() {
        const panel = document.getElementById('preferencePanel');
        panel.innerHTML = this.generatePreferencePanel();
        panel.style.display = 'block';
    }

    // Update preference panel
    updatePreferencePanel() {
        const panel = document.getElementById('preferencePanel');
        if (panel.style.display !== 'none') {
            panel.innerHTML = this.generatePreferencePanel();
        }
    }

    // Generate preference panel HTML
    generatePreferencePanel() {
        const prefs = this.userPreferences;
        
        return `
            <div class="preference-panel">
                <h3>🎯 Your Preferences</h3>
                <div class="preference-item">
                    <label>Budget Range:</label>
                    <div class="preference-value">
                        ${prefs.budget ? 
                            `${prefs.budget.min ? `₹${prefs.budget.min}` : 'Any'} - ${prefs.budget.max ? `₹${prefs.budget.max}` : 'Any'}` : 
                            '<em>Not set</em>'}
                    </div>
                </div>
                <div class="preference-item">
                    <label>Brand:</label>
                    <div class="preference-value">${prefs.brand || '<em>Not set</em>'}</div>
                </div>
                <div class="preference-item">
                    <label>Size:</label>
                    <div class="preference-value">${prefs.size || '<em>Not set</em>'}</div>
                </div>
                <div class="preference-item">
                    <label>Color:</label>
                    <div class="preference-value">${prefs.color || '<em>Not set</em>'}</div>
                </div>
                <div class="preference-actions">
                    <button class="pref-btn" onclick="shoppingAI.quickSetBudget()">💰 Set Budget</button>
                    <button class="pref-btn" onclick="shoppingAI.quickSetBrand()">🏷️ Set Brand</button>
                </div>
            </div>
        `;
    }

    // Quick set budget
    quickSetBudget() {
        this.addToConversation("user", "I want to set my budget");
        this.processUserMessage("My budget is 10000-20000");
    }

    // Quick set brand
    quickSetBrand() {
        const category = this.userPreferences.category;
        const brands = {
            electronics: "Samsung, Apple, OnePlus, Xiaomi",
            clothing: "Nike, Adidas, Puma, Levi's",
            home: "Prestige, Philips, Bajaj, Milton"
        }[category] || "popular brands";

        this.addToConversation("user", "I want to set brand preference");
        this.processUserMessage(`I prefer ${brands}`);
    }

    // Utility methods
    addToConversation(sender, message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = message;
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    showTypingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing';
        typingDiv.id = 'typingIndicator';
        
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-indicator">
                    AI is thinking
                    <span class="typing-dots">
                        <span class="typing-dot"></span>
                        <span class="typing-dot"></span>
                        <span class="typing-dot"></span>
                    </span>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the AI
const shoppingAI = new ShoppingAI();

// Chat functions
function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    userInput.value = '';
    shoppingAI.processUserMessage(message);
}

// Allow pressing Enter to send message
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Quick action buttons
function quickAction(action) {
    const messages = {
        'smartphone': "I'm looking for a smartphone",
        'laptop': "I need a laptop for work",
        'shoes': "I want to buy running shoes",
        'tshirt': "Looking for casual t-shirts",
        'kitchen': "Need kitchen appliances"
    };
    
    document.getElementById('userInput').value = messages[action];
    sendMessage();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    shoppingAI.init();
    
    // Set up website navigation
    document.querySelectorAll('.website-item').forEach(item => {
        item.addEventListener('click', function() {
            const website = this.getAttribute('data-website');
            shoppingAI.previewWebsite(website);
        });
    });
});
