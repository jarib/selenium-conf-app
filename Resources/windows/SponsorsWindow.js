(function () {
    Codestrong.ui.createSponsorsWindow = function () {
        var sponsorsWindow = Titanium.UI.createWindow({
            id: 'sponsorsWindow',
            title: 'Sponsors',
            backgroundColor: '#FFF',
            barColor: '#414444',
            fullscreen: false
        });

        var sponsors = SeConf.datastore.getSponsors();

        var webView = Ti.UI.createWebView({
            scalesPageToFit: true
        });

        // TODO: find a better way to do this
        var html = '<html><head><meta name="viewport" content="user-scalable=yes, width=device-width, initial-scale = 1.0, minimum-scale = 1.0, maximum-scale = 10.0" /> <meta name="apple-mobile-web-app-capable" content="yes" />' +
                   '<link rel="stylesheet" href="pages/styles.css" /><title>About our Sponsors</title></head>' +
                   '<body class="about"><h2>About our Sponsors</h2><p>The following companies and organizations support SeleniumConf through their sponsorships. We would like to thank them for their generous support!</p>';

        html += '<ul id="sponsor-list">';

        for (var i = 0; i < sponsors.length; i++){
          var sponsor = sponsors[i];
          html += '<li><a href="' + sponsor.url + '" onclick="Ti.App.fireEvent("openURL", {url:"' + sponsor.url + '"}); return false;"><img src="' + sponsor.logo + '"></a></li>';
        };
        
        html += '</ul></body></html>'
        webView.html = html;

        sponsorsWindow.add(webView);

        return sponsorsWindow;
    };
})();