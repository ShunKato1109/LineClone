const express = require('express');
const {createServer} = require('node:http');
const {join} = require('node:path');

const app = express();
const server = createServer(app);

const PORT = 3005;

app.get('/',(req,res)=>{
    // res.send('<h1>Hello World</h1>');
    res.sendFile(join(__dirname, 'src', '01Page', 'Home.jsx'));
});

server.listen(PORT,()=>{
    console.log('PORT3005サーバー起動');
});