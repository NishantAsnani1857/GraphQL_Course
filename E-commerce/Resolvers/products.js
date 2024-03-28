// Getting a category corresponding to product
exports.Product={
    category: (parent, args, {db}) => { //We can get Id of product because product is parent of category.
        return db.categories.find((category) => category.id == parent.CategoryId)
    },
    Review:(parent, args,{db}) => { //We can get Id of product because product is parent of review here.
        return db.reviews.filter((review) => review.productId == parent.id)
    }
}