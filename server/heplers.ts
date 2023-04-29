function generateRandomString(length: number): string {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	const randomValues = new Uint32Array(length);
	const result: string[] = [];
  
	// Use crypto.getRandomValues for web browsers or crypto.randomFillSync for Node.js
	if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
	  window.crypto.getRandomValues(randomValues);
	} else {
	  const crypto = require('crypto');
	  crypto.randomFillSync(randomValues);
	}
  
	for (let i = 0; i < length; i++) {
	  result.push(characters[randomValues[i] % charactersLength]);
	}
  
	return result.join('');
  }

  export default generateRandomString;