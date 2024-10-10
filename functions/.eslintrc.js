module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    "ecmaVersion": 2018,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "max-len": ["error", { "code": 120 }],
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    // "quotes": ["error", "double", {"allowTemplateLiterals": true}],
    "object-curly-spacing": ["error", "always"], // Enforce spaces inside curly braces
    "quotes": ["error", "double"], // Enforce double quotes
    "comma-dangle": ["error", "always-multiline"], // Enforce trailing commas

  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
