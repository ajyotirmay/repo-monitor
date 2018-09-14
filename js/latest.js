(function() {
  'use strict';

  var app = {
    spinner: document.querySelector('.loader')
  };

  var container = document.querySelector('.container');

  document.getElementById('butRefresh').addEventListener('click', function() {
    // Get fresh, updated data from Github whenever you are clicked
    toast('Fetching latest data...');
    fetchCommits();
    console.log("Getting fresh data!!!");
  });

  var commitContainer = ['.first', '.second', '.third', '.fourth', '.fifth'];
  var posData = ['first', 'second', 'third', 'fourth', 'fifth'];

  // Check that localStorage is both supported and available
  function storageAvailable(type) {
    try {
      var storage = window[type],
        x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    }
    catch(e) {
      return false;
    }
  }

  // Get Commit Data from Github API
  function fetchCommits() {
    var url = 'https://api.github.com/repos/ajyotirmay/battery-monitor/commits?sha=0affa143bc36082186f4d9014007cc9ee0a06804';

    app.spinner.setAttribute('visible', true);

    fetch(url)
    .then(function(fetchResponse){
      return fetchResponse.json();
    })
    .then(function(response) {
        console.log("Response from Github", response);

        var commitData = {};

        for (var i = 0; i < posData.length; i++) {
          commitData[posData[i]] = {
            avatar: response[i].author.avatar_url,
            message: response[i].commit.message,
            author: response[i].commit.author.name,
            time: response[i].commit.author.date,
            link: response[i].html_url,
            sha: response[i].sha.substring(0,7)
          };
        }

        localStorage.setItem('commitData', JSON.stringify(commitData));

        for (var i = 0; i < commitContainer.length; i++) {
          container.querySelector("" + commitContainer[i]).innerHTML =
          "<img class='profile' src='" + response[i].author.avatar_url + "' align='left'/>" +
          "<span class='msg' title='" + response[i].commit.message + "' style='font-weight:bold;'>" + response[i].commit.message + "</span>" +
          "<span class='content'>" + response[i].commit.author.name + "</span>" +
          "<span class='content'>" + (new Date(response[i].commit.author.date)).toUTCString() + "</span>" +
          "<form action='" + response[i].html_url + "'><input class='viewCommit' type='submit' value='" + response[i].sha.substring(0,7) + "'/>";
        }

        app.spinner.setAttribute('hidden', true); // hide spinner
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  // Get the commits Data from the Web Storage
  function fetchCommitsFromLocalStorage(data) {
    var localData = JSON.parse(data);

    app.spinner.setAttribute('hidden', true); //hide spinner

    for (var i = 0; i < commitContainer.length; i++) {

      container.querySelector("" + commitContainer[i]).innerHTML =
      "<img class='profile' src='" + localData[posData[i]].avatar + "' align='left'/>" +
      "<span class='msg' title='" + localData[posData[i]].message + "' style='font-weight:bold;'>" + localData[posData[i]].message + "</span>" +
      "<span class='content'>" + localData[posData[i]].author + "</span>" +
      "<span class='content'>" + (new Date(localData[posData[i]].time)).toUTCString() + "</span>" +
      "<form action='" + localData[posData[i]].html_url + "'><input class='viewCommit' type='submit' value='" + localData[posData[i]].sha.substring(0,7) + "'/>";

    }
  };

  if (storageAvailable('localStorage')) {
    if (localStorage.getItem('commitData') === null) {
      /* The user is using the app for the first time, or the user has not
       * saved any commit data, so show the user some fake data.
       */
      fetchCommits();
      console.log("Fetch from API");
    } else {
      fetchCommitsFromLocalStorage(localStorage.getItem('commitData'));
      console.log("Fetch from Local Storage");
    }
  }
  else {
    toast("We can't cache your app data yet..");
  }
})();
