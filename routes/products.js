const express = require('express');
const router = express.Router();

// Seed data
let products = [
    { id: 1, title: 'Fjallraven - Foldsack No. 1 Backpack', price: 109.95, category: "men's clothing", description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday" },
    { id: 2, title: 'Mens Casual Premium Slim Fit T-Shirts', price: 22.3, category: "men's clothing", description: "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing." },
    { id: 3, title: 'Mens Cotton Jacket', price: 55.99, category: "men's clothing", description: "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors." },
    { id: 4, title: 'Solid Gold Petite Micropave', price: 168.00, category: "jewelery", description: "Satisfaction Guaranteed. Return or exchange any order within 30 days.Designed and sold by Hafeez Center in the United States. Satisfaction Guaranteed." },
    { id: 5, title: 'WD 2TB Elements Portable External Hard Drive - USB 3.0', price: 64.00, category: "electronics", description: "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7" }
];
let currentId = 6;

// GET /products with optional ?search= & ?page= & ?limit=
router.get('/', (req, res) => {
    let result = products;

    if (req.query.search) {
        const search = req.query.search.toLowerCase();
        result = result.filter(p => p.title.toLowerCase().includes(search) || p.category.toLowerCase().includes(search));
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedResult = result.slice(startIndex, endIndex);

    // Artificial delay to show loading state in frontend
    setTimeout(() => {
        res.json({
            data: paginatedResult,
            totalCount: result.length,
            page,
            limit,
            totalPages: Math.ceil(result.length / limit)
        });
    }, 500);
});

// GET /products/:id
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// POST /products
router.post('/', (req, res) => {
    const { title, price, category, description } = req.body;
    if (!title || !price || !category) {
        return res.status(400).json({ message: 'Title, price, and category are required' });
    }

    const newProduct = {
        id: currentId++,
        title,
        price: parseFloat(price),
        category,
        description: description || ''
    };

    // Add to beginning of array
    products.unshift(newProduct);

    setTimeout(() => res.status(201).json(newProduct), 500);
});

// PUT /products/:id
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);

    if (index !== -1) {
        const { title, price, category, description } = req.body;
        if (!title || !price || !category) {
            return res.status(400).json({ message: 'Title, price, and category are required' });
        }

        products[index] = {
            ...products[index],
            title,
            price: parseFloat(price),
            category,
            description: description !== undefined ? description : products[index].description
        };

        setTimeout(() => res.json(products[index]), 500);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// DELETE /products/:id
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);

    if (index !== -1) {
        products.splice(index, 1);
        setTimeout(() => res.status(204).send(), 500);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

module.exports = router;
