export default class WordAPI {
  constructor() {
    // this.apiKey = process.env.NINJA_API_KEY;
    this.apiKey = '+l/6Qhz/0J0PLhuk26U1Ag==6jqv7A8uoE0H1mZz';
    this.paramNames = {
      topics: ['topics'],
      synonymOf: ['ml', 'rel_syn'],
      antonymOf: ['rel_ant'],
      rhymesWith: ['rel_rhy'],
      nearlyRhymesWith: ['rel_nry'],
      moreSpecificThan: ['rel_spc'],
      moreGeneralThan: ['rel_gen'],
      commonNextWord: ['rc', 'rel_bga'],
      commonPreviousWord: ['lc', 'rel_bgb'],
    };
  }

  async getWords(wordInfo, max, options) {
    let poolSize = 500;
    let wordQuery = typeof wordInfo == 'number' ? `sp=${('?').repeat(wordInfo)}` : `sp=${wordInfo}`;
    let optionsQuery = '';
    if (options) {
      for (const optionDescription in options) {
        let optionValue = options[optionDescription];
        let paramTags = this.paramNames[optionDescription];
        paramTags.forEach(tag => {
          optionsQuery += `&${tag}=${optionValue}`;
        });
      }
    }
    const response = await fetch(`https://api.datamuse.com/words?${wordQuery}${optionsQuery}&md=f&max=${poolSize}`);
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    } else {
      let result = await response.json();
      result = this.filterWordList(result, max);
      return result;
    }
  }

  async getSentences() {
    let url = `https://api.api-ninjas.com/v1/quotes?&limit=10`;
    const response = await fetch(url, { headers: { 'X-Api-Key': this.apiKey }, });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    } else {
      let result = await response.json();
      result = result.map(item => item.quote);
      return result;
    }
  }

  filterWordList(objList, max) {
    // single words only
    let result = objList.filter(wordObj => wordObj.word.split(' ').length === 1);
    // get rid of less common 50% of list
    result.sort((a, b) => {
      let freqScoreA = parseFloat(a.tags[0].split(':')[1]);
      let freqScoreB = parseFloat(b.tags[0].split(':')[1]);
      return freqScoreB - freqScoreA;
    });
    if (result.length >= (max * 2)) {
      result = result.slice(0, Math.ceil(result.length / 2));
    }
    // randomly select the original requested amount for output
    result = result.sort(() => .5 - Math.random()).slice(0, max);
    result = result.map(item => item.word);
    return result;
  }
}