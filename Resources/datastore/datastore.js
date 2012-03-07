var SeConf = SeConf || {};

SeConf.DataStore = function() {
  this.endpoint = "https://raw.github.com/jarib/selenium-conf-app/master/data/";
  this.speakers = null;
  this.sessions = null;
};

SeConf.DataStore.timeout = 11000;

SeConf.DataStore.prototype.refreshSpeakers = function() {
  this.fetch_(this.endpoint + "speakers.json", function(data) {
    SeConf.datastore.speakers = data;
    Titanium.fireEvent("datastore:update_completed");
    Ti.App.Properties.setString('speakers', JSON.stringify(data));
  });
};

SeConf.DataStore.prototype.refreshSessions = function() {
  this.fetch_(this.endpoint + "sessions.json", function(data) {
    SeConf.datastore.sessions = data;
    Titanium.fireEvent("datastore:update_completed");
    Ti.App.Properties.setString('sessions', JSON.stringify(data));
  });
}

SeConf.DataStore.prototype.getSpeakers = function() {
  if(!this.speakers) {
    this.speakers = JSON.parse(Ti.App.Properties.getString('speakers', '{}'));
    this.refreshIfNecessary(this.speakers);
  }

  return this.speakers;
};

SeConf.DataStore.prototype.getSessions = function() {
  if (!this.sessions) {
    this.sessions = JSON.parse(Ti.App.Properties.getString('sessions', '{}'));
    this.refreshIfNecessary(this.speakers);
  }

  return this.sessions;
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
    Ti.fireEvent("codestrong:update_data");
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
    callback(eval(this.responseText));
  };
  xhr.send();
};


SeConf.datastore = new SeConf.DataStore();
