/*
 * @Description: 
 * @Author: linchaoting
 * @Date: 2020-07-28 09:46:54
 * @LastEditTime: 2020-07-30 15:09:21
 */ 
const pkg = require('../package.json')
const { program } = require('commander');
program.name('tiny')
program.version(pkg.version);
program.requiredOption('-i --input <path>','input file path')
program.option('-o --output <path>','output file path')
program.parse(process.argv)
console.log(program.opts())