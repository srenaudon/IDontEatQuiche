


    var db;
    var _meshCache={};
    var app6Uris = ["res/app-6-svg/rectangle.svg","res/app-6-svg/basics.svg","res/app-6-svg/APP_6_Aerial_Refuel.svg","res/app-6-svg/APP_6_Air_Force.svg","res/app-6-svg/APP_6_Airmobile_Infantry.svg","res/app-6-svg/APP_6_Airmobile_Mortar.svg","res/app-6-svg/APP_6_Airmobile_Supply_Transport.svg","res/app-6-svg/APP_6_Ammunition.svg","res/app-6-svg/APP_6_Amphibious_Mechanized_Infantry.svg","res/app-6-svg/APP_6_Armored_Air_Defence_Artillery.svg","res/app-6-svg/APP_6_Armored_Engineer.svg","res/app-6-svg/APP_6_Bridging.svg","res/app-6-svg/APP_6_Electronic_Warfare.svg","res/app-6-svg/APP_6_Hospital.svg","res/app-6-svg/APP_6_Infantry_Mechanized_IFV.svg","res/app-6-svg/APP_6_Infantry_Wheeled_Mechanized_IFV.svg","res/app-6-svg/APP_6_Missile.svg","res/app-6-svg/APP_6_NBC.svg","res/app-6-svg/APP_6_Radar.svg","res/app-6-svg/APP_6_Special_Operations_Forces.svg","res/app-6-svg/APP_6_Topographical.svg","res/app-6-svg/APP_6_Wheeled_Armored_Reconnaissance.svg","res/app-6-svg/APP_6_Wheeled_Tank.svg","res/app-6-svg/TZ_AD.svg","res/app-6-svg/TZ_LW.svg","res/app-6-svg/TZ_PZ_PIO.svg"];

    function load(uri) {
        $.get(uri, {}, function (res) {
            var name = uri;
            name = name.slice(name.lastIndexOf('/')+1,name.lastIndexOf('.'));
            _debug("loading ["+name+"] svg=\n["+res+"]");
            db.transaction(["binarycache"], "readwrite").objectStore("binarycache").add({data: res, name: name});

        }, "text");

    }

    function loadApp6() {

        var openRequest = indexedDB.open("svgdemo", 1);

        openRequest.onupgradeneeded = function (e) {
            var thisDB = e.target.result;



            if (!thisDB.objectStoreNames.contains("binarycache")) {
                _debug("Creating database");
                var os = thisDB.createObjectStore("binarycache", {autoIncrement: true});
                os.createIndex("name", "name", {unique: true});
            }
        }

        openRequest.onsuccess = function (e) {


            db = e.target.result;
            for (var i=0;i<app6Uris.length;i++) {
                load(app6Uris[i]);
            }

        }


    }

    function readApp6(name){
        var cached = _meshCache[name];
        if(typeof(cached)!= "undefined")return cached;
    /* Retrieve svg stored in indexedDB and transrfrm to mesh */

    var transaction = db.transaction(["binarycache"], "readonly");
    var store = transaction.objectStore("binarycache");
    var index = store.index("name");

    //name is some value
    _debug("Getting from db :" +name);
    var request = index.get(name);

    request.onsuccess = function (event) {
        var svgSymbol = event.target.result;
        _meshCache[name] = transformSVGPathExposed(svgSymbol);

        console.log("mesh for "+name+" is "+_meshCache[name]);
    };

    }



