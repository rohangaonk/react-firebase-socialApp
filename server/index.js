const express = require('express');
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:false}));

app.use('/',require('./router/route'));
app.listen(5000, ()=> console.log("server started on port 5000"))