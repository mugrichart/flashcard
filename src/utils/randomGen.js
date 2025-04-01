
export default function randomGen(max, howMany, alreadyUsed) {
    return new Promise((resolve, reject) => {
      // //console.log('random', max, howMany, 'already: ', alreadyUsed)
      if (max === 1) resolve([0])
      // //console.log('continue')
      const randomArray = [];
      // Helper function to check if the item is valid and unique
      const isValidAndUnique = (item) => {
        return !randomArray.includes(item) && item !== alreadyUsed;
      };
  
      const generateRandomItem = () => {
        const item = Math.floor(Math.random() * max);
  
        if (isValidAndUnique(item)) {
            ////console.log(item, alreadyUsed, randomArray);
            randomArray.push(item);
  
          if (randomArray.length === howMany) {
            ////console.log(true, randomArray)
            clearInterval(intervalId); // Stop the interval once the array is complete
            resolve(randomArray);
          }
        }
      };
  
      const intervalId = setInterval(generateRandomItem, 1);
    });
  }
  