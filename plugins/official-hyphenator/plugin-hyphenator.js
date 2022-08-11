caph.plugins.hyphenator = new class extends caph.Plugin{
  render(){ return null; }
  async loader({}){
    await caph.load('caph-docs/libraries/Hyphenator-5.3.0/Hyphenator.min.js');
  }
};
