$(document).ready(function() {

  playerWins = 0;
  playerLosses = 0;
  ties = 0;
  slotCounter = 9;
  playerTurn = 1;

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

  markAssign = function() {
    if (document.getElementById("X").checked) {
      playerMark = "X";
    } else {
      playerMark = "O";
    }
  }

  setDifficulty = function() {
    if (document.getElementById("Easy").checked) {
      difficulty = "Easy";
    } else if (document.getElementById("Medium").checked) {
      difficulty = "Medium";
    } else {
      difficulty = "Hard";
    }
  }

  restart = function() {
    $("#1").html("&nbsp;");
    $("#2").html("&nbsp;");
    $("#3").html("&nbsp;");
    $("#4").html("&nbsp;");
    $("#5").html("&nbsp;");
    $("#6").html("&nbsp;");
    $("#7").html("&nbsp;");
    $("#8").html("&nbsp;");
    $("#9").html("&nbsp;");
    $(".slot").css("background-color", "lightblue");
    slotCounter = 9;
    $("#Record").html("Your victories: " + playerWins + "<br>Your losses: " + playerLosses + "<br>Ties: " + ties);

  }

  someoneWon = function(winner) {
    if (winner === "X") {
      if (playerMark == "X") {
        $(".slot").css("background-color", "lightgreen");
        alert("Victory!");
        playerWins += 1;
      } else {
        $(".slot").css("background-color", "red");
        alert("Defeat...");
        playerLosses += 1;
      }
      restart();
    } else if (winner === "O") {
      if (playerMark == "O") {
        $(".slot").css("background-color", "lightgreen");
        alert("Victory!");
        playerWins += 1;
      } else {
        $(".slot").css("background-color", "red");
        alert("Defeat...");
        playerLosses += 1;
      }
      restart();
    }
  }

  winCheck = function() {
    
    for (var x in chains) {
      var xCounter = 0;
      var oCounter = 0;
      for (var i in chains[x]) {
        if (document.getElementById(chains[x][i]).innerHTML === "X") {
          xCounter += 1;
        }
        if (document.getElementById(chains[x][i]).innerHTML === "O") {
          oCounter += 1;
        }
        if (xCounter === 3) {
          someoneWon("X");
        } else if (oCounter === 3) {
          someoneWon("O");
        }
      }
    }
    if (slotCounter == 0) {
      $(".slot").css("background-color", "yellow");
      alert("A tie.");
      ties += 1;
      restart();
    }
  }


    /*
      for (var i = 1; i < 10; i++) {
        document.getElementById()
      }
      */

      move = function(e) {

        if (!e) {
          e = window.event;
        }
        var eventTarget = e.target || e.srcElement;
        markAssign();
        setDifficulty();

        var mark = document.getElementById(eventTarget.id).innerHTML;

        if (mark == "&nbsp;" && playerTurn) {
          document.getElementById(eventTarget.id).innerHTML = playerMark;

          slotCounter -= 1;

          winCheck();
          compMove();

        }
      }

      AI = function() {
        movedAlready = false;

        if ($("#5").html() == "&nbsp;") {
          $("#5").html(compMark);
          movedAlready = true;
        } else if (slotCounter === 7) {
          if ($("#1").html() == playerMark) {
            $("#9").html(compMark);
          } else if ($("#3").html() == playerMark) {
            $("#7").html(compMark);
          } else if ($("#7").html() == playerMark) {
            $("#3").html(compMark);
          } else {
            $("#1").html(compMark);
          }
          movedAlready = true;
        } else if (slotCounter === 6) {
          $("#6").html(compMark);
          movedAlready = true;
        } else {
          for (var x in chains) {
            var playerChainCount = 0;
            var compChainCount = 0;
            for (var i in chains[x]) {
              if (document.getElementById(chains[x][i]).innerHTML === playerMark) {
                playerChainCount += 1;
              }
              if (document.getElementById(chains[x][i]).innerHTML === compMark) {
                compChainCount += 1;
              }
            }
            if (playerChainCount === 2 && movedAlready === false) {
              for (var i in chains[x]) {
                if (document.getElementById(chains[x][i]).innerHTML == "&nbsp;") {
                  document.getElementById(chains[x][i]).innerHTML = compMark;
                  movedAlready = true;
                }
              }
            } else if (compChainCount === 2 && movedAlready === false) {
              for (var i in chains[x]) {
                if (document.getElementById(chains[x][i]).innerHTML == "&nbsp;") {
                  document.getElementById(chains[x][i]).innerHTML = compMark;
                  movedAlready = true;
                }
              }
            }
          }
        }
        if (!movedAlready) {
          if ($("#1").html() == "&nbsp;") {
            $("#1").html(compMark);
          } else if ($("#3").html() == "&nbsp;") {
            $("#3").html(compMark);
          } else if ($("#7").html() == "&nbsp;") {
            $("#7").html(compMark);
          } else if ($("#9").html() == "&nbsp;") {
            $("#9").html(compMark);
          }
          movedAlready = true;
        }
      }

      compMove = function() {
        playerTurn = 0;
        $(".slot").css("background-color", "lightblue");
        setTimeout(function() {
          //disable mouse here
          if (playerMark == "X") {
            compMark = "O";
          } else {
            compMark = "X";
          }

          randomMove = function() {
            randomSlot = Math.floor(Math.random() * 9) + 1;
            if ($("#" + randomSlot).html() == "&nbsp;") {
              $("#" + randomSlot).html(compMark);
            } else {
              randomMove();
            }
          }

          if (difficulty == "Easy") {
            randomMove();
          } else if (difficulty == "Medium") {
            if (Math.floor(Math.random() * 3) == 1) {
              randomMove();
            } else {
              AI();
            }
          } else {
            AI();
          }
          slotCounter -= 1;

          playerTurn = 1;

          $(".slot").css("background-color", "#f1f3f3");
          $(".slot:hover").css("background-color", "#ccffff");

          winCheck();

        }, 625);
      }
    })