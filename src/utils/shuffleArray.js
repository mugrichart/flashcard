 function shuffledNumbers(maxNumber) {
    let shuffledArray = []
    if (Array.isArray(maxNumber)) {
        shuffledArray = maxNumber
    }
    else{
        // Create an array of numbers from 0 to maxNumber
        for (var i = 0; i <= maxNumber; i++) {
          shuffledArray.push(i);
        }
    }
    
  
    // Shuffle the array
    for (var j = shuffledArray.length - 1; j > 0; j--) {
      var randomIndex = Math.floor(Math.random() * (j + 1));
      var temp = shuffledArray[j];
      shuffledArray[j] = shuffledArray[randomIndex];
      shuffledArray[randomIndex] = temp;
    }
  
    return shuffledArray;
  }
  
export default shuffledNumbers;