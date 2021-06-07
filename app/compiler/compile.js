var crypto = require("crypto");
var sandBox = require("./DockerSandbox");

function random(size) {
  //returns a crypto-safe random
  return crypto.randomBytes(size).toString("hex");
}

var path = __dirname + "/"; //current working path
var vm_name = "virtual_machine"; //name of virtual machine that we want to execute
var timeout_value = 20; //Timeout Value, In Seconds

// Hardcoded C++;
var compiler = "'g++ -o /usercode/a.out' ";
var file_name = "file.cpp";
var langName = "C/C++";
var extra_arguments = "";

exports.compile = (req, res) => {
  var code = req.body.code;
  var stdin = "";
  // Since we dont need to execute compiled program
  var output_command = "";

  var folder = "temp/" + random(10); //folder in which the temporary folder will be saved

  //details of this are present in DockerSandbox.js
  console.log(__dirname);
  var sandboxType = new sandBox(
    timeout_value,
    path,
    folder,
    vm_name,
    compiler,
    file_name,
    code,
    output_command,
    langName,
    extra_arguments,
    stdin
  );

  //data will contain the output of the compiled/interpreted code
  //the result maybe normal program output, list of error messages or a Timeout error
  sandboxType.run(function (data, exec_time, err) {
    //console.log("Data: received: "+ data)
    res.send({
      output: data,
      errors: err,
      time: exec_time,
    });
  });
};

exports.run = (req, res) => {
  var code = req.body.code;
  var stdin = req.body.stdin;

  var folder = "temp/" + random(10); //folder in which the temporary folder will be saved

  // So we need to execute a.out
  var output_command = "/usercode/a.out";

  //details of this are present in DockerSandbox.js
  console.log(__dirname);
  var sandboxType = new sandBox(
    timeout_value,
    path,
    folder,
    vm_name,
    compiler,
    file_name,
    code,
    output_command,
    langName,
    extra_arguments,
    stdin
  );

  //data will contain the output of the compiled/interpreted code
  //the result maybe normal program output, list of error messages or a Timeout error
  sandboxType.run(function (data, exec_time, err) {
    res.send({
      output: data,
      code: code,
      errors: err,
      time: exec_time,
    });
  });
};
