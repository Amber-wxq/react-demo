var express = require('express');
var path = require('path');

var app = express();

var compression = require('compression');
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')))

app.get('*',function(req, res){
    res.sendFile(path.join(__dirname,'public', 'index.html'))
})

var PORT=process.env.PORT ||8080
app.listen(PORT, function(){
    console.log('Porduction Express server running at localhost'+PORT);
})