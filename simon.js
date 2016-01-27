$(document).ready(function() {

  var strict = false;
  
  $(document).mousemove(function (e) {
    // Set global values
    window.mouseXPos = e.pageX;
    window.mouseYPos = e.pageY;
});

  $("#start").show();
  $("#restart").hide();

  $("#btn1").css("cursor", "default");
  $("#btn2").css("cursor", "default");
  $("#btn3").css("cursor", "default");
  $("#btn4").css("cursor", "default");

  var sound1 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
  var sound2 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
  var sound3 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
  var sound4 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");

  unlockButtons = function() {
    $("#btn1").hover(function() {
      $(this).css("background-color", "lightgreen");
      $(this).css("cursor", "pointer");
    }, function() {
      $(this).css("background-color", "green");
    });
    $("#btn2").hover(function() {
      $(this).css("background-color", "pink");
      $(this).css("cursor", "pointer");
    }, function() {
      $(this).css("background-color", "red");
    });
    $("#btn3").hover(function() {
      $(this).css("background-color", "violet");
      $(this).css("cursor", "pointer");
    }, function() {
      $(this).css("background-color", "purple");
    });
    $("#btn4").hover(function() {
      $(this).css("background-color", "cyan");
      $(this).css("cursor", "pointer");
    }, function() {
      $(this).css("background-color", "blue");
    });
    
    //this makes it so the game realizes that you are hovering over a button once it becomes your turn:
    $(document.elementFromPoint(window.mouseXPos, window.mouseYPos)).trigger("mouseenter"); 

    $("#btn1").off('click').click(function() {
      triggerB1();
      doesItMatch(1);
    });

    $("#btn2").off('click').click(function() {
      triggerB2();
      doesItMatch(2);
    });

    $("#btn3").off('click').click(function() {
      triggerB3();
      doesItMatch(3);
    });

    $("#btn4").off('click').click(function() {
      triggerB4();
      doesItMatch(4);
    })
  }

  lockButtons = function() {
    $("#btn1").trigger('mouseleave');
    $("#btn1").unbind('mouseenter mouseleave click');
    $("#btn1").css("cursor", "default");
    $("#btn2").trigger('mouseleave');
    $("#btn2").unbind('mouseenter mouseleave click');
    $("#btn2").css("cursor", "default");
    $("#btn3").trigger('mouseleave');
    $("#btn3").unbind('mouseenter mouseleave click');
    $("#btn3").css("cursor", "default");
    $("#btn4").trigger('mouseleave');
    $("#btn4").unbind('mouseenter mouseleave click');
    $("#btn4").css("cursor", "default");

  }

  triggerB1 = function() {
    sound1.cloneNode(true).play();
    $("#btn1").css("background-color", "white");
    setTimeout(function() {
      $("#btn1").css("background-color", "lightgreen");
    }, 35);
    setTimeout(function() {
      $("#btn1").css("background-color", "green");
    }, 100);
  };

  triggerB2 = function() {
    sound2.cloneNode(true).play();
    $("#btn2").css("background-color", "white");
    setTimeout(function() {
      $("#btn2").css("background-color", "pink");
    }, 35);
    setTimeout(function() {
      $("#btn2").css("background-color", "red");
    }, 100);
  };

  triggerB3 = function() {
    sound3.cloneNode(true).play();
    $("#btn3").css("background-color", "white");
    setTimeout(function() {
      $("#btn3").css("background-color", "violet");
    }, 35);
    setTimeout(function() {
      $("#btn3").css("background-color", "purple");
    }, 225);
  };

  triggerB4 = function() {
    sound4.cloneNode(true).play();
    $("#btn4").css("background-color", "white");
    setTimeout(function() {
      $("#btn4").css("background-color", "cyan");
    }, 35);
    setTimeout(function() {
      $("#btn4").css("background-color", "blue");
    }, 225);
  };

  roundsCounter = 0;

  $("#start").click(function() {
    if (roundsCounter === 20) {
      alert("You win!");
      $("#restart").click();
    } else {
      lockButtons();
      setTimeout(function() {
        compTurn();
      }, 800);
      roundsCounter++;
      $("#start").hide();
      $("#restart").show();
      $("#feedback").html("ROUND " + roundsCounter);
    }
  })

  $("#restart").click(function() {
    roundsCounter = 0;
    sequence = [];
    playerArray = [];
    counter = 0;
    pressCount = 0;
    $("#feedback").html("");
    $("#start").click();
  })

  sequence = [];

  showSequence = function() {
    if (sequence[counter] === 1) {
      triggerB1();
    } else if (sequence[counter] === 2) {
      triggerB2();
    } else if (sequence[counter] === 3) {
      triggerB3();
    } else if (sequence[counter] === 4) {
      triggerB4();
    }
    counter++;
    if (counter < sequence.length) {
      if (roundsCounter <= 4) {
        setTimeout(function() {
          showSequence();
        }, 1200);
      } else if (5 <= roundsCounter <= 8) {
        setTimeout(function() {
          showSequence();
        }, 1000);
      } else if (8 <= roundsCounter <= 11) {
        setTimeout(function() {
          showSequence();
        }, 800);
      } else if (12 <= roundsCounter) {
        setTimeout(function() {
          showSequence();
        }, 600);
      }
    }

    if (counter === sequence.length) {
      setTimeout(function() {
        unlockButtons();
      }, 500);
    }
  }

  compTurn = function() {
    sequence.push(Math.floor(Math.random() * 4 + 1));
    counter = 0;
    showSequence();
  }

  playerArray = [];
  pressCount = 0;

  doesItMatch = function(buttonNumber) {
    pressCount++;

    playerArray.push(buttonNumber);
    if (playerArray[pressCount - 1] !== sequence[pressCount - 1]) {
      if (strict === false) {
        $("#feedback").html("WRONG! Try again...");
        playerArray = [];
        pressCount = 0;
        counter = 0;
        lockButtons();
        setTimeout(function() {
          showSequence();
        }, 800);
      } else {
        $("#feedback").html("GAME OVER!");
        setTimeout(function() {
          $("#restart").click();
        }, 800)
      }
    } else {
      $("#feedback").html("ROUND " + roundsCounter);
      if (pressCount === sequence.length) {
        lockButtons();
        pressCount = 0;
        playerArray = [];
        setTimeout(function() {
          $("#start").click();
        }, 1000);

      }
    }
  }

  $("#strict").off("click").click(function() {
    if (strict === false) {
      strict = true;
      $(this).html("Turn on Normal Mode");
      $("#feedback2").html("Strict Mode enabled! One mistake will restart your game!");
    } else {
      strict = false;
      $(this).html("Turn on Strict Mode");
      $("#feedback2").html("");
    }
  })

})