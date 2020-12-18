import { ApolloClient } from 'apollo-boost'
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { setContext } from 'apollo-link-context';
const httpLink = createUploadLink({
    uri: `http://localhost:4000/graphql`,
    fetch
});
// Create a WebSocket link:
const wsLink = new WebSocketLink({
    uri: `ws://localhost:4000/graphql`,
    options: {
        reconnect: true,
    }
});

const authLink = setContext((_, { headers }) => {
    const token = JSON.parse(sessionStorage.getItem('data'));
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token.data.login.token}` : "",
        }
    }
  }
  
);

const link = split( ({ query }) => {
    let definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    authLink.concat(httpLink)
);

const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
});


export default client