exports.Query = {
    hello: () => "World",
    products: (parent, args,{db}) => {
        const { filter, avgRating } = args;
        if (filter) {
            if (filter.onSale) {
                if (filter.onSale == true) {
                    return db.products.filter((prod) => prod.onSale === true)
                }
                else if (filter.onSale == false) {
                    return db.products.filter((prod) => prod.onSale === false)
                }
                else if (filter.avgRating) {
                    let sumRating = 0
                    let numberOfViews = 0
                    if ([1, 2, 3, 4, 5].includes(filter.avgRating)) {
                        let ProductReviews = products.filter((prods) => {
                            reviews.forEach((review) => {
                                if (review.productId === prods.id) {
                                    sumRating += review.avgRating
                                    numberOfViews++
                                }
                            });
                            const avgRating = sumRating / numberOfViews;
                            return [avgRating, prods.name]
                        })
                    }
                }
            }
        }
        else {
            return db.products
        }
    },
    product: (parent, args,{db}) => {
        const productId = args.id;
        return db.products.find((prod) => prod.id == productId)

    },
    categories: (parent, args,{db}) => {
        return db.categories
    },
    category: (parent, args,{db}) => {
        const id = args.id;
        return db.categories.find((item) => item.id == id)
    }
}

