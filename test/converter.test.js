import { editDistance, lemmatize } from '../src/converter';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// tests for editDistance
testEditDistance();
function testEditDistance() {

  // words to test on for editDistance
  const words = [
    'one',
    'fish',
    'fishes',
    'Fishes',
    'crabs'
  ];
  
  for (let i = 0; i < words.length; i += 1) {
    let word = words[i];
    
    test('Edit distance between a word and itself should be zero.', () => {
      expect(editDistance(word, word)).toEqual(0);
    });
    
    test('Edit distance between a word and itself (single letter capitalized/different) is 1.', () => {
      let minusOne = word.substring(0, word.length - 1);
      let diff = minusOne + "Z";
      let caps = minusOne + minusOne.substring(word.length - 1, word.length);
      expect(editDistance(word, diff)).toEqual(1);
      expect(editDistance(word, caps)).toEqual(1);
    });

    test('adding/subtracting a letter -> editDist == 1', () => {
      let plusOne = word + "1";
      let subOne = word.substring(0, word.length - 1);
      expect(editDistance(word, plusOne)).toEqual(1);
      expect(editDistance(word, subOne)).toEqual(1);
    });
  }
}

// tests for lemmatize
// testLemmatize();
function testLemmatize() {

  // words to test on for editDistance
  const words = [
    'one',
    'fish',
    'fishes',
    'Fishes',
    'crabs'
  ];

  const outputs = [
    '',
    'fish',
    'fish',
    'Fishes',
    'crab'
  ];

  for (let i = 0; i < words.length; i += 1) {
    let word = words[i];
    let output = outputs[i];

    test(`lemmatize output for ${word} is ${output}`, async () => {
      const result = await lemmatize(word);
      expect(result).toEqual(output);
    });
  }
}

test('example', async () => {
  const result = await lemmatize("fishes");
  // expect(result).toEqual("fish");
  // expect(result).toEqual(String("fish"));
  expect(result).toStrictEqual({
    "data": [102, 105, 115, 104, 10], 
    "type": "Buffer"
  });
});