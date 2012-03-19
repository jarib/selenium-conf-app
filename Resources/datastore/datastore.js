var SeConf = SeConf || {};

SeConf.DataStore = function() {
  this.endpoint = "https://raw.github.com/jarib/selenium-conf-app/master/data/";
  this.speakers = null;
  this.sessions = null;
  this.sponsors = null;
  this.extraLocations = null;
};

SeConf.DataStore.timeout = 11000;

SeConf.DataStore.prototype.refresh = function() {
  this.fetch_(this.endpoint + "seconf.json", function(data) {
    SeConf.datastore.speakers = data.speakers;
    Ti.App.Properties.setString('speakers', JSON.stringify(data.speakers));

    SeConf.datastore.sessions = data.sessions;
    Ti.App.Properties.setString('sessions', JSON.stringify(data.sessions));

    SeConf.datastore.sponsors = data.sponsors;
    Ti.App.Properties.setString('sponsors', JSON.stringify(data.sponsors));

    Titanium.App.fireEvent("datastore:update_completed");
  });
};

SeConf.DataStore.prototype.getSpeakers = function() {
  if(!this.speakers) {
    this.speakers = JSON.parse(Ti.App.Properties.getString('speakers', '[]'));
    this.refreshIfNecessary(this.speakers);
  }

  return this.speakers;
};

SeConf.DataStore.prototype.getSessions = function() {
  if (!this.sessions) {
    this.sessions = JSON.parse(Ti.App.Properties.getString('sessions', '[]'));
    this.refreshIfNecessary(this.speakers);
  }

  return this.sessions;
};

SeConf.DataStore.prototype.getSponsors = function() {
  if(!this.sponsors) {
    this.sponsors = JSON.parse(Ti.App.Properties.getString('sponsors', '[]'));
    this.refreshIfNecessary(this.sponsors);
  }

  return this.sponsors;
};

SeConf.DataStore.prototype.getExtraLocations = function() {
  if(!this.extraLocations) {
    this.extraLocations = JSON.parse(Ti.App.Properties.getString('extraLocations', '[]'));
    this.refreshIfNecessary(this.extraLocations);
  }

  return this.extraLocations;
};


SeConf.DataStore.prototype.sessionAt = function(nid) {
  var sessions = this.getSessions();
  for(var i = 0; i < sessions.length; i++) {
    var session = sessions[i];
    if(session.nid === nid) {
      return session;
    }
  }

  throw new Error("could not find session with nid: " + nid);
}

SeConf.DataStore.prototype.speakerAt = function(uid) {
  var speakers = this.getSpeakers();
  for(var i = 0; i < speakers.length; i++) {
    var speaker = speakers[i];
    if(speaker.uid === uid) {
      Ti.API.debug("returning speaker: " + JSON.stringify(speaker) + " for uid" + uid);
      return speaker;
    }
  }

  throw new Error("could not find speaker with uid: " + uid);
}


SeConf.DataStore.prototype.getSpeakersNamed = function(names) {
  var speakers = this.getSpeakers();

  var result = [];
  for(var i = 0; i < speakers.length; i++) {
    var speaker = speakers[i];
    for(var j = 0; j < names.length; j++) {
      if (speaker.full_name.indexOf(names[j]) != -1) {
        result.push(speaker);
      }
    }
  }

  return result;
};

SeConf.DataStore.prototype.getSessionsForSpeaker = function(name) {
  var sessions = this.getSessions();
  var result = [];
  for(var i = 0; i < sessions.length; i++) {
    var session = sessions[i];
    if (session.instructors.indexOf(name) != -1) {
      result.push(session);
    }
  }

  return result;
}

SeConf.DataStore.prototype.refreshIfNecessary = function(data) {
  if(!data || data.length == 0) {
    Ti.App.fireEvent("codestrong:update_data");
  }
};

SeConf.DataStore.prototype.getSessionsFor = function(startDate, endDate) {
  var result = [];
  var sessions = this.getSessions();

  for(var i = 0; i < this.sessions.length; i++) {
    var session = this.sessions[i];
    var sessionStart = Codestrong.datetime.strtotime(session.start_date);
    var sessionEnd = Codestrong.datetime.strtotime(session.end_date);

    if(sessionStart >= startDate && sessionEnd <= endDate) {
      result.push(session);
    }
  }

  return result;
}


SeConf.DataStore.prototype.fetch_ = function(url, callback) {
  var xhr = Ti.Network.createHTTPClient();
  xhr.timeout = SeConf.DataStore.timeout;
  xhr.open("GET", url);

  xhr.onerror = function () {
    Ti.API.info("xhr error");
  };

  xhr.onload = function () {
    Ti.API.info("onload: " + this.responseText);
    callback(JSON.parse(this.responseText));
  };

  Ti.API.info("fetching " + url);
  xhr.send();
};


SeConf.datastore = new SeConf.DataStore();
