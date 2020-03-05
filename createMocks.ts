// This mock creator uses Node-emberplus test creator by g.dufour@evs.com

const jsonRoot = require('./src/__tests__/createTestTree').jsonRoot
const fs = require('fs')

let convertedTree = JSON.stringify(jsonRoot())
console.log('Storing Ember Tree : ', convertedTree)
fs.writeFileSync('storage/embertree.json', convertedTree)
console.log('Tree Stored')