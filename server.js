const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname,'dist')));
app.post('/',(_req,res)=>res.status(503).json({error:'Preview only. Submit through the deployed Netlify site.'}));
app.listen(process.env.PORT || 3026,'0.0.0.0');
