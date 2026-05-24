const APPSYNC_URL = process.env.NEXT_PUBLIC_APPSYNC_URL || '';
const APPSYNC_API_KEY = process.env.NEXT_PUBLIC_APPSYNC_API_KEY || '';

export async function fetchGraphQL<T>(query: string, variables = {}, token?: string): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `${token}`; // AppSync USER_POOL espera el token directo en la cabecera, a veces sin Bearer o con él. Usualmente sin Bearer si es Cognito, pero con Bearer o token directo depende de cómo lo envía AWS SDK. Wait, en AppSync JWT (OIDC/Cognito), solo se envía el JWT puro en Authorization.
    // Corrección: AppSync con Amazon Cognito User Pools requiere solo el JWT puro (eyJ...) en la cabecera Authorization.
  } else {
    headers['x-api-key'] = APPSYNC_API_KEY;
  }

  const response = await fetch(APPSYNC_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
    cache: 'no-store'
  });

  const json = await response.json();

  if (json.errors) {
    console.error('GraphQL Errors:', json.errors);
    throw new Error('Error ejecutando la petición GraphQL');
  }

  return json.data;
}
