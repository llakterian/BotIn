import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const SUBGRAPH_URL = import.meta.env.VITE_SUBGRAPH_URL || "https://api.studio.thegraph.com/query/botin";

export const graphClient = new ApolloClient({
  uri: SUBGRAPH_URL,
  cache: new InMemoryCache({
    typePolicies: {
      Agent: {
        keyFields: ["id"],
      },
      Query: {
        fields: {
          agents: {
            merge: false,
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
    query: {
      fetchPolicy: "cache-first",
    },
  },
});

export const GET_AGENT = gql`
  query GetAgent($id: ID!) {
    agent(id: $id) {
      id
      agentId
      owner
      agentWallet
      agentURI
      subscriptionTier
      subscriptionExpiry
      isActive
      registeredAt
      name
      description
      image
      category
      skills
      languages
      feedbackCount
      averageRating
      validationCount
      validationScore
    }
  }
`;

export const GET_ALL_AGENTS = gql`
  query GetAllAgents($first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!) {
    agents(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      agentId
      owner
      agentWallet
      agentURI
      subscriptionTier
      subscriptionExpiry
      isActive
      registeredAt
      name
      description
      image
      category
      skills
      feedbackCount
      averageRating
    }
  }
`;

export const GET_AGENTS_BY_OWNER = gql`
  query GetAgentsByOwner($owner: Bytes!) {
    agents(where: { owner: $owner }) {
      id
      agentId
      owner
      agentWallet
      agentURI
      subscriptionTier
      subscriptionExpiry
      isActive
      registeredAt
      name
      description
      image
      skills
    }
  }
`;

export const GET_AGENT_FEEDBACK = gql`
  query GetAgentFeedback($agentId: ID!) {
    feedbacks(where: { agent: $agentId, isRevoked: false }, orderBy: timestamp, orderDirection: desc) {
      id
      clientAddress
      feedbackIndex
      value
      valueDecimals
      tag1
      tag2
      timestamp
    }
  }
`;

export const GET_AGENT_VALIDATIONS = gql`
  query GetAgentValidations($agentId: ID!) {
    validations(where: { agent: $agentId }, orderBy: timestamp, orderDirection: desc) {
      id
      requestHash
      validator
      response
      tag
      timestamp
    }
  }
`;

export const GET_DAILY_STATS = gql`
  query GetDailyStats($date: Int!) {
    dailyStats(where: { date_gte: $date }, orderBy: date, orderDirection: desc) {
      id
      date
      totalAgents
      newAgents
      totalPayments
      totalFeedback
    }
  }
`;

export const SEARCH_AGENTS = gql`
  query SearchAgents($searchText: String!, $category: String, $minTier: Int) {
    agents(
      where: {
        or: [{ name_contains_nocase: $searchText }, { description_contains_nocase: $searchText }, { skills_contains: $searchText }]
        category: $category
        subscriptionTier_gte: $minTier
      }
    ) {
      id
      agentId
      name
      description
      image
      category
      skills
      subscriptionTier
      feedbackCount
      averageRating
    }
  }
`;
