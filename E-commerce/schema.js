const { gql } = require('apollo-server')

exports.typeDefs = gql`
type Query{
    hello:String,
    products(filter:FilteredProduct):[Product!]!,
    product(id:String!):Product,
    categories:[Category!]!,
    category(id:ID!):Category
}

type Product  {
    id:ID!
    name:String!,
    description:String!,
    quantity:String!,
    price:Float!,
    onSale:Boolean!,
    image:String!,
    category:Category,
    Review:[reviews]
}

type Category{
    id:ID!,
    name:String!,
    products:[Product!]!
}

type reviews{
      id: ID!,
      date: String!,
      title:String!,
      comment:String!,
      rating:Int!,
      productId:ID,
}

type Mutation{
    addCategory(input:addCategoryInput!):Category!
    addProduct(input:addProductInput!):Product!
    addReview(input:addReviewInput!):reviews!
    deleteCategory(id:ID!):Boolean!
    deleteProduct(id:ID!):Boolean!
    deleteReview(id:ID!):Boolean!
    updateCategory(id:ID!,input:UpdateCategoryInput!):Category!
    updateProduct(id:ID!,input:UpdateProductInput!):Product!
    updateReview(id:ID!,input:UpdateReviewInput!):reviews!
}

input FilteredProduct{
    onSale:Boolean,
    avgRating:Int
}

input addCategoryInput{
    name:String
}

input addProductInput{
    name:String,
    description:String,
    quantity:Int!,
    price:Float!,
    onSale:Boolean!,
    image:String!,
    CategoryId:ID!,
}

input addReviewInput {
      date: String!,
      title:String!,
      comment:String!,
      rating:Int!,
      productId:ID!,
}

input UpdateCategoryInput{
    name:String!
}

input UpdateProductInput{
    name:String,
    description:String,
    quantity:Int!,
    price:Float!,
    onSale:Boolean!,
    image:String!,
    CategoryId:ID,
}

input UpdateReviewInput{
    name:String!,
    date: String!,
    title:String!,
    comment:String!,
    rating:Int!,
    productId:ID,
}

`