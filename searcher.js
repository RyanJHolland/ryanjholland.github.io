var callAPI = function() {
  $("#results").html("");
  $.getJSON("https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=" + searchBar.value +
    "&redirects=resolve&callback=?",
    function(json) {
      for (var x in json[1]) {
        $("#results").append(

          "<a href='"

          + json[3][x]

          + "'><span class='result' id='"

          + json[1][x]

          + "'><span id='title'>"

          + json[1][x]

          + "</span><br><br><span id='description'>"

          + json[2][x]

          + "</span></span></a>"

        );
      }

    })
}

$("#search").click(function() {
    callAPI();
  }
)

$("#random").click(function() {
    window.location.href = "https://en.wikipedia.org/wiki/Special:Random";
  }
)