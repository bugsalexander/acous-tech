from nltk.corpus import wordnet
import sys

# get the word from command line args
word = sys.argv[1]

# store the found synonyms
result = []

# for each one of the synonyms, add to result.
for syn in wordnet.synsets(word):
  for l in syn.lemmas():
    result.append(l.name())

# prints out as an array, in the form:
# $ ['result1', 'result2', result3']
print(list(set(result)))