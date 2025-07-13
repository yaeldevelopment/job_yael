
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: false,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 641, hash: '1d7b811a4a98f8154c1cee0b1e94ddb14e3fa240495e12e12e2e840f548a36fc', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1181, hash: '258024097b2e6ec97d00ae5b008817d981450b934cf96d20eb6878706f4bccde', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)}
  },
};
