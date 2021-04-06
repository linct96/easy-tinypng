/*
 * @Description: 
 * @Author: linchaoting
 * @Date: 2020-07-28 09:46:54
 * @LastEditTime: 2021-04-06 17:49:00
 */ 
const pkg = require('../package.json')
const { Command } = require('commander');

const program = new Command();

program.version(pkg.version);
program.requiredOption('-i --input <path>','input file path')
program.option('-o --output <path>','output file path')
program.parse(process.argv)
console.log(program.opts())