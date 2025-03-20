
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 5317, hash: '983a7bcf81813725773ce012a46d03ba70b23267abcb112f4ca23d0faa406f60', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1010, hash: '44496e306e9717ecaa0425b14fbafe0985c64b3d11492eed2ead073052a91e0c', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-UVLAIPNA.css': {size: 228103, hash: '/nOT3KqItKw', text: () => import('./assets-chunks/styles-UVLAIPNA_css.mjs').then(m => m.default)}
  },
};
