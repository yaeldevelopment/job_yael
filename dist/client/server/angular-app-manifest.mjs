
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 5317, hash: '4134de17c74028498719be9f41d6d40fad904ea2426a75e22766b7d279c2ed2c', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1010, hash: '59870309e1ea4b21b276db63b222270602a4907abd13b40a00870f4bab76dadf', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-UVLAIPNA.css': {size: 228103, hash: '/nOT3KqItKw', text: () => import('./assets-chunks/styles-UVLAIPNA_css.mjs').then(m => m.default)}
  },
};
