const { v4: uuid } = require('uuid')

exports.Mutation = {
    addCategory: (parent, { input }, context) => {
        const { name } = input;
        const { categories } = context
        const newCategory = {
            id: uuid(),
            name
        }
        categories.push(newCategory);
        return newCategory;
    },
    addProduct: (parent, { input }, context) => {
        const { name, description, quantity, price, onSale, image, CategoryId } = input;
        const { products } = context
        const newproduct = {
            id: uuid(),
            name, description, quantity, price, onSale, image, CategoryId
        }
        products.push(newproduct);
        return newproduct;
    },
    addReview: (parent, { input }, context) => {
        const { date, title, comment, rating, productId } = input;
        const { reviews } = context
        const newReview = {
            id: uuid(),
            date, title, comment, rating, productId,
        }
        reviews.push(newReview);
        return newReview;
    },
    deleteCategory: (parent, args, { db }) => {  //Does not delete Related products
        const { id } = args
        db.categories = db.categories.filter((category) => category.id !== id)
        return true
    },
    deleteProduct: (parent, args, { db }) => {  //Delete reviews pertaining to product (Cascading delete)
        const { id } = args
        db.products = db.products.filter((prods) => prods.id !== id)
        db.reviews = db.reviews.filter((review) => review.productId !== id)
        return true
    },
    deleteReview: (parent, args, { db }) => {  //Does not delete Related products
        const { id } = args
        db.reviews = db.reviews.filter((review) => review.id !== id)
        return true
    },
    updateCategory: (parents, { id,input }, { db }) => {
        const index = db.categories.findIndex((category) => category.id == id);
        db.categories[index] = {
            ...db.categories[index],
            ...input
        };
        return db.categories[index]
    },
    updateProduct: (parents, { id,input }, { db }) => {
        const index = db.products.findIndex((prods) => prods.id == id);
        db.products[index] = {
            ...db.products[index],
            ...input
        };
        return db.products[index]
    },
    updateReview: (parents, { id,input }, { db }) => {
        const index = db.reviews.findIndex((review)=>review.id==id)
        db.reviews[index] = {
            ...db.reviews[index],
            ...input
        };
        return db.reviews[index]
    }
}