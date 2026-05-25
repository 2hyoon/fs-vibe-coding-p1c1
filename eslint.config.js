export default [
  {
    rules: {
      "no-var": "error",
      "no-console": "warn",
      "no-unused-vars": "error",
      "eqeqeq": "error",
      "no-undef": "error"
    },
    languageOptions: {
      globals: {
        document: "readonly",
        window: "readonly",
        localStorage: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly"
      }
    }
  }
];
