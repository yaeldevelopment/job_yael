
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 5317, hash: '68db4cbab5c32fb6999012ff5dd0ca7b9bf340b0089c9da5fd22cd23e278ce61', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1010, hash: '5ffe2db4dc503636cc52fd833d8725b8ab75e9829770eecb90e0a350fbcc1341', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-UVLAIPNA.css': {size: 228103, hash: '/nOT3KqItKw', text: () => import('./assets-chunks/styles-UVLAIPNA_css.mjs').then(m => m.default)}
  },
};
