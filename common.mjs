function normalize(s) {
  return s.replace(/ [&\/\\#,+()$~%.'":*?<>{}]/g,'').toUpperCase()
}

let lookupColumns = {
 'GA': ['firstName', 'lastName', 'birthDate'], 
 'MI': ['firstName', 'lastName', 'birthYear'],
 'NV': ['firstName', 'lastName', 'birthDate'],
 'PA': ['firstName', 'lastName', 'birthDate'],
 'WI': ['firstName', 'lastName', 'zipCode']}

function voter(line) { 
  let s = line.trim().split(',')
  let v = {}
  v['firstName'] = normalize(s[0])
  v['lastName'] = normalize(s[1])
  if (s[2].indexOf('/') != -1) {
    let bd = s[2].split('/')
    v['birthDate'] = bd.map(c => parseInt(c).toString()).join('/')
    v['birthYear'] = bd[2]    
  } else {
    v['birthYear'] = s[2]
  }
  return v
}

function toBloomKey(voter, state) {
  let columns = lookupColumns[state]
  let key = []
  for (let c of columns) { 
    key.push(voter[c])
  }
  return key.join(',')
}

let k = 16

export {voter, toBloomKey, k}