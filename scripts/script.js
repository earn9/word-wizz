//NAMESPACE: To keep app contained
const wizApp = {}

// =============== GLOBAL STATES  =============== //
wizApp.guessedWords = [];
wizApp.totalScore = [];
wizApp.currentRoundNum = 0;
wizApp.nextRoundNum = 1;
wizApp.category = [
  // ANIMALS
  [
    { //chicken
      type: `Chicken`,
      words: [`kfc`, `wing`],
      score: 0
    },
    { //cow
      type: `Cow`,
      words: [`steak`, `moo`],
      score: 0
    },
    { //fish
      type: `Fish`,
      words: [`wet`, `ocean`, `gill`, `gills`],
      score: 0
    }
  ]
];

// Animal References
wizApp.animalCategory = wizApp.category[0];
wizApp.chicken = wizApp.animalCategory[0];
wizApp.cow = wizApp.animalCategory[1];
wizApp.fish = wizApp.animalCategory[2];

wizApp.finalChickenWords = wizApp.chicken.words;
wizApp.finalCowWords = wizApp.cow.words;
wizApp.finalFishWords = wizApp.fish.words;

wizApp.chickenObjsFromAPI = [];
wizApp.cowObjsFromAPI = [];
wizApp.fishObjsFromAPI = [];


// =============== API CALLS  =============== //
//Keys needed for iterating through the four different endpoints
wizApp.wordTypeKey = [`rel_jjb=`, `rel_jja=`, `rel_trg=`, `ml=`];

// Function to filter through array to remove duplicate words
wizApp.uniqueArr = function (arr) {
  return arr.filter(function (item, index) {
    return arr.indexOf(item) >= index;
  })
};

wizApp.getWords = (wordType, animal) => {
return $.ajax ({
    url: `https://api.datamuse.com//words?${wordType}${animal}`,
    dataType: `json`,
    method: `GET`
  })
};

// Chicken API call
wizApp.compiledChickenArr = [];
for (let i = 0; i <= 3; i++) {
  chickenObjsFromAPI = [];
  wizApp.chickenObjsFromAPI.push(wizApp.getWords(wizApp.wordTypeKey[i], `chicken`));
}
$.when(...wizApp.chickenObjsFromAPI).then((...chickenWords) => {
  const pulledArray = chickenWords.map(word => {
    return word[0];
  });
  for (i = 0; i <= 3; i++) {
    pulledArray[i].forEach(chick => {
      wizApp.compiledChickenArr.push(chick.word);
    });
  }
  cleanChickenArr = wizApp.uniqueArr(wizApp.compiledChickenArr);
  wizApp.chicken.words.push(...cleanChickenArr);
});


// Cow API call
wizApp.compiledCowArr = [];
for (let i = 0; i <= 3; i++) {
  wizApp.cowObjsFromAPI.push(wizApp.getWords(wizApp.wordTypeKey[i], `cow`));
}
$.when(...wizApp.cowObjsFromAPI).then((...cowWords) => {
  const pulledArray = cowWords.map(word => {
    return word[0];
  });
  for (i = 0; i <= 3; i++) {
    pulledArray[i].forEach(cow => {
      wizApp.compiledCowArr.push(cow.word);
    });
  }
  cleanCowArr = wizApp.uniqueArr(wizApp.compiledCowArr);
  wizApp.cow.words.push(...cleanCowArr);
});


// Fish API call
wizApp.compiledFishResults = [];
for (let i = 0; i <= 3; i++) {
  wizApp.fishObjsFromAPI.push(wizApp.getWords(wizApp.wordTypeKey[i], `fish`));
}
$.when(...wizApp.fishObjsFromAPI)
  .then((...fishWords) => {
    const pulledArray = fishWords.map((word) => {
      return word[0];
    })
    for (i = 0; i <= 3; i++) {
      pulledArray[i].forEach((fish) => {
        wizApp.compiledFishResults.push(fish.word)
      });
    }
    cleanFishArray = wizApp.uniqueArr(wizApp.compiledFishResults);
    wizApp.fish.words.push(...cleanFishArray)
  });


// =============== GAME FUNCTIONS  =============== //

//Form to handle user's guesses
wizApp.handleSubmit = (animalCategoryay, animalScore) => {
  // Grab the user's guess from input field
  let userInput = $(`input`).val().toLowerCase();
  // Reset input field to nothing after user submits
  $(`input`).val(``);
  // Check user's guess against current list and if correct, add one
  if (animalCategoryay.includes(userInput) && !wizApp.guessedWords.includes(userInput)) {
      animalScore.score += 1;
      wizApp.guessedWords.push(userInput);
    // Append correct guesses and colour them green
    $(`.user-guesses`).append(`<li class="correct">${userInput}</li>`);
    // Update score
    $(`.score-counter`).html(`<p>${animalScore.score}</p>`);
  } else {
    // If inputs do not match, still append but leave red
    $(`.user-guesses`).append(`<li>${userInput}</li>`);
  }
};

// Set-up for cycling through the rounds
wizApp.round = () => {
  $(`.intro-screen`).addClass(`hide`);
  $(`.game-play-screen`).removeClass(`hide`);
  $(`.game-center`).removeClass(`hide`);
  wizApp.currentRoundNum += 1;
  wizApp.nextRoundNum += 1;
  $(`h2 span`).html(`${wizApp.currentRoundNum}`);
  if (wizApp.currentRoundNum === 1) {
    wizApp.displayGameCountdown(wizApp.chicken);
  } else if (wizApp.currentRoundNum === 2) {
    wizApp.displayGameCountdown(wizApp.cow);
  } else if (wizApp.currentRoundNum === 3) {
    wizApp.displayGameCountdown(wizApp.fish);
  };
};

// Countdown screen for each round
wizApp.displayGameCountdown = animal => {
  $(`.score-counter`).html(`<p>${animal.score}</p>`);
  $(`.countdown-screen`).removeClass(`hide`);
  //reset input field to nothing before each round
  $(`input`).val(``);
  let timeLeft = 3;
  let timer = setInterval(function() {
    $(`.three-sec-timer`).html(timeLeft);
    timeLeft -= 1;
    if (timeLeft < 0) {
      timeLeft = 3;
      wizApp.playGame(animal);
      window.clearInterval(timer);
      $(`.three-sec-timer`).html(``);
    }
    //run the timer at 1 sec intervals
  }, 1000);
};

// Play the game
wizApp.playGame = animal => {
  // Automatically sets user input field to be focused on load
  $('#user-input').focus();
  $(`.category-word`).html(`${animal.type}`);
  $(`.countdown-screen`).addClass(`hide`);
  //start timer for the game rounds
  let timeLeft = 20;
  let timer = setInterval(function() {
    $(`.play-timer`).html(timeLeft);
    timeLeft -= 1;
    if (timeLeft === 0) {
      $(`.game-play-screen`).addClass(`hide`);
      window.clearInterval(timer);
      $(`.play-timer`).html(``);
      wizApp.displayRoundResultScreen(animal);
      //reset the guessedWords to an empty array for next round
      wizApp.guessedWords = [];
    }
  }, 1000);
};

// Display user score for the round
wizApp.displayRoundResultScreen = (animal) => {
  //update values and display round results
  $(`.round-result-screen p span`).html(`${animal.score}`);
  wizApp.totalScore.push(animal.score);
  $(`h2 span`).html(`${wizApp.currentRoundNum}`);
  if (wizApp.currentRoundNum === 3) {
    $(`.next-round-btn`).html(`Did you out-wiz our Wizard?`).on(`click`, function () {
      wizApp.displayTotalScoreScreen();
    });
  } else {
    $(`.next-round-btn span`).html(`${wizApp.nextRoundNum}`);
  }
  $(`.round-result-screen`).removeClass(`hide`);
  $(`form`).attr(`id`, `round-${wizApp.nextRoundNum}`)
}

// Display final user score
wizApp.displayTotalScoreScreen = () => {
  $(`.final-result-screen`).removeClass(`hide`);
  $(`.game-center`).addClass(`hide`);
  const sum = wizApp.totalScore.reduce((total, a) => total + a, 0);
  $(`p span`).html(`${sum}`);
};

// Event listeners for game functionality
wizApp.eventListeners = () => {
  // Start the first round on click of start button
  $(`.start-btn`).on(`click`, function () {
    wizApp.round();
  });
  // If user is on rounds 1 or 2, go to next round
  if (wizApp.currentRoundNum < 3) {
    $(`.next-round-btn`).on(`click`, function () {
      $(`.round-result-screen`).addClass(`hide`);
      $(`li`).addClass(`hidden`);
      wizApp.round();
    });
  } // If on final round (3), go to the final results score screen
  else if (wizApp.currentRoundNum === 3) {
    $(".next-round-btn").on("click", function() {
      $(".game-center").addClass("hide");
      $(".game-play-screen").addClass("hide");
      $(".round-result-screen").addClass("hide");
      $(".final-result-screen").removeClass("hide");
      wizApp.displayTotalScoreScreen();
    });
  };
   
  // Form handling for user user guesses
  $(`form`).on(`submit`, function (event) {
    // Prevent the default behaviour
    event.preventDefault();
    const round = event.target.id;
    if (round === `round-one`) {
      wizApp.handleSubmit(wizApp.finalChickenWords, wizApp.chicken);
    } else if (round === `round-two`) {
      wizApp.handleSubmit(wizApp.finalCowWords, wizApp.cow);
    } else {
      wizApp.handleSubmit(wizApp.finalFishWords, wizApp.fish);
    } 
  });

  // Reset the game when play again button is clicked
  $(`.play-again-btn`).on(`click`, function() {
    console.log(`clicked reset btn`);
    window.location.reload();
  });
};

// Initialise the game
wizApp.init = () => {
  wizApp.eventListeners();
};

// DOC READY: Only run when DOM elements have loaded
$(function () {
  wizApp.init();
});
