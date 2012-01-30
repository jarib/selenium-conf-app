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

    Codestrong.ui.createDayWindow = function (tabGroup) {
        // Base row properties
        var baseRow = {
            hasChild: true,
            color: '#000',
            backgroundColor: '#fff',
            font: {
                fontWeight: 'bold'
            }
        };
        baseRow[Codestrong.ui.backgroundSelectedProperty + 'Color'] = Codestrong.ui.backgroundSelectedColor;

        // Creates a TableViewRow using the base row properties and a given
        // params object
        var createDayRow = function (params) {
            return Codestrong.extend(Ti.UI.createTableViewRow(params), baseRow);
        }

        // Create data for TableView
        var data = [
	        createDayRow({
	            title: 'Monday, April 16th',
	            titleShort: 'April 16th',
	            start_date: Codestrong.datetime.strtotime('2012-04-16 00:00:00'), // TODO new Date...
	            end_date: Codestrong.datetime.strtotime('2012-04-17 00:00:00'), // TODO new Date...
	            scheduleListing: true
	        }),
	        createDayRow({
	            title: 'Tuesday, April 17h',
	            titleShort: 'April 17th',
	            start_date: Codestrong.datetime.strtotime('2012-04-17 00:00:00'), // TODO new Date...
	            end_date: Codestrong.datetime.strtotime('2012-04-18 00:00:00'), // TODO new Date...
	            scheduleListing: true
	        }),
	        createDayRow({
	            title: 'Monday, April 18th',
	            titleShort: 'April 18th',
	            start_date: Codestrong.datetime.strtotime('2012-04-18 00:00:00'), // TODO new Date...
	            end_date: Codestrong.datetime.strtotime('2012-04-19 00:00:00'), // TODO new Date...
	            scheduleListing: true
	        }),
        ];

        // create main day window
        var dayWindow = Titanium.UI.createWindow({
            id: 'win1',
            title: 'Schedule',
            backgroundColor: '#fff',
            barColor: '#414444',
            fullscreen: false
        });
        var tableview = Titanium.UI.createTableView({
            data: data
        });
        dayWindow.add(tableview);

        tableview.addEventListener('click', function (e) {
            if (e.rowData.scheduleListing) {
                Codestrong.navGroup.open(Codestrong.ui.createSessionsWindow({
                    titleShort: e.rowData.titleShort,
                    title: e.rowData.title,
                    start_date: e.rowData.start_date,
                    end_date: e.rowData.end_date
                }), {
                    animated: true
                });
            } else {
                Codestrong.navGroup.open(Codestrong.ui.createHtmlWindow({
                    title: e.rowData.titleShort,
                    url: e.rowData.url
                }), {
                    animated: true
                });
            }

        });

        SeConf.datastore.getSessions(); // we want to make the inital request here.

        return dayWindow;
    };
})();