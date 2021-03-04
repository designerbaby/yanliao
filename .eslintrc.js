module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  extends: [
    'standard',
    'plugin:vue/essential'
  ],
  globals: {
    Promise: true,
    PIE: true,
    $: true,
    Vue: true,
    Vuex: true,
    VueRouter: true,
    Regular: true,
    __DEV__: true,
    __PROD__: true
  },
  rules: {
    'object-curly-spacing': ['error', 'always'],
    "template-curly-spacing": "off",
    indent: "off",
    "no-new": "off",
    "vue/no-parsing-error": [
      2,
      {
        "x-invalid-end-tag": false
      }
    ],
    "vue/require-prop-types": "off",
    "vue/require-default-prop": "off"
  },
  
}