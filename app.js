$(document).ready(function() {

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
		$('.error.length').css('visibility', 'hidden');

		// Chrome extensions are only allowed to open 3 new tabs at once
		if ($("input[type='checkbox']:checked").length > 3) {
			$("input[type='checkbox']:checked").not(this).last().removeAttr('checked');
			$('.error.length').css('visibility', 'visible');
		}

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
			$.each($("input[type='checkbox']:checked"), function(index, ele) {
				var search_url = $(ele).attr('data-search-url').replace('{{k}}', k);
  			chrome.tabs.create({'url': search_url}, function(tab) {});
	    });
		}
	});
});