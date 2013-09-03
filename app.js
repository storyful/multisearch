$(document).ready(function() {

	mixpanel.track("MultiSearch shown");

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

	// Store checkbox choice
	$("input[type='checkbox']").change(function(e) {
		$.each($("input[type='checkbox']"), function(index, ele) {
			if ($(ele).is(':checked'))	{
				localStorage[$(ele).attr('id')] = 'true';
			} else {
				localStorage[$(ele).attr('id')] = 'false';
			}
		});
	});

	// Remember keyword between sessions
	$('#keyword').change(function() {
		localStorage['keyword'] = $(this).val();
	});

	$('form').submit(function(e) {
    e.preventDefault();

    var k = $('#keyword').val();

    if (k.replace(/ /g, '').length == 0) {
			$('#keyword').focus();        	
    } else {
    	mixpanel.track("MultiSearch requested"); //#NOTE: Only tracks that a search happened, not what the search was for.
    	
    	// To open more than 3 tabs at once in Chrome requires trickery.
    	var code_block = '';
			$.each($("input[type='checkbox']:checked"), function(index, ele) {
				var search_url = $(ele).attr('data-search-url').replace('{{k}}', encodeURIComponent(k));
				if (index == 0) {
					code_block = "document.location = '" + search_url + "'; ";
				} else {
					code_block = code_block + "window.open('" + search_url + "');";
				}
    	});

			// Cannot executeScript in chrome:// tabs so must open real URL.
    	chrome.tabs.create({url: 'http://storyful.com?utm=multisearch', active: false}, function(tab) {
	    	chrome.tabs.executeScript(tab.id, {runAt: 'document_start', code:code_block});
	    });
		}
	});
});