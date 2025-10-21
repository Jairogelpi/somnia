/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: { es2022: true, node: true, jest: true },
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  ignorePatterns: ["dist/", "build/", "node_modules/"],
  rules: {
    "@typescript-eslint/consistent-type-imports": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
};
