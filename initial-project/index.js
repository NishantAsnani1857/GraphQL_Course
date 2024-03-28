const { ApolloServer, gql } = require("apollo-server");
const typeDefs = gql`
  type Query {
    cars: [Car!]!
  }

  type Car {
    id: ID!
    color: String!
    make: String!
  } 
  

  type ManualGroup{
    Image
    [Car]
  }

  type AutomaticGroup{
    Image
    [GroupFeatures]
    [Car]
  }

  type Group{
    id:ID!,
    featureSet:GroupFeatures
    cars(skip:Int!,take:Int!):[Car!]!
    name:String!
    imageId:ID!
    description:String!
  }

  type GroupFeatureSet{
    features:[GroupFeatures!]!
    applyFeaturesSeperately:Boolean!
  }

  type GroupFeatures{
    features:GroupFeatureFields!,
  }

  type Mutations{
   
    delete(groupId:ID!)
    publish(groupId:ID!)
    unpublish(groupId:ID!)
    addCars(groupId:ID!,carID:ID!)
    removeCars(groupId:ID!,carID:ID!)
    groupCreate(
      groupInput:GroupInput!
    )
    groupUpdate(
      groupId:ID!
      groupInput:GroupInput!
    ):Group
  }

type GroupUpdatePayload{
  userErrors:[userErrors!]!
  group:Group

}

type userErrors {
  message:String!
  field:[String!]!
}

  input GroupInput{
    name:String,
    image:ImageInput,
    description:String,
    featureSet:GroupFeatureFields

  }
  enum GroupFeatureFields {
      INCLINE_ENGINE
      FOUR_CYLINDER_ENGINE
      TWIN_CYLINDER_ENGINE
      RED_PAINT
      BLACK_PAINT
    }
input ImageInput{
  url:String!
}

`;

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: {
      cars: () => [{ id: 1, color: "blue", make: "Toyota" }],
    },
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
