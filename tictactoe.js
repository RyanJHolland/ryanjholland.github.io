$(document).ready(function() {

  playerWinsCounter = 0;
  compWinsCounter = 0;
  tiesCounter = 0;
  emptySlotCounter = 9;
  playerGoesNext = true;
  playerWentLast = false;
  winningChain = ""; // for the graphics that highlight it
  playerMark = "X";
  compMark = "O";
  gameOver = false;
  customDifficultyDifference = 0;
  difficulty = playerWinsCounter - compWinsCounter + customDifficultyDifference;
  chains = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["1", "4", "7"],
  ["2", "5", "8"],
  ["3", "6", "9"],
  ["1", "5", "9"],
  ["3", "5", "7"]
  ];

  increaseDifficulty = function() {
    customDifficultyDifference++;
    difficulty = playerWinsCounter - compWinsCounter + customDifficultyDifference;
    $("#Record").html("Difficulty: " + difficulty + "<br>Your victories: " + playerWinsCounter + "<br>Your losses: " + compWinsCounter + "<br>Ties: " + tiesCounter);

  }

  decreaseDifficulty = function() {
    customDifficultyDifference--;
    difficulty = playerWinsCounter - compWinsCounter + customDifficultyDifference;
    $("#Record").html("Difficulty: " + difficulty + "<br>Your victories: " + playerWinsCounter + "<br>Your losses: " + compWinsCounter + "<br>Ties: " + tiesCounter);

  }

  resetBoard = function() {
    console.log("resetBoard");
    difficulty = playerWinsCounter - compWinsCounter + customDifficultyDifference;
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
    $("#Record").html("Difficulty: " + difficulty + "<br>Your victories: " + playerWinsCounter + "<br>Your losses: " + compWinsCounter + "<br>Ties: " + tiesCounter);
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
      console.log("player won");
      for (var i in winningChain) {
        document.getElementById(winningChain[i]).className = "playerWin";
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
            document.getElementById(winningChain[arg]).className = "compWin";
            compWinGraphic(arg+1);
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
    for (var chain in chains) {
      var xCounter = 0;
      var oCounter = 0;
      for (var i in chains[chain]) {
        if (document.getElementById(chains[chain][i]).innerHTML === "X") {
          xCounter += 1;
        }
        if (document.getElementById(chains[chain][i]).innerHTML === "O") {
          oCounter += 1;
        }
        if (xCounter === 3) {
          winnerFound = true;
          winningChain = chains[chain];
          someoneWon("X");
        } else if (oCounter === 3) {
          winnerFound = true;
          winningChain = chains[chain];
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

// I'm using the word "chain" to describe the 3-slot, straight-line, victory conditions. The AI looks at each slot and 
// prioritizes it by how many chains it is in, taking into account what marks (X or O) are in each of those chains.
// It prefers slots which are in chains which have other Os, or which have an X, so it can block that chain.
AI = function() {
  console.log("AI");
  compMovedAlready = false;

  chainPriorityList = [
  [0,1],
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

      // For each chain:
      for (var chain in chains) {

        var playerMarkCount = 0;
        var compMarkCount = 0;

        // Count how many of each mark is in the chain on the board now.
        for (var slot in chains[chain]) {
          if (document.getElementById(chains[chain][slot]).innerHTML === playerMark) {
            playerMarkCount += 1;
          }
          if (document.getElementById(chains[chain][slot]).innerHTML === compMark) {
            compMarkCount += 1;
          }
        } 

        // Prioritize it depending on what's in it:
        if (compMarkCount === 1 && playerMarkCount === 0) {
          chainPriorityList[chain][1] ++; // finish your own chain
        } else if (compMarkCount === 0 && playerMarkCount === 1) { 
          chainPriorityList[chain][1] ++; // block enemy chain
        } else if ((compMarkCount === 1 || compMarkCount === 2) && (playerMarkCount === 1 || playerMarkCount === 2)) {
          chainPriorityList[chain][1] -= 100; // ignore inert chain
        } else if (playerMarkCount === 2) {
          chainPriorityList[chain][1] += 100; // block enemy victory
        } else if (compMarkCount === 2) {
          chainPriorityList[chain][1] += 200; // win game
        }

        // Update slot priority list
        for (var slot in chains[chain]) {
          if (difficulty>0) {
            slotPriorityList[chains[chain][slot]-1] += 1 + chainPriorityList[chain][1];
          } else {
            slotPriorityList[chains[chain][slot]-1] -= 1 + chainPriorityList[chain][1];
          }
        }
      }

      var countdown = 9;
    // Mark the highest ranking available slot
    function compPlaceIntelligentMark() {
      console.log("compPlaceIntelligentMark");
      if (countdown===0) {
        randomMove(); // If there's only one slot available, and it can't detect it, it moves randomly until it finds it.
        // Otherwise it was endlessly looping sometimes. This is faster than coding an iteration to find it.
      } else {
        var bestSlot = slotPriorityList.indexOf(Math.max(...slotPriorityList)) + 1;
        if (document.getElementById(bestSlot).innerHTML == "&nbsp;") {
          document.getElementById(bestSlot).innerHTML = compMark;
          document.getElementById(bestSlot).className = "compSlot";
          compMovedAlready = true; 
        } else {
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