
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
        //console.log("okItems");
        var str="";
        for(var i=0; i<okItems.length; i++){
            str+= okItems[i]+"<br><br>";
        }
        //console.log("str: " + str);
        return str;
    }

    function parseDate(x){
        console.log("x: "+x);
        var m,d,y;
        y=x.substr(0,4);
        m=x.substr(5,2);
        d=x.substr(8,2);
        console.log(y+" "+m+" "+d);
        var today= new Date(y+"-"+m+"-"+d);
        return today.toDateString();
    }

    function parseMenu(menu){
        console.log("menu: "+ menu);
        var okItems=[];
        for(var prop in menu){
            if(menu.hasOwnProperty(prop)){
                //console.log("menu."+prop+ " = "+ menu[prop].label);
                if(menu[prop].cor_icon.hasOwnProperty(9)){
                    //console.log(menu[prop].label);
                    okItems.push(menu[prop].label);
                }
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
    console.log("date: " + theDate);
    theMenu= jstringObj.items;
    console.log("theMenu: "+theMenu);
    var friendly= parseMenu(theMenu);
    console.log("friendly: "+ friendly);
    //outputString="hello";
    outputString= createOutputString(friendly);




    title = "Stav Hall Menu";

    //Output
    dom.find(widgetTitle).html(title);
    dom.find(date).html(theDate);
    dom.find(food).html(outputString);
  },
  style: "top: 20px\nleft: 440px\nwidth:400px\nmargin:0px\npadding:0px\nbackground:rgba(#FFF, 0.5)\nborder:2px solid rgba(#000, 0.5)\nborder-radius:10px\noverflow:hidden\n#date\n  margin:12pt\n  margin-bottom:12pt\n  font-family: Helvetica\n  font-size: 25pt\n  font-weight:bold\n  color: rgba(black, 0.75)\n\n#title\n  margin-left:50pt\n  margin-right:12pt\n  font-family: American Typewriter\n  font-size: 20pt\n  font-weight:bold\n#description\n  margin-left:12pt\n  margin-right:12pt\n  font-family: American Typewriter\n  font-size: 12pt\n  line-height:18pt\n  max-height:10pt\n  overflow:hidden\n  hyphens: auto\n\n\#food\n  height: 350px\n\n#footer\n  font-family: Helvetica\n  font-size: 9pt\n  margin:12pt\n  color: rgba(#000, 0.5)\n\np\n  margin: 0 0 0 20px\n\n.e\n  height: 60pt\n\n.event\n  font-size: 17pt\n  font-weight: bold\n"
