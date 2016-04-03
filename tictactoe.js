$(document).ready(function() {

  playerWinsCounter = 0;
  compWinsCounter = 0;
  tiesCounter = 0;
  emptySlotCounter = 9;
  playerGoesNext = true;
  playerWentLast = false;
  winningRow = ""; // for the graphics that highlight it
  playerMark = "X";
  compMark = "O";
  gameOver = false;
  customDifficultyDifference = 0;
  difficulty = playerWinsCounter - compWinsCounter + customDifficultyDifference;
  rows = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["1", "4", "7"],
  ["2", "5", "8"],
  ["3", "6", "9"],
  ["1", "5", "9"],
  ["3", "5", "7"]
  ];

  var sound1 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
  var sound2 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
  var sound3 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
  var sound4 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");

  increaseDifficulty = function() {
    if (difficulty < 10) {
      customDifficultyDifference++;
      difficulty = playerWinsCounter - compWinsCounter + customDifficultyDifference;
      $("#Record").html("Difficulty: " + difficulty + "/10<br>Your victories: " + playerWinsCounter + "<br>Your losses: " + compWinsCounter + "<br>Ties: " + tiesCounter);
    };
  }

  decreaseDifficulty = function() {
    if (difficulty > 0) {
      customDifficultyDifference--;
      difficulty = playerWinsCounter - compWinsCounter + customDifficultyDifference;
      $("#Record").html("Difficulty: " + difficulty + "/10<br>Your victories: " + playerWinsCounter + "<br>Your losses: " + compWinsCounter + "<br>Ties: " + tiesCounter);
    };
  }

  resetBoard = function() {
    console.log("resetBoard");
    if (0 < difficulty < 10){
        difficulty = playerWinsCounter - compWinsCounter + customDifficultyDifference;
      };
    gameOver = false;
    for (var i = 1; i < 10; i++) {
      document.getElementById(i).className = "slot";
      document.getElementById(i).style = "pointer-events:none;";
      $("#" + i).html("&nbsp;");
    }
    if (playerGoesNext) {
      setTimeout(function() {
        enableMouse();
      }, 300);
    } else {
      compMove();
    }
    emptySlotCounter = 9;
    $("#Record").html("Difficulty: " + difficulty + "/10<br>Your victories: " + playerWinsCounter + "<br>Your losses: " + compWinsCounter + "<br>Ties: " + tiesCounter);
  }

  function disableMouse() {
    console.log("disableMouse");
    for (var i = 1; i < 10; i++) {
      document.getElementById(i).style = "pointer-events:none;";
    }
  }
  function enableMouse() {
    console.log("enableMouse");
    for (var i = 1; i < 10; i++) {
      document.getElementById(i).style = "pointer-events:auto;";
    }
  }

  var fadeSlot = 1;
  function fadeOut() {
    console.log("fadeOut");
    if (fadeSlot < 10) {
      setTimeout(function(){
        document.getElementById(fadeSlot.toString()).className = "slot";
        fadeSlot++;
        fadeOut();
      }, 150);
    } else {
      fadeSlot = 1;
      setTimeout(function() {
        resetBoard();
      }, 1650);
    }
  }

  someoneWon = function(winner) {
    console.log("someoneWon");
    disableMouse();
    gameOver = true;
    
    if (winner === "X") {
      setTimeout(function() {
        sound3.cloneNode(true).play();
      }, 150);
      setTimeout(function() {
        sound3.cloneNode(true).play();
      }, 300);
      setTimeout(function() {
        sound3.cloneNode(true).play();
      }, 450);
      console.log("player won");
      for (var i in winningRow) {
        document.getElementById(winningRow[i]).className = "playerWin";
      }
      playerGoesNext = false;
      playerWinsCounter += 1;

      setTimeout(function() { 
        fadeOut();
      },1000);

    } else if (winner === "O") {
      console.log("comp won");

      function compWinGraphic(arg) {
        setTimeout(function() {
          if (arg < 3) {
            document.getElementById(winningRow[arg]).className = "compWin";
            compWinGraphic(arg+1);

            setTimeout(function() {
              sound4.cloneNode(true).play();
            }, 200);
          }
        }, 150);
      }
      compWinGraphic(0);

      playerGoesNext = true;
      compWinsCounter += 1;

      setTimeout(function() {
        fadeOut();
      },1000);

    }
  }

  winCheck = function() {
    console.log("winCheck");
    var winnerFound = false;
    for (var row in rows) {
      var xCounter = 0;
      var oCounter = 0;
      for (var i in rows[row]) {
        if (document.getElementById(rows[row][i]).innerHTML === "X") {
          xCounter += 1;
        }
        if (document.getElementById(rows[row][i]).innerHTML === "O") {
          oCounter += 1;
        }
        if (xCounter === 3) {
          winnerFound = true;
          winningRow = rows[row];
          someoneWon("X");
        } else if (oCounter === 3) {
          winnerFound = true;
          winningRow = rows[row];
          someoneWon("O");
        }
      }
    }

    if (emptySlotCounter == 0 && winnerFound == false) { // a tie
      console.log("tie found");
      gameOver = true;
      tiesCounter += 1;

      // tie wipe animation
      function tieGraphic(arg) {
        setTimeout(function() {
          if (arg < 10) {
            document.getElementById(arg).innerHTML = "tie";
            tieGraphic(arg+1);
          }
        }, 150);
      }
      tieGraphic(2);
      document.getElementById("1").innerHTML = "tie";



      if (playerWentLast) {
        playerGoesNext = false;
      }

      fadeOut();
    }
  }


  move = function(e) {
    console.log("move function (player clicked on slot, empty or not)");
    disableMouse();
    if (!e) {
      e = window.event;
    }
    var eventTarget = e.target || e.srcElement;

    var mark = document.getElementById(eventTarget.id).innerHTML;

    if (mark == "&nbsp;" && playerGoesNext) {
      document.getElementById(eventTarget.id).innerHTML = playerMark;
      document.getElementById(eventTarget.id).className = "playerSlot";
      sound1.cloneNode(true).play();

      emptySlotCounter -= 1;
      playerWentLast = true;
      winCheck();

      if (emptySlotCounter>=1 && !gameOver) {
        playerGoesNext = false;
        compMove();
      }
    } else if (playerGoesNext ) {
      console.log("move function called enableMouse");
      enableMouse();
    }
  }

// HOW THE AI WORKS

// Every turn, it weights each row by looking at what marks (if any) are in its 3 slots.

// A row gains weight if either the player or AI has one mark in it.

// However, if both the player and AI have one mark each in the same row, no one can win in that row,
// so the AI gives it zero weight.

// If the player is about to win (2 player marks and 1 empty slot in one row), that row gets weighted highly.

// The highest weight is given to a row with 2 AI marks and 1 empty slot.

// After weighting the row, it adds the weight to the slot's weight. Then it weights the next row, repeating
// the process. After weighting every row, it is ready to choose the best slot by whichever has the highest weight.

AI = function() {
  console.log("AI");
  compMovedAlready = false;

  rowPriorityList = [ // this correlates to the 'rows' array at the top of this script.
  [0,1],              // the first number is the row and the second number is the priority. All start at 1.
  [1,1],
  [2,1],
  [3,1],
  [4,1],
  [5,1],
  [6,1],
  [7,1]
  ];

  slotPriorityList = [
  0,0,0,
  0,0,0,
  0,0,0
  ];

      // For each row:
      for (var row in rows) {

        // Tally up the marks in the row by examining each of the row's 3 slots:
        var playerMarkCount = 0;
        var compMarkCount = 0;
        for (var slot in rows[row]) {
          if (document.getElementById(rows[row][slot]).innerHTML === playerMark) {
            playerMarkCount += 1;
          }
          if (document.getElementById(rows[row][slot]).innerHTML === compMark) {
            compMarkCount += 1;
          }
        } 

        // Prioritize the row depending on the tallies:
        if (compMarkCount === 1 && playerMarkCount === 0) {
          // Finishing your own row is a better idea than starting a new row.
          rowPriorityList[row][1] ++;
        }
        else if (compMarkCount === 0 && playerMarkCount === 1) { 
          // Blocking an enemy row is a good idea too.
          rowPriorityList[row][1] ++; 
        }
        else if ((compMarkCount === 1 || compMarkCount === 2) && (playerMarkCount === 1 || playerMarkCount === 2)) {
           // No one can win in this row, so ignore it.
           rowPriorityList[row][1] = 0;
         }
         else if (playerMarkCount === 2) {
          // The enemy is about to win... This is high priority!
          rowPriorityList[row][1] += 100; 
        }
        else if (compMarkCount === 2) {
          // But winning the game is the highest priority of all!
          rowPriorityList[row][1] += 200;
        }
        // Update slot priority list. This loop fires after each row has been weighted!
        // That means the AI's choice of slot will take into account the various weights
        // of every row the slot is a part of.
        for (var slot in rows[row]) {
          slotPriorityList[rows[row][slot]-1] += 1 + rowPriorityList[row][1];
        }
      }

      // Now that the slots are all weighted, it chooses the best one and marks it:
      var countdown = 9;
    function compPlaceIntelligentMark() {
      console.log("compPlaceIntelligentMark");
      if (countdown===0) {
        randomMove(); // If there's only one slot available, it moves randomly until it finds it.
                      // This solves a bug where it would endlessly loop sometimes.
      } else {
        var bestSlot = slotPriorityList.indexOf(Math.max(...slotPriorityList)) + 1; // Get highest priority slot.
        if (document.getElementById(bestSlot).innerHTML == "&nbsp;") { // Check if it's empty.
        document.getElementById(bestSlot).innerHTML = compMark;
        document.getElementById(bestSlot).className = "compSlot";
        sound2.cloneNode(true).play();
        compMovedAlready = true; 
        } else { // If it isn't, get the next best.
        slotPriorityList[bestSlot - 1 ] = 0;
        countdown--;
        compPlaceIntelligentMark();
      } 
    }
  }
  compPlaceIntelligentMark();
}

compMove = function() {
  console.log("compMove");
  disableMouse();

  highlights = emptySlotCounter/2;

  randomHighlight = function() {
    console.log("randomHighlight");
    compHover = Math.floor(Math.random() * 9) + 1;
    lastcompHover = 10;
    if (document.getElementById(compHover).innerHTML == "&nbsp;" && compHover !== lastcompHover) {
      document.getElementById(compHover).className = 'compHover';
      lastcompHover = compHover;
      setTimeout(function(){
        document.getElementById(compHover).className = 'slot';
        highlights--;
        if (highlights > 0) {
          randomHighlight();
        } else {
          highlights = emptySlotCounter/2 - difficulty/2;

          randomMove = function() {
            console.log("randomMove");
            randomSlot = Math.floor(Math.random() * 9) + 1;
            if ($("#" + randomSlot).html() == "&nbsp;") {
              $("#" + randomSlot).html(compMark);
              document.getElementById(randomSlot).className = "compSlot";
              sound2.cloneNode(true).play();
            } else {
              randomMove();
            }
          }
          if (difficulty > 10) {
            AI();
          } else if (Math.floor(Math.random() * difficulty) < 1) {
            randomMove();
          } else {
            AI();
          }
          emptySlotCounter -= 1;
          playerGoesNext = true;
          playerWentLast = false;
          winCheck();
          if (playerGoesNext && !gameOver) {
            console.log("compMove function called enableMouse");
            enableMouse();
          }
        }
      },250);
    } else {
      randomHighlight();
    }
  }
  randomHighlight();

}
})