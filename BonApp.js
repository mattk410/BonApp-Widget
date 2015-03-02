
  command: 'curl -s "http://legacy.cafebonappetit.com/api/2/menus?cafe=261"',
  refreshFrequency: 6000000,



  render: function(output) {
    return [
        '<div id="widgetTitle"></div>',
        '<div id="date" class="e"></div>',
        '<div id="food" class="e"></div>',
        '<div id="footer"></div>',
    ].join('')
  },

  update: function(output, domEl) {

    function createOutputString(okItems){
        var str = "";
        for(var i = 0; i < okItems.length; i++){
            str+= okItems[i]+"<br><br>";
        }
        return str;
    }

    function parseDate(x){
        var m,d,y;
        y=x.substr(0,4);
        m=x.substr(5,2);
        d=x.substr(8,2);

        var rawToday = new Date(y+"-"+m+"-"+d);
        var offsetDate = Date(rawToday - rawToday.getTimezoneOffset());
        var todayDate = new Date(offsetDate).toString();
        var today = todayDate.substr(0,10);

        return today.toString();
    }

    function parseMenu(menu){
        console.log ("menu: ")
        console.log(arguments);

        var okItems=[];
        for(var prop in menu){
            if(menu.hasOwnProperty(prop)){
                if(menu[prop].cor_icon.hasOwnProperty(7)){
                    okItems.push(menu[prop].label);
                }
            }
        }
        // Handle update on Mondays and 0 results
        if(okItems.length === 0) {
            // Body
            okItems.push("0 menu items found...");

            // Footer
            var theDay = new Date().getDay();
            if(theDay === 1) {
                var footer = document.getElementById("footer");
                footer.innerHTML = "*Note: the menu usually updates on Mondays";
            }
        }

        return okItems;
    }

    var dom,
     theDate,
     theMenu,
     title,
     jstringObj,
     outputString;

    dom = $(domEl);
    jstringObj = JSON.parse(output);
    theDate= parseDate(jstringObj.days[0].date);
    theMenu= jstringObj.items;
    var friendly= parseMenu(theMenu);
    outputString= createOutputString(friendly);

    title = "Stav Hall Menu";

    //Output
    dom.find(widgetTitle).html(title);
    dom.find(date).html(theDate);
    dom.find(food).html(outputString);
  },
  style: "top: 20px\nleft: 440px\nwidth:400px\nmargin:0px\npadding:0px\nbackground:rgba(#FFF, 0.5)\nborder:2px solid rgba(#000, 0.5)\nborder-radius:10px\noverflow:hidden\n#date\n  margin:12pt\n  margin-bottom:12pt\n  font-family: Helvetica\n  font-size: 25pt\n  font-weight:bold\n  color: rgba(black, 0.75)\n\n#title\n  margin-left:50pt\n  margin-right:12pt\n  font-family: American Typewriter\n  font-size: 20pt\n  font-weight:bold\n#description\n  margin-left:12pt\n  margin-right:12pt\n  font-family: American Typewriter\n  font-size: 12pt\n  line-height:18pt\n  max-height:10pt\n  overflow:hidden\n  hyphens: auto\n\n\#food\n  height: 350px\n\n#footer\n  font-family: Helvetica\n  font-size: 9pt\n  margin:12pt\n  color: rgba(#000, 0.5)\n\np\n  margin: 0 0 0 20px\n\n.e\n  height: 60pt\n\n.event\n  font-size: 17pt\n  font-weight: bold\n"
