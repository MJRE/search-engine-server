const col = require('./Collection/collection');
var express = require('express');
var bodyParser = require('body-parser')
var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/', (req, res) => {
    console.log(req.body);
    res.status(200).send(req.body);
});

// var query = ''
// var searchResult = []

// if(process.argv[2] === '-query'){
//     query = process.argv[3]
//     searchResult = col.search(query)
// }else{
//     console.log('\t>>Please enter your query like: ', '\" -query \"YOUR QUERY\"\"')
// }

// if(searchResult.length > 0){
//     showSearchResult(searchResult)
//     console.log(searchResult)
// }else{
//     console.log('\n\t * All result for your query:')
//     console.log('\n\t\t>> No content to display :(\n')
// }

// function showSearchResult(result){
//     var index = 0
//     searchResult.sort((a,b) => a.similarity - b.similarity)
//     searchResult.reverse()

//     console.log('\n\t * All result for your query:')
//     console.log('\t\t CONTENT                                                     SIMILARITY')
    
//     searchResult.forEach(obj => {
//         console.log('\t\t', obj.content.substring(0,50), '...\t\t', obj.similarity.toString()+'%')
//     });
//     console.log('\n')
// }

console.log('Server run at localhost:3000 \n');
app.listen(3000);
