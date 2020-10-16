const util = require('./utils')
const {docs} = require('./documents')

function search(query, callback){
    var documents = util.setAllDocsToLowercase(query, docs)
    //========================================================================== Step One
    var allWords = util.getAllWords(documents)
    var TFMap = util.getTFMap(allWords, documents)
    //========================================================================== Step Two
    var DFMap = util.getDFMap(allWords, documents)
    //========================================================================== Step Three
    var TF_IDFMap = util.getTF_IDFMap(TFMap, DFMap, documents, allWords)
    //========================================================================== Step Four
    var similarityMap = util.getSimilarityMap(TF_IDFMap, documents)
    //========================================================================== Step Five
    var SearchResult = util.getSearchResult(similarityMap, documents)
    
    callback(SearchResult)
}

module.exports = {search}