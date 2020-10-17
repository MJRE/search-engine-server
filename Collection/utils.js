const {stopWords} = require('./stopWords')
const d = require('distance-calc')
const robustDot = require("robust-dot-product")

//=============================================================== For Get All Words
function getAllWords(documents){
    var allWords = new Set()
    documents.forEach(obj => {
        obj.content.toLowerCase().split(' ').forEach(contentWord => {
            if(!stopWords.includes(contentWord)){
                allWords.add(contentWord)
            }
        })
    });
    return allWords
}

function setAllDocsToLowercase(query, documents){
    var docs = documents
    docs[0].content = query
    docs.forEach(obj => {
        obj.content = obj.content.toLowerCase()
    });
    return docs
}
//=============================================================== For TF Map
function getTFMap(allWords, documents){
    var TFMap = new Map()
    var docMap = new Map()
    documents.forEach(obj=>{
        docMap = new Map()
        allWords.forEach(word=>{
            docMap.set(word, getWordRepeatCount(word, obj.content.split(' ')))
        })
        TFMap.set(obj.key, docMap)
    })

    return TFMap
}

function getWordRepeatCount(word, doc){
    var count = 0
    doc.forEach(element => {
        if(element == word.toLowerCase()){
            count++
        }
    })
    return count
}
//=============================================================== For DF Map
function getDFMap(allWords, documents){
    var DFMap = new Map()
    allWords.forEach(word => {
        DFMap.set(word, howManyDocsHaveIt(word, documents))
    });
    return DFMap
}

function howManyDocsHaveIt(word, documents){
    var count = 0
    documents.forEach(obj=>{
        if (obj.content.includes(word)){
            count++
        }
    })
    return count
}
//=============================================================== For TF-IDF Map
function getTF_IDFMap(TFMap, DFMap, documents, allWords){
    var TF_IDFMap = new Map()
    var wordsWeightMap = new Map()
    var tf = 0
    var df = 0
    var N = documents.length
    documents.forEach(obj => {
        wordsWeightMap = new Map()
        allWords.forEach(word => {
            df = DFMap.get(word)
            tf = TFMap.get(obj.key).get(word)
            if(tf != 0) {wordsWeightMap.set(word, getWordWeight(tf, df, N))}else{wordsWeightMap.set(word, 0.0)}
        });
        TF_IDFMap.set(obj.key, wordsWeightMap)
    });

    return TF_IDFMap
}

function getWordWeight(tf, df, N){
    return (Math.log1p(1 + tf)) * (Math.log1p(N/df))
}
//=============================================================== For Similarity Map
function getSimilarityMap(TF_IDFMap, documents){
    var similarityMap = new Map()
    var queryVector = Array.from(TF_IDFMap.get('Query'), ([key, value])=> value)
    documents.forEach(obj => {
        similarityMap.set(obj.key, getCos(queryVector, Array.from(TF_IDFMap.get(obj.key), ([key, value])=> value)))
    });
    return similarityMap
}

function getCos(queryVector, docVector){
    var normQuery = d.norm(queryVector)
    var normDoc = d.norm(docVector)
    var dot = getDotProduct(queryVector, docVector)
    return (dot / (normQuery * normDoc))
}

function getDotProduct(vector1, vector2) {
    var result = 0;
    for (var i = 0; i < vector1.length; i++) {
      result += vector1[i] * vector2[i];
    }
    return result;
}
//=============================================================== For Output Search Result
function getSearchResult(similarityMap, documents){
    var result = []
    var obj = {key: '', content:'', similarity: 0}
    documents.forEach(object => {
        obj = {key: '', content:'', similarity: 0}
        if(similarityMap.get(object.key) > 0.0 && object.key != 'Query'){
            obj.key = object.key
            obj.content = object.content
            sim = similarityMap.get(object.key);
            obj.similarity = (sim > 0.0 && sim <= 1)? 1:parseInt((sim * 100))
            result.push(obj)
        }
    });
    return result
}

module.exports = {
    getAllWords,
    setAllDocsToLowercase,
    getTFMap,
    getDFMap,
    getTF_IDFMap,
    getSimilarityMap,
    getSearchResult
}