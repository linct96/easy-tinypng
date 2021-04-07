#!/usr/bin/env node
const pkg = require('../package.json')
const { Command } = require('commander');
const tiny = require('../lib/tiny');

const program = new Command();

program.version(pkg.version);
program.requiredOption('-i --input <path>', 'input file path')
program.option('-o --output <path>', 'output file path')
program.option('-r --ratio <number>', 'unCompress ratio limit')
program.option('-v --verbose', 'show log')
program.parse(process.argv)
const {
  input: inputPath,
  output: outputPath,
  ratio: compressRatioLimit,
  verbose: verbose
} = program.opts()
tiny(inputPath, {
  outputPath,
  compressRatioLimit,
  verbose
})