## Storyful Multisearch

A Google Chrome browser extension to help you search multiple social networks quickly and
efficiently.

## Note

The Storyful maintained version of this extension in the Google Store records usage via Google Analytics
and Mixpanel. We only record that the extension was opened and when a search is requested, not the search 
term or which search services were selected.

## Installation

You can install the Storyful maintained version of this extension from the [Google Store](https://chrome.google.com/webstore/detail/storyful-multisearch/hkglibabhninbjmaccpajiakojeacnaf).

Or you can maintain your own version and upload it to the Google Store or load a packed CRX version
or the unpacked version into your local Chrome browser using the Extensions page;
chrome://extensions

## Development

We welcome your improvements. Fork the repo on Github and send a pull request with your changes.

1. Either supply a Google Analytics key in tracking.js or remove tracking.js requirement browser_action.html.

## Features & Issues

1. You can add new websites to search just by copying one of the existing checkbox inputs and
modifying the data-search-url attribute.
2. A Firefox or Safari version of this extension would be useful.
3. The data-search-modifier lets you use regex to strip out chars e.g. when converting a search phrase
to a tag for Instagram and Tumblr. "america's cup" becomes "americascup".

## Contact

Contact Tony Byrne <tony.byrne@storyful.com> (CTO @Storyful) with any questions, suggestions or problems.

## License

Storyful Multisearch is released under the [MIT License](http://www.opensource.org/licenses/MIT).
