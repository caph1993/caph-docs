
caph.pluginDefs[caph.currentSrc] = new class extends caph.Plugin {
  Component() { return null; }
  async loader({ }) {
    await caph.load('caph-docs/libraries/Hyphenator-5.3.0/Hyphenator.min.js');
  }
};
