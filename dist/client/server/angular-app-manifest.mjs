
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 5317, hash: 'eaf45f29bbab57a638b5064de7c44558b60616489de31fa17b12bdd33d5ae7e4', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1010, hash: '99f50db2c0aec9d17b1845cdbe2245b0dc57c3703b2b36044050b6b0e6c6300c', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-UVLAIPNA.css': {size: 228103, hash: '/nOT3KqItKw', text: () => import('./assets-chunks/styles-UVLAIPNA_css.mjs').then(m => m.default)}
  },
};
