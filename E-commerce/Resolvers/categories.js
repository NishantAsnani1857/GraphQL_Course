// Getting all products corresponding to a category
exports.Category = {
    products: ({ id: categoryId }, args, {db}) => { //We can get Id of category because category is parent of product.
        return db.products.filter((prods) => prods.CategoryId === categoryId)
    }
}