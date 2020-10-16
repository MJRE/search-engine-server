const col = require('./Collection/collection');
var express = require('express');
var bodyParser = require('body-parser')
var app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/', (req, res) => {
    col.search(req.body.query, (searchResult) => {
        res.status(200).send(searchResult);
    })
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
