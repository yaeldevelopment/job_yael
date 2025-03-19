
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 5310, hash: 'e331bdaf4d06e7a1c653d3272465555ca51567a440f2b3ab4eae7bbdcc32027c', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1003, hash: '1194307a2b477f5bc7a7fe8e960b573397b47ff0ba5b7bdb2caa5a44ea11d0f2', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-W4HMEMUE.css': {size: 227945, hash: 'y7top+NaJxI', text: () => import('./assets-chunks/styles-W4HMEMUE_css.mjs').then(m => m.default)}
  },
};
