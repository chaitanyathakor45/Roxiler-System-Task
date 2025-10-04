export function buildSwaggerSpec() {
  // Minimal stub; full OpenAPI can be expanded later
  return {
    openapi: '3.0.0',
    info: { title: 'Store Ratings API', version: '1.0.0' },
    paths: {
      '/auth/login': { post: { summary: 'Login', responses: { '200': { description: 'OK' } } } },
      '/auth/signup': { post: { summary: 'Signup', responses: { '201': { description: 'Created' } } } },
      '/stores': { get: { summary: 'Browse stores', responses: { '200': { description: 'OK' } } } },
    },
  } as const;
}

