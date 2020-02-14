const fs = require('fs').promises;

// parse arguments
let args = process.argv;
if( args[2] == '-h' ) {
  console.log("node ab-autocomplete fragment textfile ..")
}

let fragment = args[2];
// console.log("fragment is " + fragment)

let libraryFiles = args.slice(3)
// TODO validate filenames, test if they exist

// read libraryFiles
readFiles(libraryFiles)
  .then( library => {
    // identify results
    let result = autocomplete(fragment, library);
    // print output
    console.log(result);
  })
  .catch(console.log)

// --------- End Main, Only helper functions below this point -------------//
// core autocomplete functionality
function autocomplete(fragment, library) {
  // grep with word boundaries
  let matchResults = search(fragment, library);
  let results = getTopResults(matchResults);
  return results;
}

// Reads the files and concatenates them into a single string
async function readFiles( filenames ) {
  let contentArray = await Promise.all(
    filenames.map(f => fs.readFile(f, 'utf8'))
  );
  let library = contentArray.reduce( (acc, content) => acc.concat( content ), "");
  // console.log(library)
  return library;
}

// Lowercases words and strips non alphabetic charaters
function sanitizeWord( word ) {
  if(typeof word === 'undefined') {
    return '';
  }
  // - make lowercase
  let sanitizedWord = word.toLowerCase();
  // - remove all non-letters
  sanitizedWord = sanitizedWord.replace(/[^a-z]/g, '');
  return sanitizedWord
}

// searches library for a fragment and returns hash of matches and their count
function search(fragment, library) {
  // sanitize input
  let searchTerm = sanitizeWord(fragment);
  if(searchTerm === "") {
    return {};
  }
  // add word boundary regex
  searchTerm = "\\w*" + searchTerm +"\\w*";
  const resultMap = {}
  let matches = library.matchAll(searchTerm)
  // count occurances for each result
  for (const regexMatch of matches) {
    let match = sanitizeWord(regexMatch[0]);
    let count = resultMap[match];
    if ( !count) {
      count = 0;
    }
    resultMap[match] = count + 1;
  }
  // console.log(library);
  // console.log(resultMap);
  return resultMap;
}

// returns the top num most frequent results
function getTopResults(results, num) {
  if(num === 'undefined') {
    num = 25;
  }
  let keys = Object.keys(results);
  // sort desc by occurances
  keys.sort(function(a, b) {
    return results[b] - results[a]
  });
  // return top num results
  keys = keys.slice(0, num);
  // include count in return value
  return keys.map( key => { return { suggestion: key, frequency: results[key] } });
}


module.exports = { sanitizeWord, search, getTopResults };
