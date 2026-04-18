// Define the documents
const document1 = "The quick brown fox jumped over the lazy dog .";
const document2 = "The lazy dog slept in the sun .";

// Step 1: Tokenize
const tokens1 = document1.toLowerCase().split(/\s+/);
const tokens2 = document2.toLowerCase().split(/\s+/);

// Unique terms
const terms = [...new Set([...tokens1, ...tokens2])];

// Step 2: Building inverted index
const invertedIndex = {};

//now loop through each term
for (const term of terms) {
  const documents = [];

  if (tokens1.includes(term)) {
    documents.push("Document 1");
  }

  if (tokens2.includes(term)) {
    documents.push("Document 2");
  }
//Making the term as key and the documents as a value 
  invertedIndex[term] = documents;
}

// Step 3: Print
for (const [term, docs] of Object.entries(invertedIndex)) {
  console.log(`${term} -> ${docs.join(", ")}`);
}