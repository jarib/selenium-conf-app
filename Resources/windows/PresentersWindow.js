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

    Codestrong.ui.createPresentersWindow = function () {
        var PresentersWindow = Titanium.UI.createWindow({
            id: 'presentersWindow',
            title: 'Speakers',
            backgroundColor: '#FFF',
            barColor: '#414444',
            fullscreen: false
        });

        // Create the table view
        var tableview = Titanium.UI.createTableView({
            backgroundColor: '#fff'
        });

        PresentersWindow.doRefresh = function () {
            var speakers = SeConf.datastore.getSpeakers();
            var sortedNames = speakers.sort(function (a, b) {
                a = a.last_name.toLowerCase();
                b = b.last_name.toLowerCase();
                if (a > b) {
                    return 1;
                }
                if (a < b) {
                    return -1;
                }
                return 0;
            });

            var headerLetter = '';
            var index = [];
            var presenterRow = [];
            var data = [];
            for (var i = 0; i < speakers.length; i++) {
              var speaker = speakers[i];
              Titanium.API.debug(JSON.stringify(speaker));


                presenterRow = Ti.UI.createTableViewRow({
                    hasChild: Codestrong.isAndroid(),
                    className: 'presenters_row',
                    selectedColor: '#999',
                    backgroundColor: '#fff',
                    color: '#000',
                    name: speaker.full_name,
                    uid: speaker.uid,
                    height: 40,
                    layout: 'auto'
                });
                presenterRow[Codestrong.ui.backgroundSelectedProperty + 'Color'] = Codestrong.ui.backgroundSelectedColor;

                if (Codestrong.isAndroid()) {
                    presenterRow.add(Ti.UI.createLabel({
                        text: speaker.full_name,
                        fontFamily: 'sans-serif',
                        font: {
                            fontWeight: 'bold'
                        },
                        left: (speaker.full_name !== '') ? 9 : 0,
                        height: 40,
                        color: '#000',
                        touchEnabled: false
                    }));
                } else {
                    var nameView = Ti.UI.createView({
                        height: 40,
                        layout: 'horizontal'
                    });

                    var firstNameLabel = Ti.UI.createLabel({
                        text: speaker.first_name,
                        font: 'Helvetica',
                        left: 10,
                        height: 40,
                        width: 'auto',
                        color: '#000',
                        touchEnabled: false
                    });
                    nameView.add(firstNameLabel);

                    var lastNameLabel = Ti.UI.createLabel({
                        text: speaker.last_name,
                        font: 'Helvetica-Bold',
                        left: 5,
                        height: 40,
                        width: 'auto',
                        color: '#000',
                        touchEnabled: false
                    });
                    nameView.add(lastNameLabel);
                    presenterRow.add(nameView);
                }

                // If there is a new last name first letter, insert a header in the table.
                // We also push a new index so we can create a right side index for iphone.
                if (headerLetter === '' || speaker.last_name.charAt(0).toUpperCase() != headerLetter) {
                    headerLetter = speaker.last_name.charAt(0).toUpperCase();
                    data.push(Codestrong.ui.createHeaderRow(headerLetter));
                    index.push({
                        title: headerLetter,
                        index: i
                    });
                }

                data.push(presenterRow);
            }

            tableview.setData(data);
            tableview.index = index;
        };

        PresentersWindow.doRefresh();
        Ti.App.addEventListener('app:update_speakers', function () {
            PresentersWindow.doRefresh();
        });

        // create table view event listener
        tableview.addEventListener('click', function (e) {
            if (!e.rowData.uid) {
                return;
            }
            // event data
            var index = e.index;
            Codestrong.navGroup.open(Codestrong.ui.createPresenterDetailWindow({
                title: e.rowData.full_name,
                uid: e.rowData.uid,
                name: e.rowData.full_name
            }), {
                animated: true
            });
        });

        // add table view to the window
        PresentersWindow.add(tableview);

        return PresentersWindow;
    };


})();
