const path = require('path');
const express = require('express')

const app = express();
const port = process.env.PORT || 3000;
const ROOT_DIRECTORY = process.cwd();

app.use(express.json());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));

app.use(express.static('public'))

app.get("/", async (req, res) => {

  res.send(
    `
  <h1>Loo bee</h1>
  <h2>Available Routes</h2>
  <pre>
    GET, POST /download
  </pre>
  `.trim(),
  );
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get('/download', function(req, res){
  const file = path.join(ROOT_DIRECTORY, 'bundle.zip');
  res.download(file); // Set disposition and send it.
});

// (function(ns) {
//   if (typeof window.fetch !== 'function') return;

//   // ns.XMLHttpRequest

//   ns.fetch = function() {
//     var out = fetch.apply(this, arguments);

//     // side-effect
//     out.then((asd) => console.log('loaded fetch', asd, arguments));

//     return out;
//   }

//   ns.XMLHttpRequest = function() {
//     var out = XMLHttpRequest.apply(this, arguments);

//     // side-effect
//     out.then((asd) => console.log('loaded XMLHttpRequest', asd, arguments));

//     return out;
//   }

// }(window))


// const originalRequestOpen = XMLHttpRequest.prototype.open;
// XMLHttpRequest.prototype.open = function() {
//   this.addEventListener('load', function() {
//       console.log('1')
//   });
//   originalRequestOpen.apply(this, arguments);
// };
