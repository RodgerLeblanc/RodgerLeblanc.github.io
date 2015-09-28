var settings;

// to get value of query string
function getURLVariable(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)",
        regex = new RegExp(regexS),
        results = regex.exec(window.location.href);
    if (results == null) return "";
    else return results[1];
}

// displaying current time
function startTime() {
    var today=new Date();
    var h=today.getHours();
    var m=today.getMinutes();
    $('#h1').text(Math.floor(h/10));
    $('#h2').text(h % 10);
    $('#m1').text(Math.floor(m/10));
    $('#m2').text(m % 10);
    
    setTimeout(function(){startTime()},1000);
}

function changeColor(picker_id, color) {
    var hcolor = color.toHex();
    var gcolor = GColor.fromHex(hcolor);

    switch (picker_id) {
        case 'topcolor':
            settings.topcolor = gcolor;
            break;
        case 'bottomcolor':
            settings.bottomcolor = gcolor;
            break;
        case 'timecolor':
            settings.timecolor = gcolor;
            break;
    }

    //displaying current settings
    $('#code').val(JSON.stringify(settings));
}

var pebble_palette = [
          ['000', '005', '00a', '00f', '050', '055', '05a', '05f'],
          ['500', '505', '50a', '50f', '550', '555', '55a', '55f'],
          ['a00', 'a05', 'a0a', 'a0f', 'a50', 'a55', 'a5a', 'a5f'],
          ['f00', 'f05', 'f0a', 'f0f', 'f50', 'f55', 'f5a', 'f5f'],
          ['0a0', '0a5', '0aa', '0af', '0f0', '0f5', '0fa', '0ff'],
          ['5a0', '5a5', '5aa', '5af', '5f0', '5f5', '5fa', '5ff'],
          ['aa0', 'aa5', 'aaa', 'aaf', 'af0', 'af5', 'afa', 'aff'],
          ['fa0', 'fa5', 'faa', 'faf', 'ff0', 'ff5', 'ffa', 'fff']
];

$(document).ready(function () {

    $('#xbtnSave').click(function () {

        if (settings.timecolor == settings.topcolor) {
            alert('Please select different colors for Top Section and Time');
            return
        }

        localStorage.setItem("settings", JSON.stringify(settings));
        
        var location = (decodeURIComponent(getURLVariable('return_to')) || "pebblejs://close#") + encodeURIComponent(JSON.stringify(settings));
        document.location = location;
    })

    function applyCode() {
        settings = JSON.parse($('#code').val());
    }

    
    $('#xbtnApplyCode').click(applyCode);


    $('#code').click(function () {
        $(this).select();
    });

    $('#code').on('paste', function () { setTimeout(applyCode, 0) });


    $('#xbtnCancel').click(function () {
        var location = decodeURIComponent(getURLVariable('return_to')) || "pebblejs://close#";
        document.location = location;
    })

    $('#selThemes').change(function () {
        if (this.value == '') return;

        $('#code').val(this.value);
        applyCode();
    })

    
    // defining color pickers
    $(".picker").spectrum({
        showPaletteOnly: true,
        hideAfterPaletteSelect: true,
        preferredFormat: "hex3",
        change: function (color) {
            changeColor(this.id, color);
        },
        palette: pebble_palette
    });

    try {
        settings = JSON.parse(localStorage.getItem("settings"));
    }
    catch(err) {
        settings = null;
    }
        

    if(settings==null) {
        settings = {};
      
        settings.topcolor = GColor.fromHex("000000");
        settings.timecolor = GColor.fromHex("FFFFFF");
        settings.bottomcolor = GColor.fromHex("FFFFFF");
    }

    //displaying current settings
    $('#code').val(JSON.stringify(settings));

    $("input[type='radio']").checkboxradio();
    $("input[type='button']").button({ inline: true, mini: true, theme: "b" });
    $("textarea").textinput();
    $('.sp-replacer').unwrap();

    //starting clock
    startTime();

    $('#main').show();

});
