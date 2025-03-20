
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 5317, hash: '2c366a6dfd71002184bec99354cb817885c15ab1a44ba2a63fbcaa8a3b4f9a3a', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1010, hash: 'af3c875ea7f2f77f24aaaba4fd425d0027a136d13ed4c806a9c9918e4afe6b94', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-UVLAIPNA.css': {size: 228103, hash: '/nOT3KqItKw', text: () => import('./assets-chunks/styles-UVLAIPNA_css.mjs').then(m => m.default)}
  },
};
