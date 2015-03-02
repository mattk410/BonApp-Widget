
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
        // enum object to map diets to numbers
        var diets = {
            "FTF"   : 6, // farm to fork
            "GF"    : 9, // gluten free
            "VEG"   : 1, // vegetarian
            "VEGAN" : 4, // vegan
        };

        // your selected diets
        var preferredDiet = diets.GF;

        console.log ("menu: ")
        console.log(arguments);

        var okItems = [];
        var prevStation = "";

        for(var prop in menu){
            var item = "";
            // looping through the properties on an element
            if(menu.hasOwnProperty(prop)){
                // Icon (filtering dietary restrictions)
                if(menu[prop].cor_icon.hasOwnProperty(preferredDiet)){
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

  style: [
    "top: 20px",
    "left: 40px",
    "width:400px",
    "margin:0px",
    "padding:0px",
    "background:rgba(#FFF, 0.5)",
    "border:2px solid rgba(#000, 0.5)",
    "border-radius:10px",
    "overflow:hidden",

    "#date",
    "  margin:12pt",
    "  margin-bottom:12pt",
    "  font-family: Helvetica",
    "  font-size: 25pt",
    "  font-weight:bold",
    "  color: rgba(128,0,0,0.75)",

    "#title",
    "  margin-left:50pt",
    "  margin-right:12pt",
    "  font-family: American Typewriter",
    "  font-size: 20pt",
    "  font-weight:bold",

    "#description",
    "  margin-left:12pt",
    "  margin-right:12pt",
    "  font-family: American Typewriter",
    "  font-size: 12pt",
    "  line-height:18pt",
    "  max-height:10pt",
    "  overflow:hidden",
    "  hyphens: auto",

    "#food",
    "  height: 350px",

    "#footer",
    "  font-family: Helvetica",
    "  font-size: 9pt",
    "  margin:12pt",
    "  color: rgba(#000, 0.5)",

    "p",
    "  margin: 0 0 0 20px",

    ".e",
    "  margin-top: -40px",
    "  margin-left: 20px",
    "  height: 60pt",

    ".event",
    "  font-size: 17pt",
    "  font-weight: bold",
    ].join('\n')
