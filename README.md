## Node client for YMLP (Your Mailing List Provider)

This module is a client to interact with the emailing service "Your Mailing List Provider" (http://www.ymlp.com). 

### API Credentials

Before using this module, you need to enable the API usage and retrieve your API key. If you have no idea about how to do it, please read this [article](http://www.nikkow.eu/node-ymlp/create-api).

### Usage

Installation from npm repository:

	npm install --save node-ymlp

You need to include the library and create new instance with your API credentials:

	var YMLP = require("node-ymlp");
	var ymlp = new YMLP("MY_API_KEY", "MY_USER_NAME");
	
You can also specify optional settings:

	var YMLP = require("node-ymlp");
	
	var options = {
		secure: false,
	};
	
	var ymlp = new YMLP("MY_API_KEY", "MY_USER_NAME", options);

For now, only the `secure` option can be used. If it is set to true, the API transactions will use HTTPS. It is, by default, set to true. 

The methods are grouped by functions:

	ymlp.contacts([method], [params], [callback]);
	ymlp.groups([method], [params], [callback]);
	ymlp.filters([method], [params], [callback]);
	ymlp.fields([method], [params], [callback]);
	ymlp.newsletter([method], [params], [callback]);
	ymlp.archive([method], [params], [callback]);

`[method]` corresponds to the list defined below. 

`[params]` is required for some methods, optionnal for others. It is an object of all params needed for each method. Refer to the official YMLP documentation to know what params are available for which method. 

`[callback]` has the syntax `callback(err, response)`. If all went well and no error was returned, `err` will be null. It something went wrong, it will contain an Error object. `response` contains the raw response returned by YMLP.

### Methods

All the methods available in YMLP APIs can be used via this client. For a complete list, check-out their [documentation](http://www.ymlp.com/app/api.php).

#### Contacts

* `Add`: Adds a contact to the mailing list
* `Delete`: Removes a contact from the system (from all lists)
* `Unsubscribe`: Unsubscribe a contact (it will generate an error if you try to re-add the same email address)
* `GetContact`: Retrieves information about a contact
* `GetList`: Retrieves a list of all the contacts
* `GetUnsubscribed`: Retrieves a list of all unsubscribed email addresses
* `GetDeleted`: Retrieves a list of all deleted email addresses
* `GetBounced`: Retrieves a list of all email addresses deleted after a few bounces

#### Groups

* `GetList`: Retrieves a list of all the available groups
* `Add`: Creates a new group
* `Delete`: Removes a group
* `Update`: Updates a group label 
* `Empty`: Removes all the contacts from a given group

#### Fields

* `GetList`: Retireves a list of all custom fields available
* `Add`: Creates a new custom field
* `Delete`: Removes a custom field
* `Update`: Updates the label of a custom field

#### Filters

* `GetList`: Retrieves a list of all custom filters
* `Add`: Creates a new filter (e.g. All the email addresses belonging to "yahoo" domain, or created before a given date)
* `Delete`: Removes a filter

#### Newsletter

* `GetFroms`: Retrieves a list of all the authorized senders
* `AddFrom`: Add an authorized sender (an email address that can be used as the expeditor of a campaign)
* `DeleteFrom`: Delete an authorized sender
* `Send`: Send an email/campaign

#### Archive

* `GetList`: Retrieves a list of all sent items
* `GetSummary`: Retrieves a set of information about a given emailing campaign
* `GetRecipients`: Retrieves the list of a given campaign recipients
* `GetDelivered`: Retrieves the list of email addresses a newsletter was successfully delivered to
* `GetBouces`: Retrieves the bouncebacks for a newsletter
* `GetOpens`: Retrieves the list of email addresses that opened a newsletter
* `GetUnopened`: Retrieves the list of email addresses that did not open a newsletter.
* `GetTrackedLinks`: Returns the list of tracked links for a newsletter that was sent with click tracking
* `GetClicks`: Returns the list of clicks for a newsletter that was sent with click tracking, either for all links in the newsletter
* `GetForwards`: Returns the list of forwards for a newsletter

### Usage Examples

#### Case 1: Add a contact into a group (ID: 1)

	var YMLP = require("node-ymlp");
	var ymlp = new YMLP("MY_API_KEY", "MY_USER_NAME");
	
	ymlp.contacts("Add", {
		"email": "john@dummy.com",
		"groupId": 1
	}, function(err, response) {
		if(err) throw err;
		// - Do what you need
		// - response will equal "john@dummy.com has been added" if all went well.
	});
	
#### Case 2: Send a newsletter to all contacts in the group ID=1

	var YMLP = require("node-ymlp");
	var ymlp = new YMLP("MY_API_KEY", "MY_USER_NAME");
	
	ymlp.newsletter("Send", {
		"Subject": "This is my subject",
		"Text": "This is the plain/text part of my newsletter",
		"HTML": "<b>This is the HTML content</b>",
		"DeliveryTime": "2015-09-09 03:59:59 pm",
		"FromId": "1", // See Newsletter > GetFroms
		"GroupId": "1"
	}, function(err, response) {
		if(err) throw err;
		// - Do what you need
		// - response will equal "Message queued for delivery" if all went well.
	});
	
### Changelog

#### Version 1.0.0 (2015-07-31)

* Initial version

### Todo

* Improve documentation
* Parse the "raw" responses to return prettier ones (e.g. return `true` instead of `john@dummy.com has been added`)

### Contribute

I created this plugin to match my requirements for a personal project :-). If it does not perfectly correspond to what you need, feel free to fork it, adapt it and why not send me a pull request so I can merge your changes with the "main" project.