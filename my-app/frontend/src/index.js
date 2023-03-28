/*import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( //Renvoie le code html ecrit dans App.js
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();*/
const http = require('http')
const port = 9000
http.createServer((req, res) => {
 res.writeHead(200, {'Content-Type': 'text/plain'})
 res.end('Hello World\n')
}).listen(port, () => {
 console.log(`Server running at http://localhost:${port}`)
})
