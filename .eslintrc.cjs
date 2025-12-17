module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "security"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:security/recommended",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "warn",
    "security/detect-eval-with-expression": "warn",
  },
  ignorePatterns: ["dist/", "coverage/", "node_modules/"],
};
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "security"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:security/recommended",
  ],
  rules: {
    // Project specific adjustments
    "@typescript-eslint/no-explicit-any": "warn",
    "security/detect-eval-with-expression": "warn",
  },
  ignorePatterns: ["dist/", "coverage/", "node_modules/"],
};
