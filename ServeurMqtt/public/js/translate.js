// * SmartCampus
// *  ©SmartCampus 2014 https://github.com/thomasNDS/SmartCampus2014
// *  License MIT

var lang_selected = 'en';
// uk - ru

function translate(text2translate) {
    if (lang_selected != "fr") {
        var res = ""
//    var text2translate = " bonjour, qui est là ? ok"
        var lang = lang_selected;
        var adresse = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20140325T172944Z.a1669eaf10e9af7c.cfbf70161455f55314e8bd3b525142299d4cf49a&lang=fr-' + lang + '&text=' + text2translate

        jQuery.ajax({
            url: adresse,
            type: 'GET',
            async: false,
            cache: false,
            success: function(data, textStatus, jqXHR) {
//            console.log(data.text + "")
                res = (data.text + "");
            }
        });
        return res;
    } else
        return text2translate;
}