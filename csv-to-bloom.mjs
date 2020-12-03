import {promises as fs} from "fs"
import readline from "readline"
import {BloomFilter} from "bloomfilter"
import {voter, toBloomKey, numHashes} from './common.mjs'

let bloomSizes = {
 'CO': 48000000,
 'FL': 80000000,
 'MI': 64000000,
 'GA': 48000000,
 'NC': 48000000,
 'NV': 24000000,
 'NY': 90000000,
 'OH': 36000000,
 'PA': 56000000,
 'RI': 18000000,
 'WA': 32000000, 
 'WI': 24000000 
}

let state = process.argv[2]

async function insertVotersAndSave() {
  // https://stackoverflow.com/questions/658439/how-many-hash-functions-does-my-bloom-filter-need
  let m = bloomSizes[state]
  let k = numHashes(state)
  let bloom = new BloomFilter(m, k)

  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  const rl = readline.createInterface({
    input: process.stdin,
    crlfDelay: Infinity
  })

  let n = 0
  for await (const line of rl) {
    try { 
      let key = toBloomKey(voter(line), state)
      bloom.add(key);
	  n += 1
	} catch (error) {
	  console.error("Bad voter line: " + line)
	}
  }
  console.log(bloom)
  let bestk = (m/n)*Math.log(2)
  console.log(`${n} voters inserted. Should be using k = ${bestk}.`)

  // FIXME: short write?
  await fs.writeFile('buckets/' + state, bloom.buckets, 'binary');
}

insertVotersAndSave()

