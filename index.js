#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);

import { program } from 'commander';
import chalk from 'chalk'; //美化终端
import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
const packages = require("./package.json") // use the require method
import logSymbols from 'log-symbols';
const regx = new RegExp("^[a-zA-Z\-0-9]+$"); //检查文件名是否是英文，只支持英文

program
  .version(packages.version, '-v,--version')
  .command('init <name>')
  .action(name => {
    if (!regx.test(name)) { //检查文件名是否是英文
      console.log(logSymbols.error, chalk.red('错误!请输入英文名称'));
      return
    }
    if (!fs.existsSync(name)) { //检查项目中是否有该文件
      fs.mkdirSync(name);
      //用户选择后回调
      console.log(logSymbols.success, chalk.green('开始创建..........,请稍候'));


      const templateFolderPath = path.join(__dirname, './template');
      var files = fs.readdirSync(templateFolderPath);
      console.log(templateFolderPath, files);
      for (let i = 0; i < files.length; i++) { //修改文件内容
        let filePath = `${name}/${files[i]}`;
        if (!fs.existsSync(filePath)) {
          const content = fs.readFileSync(path.join(templateFolderPath, files[i])).toString();
          fs.writeFileSync(filePath, content);
        }
      }
      console.log(logSymbols.success, chalk.green('创建成功！'));
    } else {
      console.log(logSymbols.error, chalk.red('有相同名称模版'));
    }
  });

program.parse(process.argv);
