$(document).ready(function() {

  var bindEvents = function(){
    $("input[type='checkbox']").change(saveSearchOptions);
    $('#keyword').change(saveKeyword);
    $('form').submit(search);    
  }

  var initialize = function(){
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

    var k = $('#keyword').val(),
        tabs = [];

    if (k.replace(/ /g, '').length == 0) {
      $('#keyword').focus();
    } else {
      $.each($("input[type='checkbox']:checked"), function(index, el) {
        heap.track('Search ' + $(el).attr('data-service'));
        tabs.push( getSearchUrl(el, k) );
      });

      openTabs(tabs);
      toggleOverlay();
    }
  }

  var getSearchUrl = function(el, query){
    if ($(el).attr('data-search-modifier') != 'undefined') {
      var modifier = new RegExp($(el).attr('data-search-modifier'), 'g');
      query = query.replace(modifier, '');
    }

    return $(el).attr('data-search-url').replace('{{k}}', encodeURIComponent(query));
  }

  var getSearchScript = function(urls){
    var script = [];
    
    // To open more than 3 tabs at once in Chrome requires trickery.
    for(i = 0; i < urls.length; i++){
      script.push((i == 0) ?
        'document.location = "' + urls[i] + '"; ' :
        'window.open("' + urls[i] + '");');
    }

    return script.join('');
  }
  
  var openTabs = function(urls){  
    chrome.runtime.sendMessage({ text: "search", script: getSearchScript(urls) });
  }

  var toggleOverlay = function(){
    chrome.runtime.sendMessage({ text: "toggle_overlay" });
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