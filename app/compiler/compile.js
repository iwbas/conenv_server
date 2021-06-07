var crypto = require('crypto');
var sandBox = require('./DockerSandbox');

function random(size) {
    //returns a crypto-safe random
    return crypto.randomBytes(size).toString('hex');
}

exports.compile = (req, res) => {
  
};

exports.run = (req, res) => {
  // var language = req.body.language;
  var code = req.body.code;
  var stdin = req.body.stdin;
  
  var folder= 'temp/' + random(10); //folder in which the temporary folder will be saved
  var path=__dirname+"/"; //current working path
  var vm_name='virtual_machine'; //name of virtual machine that we want to execute
  var timeout_value=20;//Timeout Value, In Seconds

  // Hardcoded C++;
  var compilerArray = ["\'g++ -o /usercode/a.out\' ","file.cpp","/usercode/a.out","C/C++",""];

  //details of this are present in DockerSandbox.js
  console.log(__dirname)
  var sandboxType = new sandBox(timeout_value,path,folder,vm_name,compilerArray[0],compilerArray[1],code,compilerArray[2],compilerArray[3],compilerArray[4],stdin);


  //data will contain the output of the compiled/interpreted code
  //the result maybe normal program output, list of error messages or a Timeout error
  sandboxType.run(function(data,exec_time,err)
  {
      //console.log("Data: received: "+ data)
    res.send({output:data, /* langid: language, */code:code, errors:err, time:exec_time});
  });
};
