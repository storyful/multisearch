$(document).ready(function() {

  var bindEvents = function(){
    $("input[type='checkbox']").change(saveSearchOptions);
    $("input[type='checkbox']").change(toggleSearchOption);
    $("input[type='checkbox']").change(renderSelectedOptions);
    $("#options-selected").click(toggleSearchForm);
    $('.toggle-options').click(toggleSearchForm);
    $('#keyword').change(saveKeyword);
    $('form').submit(search);

    $(document).keydown(function(e){
      if(e.keyCode == 27) toggleOverlay();
    });
  };

  var initialize = function(){
    updateOptions();
    renderSelectedOptions();

    $('#keyword').focus();
  };

  var renderSelectedOptions = function(){
    var selected = [];

    $.each(localStorage, function(option, value){
      if(value === "true") {
        selected.push( $('#'+option).attr('data-service') );
      }
    });

    var output = (selected.length > 1) ?
      selected.slice(0, -1).join(", ") + " and " + selected[selected.length-1] :
      selected.join();

    $('#options-selected span').html( output );

    console.log();
    console.log(  );

    $('#options-selected .has-options').toggle( selected.length > 0 );
    $('#options-selected .no-options').toggle( selected.length === 0 );
  };

  var updateOptions = function(){
    // mixpanel.track("MultiSearch shown");
    $('#keyword').val(localStorage.keyword);

    // Remember checkbox choices between sessions
    $.each($("input[type='checkbox']"), function(index, ele) {
      if (localStorage[$(ele).attr('id')] === undefined) {
        if ($(ele).is(':checked')) {
          localStorage[$(ele).attr('id')] = 'true';
        } else {
          localStorage[$(ele).attr('id')] = 'false';
        }
      }

      if (localStorage[$(ele).attr('id')] == 'false') {
        $(ele).removeAttr('checked');
        // $(ele).closest('li').hide();
      } else {
        $(ele).attr('checked', 'checked');
        $(ele).closest('label').addClass('active');
      }
    });
  };

  var search = function(e) {
    e.preventDefault();

    var k = $('#keyword').val(),
        tabs = [];

    if (k.replace(/ /g, '').length === 0) {
      $('#keyword').focus();
    } else {
      $.each($("input[type='checkbox']:checked"), function(index, el) {
        heap.track('Search ' + $(el).attr('data-service'));
        tabs.push( getSearchUrl(el, k) );
      });

      openTabs(tabs);
      toggleOverlay();
    }
  };

  var getSearchUrl = function(el, query){
    if ($(el).attr('data-search-modifier') != 'undefined') {
      var modifier = new RegExp($(el).attr('data-search-modifier'), 'g');
      query = query.replace(modifier, '');
    }
    console.log('hello');
    return $(el).attr('data-search-url').replace('{{k}}', encodeURIComponent(query));
  };
  
  

  var getSearchScript = function(urls){
    var script = [];

    // To open more than 3 tabs at once in Chrome requires trickery.
    for(i = 0; i < urls.length; i++){
      script.push((i === 0) ?
        'document.location = "' + urls[i] + '"; ' :
        'window.open("' + urls[i] + '");');
    }

    return script.join('');
  };

  var openTabs = function(urls){
    chrome.runtime.sendMessage({ text: "search", script: getSearchScript(urls) });
  };

  var toggleOverlay = function(){
    chrome.runtime.sendMessage({ text: "toggle_overlay" });
  };

  var saveKeyword = function(e) {
    localStorage.keyword = $(e.target).val();
  };

  var expandOptions = function(){
    var expanded = $("ul").hasClass('expanded'),
        $options = $("ul label").not(".active").closest('li');

    if(expanded) return;
    $('.toggle-options').hide();

    $.when( $options.fadeToggle(expanded) ).done(function(){
      resizeOverlay();
      $("ul").toggleClass('expanded');
    });
  };

  var resizeOverlay = function(){
    chrome.runtime.sendMessage({ text: "resize", height: $('.container').outerHeight() });
  };

  var toggleSearchForm = function(e){
    $('#options-selected').fadeOut(300, function(){
      $('#options-form').fadeIn(300, function(){
        resizeOverlay();
        $('.toggle-options').fadeOut();
      });
    });
  };

  var toggleSearchOption = function(e){
    var checked = $(e.target).is(':checked');
    $(e.target).closest('label').toggleClass( 'active', checked );
  };

  var saveSearchOptions = function(e) {
    $.each($("input[type='checkbox']"), function(index, ele) {
      var checked = $(ele).is(':checked');

      if ( checked )  {
        localStorage[$(ele).attr('id')] = 'true';
      } else {
        localStorage[$(ele).attr('id')] = 'false';
      }
    });
  };

  bindEvents();

  initialize();

});