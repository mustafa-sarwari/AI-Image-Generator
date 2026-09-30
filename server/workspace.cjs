const d = require("./domain.cjs");
const { text, HttpError } = require("./http.cjs");
module.exports = {
  title: "AI image generator",
  resources: {
    generations: {
      label: "Generation history",
      noCreate: true,
      readOnly: true,
      fields: [],
    },
  },
};
