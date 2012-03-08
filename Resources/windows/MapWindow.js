/**
 * This file is part of CODESTRONG Mobile.
 *
 * CODESTRONG Mobile is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * CODESTRONG Mobile is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with CODESTRONG Mobile.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The CODESTRONG mobile companion app was based off the original work done by the team
 * at palatir.net which included:
 *
 * Larry Garfield
 * Pat Teglia
 * Jen Simmons
 *
 * This code can be located at: https://github.com/palantirnet/drupalcon_mobile
 *
 * The following Appcelerator Employees also spent time answering questions via phone calls, IRC
 * and email and contributed code to the original Drupalcon Mobile application.
 *
 * Tony Guntharp
 * Chad Auld
 * Don Thorp
 * Marshall Culpepper
 * Stephen Tramer
 * Rick Blalock
 */
(function () {

    Codestrong.ui.createMapWindow = function () {
        var mapWindow = Titanium.UI.createWindow({
            id: 'mapWindow',
            title: 'Venue - The Strand Palace Hotel',
            backgroundColor: '#FFF',
            barColor: '#414444',
            height: '100%',
            fullscreen: false
        });

        // create table view data object
        var duration = 250;
        var data = [
            {
                type: 'map',
                title: 'Map',
                atitle: 'The Strand Palace Hotel',
                asubtitle: '372 Strand, London WC2R 0JJ, United Kingdom',
                shortTitle: 'Map',
                latitude: 51.511013,
                longitude: -0.119455
            },
            {
                type: 'web',
                title: 'Directions',
                shortTitle: 'Directions',
                url: '/pages/directions.html'
            },
            {
                type: 'web',
                title: 'Venue\'s Website',
                shortTitle: 'Venue\'s Site',
                url: 'http://www.strandpalacehotel.co.uk'
            }
        ];

        var tabbedBarView = Ti.UI.createView({
            backgroundColor: '#555',
            top: 0,
            height: Codestrong.ui.tabBarHeight
        });
        var tabbedBar = Ti.UI.createView({
            top: 0,
            backgroundColor: '#000',
            height: Codestrong.ui.tabBarHeight,
            width: Ti.Platform.displayCaps.platformWidth
        });

        for (var i = 0; i < data.length; i++) {
            var myEntry = data[i];
            
            if (myEntry.type == 'web') {
                myEntry.view = Ti.UI.createWebView({
                    scalesPageToFit: true,
                    url: myEntry.url,
                    top: Codestrong.ui.tabBarHeight,
                    bottom: 0,
                    left: 0,
                    width: Ti.Platform.displayCaps.platformWidth
                });
            } else {
                var annotation = Ti.Map.createAnnotation({
                    latitude: myEntry.latitude,
                    longitude: myEntry.longitude,
                    title: myEntry.atitle,
                    subtitle: myEntry.asubtitle,
                    pincolor: Titanium.Map.ANNOTATION_RED,
                    animate: true
                 });
                 myEntry.view = Ti.Map.createView({
                     scalesPageToFit: true,
                     top: Codestrong.ui.tabBarHeight,
                     bottom: 0,
                     left: 0,
                     width: Ti.Platform.displayCaps.platformWidth,
                     mapType: Titanium.Map.STANDARD_TYPE,
                     region: {latitude: myEntry.latitude, longitude: myEntry.longitude,
                              latitudeDelta:0.01, longitudeDelta:0.01},
                     animate: true,
                     regionFit: true,
                     userLocation: true,
                     annotations: [annotation]
                 });
            }
            if (i !== 0) {
                myEntry.view.hide();
            }

            var tabView = Ti.UI.createView({
                backgroundImage: (i == 0) ? '/images/buttonbar/button2_selected.png' : '/images/buttonbar/button2_unselected_shadowL.png',
                height: Codestrong.ui.tabBarHeight,
                left: i * (Ti.Platform.displayCaps.platformWidth / data.length),
                right: Ti.Platform.displayCaps.platformWidth - ((parseInt(i, 10) + 1) * (Ti.Platform.displayCaps.platformWidth / data.length)),
                index: i
            });

            var tabLabel = Ti.UI.createLabel({
                text: myEntry.shortTitle,
                textAlign: 'center',
                color: '#fff',
                height: 'auto',
                touchEnabled: false,
                font: {
                    fontSize: 14,
                    fontWeight: 'bold'
                }
            });
            tabView.addEventListener('click', function (e) {
                for (var j = 0; j < data.length; j++) {
                    if (e.source.index === j) {
                        data[j].view.show();
                        data[j].tabView.backgroundImage = '/images/buttonbar/button2_selected.png';
                    } else {
                        data[j].view.hide();
                          data[j].tabView.backgroundImage = '/images/buttonbar/button2_unselected_shadowL.png';
                    }
                }
            });

            tabView.add(tabLabel);
            tabbedBar.add(tabView);
            myEntry.tabView = tabView;
        }

        tabbedBarView.add(tabbedBar);
        mapWindow.add(tabbedBarView);
        for (var j = 0; j < data.length; j++) {
            mapWindow.add(data[j].view);
        }

        return mapWindow;
    };
})();
