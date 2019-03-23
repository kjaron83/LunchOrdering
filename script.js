// JavaScript document

var myteletal = {
    func: "checkLogin",
    param: null,
    
    funcs: {
        "info": "info",
        "kilep": "exit",
        "kosar": "cart",
        "lista": "list",
        "nyomtat": "print",
        "etlap": "carte",
        "megrendeles": "order",
    },
    
    days: {
        1: "Hétfő",
        2: "Kedd",
        3: "Szerda",
        4: "Csütörtök",
        5: "Péntek",
        6: "Szombat",
        7: "Vasárnap",
    },
    
    style: {
        container: "font-size: 14pt; margin: 1em;",
        table: "border: #000 solid 1pt; border-collapse: collapse; border-spacing: 0;",
        th: "border: #000 solid 1pt; text-align: center; margin: 0; padding: 2pt;",
        td: "border: #000 solid 1pt; margin: 0; padding: 2pt;",
        tdRight: "border: #000 solid 1pt; text-align: right; margin: 0; padding: 2pt;",
    },
                
    iterator: function() {
        if ( this.func != "exit" ) {
            this[this.func]();
            window.setTimeout(function() {
                myteletal.iterator();
            }, 500);
        }
    },
        
    checkLogin: function() {
        var a = $("a[href^='/bejelentkezes']");
        if ( a.length ) {
            var login = $(a).attr("href");
            if ( !location.href.match(login) )
                location.href = login;
            else 
                $("input[name='li_email']").focus();

            this.func = "exit";
        }    
        else
            this.func = "menu";
    },        

    menu: function() {
        var addPattern=/([1-7]{1})\s+([0-9a-zA-Z]{1,2}[1-9]{0,1})\s+([0-9]+)/;
        var weekPattern=/([0-9]+)\.\s*het/i;
        var m;
    
        var s = $.trim(prompt("Adja meg a kívánt parancsot! Ha nem tudja mit tegyen, gépelje be az info szöveget és üssön Entert.", "")).toLowerCase();
        if ( s in this.funcs )
            this.func = this.funcs[s];            
        else if ( m = addPattern.exec(s) ) {
            this.func = "add";
            this.param = m;            
        }
        else if ( m = weekPattern.exec(s) ) {
            this.func = "week";
            this.param = m;            
        }
        else 
            alert("Ismeretlen parancs!");
    },
        
    info: function() {
        alert(
            "Használható parancsok:\n\n" +
            "info: Ez az oldal.\n" +
            "kilep: Kilépés a programból.\n\n" +
            "A heti étlap kiválasztásához adja meg a hét sorszámát, egy pontot és a \"het\" szót.\n" +
            "Pl.: 11. het\n\n" +
            "Megrendeléshez adja meg szóközzel elválasztva a hét napjának sorszámát, "+
            "az étel kódját és hogy hány adag kell belőle.\n" +
            "Pl.: 1 B2 1 (Hétfő B2 1 adag)\n\n" +
            "kosar: Kilépés és tovább a kosárhoz.\n" +
            "lista: A kosár tartalmának listája.\n" +
            "nyomtat: A kosár tartalmának nyomtatása.\n" +
            "etlap: Visszalépés az étlaphoz.\n" +
            "megrendeles: A kosárban lévő termékek megrendelése."
            );
        this.func = "menu";
    },
        
    cart: function() {
        var item = $("button.uk-button-primary");
        if ( item.length > 0 ) {
            $(item).click();
            this.func = "exit";
        }
        else {
            alert("Ezen az oldalon ez a funkció nem használható.");
            this.func = "menu";
        }
    },
        
    set: function(day, key, count) {    
        var item = $("#" + key.toUpperCase() + "_inp_" + day);
        if ( item.length ) {
            var v = $(item).val();
            $(item).val(count);     
            $(item).trigger("change");           
            return count - v;                            
        }    
            
        return false;                                
    },        
        
    add: function() {
        var a = this.set(this.param[1], this.param[2], this.param[3]);
        
        if ( a === false )
            alert("Ezen az oldalon ez a funkció nem használható.");            
        else if ( a > 0 )
            alert( a + " adag ételt tett a kosarába.");            
        else if ( a < 0) 
            alert(Math.abs(a) + " adag ételt kivett a kosarából.");                            
        else
            alert("A kosár tartalma nem változott.");            
                
        this.func = "menu";
    },
        
    week: function() {
        var menu = "/etlap/" + this.param[1];
        if ( !location.href.match(menu) ) {
            location.href = menu;
            this.func="exit";        
        }
        else {
            alert("Már a(z) " + this.param[1] + "heti étlapon tartózkodik.");
            this.func = "menu";                
        }
    },
                
    list: function() {
        var info = this.cartInfo();
        if ( info ) {        
            var s = "Az alábbi termékek vannak a kosarában:\n";
            for ( dayIndex in info.days ) {
                for ( orderIndex in info.days[dayIndex] ) {
                    var order = info.days[dayIndex][orderIndex];
                    s += "\n" + order["day"] + ": " + order["code"] + ", " + order["count"] + " db, " + order["price"];
                }
            }
            s += "\n\n" + info.sum;            
            alert(s);
            }
        else
            alert("Ezen az oldalon ez a funkció nem használható.");            

        this.func = "menu";        
    },
    
    print: function() {
        var info = this.cartInfo();
        if ( info ) {            
            var s =
                    "<div style='" + this.style.container + "'>" +
                    "<p>" + info.week + "</p>\n" +
                    "<table style='" + this.style.table + "'>\n";
            for ( dayIndex in info.days ) {
                s += "<tr><th colspan='4' style='" + this.style.th + "'>" + this.days[dayIndex] + "</th></tr>\n";
                for ( orderIndex in info.days[dayIndex] ) {
                    var order = info.days[dayIndex][orderIndex];
                    s +=
                        "<tr>" +
                        "<td style='" + this.style.tdRight + "'>" + order["code"] + "</td>" +
                        "<td style='" + this.style.td + "'>" + order["name"] + "</td>" +
                        "<td style='" + this.style.tdRight + "'>" + order["count"] + " db</td>" +
                        "<td style='" + this.style.tdRight + "'>" + order["price"] + "</td>" +
                        "</tr>\n";
                }
            }            
            s += "<tr><td colspan='4' style='" + this.style.tdRight + "'>" + info.sum + "</td></tr>\n";
            s += "</table>\n</div>";
            $("body").html(s);
            print();    
            
            window.setTimeout(function() {
                location.replace("/kosar");
            }, 10000);
            this.func = "exit";                          
        }
        else {
            alert("Ezen az oldalon ez a funkció nem használható.");            
            this.func = "menu";
        }            
    },

    carte: function() {
        location = "/etlap";
        this.func = "exit";        
    },

    order: function() {
        this.func = "menu";        

        var a = $("a.uk-button.uk-button-danger").first();
        if ( a.length > 0 ) {
            if (confirm("Biztos megrendeli a kosárban lévő összes terméket?\nVálassza az OK gombot a jóváhagyáshoz.")) {
                this.func = "exit";        
                window.setTimeout(function() {
                    location = $(a).attr("href");
                }, 2000);                
            }
        }
        else
            alert("Ezen az oldalon ez a funkció nem használható.");            
    },
        
    cartInfo: function() {
        var info = {
            "week": "",
            "days": {},
            "sum": "",               
        };
    
        var set = $("fieldset.uk-fieldset");
        if ( set.length ) {   
            info.week = myteletal.plainText($("h5.uk-text-center.uk-margin-small-top.uk-margin-small-bottom").first().html());
             
            var day = "";
            var dayIndex = -1;            
            
            $(set).find("div.uk-child-width-1-1.uk-grid-collapse.uk-grid.uk-grid-margin.uk-first-column.uk-grid-stack").each(function() {
                var section = this;
                
                if ( $(section).attr("ev") )
                    return true;                

                var label = $(section).find("h5");
                if ( label.length > 0 ) {
                    day = myteletal.plainText($(label).first().html());
                    dayIndex = myteletal.dayIndex(day);
                }
                
                $(section).find("div.uk-grid-margin.uk-first-column").each(function() {
                    var row = this;
                    var cols = new Array();

                    $(row).find("div.uk-width-1-1\\@s").each(function() {
                        var col = this;
                        if ( !$(col).html().match("input") )
                            cols.push(myteletal.plainText($(col).find("div.uk-width-1-1\\@m").html()));
                        else
                            cols.push($.trim($(col).find("input").first().val()));
                    });
                    
                    if ( cols.length == 7 ) {
                        if ( !info.days[dayIndex] )
                            info.days[dayIndex]=[];
                            
                        info.days[dayIndex].push({
                            "day": day,
                            "code": cols[1],
                            "name": cols[2],
                            "count": cols[3],
                            "price": cols[6],
                        });
                    }
                });
            }); 
            
            info.sum = myteletal.plainText($("h5.uk-text-right").first().html());
        }
        else
            info = false;
            
        return info;                        
    },        

    dayIndex: function(day) {
        for ( key in this.days ) {
            if ( this.days[key].match(day) )
                return key;
        }
        
        return -1;
    },
        
    plainText: function(html) {
        return $.trim(html.replace(/<[^>]+>/gi, "").replace(/\s+/gi, " "));
    },        
                                        
};
    
myteletal.iterator();