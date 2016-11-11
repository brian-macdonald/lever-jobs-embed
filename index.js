
window.loadLeverJobs = function (options) {

  var tagsToReplace = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;'
  };

  function replaceTag(tag) {
      return tagsToReplace[tag] || tag;
  }

  function sanitizeHTML(str) {
      return str.replace(/[&<>]/g, replaceTag);
  }

  //Functions for checking if the variable is unspecified and removing script tags + null check
  function sanitizeAttribute(string) {
    if (string == '' || typeof string == 'undefined' ) {
      return;
    }
    string = sanitizeHTML(string);
    return string.replace(/\s+/ig, "");
  }

  // Replace "leverdemo" with your own company name
  var url = 'https://api.lever.co/v0/postings/' + options.accountName + '?group=team&mode=json';

  function createJobs(_data) {

    var content = "";

    for(i = 0; i < _data.length; i++) {
      var title = sanitizeHTML(_data[i].title || 'Uncategorized');
      var titlesanitizeAttribute = sanitizeAttribute(title);

      content += '<ul class="lever-jobs-list ' + titlesanitizeAttribute + '">';
      content += '<li class="lever-team ' + titlesanitizeAttribute + '"><h3 class="lever-team-title">' + title + '</h3></li>';

      for (j = 0; j < _data[i].postings.length; j ++) {
        var posting = _data[i].postings[j];
        var postingTitle = sanitizeHTML(posting.text);
        var location = (posting.categories.location || 'Uncategorized');
        var locationsanitizeAttribute = sanitizeAttribute(location);
        var commitment = (posting.categories.commitment || 'Uncategorized');
        var commitmentsanitizeAttribute = sanitizeAttribute(commitment);
        var team = (posting.categories.team || 'Uncategorized' );
        var teamsanitizeAttribute = sanitizeAttribute(team);
        var link = posting.hostedUrl;

        content += '<li class="lever-job ' + teamsanitizeAttribute + ' ' + locationsanitizeAttribute + ' ' + commitmentsanitizeAttribute + '">' +
          '<a class="lever-job-title" href="' + link + '"">' + postingTitle + '</a><span class="lever-job-tag">' + location + '</span></li>';
      }
      content += '</ul>';
    }
    document.getElementById("lever-jobs-container").innerHTML = content;
  }

  console.log("INCLUDECSS", options.includeCss);
  if (options.includeCss) {
    function addCss(fileName) {

      var head = document.head
        , link = document.createElement('link');

      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = fileName;

      head.appendChild(link);
    }
    addCss('https://dl.dropbox.com/s/7de8zvhboq82yoc/style.css');
  }

  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = "json";

  request.onload = function() {
    if (request.status == 200) {
      createJobs(request.response);
    } else {
      console.log("Error fetching jobs.");
    }
  };

  request.onerror = function() {
    console.log("Error fetching jobs.");
  };

  request.send();


};

window.loadLeverJobs(window.leverJobsOptions);