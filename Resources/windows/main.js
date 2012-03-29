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
    var updateTimeout = 15000;
    var i = 0;
    var navWindow;
    var mainWindow = Ti.UI.createWindow({
        backgroundImage: Codestrong.ui.mainBackgroundImage,
        title: 'Dashboard',
        navBarHidden: true,
        exitOnClose: true
    });
    var viewFade = Ti.UI.createView({
        backgroundColor: '#fff',
        borderColor: '#888',
        borderWidth: 4,
        height: Codestrong.ui.dashboardHeight,
        width: Codestrong.ui.dashboardWidth,
        bottom: 20,
        opacity: 0.75,
        borderRadius: 8
    });
    var viewIcons = Ti.UI.createView({
        height: Codestrong.ui.dashboardHeight,
        width: Codestrong.ui.dashboardWidth,
        bottom: 20,
        borderRadius: 0,
        layout: 'horizontal'
    });
    mainWindow.add(viewFade);
    mainWindow.add(viewIcons);

    // handle cross-platform navigation
    if (Codestrong.isAndroid()) {
        Codestrong.navGroup = {
            open: function (win, obj) {
                win.open(obj);
            },
            close: function (win, obj) {
                win.close(obj);
            }
        };
        navWindow = mainWindow;
    } else {
        navWindow = Ti.UI.createWindow();
        Codestrong.navGroup = Ti.UI.iPhone.createNavigationGroup({
            window: mainWindow
        });
        navWindow.add(Codestrong.navGroup);
    }

    // lock orientation to portrait
    navWindow.orientationModes = [Ti.UI.PORTRAIT];
    if (!Codestrong.isAndroid()) {
        Ti.UI.orientation = Ti.UI.PORTRAIT;
    }

  // Create each dashboard icon and include necessary properties
  // for any windows it opens.
    var createIcon = function (icon) {
        var iconWin = undefined;
        var view = Ti.UI.createView({
            backgroundImage: icon.image,
            top: 0,
            height: Codestrong.ui.icons.height,
            width: Codestrong.ui.icons.width
        });
        view.addEventListener('click', function (e) {
            iconWin = icon.func(icon.args);
            iconWin.orientationModes = [Ti.UI.PORTRAIT];

            // add a left navigation button for ios
            if (!Codestrong.isAndroid()) {
                var leftButton = Ti.UI.createButton({
                    backgroundImage: '/images/6dots.png',
                    width: 41,
                    height: 30
                });
                leftButton.addEventListener('click', function () {
                    Codestrong.navGroup.close(iconWin, {
                        animated: true
                    });
                });
                iconWin.leftNavButton = leftButton;
            }

            // add sessions and speaker refresh
            if (icon.refresh) {
                if (Codestrong.isAndroid()) {
                    iconWin.addEventListener('open', function () {
                        Codestrong.android.menu.init({
                            win: iconWin,
                            buttons: [{
                                title: "Update",
                                clickevent: function () {
                                    Ti.App.fireEvent('codestrong:update_data');
                                }
                            }]
                        });
                    });
                } else {
                    var rightButton = Ti.UI.createButton({
                        systemButton: Ti.UI.iPhone.SystemButton.REFRESH
                    });
                    iconWin.rightNavButton = rightButton;
                    rightButton.addEventListener('click', function () {
                        Ti.App.fireEvent('codestrong:update_data');
                    });
                }
            }

            iconWin.navBarHidden = false;
            Codestrong.navGroup.open(iconWin, {
                animated: true
            });
        });
        return view;
    };

  // Layout the dashboard icons
    for (i = 0; i < Codestrong.ui.icons.list.length; i++) {
        viewIcons.add(createIcon(Codestrong.ui.icons.list[i]));
    }

    if (Codestrong.isAndroid()) {
        mainWindow.open({
            animated: true
        });
    } else {
        navWindow.open({
            transition: Ti.UI.iPhone.AnimationStyle.CURL_DOWN
        });
    }

    // Handle sessions and speaker updates
    Ti.App.addEventListener('datastore:update_completed', function (e) {
        Codestrong.ui.activityIndicator.hideModal();
    });

    Ti.App.addEventListener('codestrong:update_data', function (e) {
        Ti.API.debug("updating data");

        if(!Ti.Network.online) {
          Titanium.UI.createAlertDialog({
            title: 'No network connection detected.',
            message: 'Unable to load session and speaker data.',
            buttonNames: ['OK']
          }).show();
        } else {
          Codestrong.ui.activityIndicator.showModal('Loading...', updateTimeout, 'Connection timed out. All session and speaker data may not have updated.');
          SeConf.datastore.refresh();
        }

    });

    Ti.App.fireEvent("codestrong:update_data");
})();