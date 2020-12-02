function normalize(s) {
  return s.replace(/ [&\/\\#,+()$~%.'":*?<>{}]/g,'').toUpperCase()
}

let lookupColumns = {
 'CO': ['firstName', 'lastName', 'birthYear'],
 'FL': ['firstName', 'lastName', 'birthDate'], 
 'GA': ['firstName', 'lastName', 'birthDate'], 
 'MI': ['firstName', 'lastName', 'birthYear'],
 'NC': ['firstName', 'lastName', 'birthYear'],
 'NV': ['firstName', 'lastName', 'birthDate'],
 'OH': ['firstName', 'lastName', 'birthDate'],
 'PA': ['firstName', 'lastName', 'birthDate'],
 'RI': ['firstName', 'lastName', 'zipCode'],
 'WA': ['firstName', 'lastName', 'birthDate'],
 'WI': ['firstName', 'lastName', 'zipCode']}

function voter(line) { 
  let s = line.trim().split(',')
  let v = {}
  v['firstName'] = normalize(s[0])
  v['lastName'] = normalize(s[1])
  if (s[2] && s[2].indexOf('/') != -1) {
    let bd = s[2].split('/').map(c => parseInt(c))
	if (bd[0] > 1000) { 
	  let yr = bd.shift()
	  bd.push(yr)
	}
    v['birthDate'] = bd.map(c => c.toString()).join('/')
    v['birthYear'] = bd[2]    
  } else {
    v['birthYear'] = s[2]
  } 
  if (s.length > 3) {
    // have zip 
	let z = s[3]
	if (z.indexOf('-') != -1) {
      z = z.split('-')[0]
    }	  
	v['zipCode'] = z
  }  
  return v
}

function toBloomKey(voter, state) {
  let columns = lookupColumns[state]
  let key = []
  for (let c of columns) { 
    let v = voter[c]
	if (!v) {
	  throw "Missing data for voter"
	}
    key.push(voter[c])
  }
  return key.join(',')
}

let customNumHashes = {
  'CO': 12,
  'FL': 10,  
  'MI': 10,
  'NC': 10,
  'OH': 10,
  'PA': 10,
  'WA': 10,
  'WI': 8
}

function numHashes(state) {
  let custom = customNumHashes[state]
  return custom ? custom : 16
}

export {voter, toBloomKey, numHashes}