function searchProducts(query) {
    const results = [];
    
    // Search all categories
    for (const category in products) {
        products[category].forEach(product => {
            if (product.name.toLowerCase().includes(query.toLowerCase())) {
                results.push(product);
            }
        });
    }
    
    return results;
}