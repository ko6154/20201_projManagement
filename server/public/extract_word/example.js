//$ npm install python-shell 
//$ npm install python-shell -save

var PythonShell = require('python-shell');

var options = {
    mode: 'text', 
    pythonPath: '',//doesn't matter
    pythonOptions: ['-u'],
    scriptPath: '', //doesn't matter
    args: ['filename'] // SET THIS !!!!!  sample.docx  
};

PythonShell.run('extract_text_from_file.py', options, function (err, results) {

    if (err) throw err;
  
    console.log('results: %j', results);
  
});