//ici on programmera qu'on nodeJs pas de reactJs
const express = require('express') ;
const bodyParser = require('body-parser') ;
const routerHandler = require('./routes/handlers.js') ;

const app = express() ;
/**
 * Express provides methods to specify what function is called for a particular HTTP verb 
 * ( GET , POST , SET , etc.) and URL pattern ("Route"),
 * and methods to specify what template ("view") engine is used, where template files are located,
 * and what template to use to render a response
 */
app.use(bodyParser.urlencoded({extended:false})) ;
app.use(bodyParser.json()) ;
app.use('/', routerHandler) ;

app.all('*', (req, res) => {
    res.send('Welcome to Practical Node.js!')
   })

const PORT = 9000 ; 
app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}.`) ;
}) ;
