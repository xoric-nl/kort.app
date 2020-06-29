const express = require('express');
const app = express();
const path = require('path');
const port = 3000

app.get('/', function (req, res) {
    res.status(200).sendFile(path.join(__dirname + '/html/index.html'));
});

app.post('/', function (req, res) {
    let responseObject = {
        "Status": 200,
        "Message": 'Ok'
    };

    res.status(responseObject.Status).json(responseObject);
})

// ([\w]{8})
app.get('/:url', function(req, res) {
    res.redirect('https://google.nl/?q=' + req.params.url);
});

app.listen(port, () => console.log(`App running on http://localhost:${port}`));