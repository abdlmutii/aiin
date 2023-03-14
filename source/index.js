#!/usr/bin/env node
// Code made in 1 day 😃.

const fs = require('fs');

const { prompt } = require('enquirer');

const axios = require('axios');

const path = require('path');

async function executeFile(file) {

  const contents = fs.readFileSync(file, 'utf8');

  const lines = contents.split('\n');

  const vars = {};

  let skip = false;

  for (let line of lines) {

    line = line.trim();

    if (!line || line.startsWith("# ")) {

      continue;

    }

    if (line.startsWith("if(")) {

      const condition = line.match(/if\((.*)\)/)[1];

      const [left, operator, right] = condition.split(" ");

      let result;

      if (operator === "is") {

       if(right === "true" || right === "false") result = eval(`(${vars[left]})`) == eval(`(${right})`);

       else re81172226sult = eval(`(${vars[left]})`) == eval(`(${vars[right]})`);

     

      } else if (operator === ">") {

        result = vars[left] > vars[right];

      } else if (operator === "<") {

        result = vars[left] < vars[right];

      } else if (operator === ">=") {

        result = vars[left] >= vars[right];

      } else if (operator === "<=") {

        result = vars[left] <= vars[right];

      } else if (operator === "isnt") {

        if(right === "true" || right === "false") result = eval(`(${vars[left]})`) !== eval(`(${right})`);

       else result = eval(`(${vars[left]})`) !== eval(`(${vars[right]})`);

      } else {

        throw new Error(`Invalid operator: ${operator}`);

      }

      let block = "";

      let i = lines.indexOf(line) + 1;

      while (lines[i] && !lines[i].startsWith("#")) {

        block += `${lines[i]}\n`;

        i++;

      }

      if (result) {

        skip = false;

        await executeCodeBlock(block, vars);

      } else {

        skip = true;

      }

    } else if (skip && line.endsWith("}")) {

      skip = false;

    } else if (!skip) {

      if (line.startsWith("random(")) {

        const rargs = line.match(/random\((.*)\)/)[1].split(',');

        const min = rargs[0].trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');

        let max = rargs[1].trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');

        console.log(Math.floor(Math.random() * (max - min + 1) + min));

      } else if (line.startsWith("ask(")) {

        const promptArgs = line.match(/ask\((.*)\)/)[1].split(',');

        let message = promptArgs[0].trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');

        message = message.replace(/{random\((.*)\)}/g, (_, args) => {

          const [min, max] = args.split(',').map(arg => parseInt(arg.trim()));

          return Math.floor(Math.random() * (max - min + 1) + min);

        });

        if (Object.keys(vars).length > 0) {

          message = message.replace(/\{([^}]+)\}/g, (_, key) => {

            if (!key.includes(".")) {

              const mathRegex = /^([\d\s\.\*\+\-\x\/\(\)]+)$/;

              if (mathRegex.test(key)) {

                const result = eval(key.replaceAll("x", "*"));

                return result;

              }

              return vars[key] || `blank`;

          } else {

            let propSegments = key.split('.');

            let value = vars;

            for (let i = 0; i < propSegments.length; i++) {

              value = value[propSegments[i]];

            }

            return value || "blank";

          };

        });

        console.log(message.replaceAll(`"`, ``).replaceAll(`'`, ``).replaceAll("`", ``));

      } else {

        console.log(message.replaceAll(`"`, ``).replaceAll(`'`, ``).replaceAll("`", ``));

      }

    } 

       if (line.match(/log\(("|')(.*)\1\)/)) {

      let message = line.match(/log\(("|')(.*)\1\)/)[2];

      message = message.replace(/{random\((.*)\)}/g, (_, args) => {

        const [min, max] = args.split(',').map(arg => parseInt(arg.trim()));

        return Math.floor(Math.random() * (max - min + 1) + min);

      });

      if (Object.keys(vars).length > 0) {

        message = message.replace(/\{([^}]+)\}/g, (_, key) => {

          if (!key.includes(".")) {

            const mathRegex = /^([\d\s\.\*\+\-\x\/\(\)]+)$/;

            if (mathRegex.test(key)) {

              const result = eval(key.replaceAll("x", "*"));

              return result;

            }

            return vars[key] || `blank`;

          } else {

            let propSegments = key.split('.');

            let value = vars;

            for (let i = 0; i < propSegments.length; i++) {

              value = value[propSegments[i]];

            }

            return value || "blank";

          };

        });

        console.log(message.replaceAll(`"`, ``).replaceAll(`'`, ``).replaceAll("`", ``));

      } else {

        console.log(message.replaceAll(`"`, ``).replaceAll(`'`, ``).replaceAll("`", ``));

      }

    } 

    if(line.match(/log\((.*?)\)/) && !line.includes('"') && !line.includes("'") && !line.includes("`")) {

      

      let key = line.match(/log\((.*?)\)/)[1];

      let tu;

      if(key.includes('random')) key = key + ")";

      if(key.match(/random\((.*)\)/)) {

        const [min, max] = key.match(/random\((.*)\)/)[1].split(',');

     return console.log(Math.floor(Math.random() * (max - min + 1) + min));

    }

    if(!key.includes(".")) {

      const mathRegex = /^([\d\s\.\*\+\-\x\/\(\)]+)$/;

    if (mathRegex.test(key) === true) {

      const result = eval(key.replaceAll("x", "*"));

      tu = result;

    } else {

    tu = vars[key] || `blank`;

    }

    } else {

  let propSegments = key.split('.');

let value = vars;

for (let i = 0; i < propSegments.length; i++) {

  value = value[propSegments[i]];

}

tu = value || "blank";

    };

console.log(tu);

    }

    if (line.match(/^\s*([a-zA-Z0-9_]+)\s*=\s*(.*)\s*$/)) {

      if(line.match(/^\s*([a-zA-Z0-9_]+)\s*=\s*(.*)\s*$/)[2].startsWith("fetch(")) {

   const str = line.match(/^\s*([a-zA-Z0-9_]+)\s*=\s*(.*)\s*$/)[2];

// extract the URL using regex

const urlRegex = /fetch\(["']([^"']+)["']/;

const urlMatch = str.match(urlRegex);

const url = urlMatch[1];

const regex = /fetch\((.*)\)/;

const objStr = str.match(regex)[1];

let obj;

let data;

if(!objStr) {

  obj = {};

  data = await axios(url);

}

else if(objStr) {

  obj = eval(`(${objStr})`);

  obj.url = url;

  data = await axios(obj);

}

vars[line.match(/^\s*([a-zA-Z0-9_]+)\s*=\s*(.*)\s*$/)[1].replaceAll(`"`, ``).replaceAll(`'`, ``).replaceAll("`", ``)] = data.data;

      } else {

      vars[line.match(/^\s*([a-zA-Z0-9_]+)\s*=\s*(.*)\s*$/)[1].replaceAll(`"`, ``).replaceAll(`'`, ``).replaceAll("`", ``)] = eval(`(${line.match(/^\s*([a-zA-Z0-9_]+)\s*=\s*(.*)\s*$/)[2]})`);

      }

    } 

  }

    }

}

async function executeCodeBlock(block, vars) {

  const lines = block.split("\n").filter((line) => line.trim());

  for (let line of lines) {

    line = line.trim();

    if (line.startsWith("random(")) {

      const rargs = line.match(/random\((.*)\)/)[1].split(',');

      const min = rargs[0].trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');

      let max = rargs[1].trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');

      return console.log(Math.floor(Math.random() * (max - min + 1) + min));

  }

    else if(line === "}" || line === "{") return;

    else if (line.startsWith("ask(")) {

      const promptArgs = line.match(/ask\((.*)\)/)[1].split(',');

      let message = promptArgs[0].trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');

      message = message.replace(/{random\((.*)\)}/g, (_, args) => {

        const [min, max] = args.split(',').map(arg => parseInt(arg.trim()));

        return Math.floor(Math.random() * (max - min + 1) + min);

      });

      if (Object.keys(vars).length > 0) {

        message = message.replace(/\{([^}]+)\}/g, (_, key) => {

          if (!key.includes(".")) {

            const mathRegex = /^([\d\s\.\*\+\-\x\/\(\)]+)$/;

            if (mathRegex.test(key)) {

              const result = eval(key.replaceAll("x", "*"));

              return result;

            }

            return vars[key] || `blank`;

          } else {

            let propSegments = key.split('.');

            let value = vars;

            for (let i = 0; i < propSegments.length; i++) {

              value = value[propSegments[i]];

            }

            return value || "blank";

          };

        });

       message = message;

      }

      const type = promptArgs[1] ? promptArgs[1].trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1') : 'input';

      const name = promptArgs[2] ? promptArgs[2].trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1') : 'prompt';

      const response = await prompt([{ type, name, message }]);

      vars[name] = response[name] || "false";

        }

    else if (line.match(/log\(("|')(.*)\1\)/)) {

      let message = line.match(/log\(("|')(.*)\1\)/)[2];

      message = message.replace(/{random\((.*)\)}/g, (_, args) => {

        const [min, max] = args.split(',').map(arg => parseInt(arg.trim()));

        return Math.floor(Math.random() * (max - min + 1) + min);

      });

      if (Object.keys(vars).length > 0) {

        message = message.replace(/\{([^}]+)\}/g, (_, key) => {

          if (!key.includes(".")) {

            const mathRegex = /^([\d\s\.\*\+\-\x\/\(\)]+)$/;

            if (mathRegex.test(key)) {

              const result = eval(key.replaceAll("x", "*"));

              return result;

            }

            return vars[key] || `blank`;

          } else {

            let propSegments = key.split('.');

            let value = vars;

            for (let i = 0; i < propSegments.length; i++) {

              value = value[propSegments[i]];

            }

            return value || "blank";

          };

        });

        console.log(message.replaceAll(`"`, ``).replaceAll(`'`, ``).replaceAll("`", ``));

      } else {

        console.log(message.replaceAll(`"`, ``).replaceAll(`'`, ``).replaceAll("`", ``));

      }

    } 

     if(line.match(/log\((.*?)\)/) && !line.includes('"') && !line.includes("'") && !line.includes("`")) {

      

      let key = line.match(/log\((.*?)\)/)[1];

      let tu;

      if(key.includes('random')) key = key + ")";

      if(key.match(/random\((.*)\)/)) {

        const [min, max] = key.match(/random\((.*)\)/)[1].split(',');

     return console.log(Math.floor(Math.random() * (max - min + 1) + min));

    }

    if(!key.includes(".")) {

      const mathRegex = /^([\d\s\.\*\+\-\x\/\(\)]+)$/;

    if (mathRegex.test(key) === true) {

      const result = eval(key.replaceAll("x", "*"));

      tu = result;

    } else {

    tu = vars[key] || `blank`;

    }

    } else {

  let propSegments = key.split('.');

let value = vars;

for (let i = 0; i < propSegments.length; i++) {

  value = value[propSegments[i]];

}

tu = value || "blank";

    };

console.log(tu);

    }

   if (line.match(/^\s*([a-zA-Z0-9_]+)\s*=\s*(.*)\s*$/)) {

      vars[line.match(/^\s*([a-zA-Z0-9_]+)\s*=\s*(.*)\s*$/)[1].replaceAll(`"`, ``).replaceAll(`'`, ``).replaceAll("`", ``)] = eval(`(${line.match(/^\s*([a-zA-Z0-9_]+)\s*=\s*(.*)\s*$/)[2]})`);

    }

    if (line.startsWith("if(")) {

      const condition = line.match(/if\((.*)\)/)[1];

      const [left, operator, right] = condition.split(" ");

      let result;

      if (operator === "==") {

        result = vars[left] == vars[right];

      } else if (operator === "===") {

        result = vars[left] === vars[right];

      } else if (operator === ">") {

        result = vars[left] > vars[right];

      } else if (operator === "<") {

        result = vars[left] < vars[right];

      } else if (operator === ">=") {

        result = vars[left] >= vars[right];

      } else if (operator === "<=") {

        result = vars[left] <= vars[right];

      } else {

        throw new Error(`Invalid operator: ${operator}`);

      }

      let block = "";

      let i = lines.indexOf(line) + 1;

      while (lines[i] && !lines[i].startsWith("#")) {

        block += `${lines[i]}\n`;

        i++;

      }

      if (result) {

        await executeCodeBlock(block, vars);

      }

    } else {

     throw new Error(`Invalid statement: ${line}`);

    }

  }

}

const filename = process.argv[2];

if (filename === '.') {

  const files = fs.readdirSync(process.cwd());

  for (const file of files) {

    if (file.endsWith('.aiin') || file.endsWith('.an')) {

      executeFile(file);

    }

  }

  return;

}

if (!filename) {

  console.error('No file specified.');

  process.exit(1);

}

if (!fs.existsSync(filename)) {

  console.error(`File "${filename}" not found.`);

  process.exit(1);

}

const extension = path.extname(filename);

if (extension !== '.aiin' && extension !== ".an") {

  console.error(`Invalid file extension "${extension}". Expected ".aiin" or ".an".`);

  process.exit(1);

}

executeFile(filename);
