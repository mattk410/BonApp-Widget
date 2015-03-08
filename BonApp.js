
  command: 'curl -s "http://legacy.cafebonappetit.com/api/2/menus?cafe=261"',
  refreshFrequency: 6000000,



  render: function(output) {
    return [
        '<select class="myDiet">',
        '  <option value="-1">All</option>',
        '  <option value="6">Farm to Fork</option>',
        '  <option value="18">Humane</option>',
        '  <option value="7">In-Balance</option>',
        '  <option value="9">Made Without Gluten</option>',
        '  <option value="57">Contains Nuts</option>',
        '  <option value="3">Seafood Watch</option>',
        '  <option value="1">Vegetarian</option>',
        '  <option value="4">Vegan</option>',
        '</select>',
        '<div id="widgetTitle" class="e"></div>',
        '<div id="date" class="e"></div>',
        '<div id="food" class="e"></div>',
        '<div id="footer"></div>',
    ].join('')
  },

  update: function(output, domEl) {

    function createOutputString(okItems){
        var str = "";
        for(var i = 0; i < okItems.length; i++){
            str += okItems[i] + "<br>";
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

    function parseCafe(json) {
        var id = ([Object.keys(json["days"][0]["cafes"])[0]]);
        var theTitle = json["days"][0]["cafes"][id]["name"];
        return theTitle;
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
        var item = "";

        for(var prop in menu){
            // looping through the properties on an element
            if(menu.hasOwnProperty(prop)){
                // Icon (filtering dietary restrictions)
                if(menu[prop].cor_icon.hasOwnProperty(preferredDiet)){
                    // Station
                    if(menu[prop].station != prevStation){
                        // clean station string
                        item = "<br />" + cleanUpStationLabel(menu[prop].station + "<br />");
                        // push food label next to the station
                        item += "⚬ " + capitalizeStr(menu[prop].label, 0, 1);
                        // the previous station
                        prevStation = menu[prop].station;
                    }
                    // same station with more items
                    else {
                        // the served food item
                        item = "⚬ " + capitalizeStr(menu[prop].label, 0, 1);
                        // the previous station
                        prevStation = menu[prop].station;
                    }

                    // add it
                    okItems.push(item);
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

    function lastUpdated() {
        var time    = new Date();
        var hours   = time.getHours();
        var minutes = time.getMinutes();
        var timeOfDay = "";

        // convert from military time
        if (hours > 12) {
            timeOfDay = "pm";
            hours -= 12;
        } else if (hours === 0) {
            timeOfDay = "am";
            hours = 12;
        } else {
            timeOfDay = "am";
        }

        var lastUpdated = "Updated at " + hours + ":" + minutes + timeOfDay;

        return lastUpdated;
    }

    function capitalizeStr(theStr, upperCaseLetter, removeLetter) {
        var newCapitalStr = theStr[upperCaseLetter].toUpperCase() + theStr.slice(removeLetter)
        return newCapitalStr;
    }

    function cleanUpStationLabel(theStation) {
        // replace the @ symbol
        var cleanString = theStation.replace("@", "");
        // capitalize first letter
        var capitalizedStr = capitalizeStr(cleanString, 8, 9);
        // add back in the bold formatting
        capitalizedStr = "<strong>" + capitalizedStr + "</strong>";

        return capitalizedStr;
    }

    var dom,
     theDate,
     theMenu,
     title,
     lastUpdated,
     jstringObj,
     outputString;

    dom          = $(domEl);
    jstringObj   = JSON.parse(output);
    title        = parseCafe(jstringObj);
    lastUpdated  = lastUpdated();
    theDate      = parseDate(jstringObj.days[0].date);
    theMenu      = jstringObj.items;
    var friendly = parseMenu(theMenu);
    outputString = createOutputString(friendly);

    //Output
    try {
        dom.find(widgetTitle).html(title);
    }
    catch(err) {
        console.log("Error: \"" + err.message + "\" on line " + err.line);
    }
    try {
        dom.find(date).html(theDate);
    }
    catch(err) {
        console.log("Error: \"" + err.message + "\" on line " + err.line);
    }
    try {
        dom.find(footer).html(lastUpdated);
    }
    catch(err) {
        console.log("Error: \"" + err.message + "\" on line " + err.line);
    }
    try {
        dom.find(food).html(outputString);
    }
    catch(err) {
        console.log("Error: \"" + err.message + "\" on line " + err.line);
    }
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

    "#updated",
    "  font-family: Helvetica",
    "  font-size: 12pt",
    "  color: rgba(0,0,0,0.75)",

    "#date",
    "  text-align:center",
    "  margin-bottom:12pt",
    "  margin-top: -40px",
    "  font-family: Helvetica",
    "  font-size: 15pt",
    "  font-weight:bold",
    "  color: rgba(0,0,0,0.75)",

    "#widgetTitle",
    "  text-align:center",
    "  margin-top:12pt",
    "  margin-bottom:0pt",
    "  font-family: Helvetica",
    "  font-size: 25pt",
    "  font-weight:bold",
    "  color: rgba(128,0,0,0.75)",
    "  border-bottom: solid 1px black",

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
    "  margin-top: -60px",
    "  height: auto",
    "  margin-left: 20px",

    "#footer",
    "  text-align: center",
    "  font-family: Helvetica",
    "  font-size: 9pt",
    "  margin-top: 12pt",
    "  margin-bottom: 12pt",
    "  color: rgba(#000, 0.5)",

    "p",
    "  margin: 0 0 0 20px",

    ".e",
    "  height: 60pt",

    ".event",
    "  font-size: 17pt",
    "  font-weight: bold",
    ].join('\n')
