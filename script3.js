function addToCart(productId) {
    // Find product
    let product = null;
    for (const category in products) {
        product = products[category].find(p => p.id === productId);
        if (product) break;
    }
    
    if (product) {
        cart.push(product);
        addMessage(`Added ${product.name} to cart! 🛒`);
    }
}