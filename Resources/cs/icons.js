(function() {
  var iconHeight = 85;
  var iconWidth = 102;
  var imageSuffix = '';

  if (Codestrong.isLargeScreen()) {
    iconHeight = 170;
    iconWidth = 204;
    imageSuffix = '@2x';
  }

  Codestrong.ui.icons = {
    height: iconHeight,
    width: iconWidth,
    list: [
      {
        image: '/images/dashboard/schedule' + imageSuffix + '.png',
        func: Codestrong.ui.createDayWindow,
        refresh: true
      },
      {
        image: '/images/dashboard/maps' + imageSuffix + '.png',
        func: Codestrong.ui.createMapWindow,
        refresh: true
      },
      {
        image: '/images/dashboard/news' + imageSuffix + '.png',
        func: Codestrong.ui.createTwitterWindow
      },
      {
        image: '/images/dashboard/speakers' + imageSuffix + '.png',
        func: Codestrong.ui.createPresentersWindow,
        refresh: true
      },
      {
        image: '/images/dashboard/sponsors' + imageSuffix + '.png',
        func: Codestrong.ui.createSponsorsWindow,
      },
        {
        image: '/images/dashboard/about' + imageSuffix + '.png',
        func: Codestrong.ui.createAboutWindow
      }
    ]
  };
})();