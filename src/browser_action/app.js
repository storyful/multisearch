$(document).ready(function() {

  var bindEvents = function(){
    $("input[type='checkbox']").change(saveSearchOptions);
    $('#keyword').change(saveKeyword);
    $('form').submit(search);    
  }

  var initialize = function(){
    console.log('hello')

    // mixpanel.track("MultiSearch shown");
    $('#keyword').val(localStorage['keyword']);

    // Remember checkbox choices between sessions
    $.each($("input[type='checkbox']"), function(index, ele) {
      if (localStorage[$(ele).attr('id')] == undefined) {
        if ($(ele).is(':checked')) {
          localStorage[$(ele).attr('id')] = 'true';
        } else {
          localStorage[$(ele).attr('id')] = 'false';
        }
      }

      if (localStorage[$(ele).attr('id')] == 'false') {
        $(ele).removeAttr('checked');
      } else {
        $(ele).attr('checked', 'checked');
      }
    });
  }  

  var search = function(e) {
    e.preventDefault();

    console.log('search');

    var k = $('#keyword').val(),
        tabs = [];

    if (k.replace(/ /g, '').length == 0) {
      $('#keyword').focus();
    } else {
      // mixpanel.track("MultiSearch requested");
      // #NOTE: Only tracks that a search happened, not what the search was for.
      $.each($("input[type='checkbox']:checked"), function(index, el) {
        tabs.push( getSearchUrl(el, k) );
      });

      openTabs(tabs);
    }
  }

  var getSearchUrl = function(el, query){
    if ($(el).attr('data-search-modifier') != 'undefined') {
      var modifier = new RegExp($(el).attr('data-search-modifier'), 'g');
      query = query.replace(modifier, '');
    }

    return $(el).attr('data-search-url').replace('{{k}}', encodeURIComponent(query));
  }
  
  var openTabs = function(urls){
    var script = [];
    
    // To open more than 3 tabs at once in Chrome requires trickery.
    for(i = 0; i < urls.length; i++){
      script.push((i == 0) ?
        'document.location = "' + urls[i] + '"; ' :
        'window.open("' + urls[i] + '");');
    }

    console.log(script.join(''));

    // Cannot executeScript in chrome:// tabs so must open real URL.
    chrome.tabs.create({ url: 'http://storyful.com?utm=multisearch', active: false }, function(tab) {
      chrome.tabs.executeScript(tab.id, { runAt: 'document_start', code: script.join('') });
    });
  }

  var saveKeyword = function(el) {
    localStorage['keyword'] = $(el).val();
  }

  var saveSearchOptions = function(e) {
    $.each($("input[type='checkbox']"), function(index, ele) {
      if ($(ele).is(':checked'))  {
        localStorage[$(ele).attr('id')] = 'true';
      } else {
        localStorage[$(ele).attr('id')] = 'false';
      }
    });
  }

  bindEvents();
  
  initialize();

});