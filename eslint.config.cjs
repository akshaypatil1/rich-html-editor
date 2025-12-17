module.exports = {
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      plugins: ["@typescript-eslint", "security"],
      ignorePatterns: ["dist/**", "coverage/**", "node_modules/**"],
      settings: {},
      rules: {
        // base ESLint recommended rules are enabled via `extends` below
      },
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:security/recommended",
      ],
    },
  ],
};
