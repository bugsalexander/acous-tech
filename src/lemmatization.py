import nltk
import sys
import numpy as np
import matplotlib.pyplot as plt
from IPython.core.display import display, HTML
import spacy
from tqdm import tqdm
from numpy import dot
from numpy.linalg import norm
import sys
from emo_uni import emo_list, emo_get
import nltk
from nltk.stem import WordNetLemmatizer
np.seterr(divide='ignore', invalid='ignore')

from nltk.stem import WordNetLemmatizer
input = str(sys.argv[1])
tokens = nltk.word_tokenize(input)
tagged = nltk.pos_tag(tokens)
sentence = []
for tag in tagged:
    if 'NN' in tag[1] or 'VB' in tag[1]:
        sentence.append(tag[0])

lemmatizer = WordNetLemmatizer()

new_words = []
for word in sentence:
    #print(word, " :", lemmatizer.lemmatize(word))
    new_words.append(lemmatizer.lemmatize(word))


print(" ".join(new_words))
    
    


