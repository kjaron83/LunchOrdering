(function () {
 
    function loadScript(url, callback) {
 
        var script = document.createElement("script");
        script.type = "text/javascript";
 
        if (script.readyState) { //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { //Others
            script.onload = function () {
                callback();
            };
        }
 
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }
 
    loadScript("https://rawcdn.githack.com/kjaron83/LunchOrdering/e96e7f7216b100a183d33a1654d43dba4467c6ce/script.js?_=" + Math.floor(Math.random()*1000000), function () {           
    });         
  
})();