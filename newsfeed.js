$(document).ready(function() {
  $.getJSON("http://www.freecodecamp.com/news/hot", function(json) {

    itemNum = 1;

    json = json.sort(function(a, b) {
      return parseFloat(b.timePosted - a.timePosted);
    });

    for (var i in json) {

      if (json[i].image === "") {
        pic = json[i].author.picture;
      } else {
        pic = json[i].image;
      }

      $("#item" + itemNum).append("<a href='" + json[i].link
                                  
                                  +"'><div class='item'>"

        +"<img src='" + pic + "' class='img-responsive' onError=\"this.src='http://www.wiu.edu/academics/majors/business_and_technology/images/desktop_computer_512.png';\">"

        + "<br>"

        + "<span id='articleTitle'>" + json[i].headline + "</span>"

        + "<br><br>" + "<span id='rank" + itemNum + "'>Upvoted by " + json[i].rank + "</span>"

        + "<br>"

        + "<span id='hoursAgo'>" + Math.floor((Date.now() - json[i].timePosted) / 1000 / 60 / 60) + " hours ago</span>"

        + "</div></a>"
      );

      if (json[i].rank >= 5) {
        $("#rank" + itemNum).attr("style", "background:yellow");
        $("#item" + itemNum).attr("style", "background:yellow");
      }
      if (json[i].rank >= 10) {
        $("#rank" + itemNum).attr("style", "background:orange");
        $("#item" + itemNum).attr("style", "background:orange");
      };
      if (json[i].rank >= 15) {
        $("#rank" + itemNum).attr("style", "background:red");
        $("#item" + itemNum).attr("style", "background:red");
        
      };

      itemNum += 1;
      $("#newsFeed").append("<div id='item" + itemNum + "'>");

    }

  })

})