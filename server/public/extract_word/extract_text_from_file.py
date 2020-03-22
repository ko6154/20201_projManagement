#-*- coding:utf-8 -*-

"""
pip install --upgrade konlpy
sudo apt-get install g++ openjdk-8-jdk python-dev

pip install --upgrade docx2txt
pip install --upgrade textract
"""

import docx2txt
from konlpy.tag import Okt
import sys
import os.path
import textract

file_name = sys.argv[1] #test.docx

extension = os.path.splitext(file_name)[1]

if extension == '.docx':
    text = docx2txt.process(file_name)
elif extension == '.pptx':
    text = textract.process(file_name)
elif extension == '.pdf':
    text = textract.process(file_name)
else:
    raise Exception

okt = Okt() # warning: deprication occures here
nouns = okt.nouns(text)

#text = text.split(" ")

#print(concated_nouns.encode('utf-8')) #let's apply this to.. works ok
stopword_path = '/home/semin/server/public/extract_word/stopwords.txt'
#stopword_path = 'stopwords.txt'
stopwords = set()

#read stop words from the file
f_stopwords = open(stopword_path,"r")
stopword_list_from_file = f_stopwords.readlines()
for sw in stopword_list_from_file:
    stopwords.add(sw.strip('\n').decode('utf-8'))
f_stopwords.close()

words = [] 

for noun in nouns:
    word =[noun, nouns.count(noun)]
    if word not in words and noun not in stopwords:
        words.append(word)

words.sort(key=lambda x: x[1],reverse=True)

for i in range(10) :
    print("%s"%words[i][0].encode("utf-8")) #works ok, print(words[i][0]) doesn't work
