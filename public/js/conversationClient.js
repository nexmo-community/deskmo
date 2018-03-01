/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 43);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1:
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ 43:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(44);


/***/ }),

/***/ 44:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var require;var require;var __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return require(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * Conversation SDK
 *  Application Object Model
 *
 * Copyright (c) Nexmo Inc. 2015
 */

var WildEmitter = require('wildemitter');
var logger = require('loglevel');

var User = require('./user').User;
var Conversation = require('./conversation').Conversation;
var Event = require('./events/event').Event;
var Call = require('./modules/call').Call;
var utils = require('./utils');

// Conversation Client Error
var ConversationClientError = require('./conversationClientError');

var NexmoApiError = ConversationClientError.NexmoApiError;
var NexmoClientError = ConversationClientError.NexmoClientError;

/**
 * Core application class for the SDK.
 * Application is the parent object holding the list of conversations, the session object.
 * Provides methods to create conversations and retrieve a list of the user's conversations, while it holds the listeners for 
 * user's invitations 
 * @class
 * @param {ConversationClient} SDK session Object
 * @param {object} params
 * @example <caption>Accessing the list of conversations</caption>
 *   rtc.login(token).then(function(application) {
      console.log(application.conversations);
      console.log(application.me.name, application.me.id);
  });
  * @fires Application#member:invited
  * @fires Application#member:joined
  * @fires Application#member:call
  */
var Application = function(session, params) {
	this.log = logger.getLogger("Application");
	this.session = session;
	this.conversations = {};
	this.synced_conversations_count = 0;
	this.start_sync_time = 0;
	this.stop_sync_time = 0;

	this.me = null;
	// Map the params
	for (var key in params) {
		this[key] = params[key];
	}
};

WildEmitter.mixin(Application);

/**
 * Application listening for invites.
 *
 * @event Application#member:invited
 * 
 * @property {Member} member - The invited member
 * @property {Event} event - The invitation event
 * 
 * @example <caption>listen for your invites</caption>
 * application.on("member:invited",
 *   function(member, event) {
 *      console.log("Invited to the conversation: " + event.conversation.display_name || event.conversation.name);  
 * 
 * //identify the sender.
 * console.log("Invited by: " + member.invited_by);
 * 
 * //accept an invitation.
 *  application.conversations[event.conversation.id].join();
 * 
 * //decline the invitation.
 application.conversations[event.conversation.id].leave(); 
 */
/**
 * Application listening for joins.
 *
 * @event Application#member:joined
 * 
 * @property {Member} member - the member that joined the conversation
 * @property {Event} event -  the join event
 * 
 * @example <caption>listen join events in Application level</caption>
 *  application.on("member:joined",
 *      function(member, event) {
 *              console.log("JOINED", "Joined conversation: " + event.conversation.display_name || event.conversation.name);
 *              });
 *      });
 */
/**
 * Application listening for calls.
 *
 * @event Application#member:call
 * 
 * @property {Member} member - the member that initiated the call
 * @property {Call} call -  resolves the call object
 * 
 * @example <caption>listen for calls in Application level</caption>
 *  application.on("member:call",
 *      function(member, call) {
 *              console.log("Call ", call;
 *              });
 *      });
 */

/*
* Entry point for events in Application level 
**/
Application.prototype._handleEvent = function(event) {
	var self = this;
	var cid = event.cid;
	if (cid in self.conversations) {
		self.conversations[cid]._handleEvent(event);
	} else {
		//get the conversation you don't know about (case: joined by another user)
		self.getConversation(cid).then(function(conversation) {
			self.conversations[cid] = conversation;
			self._handleApplicationEvent(event);
		});
	}
};

/*
* Update the event to map local generated events
* in case we need a more specific event to pass in the application listener
* or f/w the event as it comes 
**/
Application.prototype._handleApplicationEvent = function(event) {
	var self = this;
	var conversation = self.conversations[event.cid];
	var mutated_event = JSON.parse(JSON.stringify(event));
	var payload;
	switch (event.type) {
		case 'member:invited':
			if (conversation.me && (conversation.me.user.name === event.body.invited_by)) return;
			// identify only call type conversations to create member:call type of event. 
			// other media invites should continue as member:invited
			if (conversation.display_name && conversation.display_name.startsWith('CALL_') &&
				(mutated_event.body.user.media && mutated_event.body.user.media.audio)) {
				var caller = 'unknown';
				if (mutated_event && mutated_event.body.invited_by) {
					caller = utils.getMemberFromNameOrNull(conversation, mutated_event.body.invited_by) || 'unknown';
				} else {
					caller = conversation.me;
				}
				payload = new Call(self, conversation, caller);
				mutated_event.type = 'member:call';
			} else {
				payload = new Event(conversation, mutated_event);
			}
			break;
		default:
			payload = new Event(conversation, mutated_event);
			break;
	}
	self.emit(mutated_event.type, conversation.members[mutated_event.from], payload);
}
/**
 * Creates a call to specified user/s.
 * @classdesc creates a call between the defined users
 * @param {string[]} usernames - the user names for those we want to call
 * @returns {Call} a Call object with all the call properties
 */
Application.prototype.call = function(usernames) {
	var self = this;
	return new Promise(function(resolve, reject) {
		if (!usernames || !Array.isArray(usernames) || usernames.length === 0) {
			return reject(new NexmoClientError("error:application:call:params"));
		}
		var call = new Call(self);
		return call.createCall(usernames)
			.then(function() {
				return resolve(call);
			});
	});
}

/**
 * Query the service to create a new conversation
 * The conversation name must be unique per application.
 * @param {object} [params] - leave empty to get a GUID as name
 * @param {string} params.name - the name of the conversation. A UID will be assigned if this is skipped
 * @param {string} params.display_name - the display_name of the conversation.
 * @returns {Promise<Conversation>} - the created Conversation
 * @example <caption>Create a conversation and join</caption>
 * application.newConversation().then(
 *     function(conversation) {
 * 
 *         //join the created conversation
 *         conversation.join().then(
 *             //Get the user's member belonging in this conversation.
 *             //You can also access it via conversation.me
 *             function(member) {
 *                 console.log("Joined as " + member.user.name);
 *             });
 * 
 *     }).catch(function(error) {
 *     console.log(error);
 * });
 */
Application.prototype.newConversation = function(params) {
	var self = this;
	var p = new Promise(function(resolve, reject) {
		self.session.sendRequest({
			type: 'new:conversation',
			body: params
		}, function(response) {
			if (response.type === 'new:conversation:success') {
				var conv = new Conversation(self, response.body);
				self.conversations[conv.id] = conv;
				// do a get conversation to get the whole model as shaped in the service, 
				self.getConversation(conv.id).then(function(conversation) {
					resolve(conversation);
				});
			} else {
				reject(new NexmoApiError(response));
			}
		});
	});
	return p;
};

/**
 * Query the service to create a new conversation and join it
 * The conversation name must be unique per application.
 * @param {object} [params] - leave empty to get a GUID as name
 * @param {string} params.name - the name of the conversation. A UID will be assigned if this is skipped
 * @param {string} params.display_name - the display_name of the conversation.
 * @returns {Promise<Conversation>} - the created Conversation
 * @example <caption>Create a conversation and join</caption>
 * application.newConversationAndJoin().then(
 *     function(conversation) {
 * 
 *         //join the created conversation
 *         conversation.join().then(
 *             //Get the user's member belonging in this conversation.
 *             //You can also access it via conversation.me
 *             function(member) {
 *                 console.log("Joined as " + member.user.name);
 *             });
 * 
 *     }).catch(function(error) {
 *     console.log(error);
 * });
 */
Application.prototype.newConversationAndJoin = function(params) {
	var self = this;
	return self.newConversation(params).then(function(conversation) {
		return conversation.join().then(function() {
			return conversation;
		});
	});

};

/**
 * Query the service to see if this conversation exists with the
 * logged in user as a member and retrieve the data object
 * Result added (or updated) in this.conversations
 * 
 * @param {string} id - the id of the conversation to fetch  
 * @returns {Promise<Conversation>} - the requested conversation 
 */
Application.prototype.getConversation = function(id) {
	var self = this;
	var p = new Promise(function(resolve, reject) {
		self.session.sendRequest({
			type: 'conversation:get',
			cid: id,
			body: {}
		}, function(response) {
			if (response.type === 'conversation:get:success') {
				var updateOrCreateConversation = function() {
					if (self.conversations[response.body.id]) {
						self.conversations[response.body.id].updateObjectInstance(self, response.body);
						return self.conversations[response.body.id];
					}
					return new Conversation(self, response.body);
				};
				//check if the response is from cache already formed as Conversation object, reuse it
				var conv = (response.body instanceof Conversation) ?
					response.body : updateOrCreateConversation();


				self.conversations[conv.id] = conv;
				// Populate the events
				conv.getEvents().then(function(events) {
					// Complete
					conv.events = events;
					resolve(conv);
					//update cached conversation to maintain proper event objects
					//TODO move this in cache module
					if (self.session.cache)
						self.session.cache.update_conversation(conv);
				});
			} else {
				reject(new NexmoApiError(response));
			}
		});
	});
	return p;
};

/**
 * Query the service to obtain a complete list of conversations of which the
 * logged-in user is a member with a state of `JOINED` or `INVITED`. 
 * 
 * @returns {Promise<Object<Conversation>>} - Populate Application.conversations.
 */
Application.prototype.getConversations = function(params) {
	var self = this;
	var p = new Promise(function(resolve, reject) {
		self.session.sendRequest({
			type: 'user:conversations',
			body: params
		}, function(response) {
			if (response.type === 'user:conversations:success') {
				// Iterate and create the conversations if not existent
				// (note that cache WebWorker also populates conv list)
				// These are just templates without the full member information
				// conversations:
				response.body.map(function(c) {
					var conv = new Conversation(self, c);
					if (self.conversations[conv.id] === undefined) {
						self.conversations[conv.id] = conv;
					}
				});
				self.syncConversations(response.body);
				resolve(self.conversations);
			} else {
				reject(new NexmoApiError(response));
			}
		});
	});
	return p;
};

/**
 * Application listening sync status.
 *
 * @event Application#sync:progress
 * 
 * @property {number} status.sync_progress - Percentage of fetched conversations
 * @property {number} status.idb_progress - Percentage of conversations stored in indexedDB
 * @example <caption>listening for changes in the synchronisation progress</caption>
 *  application.on("sync:progress",
 *      function(status) {
 *			console.log(data.sync_progress);
 *          console.log(data.idb_progress);
 *       });
 *  });
 */
Application.prototype.syncConversations = function(conversations) {
	var self = this;
	var conversations_length = conversations.length;

	var d = new Date();
	self.start_sync_time = (window && window.performance) ? window.performance.now() : d.getTime();

	var fetchConversationForStorage = function() {
		self.synced_conversations_percentage = ((self.synced_conversations_count / conversations_length) * 100).toFixed(2);

		var status_payload = {
			sync_progress: self.synced_conversations_percentage
		};
		if (self.session.cache) {
			self.idb_conversations_percentage = ((self.session.cache.conversations_idb_count / conversations_length) * 100).toFixed(2);
			status_payload.idb_progress = self.idb_conversations_percentage
		}
		self.emit('sync:progress', status_payload);

		self.log.debug('Loading sync progress: ' + self.synced_conversations_count + '/' +
			conversations_length + ' - ' + self.synced_conversations_percentage + '%');
		self.log.debug('Loading idb progress: ' + self.session.cache.conversations_idb_count + '/' +
			conversations_length + ' - ' + self.idb_conversations_percentage + '%');

		if (self.synced_conversations_percentage >= 100) {
			var d = new Date();
			self.stop_sync_time = (window && window.performance) ? window.performance.now() : d.getTime();
			self.log.info('Loaded conversations in ' + (self.stop_sync_time - self.start_sync_time) + 'ms');
		}

		if (self.synced_conversations_count < conversations_length) {
			self.getConversation(conversations[self.synced_conversations_count].id).then(function() {
				fetchConversationForStorage();
			});
			self.synced_conversations_count++;
			self.sync_progress_buffer++;
		}
	};
	fetchConversationForStorage();

}

/**
 * Get Details of a user
 * @param {string} [id] - the id of the user to fetch, if skipped, it returns your own user details
 * @returns {Promise<User>} 
 */
Application.prototype.getUser = function(user_id) {
	user_id = user_id || this.me.id;
	var self = this;
	var p = new Promise(function(resolve, reject) {
		var params = {
			user_id: user_id
		};
		self.session.sendRequest({
			type: 'user:get',
			from: self.me.id,
			body: params
		}, function(response) {
			if (response.type === 'user:get:success') {
				resolve(new User(self, response.body));
			} else {
				reject(new NexmoApiError(response));
			}
		});
	});
	return p;
};


module.exports = {
	Application: Application
};
},{"./conversation":2,"./conversationClientError":3,"./events/event":5,"./modules/call":12,"./user":19,"./utils":20,"loglevel":50,"wildemitter":84}],2:[function(require,module,exports){
/*
 * Conversation SDK
 *  Conversation Object Model
 *
 * Copyright (c) Nexmo Inc. 2017
 */

var WildEmitter = require('wildemitter'),
	Member = require('./member').Member,
	Event = require('./events/event').Event,
	TextEvent = require('./events/text_event').TextEvent,
	ImageEvent = require('./events/image_event');

// var Audio = require('./modules/audio').Audio;
var Media = require('./modules/media').Media;

// Conversation Client Error
var ConversationClientError = require('./conversationClientError');

var NexmoApiError = ConversationClientError.NexmoApiError;
var NexmoClientError = ConversationClientError.NexmoClientError;

/**
 * A single conversation Object.
 * @class Conversation 
 * @property {Member} me - my Member object that belongs to this conversation
 * @property {Application} application - the parent Application
 * @property {string} name - the name of the Conversation (unique)
 * @property {string} [display_name] - the display_name of the Conversation
 * @property {object} [members] - the members of the Conversation
 * @property {object} [events] - the members of the Conversation
 * @property {number} [sequence_number] - the last event id
 */
var Conversation = function(application, params) {
	this.application = application;
	this.id = null;
	this.name = null;
	this.display_name = null;
	this.timestamp = null;
	this.members = {};
	this.events = {};
	this.sequence_number = 0;
	// this.audio = new Audio(this);
	this.media = new Media(this);
	/**
	 * A Member Object representing the current user.
	 * Only set if the user is or has been a member of the Conversation,
	 * otherwise the value will be `null`.
	 * @type Member
	 */
	this.me = null; // We are not in the conversation ourselves by default 
	// Map the params (which includes the id)
	this.updateObjectInstance(application, params);
};

WildEmitter.mixin(Conversation);

Conversation.prototype.updateObjectInstance = function(application, params) {
	var self = this;
	for (var key in params) {
		switch (key) {
			case 'id':
				this.id = params.id;
				break;
			case 'name':
				this.name = params.name;
				break;
			case 'display_name':
				this.display_name = params.display_name;
				break;
			case 'members':
				//update the conversation javascript object

				//CASE1 conversations:get:success, 
				//PATCH this responds with member[0].user_id and name

				// Iterate the list
				params.members.map(function(m) {
					var member = null;
					member = new Member(self, m);
					if (m.user_id === self.application.me.id) {
						self.me = member;
					}
					self.members[member.id] = member;
				});
				break;
			case 'timestamp':
				this.timestamp = params.timestamp;
				break;
			case 'sequence_number':
				this.sequence_number = params.sequence_number;
				break;
			case 'member_id':
				// filter needed params to create the object
				// the conversation list gives us the member_id to prepare themember/self object
				var object_params = {
					id: params.member_id,
					state: params.state,
					user: self.application.me
				};
				var member = new Member(self, object_params);
				self.me = member;
				self.members[member.id] = member;
				break;
		}
	}
};

/**
 * Join the given user to this conversation, will typically use this to join
 * ourselves to a conversation we create.
 * Accept an invitation if our member has state INVITED and no user_id / user_name is given
 * 
 * @param {object} [params = self.application.me.id] The user to join (defaults to self)
 * @param {string} params.user_name the user_name of the user to join
 * @param {string} params.user_id the user_id of the user to join
 * @return {Promise<Member>}
 * 
 * @example <caption>join a user to a conversation</caption>
 * 
 * 		conversation.join()
 * 			.then(function(member) {
 * 				console.log("joined as member: ", member)
 * 		})
 */
Conversation.prototype.join = function(params) {
	var self = this;
	var request_body = {};
	if (!params && self.me && self.me.id && self.me.state === 'INVITED')
		request_body.member_id = self.me.id;

	// default to self if there is no username or id
	if (params && params.user_id)
		request_body.user_id = params.user_id;
	if (params && params.user_name)
		request_body.user_name = params.user_name;

	if (!params) {
		request_body.user_name = self.application.me.name;
		request_body.user_id = self.application.me.id;
	}

	var p = new Promise(function(resolve, reject) {
		self.application.session.sendRequest({
			type: 'conversation:join',
			cid: self.id,
			body: request_body
		}, function(response) {
			if (response.type === 'conversation:join:success') {
				// Create a new member object, response.body will contain all the parameters from the service
				var is_self = (response.body.user_id === self.application.me.id);
				var member = new Member(self, response.body);
				if (is_self) {
					self.me = member;
				}
				self.members[member.id] = member;
				self.application.getConversation(self.id).then(function(conversation) {
					resolve(conversation.members[member.id]);
				});
			} else {
				reject(new NexmoApiError(response));
			}
		});
	});
	return p;
};

/**
 * Delete a conversation
 * 
 * @return {Promise}
 * 
 * @example <caption>delete the conversation</caption>
 * 
 * 		conversation.del()
 * 			.then(function() {
 * 				console.log("conversation deleted");
 * 		})
 */
Conversation.prototype.del = function() {
	var self = this;
	var p = new Promise(function(resolve, reject) {
		self.application.session.sendRequest({
			type: 'conversation:delete',
			cid: self.id
		}, function(response) {
			if (response.type === 'conversation:delete:success') {
				delete self.application.conversations[self.id];
				resolve();
			} else {
				reject(new NexmoApiError(response));
			}
		});
	});
	return p;
};

/**
 * Delete an Event (e.g. Text)
 * @param {Event} event
 * @returns {Promise}
 * 
 */
Conversation.prototype.deleteEvent = function(event) {
	return event.deleteEvent(event.id);
};

/**
 * Invite the given user (id or name) to this conversation
 * @param {Member} params
 * @param {string} [params.id or username] - the id or the username of the user to invite
 * 
 * @returns {Promise<Member>}
 * 
 * @example <caption>invite a user to a conversation</caption>
 *  var user_id = 'user to invite';
 *  var user_name = 'username to invite';
 *
 *  conversation.invite({
 *          id: user_id,
 *          user_name: user_name
 *      })
 * 		.then(function(member) {
 *            displayMessage(member.state + " user: " + user_id + " " + user_name);
 *       }).catch(function(error) {
 *          console.log(error);
 *  });
 * 
 */
Conversation.prototype.invite = function(params) {
	if (!params || (!params.id && !params.user_name)) return Promise.reject(new NexmoClientError('error:invite:missing:params'));
	var self = this;
	var p = new Promise(function(resolve, reject) {
		self.application.session.sendRequest({
			type: 'conversation:invite',
			cid: self.id,
			body: {
				user_id: params.id,
				user_name: params.user_name,
				media: params.media
			}
		}, function(response) {
			if (response.type === 'conversation:invite:success') {
				// Create a new member object, response.body will contain all the parameters from the service
				var member = new Member(self, response.body);
				self.members[member.id] = member;
				resolve(member);
			} else {
				reject(new NexmoApiError(response));
			}
		});
	});
	return p;
};

/**
 * Invite the given user (id or name) to this conversation with media audio
 * @param {Member} params
 * @param {string} [params.id or username] - the id or the username of the user to invite
 * 
 * @returns {Promise<Member>}
 * 
 * @example <caption>invite a user to a conversation</caption>
 *  var user_id = 'user to invite';
 *  var user_name = 'username to invite';
 *
 *  conversation.inviteWithAudio({
 *          id: user_id,
 *          user_name: user_name
 *      })
 * 		.then(function(member) {
 *            displayMessage(member.state + " user: " + user_id + " " + user_name);
 *       }).catch(function(error) {
 *          console.log(error);
 *  });
 * 
 */
Conversation.prototype.inviteWithAudio = function(params) {
	if (!params || (!params.id && !params.user_name)) return Promise.reject(new NexmoClientError('error:invite:missing:params'));
	params.media = {
		audio: {
			muted: false,
			earmuffed: false
		}
	};

	return this.invite(params);
};

/**
 * Leave from the conversation
 * @returns {Promise}
 */
Conversation.prototype.leave = function() {
	var self = this;
	var p = new Promise(function(resolve, reject) {
		self.application.session.sendRequest({
			type: 'conversation:member:delete',
			cid: self.id,
			from: self.me.id,
			body: {
				'member_id': self.me.id
			}
		}, function(response) {
			if (response.type === 'conversation:member:delete:success') {
				resolve(response.body);
			} else {
				reject(new NexmoApiError(response));
			}
		});
	});
	return p;
};

/**
 * Send a text message to the conversation, which will be relayed to every other member of the conversation
 * @param {string} - text the text message to be sent
 * 
 * @returns {Promise<TextEvent>} - the text message that was sent 
 * 
 * @example <caption> sending a text </caption>
 *	conversation.sendText("Hi Nexmo").then(function(){
 *			console.log('message was sent');
 *		}).catch(function(error){
 *			console.log('error sending the message', error);
 *	});
 * 
 */
Conversation.prototype.sendText = function(text) {
	var self = this;
	var p = new Promise(function(resolve, reject) {
		if (self.me === null) {
			reject(new NexmoClientError('error:self'));
		} else {
			var msg = {
				type: 'text',
				cid: self.id,
				from: self.me.id,
				body: {
					text: text
				}
			};
			self.application.session.sendRequest(msg, function(response) {
				if (response.type === 'text:success') {
					msg.id = response.body.id;
					msg.body.timestamp = response.body.timestamp;
					var text_event = new TextEvent(self, msg);
					resolve(text_event);
				} else {
					reject(new NexmoApiError(response));
				}
			});
		}
	});

	return p;

};

/**
 * Send an Image message to the conversation, which will be relayed to every other member of the conversation.
 * implements xhr (https://xhr.spec.whatwg.org/) - this.imageRequest
 * 
 * @param {File} file single input file (jpeg/jpg)
 * @param {string} [params.quality_ratio = 100] a value between 0 and 100. 0 indicates 'maximum compression' and the lowest quality, 100 will result in the highest quality image
 * @param {string} [params.medium_size_ratio = 50] a value between 1 and 100. 1 indicates the new image is 1% of original, 100 - same size as original
 * @param {string} [params.thumbnail_size_ratio = 10] a value between 1 and 100. 1 indicates the new image is 1% of original, 100 - same size as original
 * 
 * @returns {Promise<XMLHttpRequest>}
 * 
 * @example <caption>sending an image</caption>
 * conversation.sendImage(fileInput.files[0]).then(function(imageRequest){ 
 *    
 *         imageRequest.onabort = function(e) {
 *            console.log(e);
 *          console.log("Image:" + e.type);
 *      };
 *          imageRequest.onloadend = function(e) {
 *          console.log("Image:" + e.type);
 *      };
 * });
 */

Conversation.prototype.sendImage = function(fileInput, params) {
	params = params || {
		quality_ratio: 100,
		medium_size_ratio: 50,
		thumbnail_size_ratio: 30
	};
	var self = this;
	var p = new Promise(function(resolve, reject) {
		if (!localStorage.getItem("NXMO_user_data")) {
			reject(new NexmoClientError("error:user:relogin"));
		} else {
			if (self.me === null) {
				reject(new NexmoClientError("error:self"));
			} else {
				var imageRequest = new XMLHttpRequest();
				var token = JSON.parse(localStorage.getItem("NXMO_user_data")).token;
				var IPS_url = self.application.session.config.ips_url;
				var formData = new FormData();
				formData.append("file", fileInput);
				formData.append("quality_ratio", params.quality_ratio);
				formData.append("medium_size_ratio", params.medium_size_ratio);
				formData.append("thumbnail_size_ratio", params.thumbnail_size_ratio);
				imageRequest.open("POST", IPS_url);
				imageRequest.setRequestHeader("Authorization", "Bearer " + token);
				imageRequest.onloadstart = function() {
					resolve(this);
				};
				imageRequest.upload.addEventListener("progress", function(evt) {
					if (evt.lengthComputable) {
						// console.log("uploading image " + evt.loaded + "/" + evt.total);
					}
				}, false);
				imageRequest.onreadystatechange = function() {
					if (imageRequest.readyState === 4 && imageRequest.status === 200) {
						var msg = {
							type: 'image',
							cid: self.id,
							from: self.me.id,
							body: {
								representations: JSON.parse(imageRequest.responseText)
							}
						};
						self.application.session.sendRequest(msg, function(response) {
							if (response.type !== 'image:success') {
								reject(new NexmoApiError(response));
							}
						});
					} else {
						reject(new NexmoApiError(imageRequest));
					}
				};
				imageRequest.send(formData);
			}
		}
	});
	return p;
};

/**
 * Cancel sending an Image message to the conversation.
 * 
 * @param {XMLHttpRequest} imageRequest 
 * 
 * @returns void
 * 
 * @example <caption>cancel sending an image</caption>
 * conversation.sendImage(fileInput.files[0]).then(function(imageRequest){ 
 *    conversation.abortSendImage(imageRequest);
 * });
 */
Conversation.prototype.abortSendImage = function(imageRequest) {
	if (imageRequest) {
		imageRequest.abort();
	}
};

/**
 * Send start typing indication
 *
 * @returns {Promise} - resolves the promise on successful sent
 */
Conversation.prototype.startTyping = function() {
	var self = this;
	return typing.call(self, 'on');
};

/**
 * Send stop typing indication
 *
 * @returns {Promise} - resolves the promise on successful sent
 */
Conversation.prototype.stopTyping = function() {
	var self = this;
	return typing.call(self, 'off');
};

var typing = function(state) {
	var self = this;
	var p = new Promise(function(resolve, reject) {
		var params = {
			activity: (state === 'on') ? 1 : 0
		};
		self.application.session.sendRequest({
			type: 'text:typing:' + state,
			cid: self.id,
			from: self.me.id,
			body: params
		}, function(response) {
			if (response.type === 'text:typing:' + state + ':success') {
				resolve(response.type);
			} else {
				reject(new NexmoApiError(response));
			}
		});
	});
	return p;
};
/**
 * Query the service to get a list of events in this conversation.
 *
 * @param {object} [params] - leave empty to get all the events
 * @param {string} params.start_id - the id of the event to begin the batch 
 * @param {string} params.end_id - the id of the event to finish the batch
 * 
 * @returns {Promise<Array<Event>>} - A promise to the Events list 
 */
Conversation.prototype.getEvents = function(params) {
	var self = this;
	var p = new Promise(function(resolve, reject) {
		self.application.session.sendRequest({
			type: 'conversation:events',
			cid: self.id,
			body: params
		}, function(response) {

			if (response.type === 'conversation:events:success') {
				//events from cache are constructed with the proper object.
				//those from storage need to be processed (string conversion)

				if (!response.fromCache) {
					// Iterate and create the events
					response.body.map(function(m) {
						var message;
						switch (m.type) {
							case 'text':
								message = new TextEvent(self, m);
								self.events[message.id] = message;
								break;
							case 'image':
								message = new ImageEvent(self, m);
								self.events[message.id] = message;
								break;
							case 'member:joined':
							case 'member:left':
							case 'member:invited':
							case 'member:media':
							case 'audio:dtmf':
							case 'audio:record':
							case 'audio:record:done':
							case 'audio:ringing:stop':
							case 'audio:ringing:start':
								message = new Event(self, m);
								self.events[message.id] = message;
								break;
						}
					});
				}
				resolve(self.events);
			} else {
				reject(new NexmoApiError(response));
			}
		});
	});
	return p;
};


/*
 * Handle and event from the cloud.
 * @param {event} event
 */
Conversation.prototype._handleEvent = function(event) {
	var self = this;
	var message;
	var delivered_id;
	var seen_id;

	//TODO Check local/remote sequence number matching
	// rtc:* events are not part of the history, and are session specific. forward them skipping the flow
	if (event.type.split(":")[0] === "rtc") {
		self.emit(event.type, event);
		return;
	}
	self.sequence_number++;

	// default from to the id of the incoming event until we get more info for this member
	// or replace the id with the member object
	if (!self.members[event.from]) {
		self.members[event.from] = new Member(self, event);
	}

	var from = self.members[event.from];

	switch (event.type) {
		case 'audio:dtmf':
		case 'audio:record':
		case 'audio:record:done':
		case 'audio:ringing:stop':
		case 'audio:ringing:start':
			message = new Event(self, event);
			self.events[message.id] = message;
			self.emit(event.type, from, message);
			break;
		case 'image':
			message = new ImageEvent(self, event);
			self.events[message.id] = message;
			self.emit(event.type, from, message);
			// Automatically send a delivery
			// avoid sending delivered to our own messages
			if (self.me.id !== message.from) {
				message.delivered().catch(function(error) {
					self.application.session.log.debug(error);
				});
			}
			break;
		case 'text':
			message = new TextEvent(self, event);
			self.events[message.id] = message;
			self.emit(event.type, from, message);
			// Automatically send a delivery
			// avoid sending delivered to our own messages
			if (self.me.id !== message.from) {
				message.delivered().catch(function(error) {
					self.application.session.log.debug(error);
				});
			}
			break;
		case 'image:seen':
			message = new ImageEvent(self, event);
		case 'text:seen':
			message = (message) ? message : new TextEvent(self, event);
			seen_id = event.body.event_id;
			if (seen_id in self.events) {
				self.events[seen_id].state = self.events[seen_id].state || {};
				self.events[seen_id].state.seen_by = self.events[seen_id].state.seen_by || {};
				self.events[seen_id].state.seen_by[event.from] = event.timestamp;
				message = self.events[seen_id];
				self.emit(event.type, from, message);

			}
			break;
		case 'image:delivered':
			message = new ImageEvent(self, event);
		case 'text:delivered':
			message = (message) ? message : new TextEvent(self, event);
			delivered_id = event.body.event_id;
			if (delivered_id in self.events) {
				self.events[delivered_id].state = self.events[delivered_id].state || {};
				self.events[delivered_id].state.delivered_to = self.events[delivered_id].state.delivered_to || {};
				self.events[delivered_id].state.delivered_to[event.from] = event.timestamp;
				message = self.events[delivered_id];
				self.emit(event.type, from, message);
			}
			break;
		case 'event:delete':
			//handle both text events or image
			if (self.events[event.body.event_id].body.text) self.events[event.body.event_id].body.text = "";
			if (self.events[event.body.event_id].body.representations) self.events[event.body.event_id].body.representations = "";

			self.events[event.body.event_id].body.timestamp = {
				deleted: event.timestamp
			};
			message = self.events[event.body.event_id];
			self.emit(event.type, from, message);
			break;
		case 'member:joined':
		case 'member:invited':
		case 'member:left':
			//use the member object to handle the state
			from._handleEvent(event);
			// self.emit(event.type, from, event.body);
			message = new Event(self, event);
			self.events[event.id] = message;
			self.emit(event.type, from, message);
			if (self.application.session.cache && self.application.session.cache.conversation_data[self.id]) {
				self.application.session.cache.setConversationDirty(self.id, true); //temp fix for fixing member status on reload			
			}
			break;
		case 'member:media':
			//TODO refactor the other events to follow this pattern
			// event contructing the assigned class here, then get handled within the object that it belongs to
			// then routed back here if needed to emit in conversation
			message = new Event(self, event);
			self.members[event.from]._handleEvent(event);
			self.events[message.id] = message;
			//this should emit the message event
			self.emit(event.type, from, message);
			break;
		default:
			//mark the conversation as dirty since other than the text/image events occured so we need to invalidate the cache for now
			//no need to mark as dirty for typing indicators or seen events
			//TODO move this in cache module
			if (self.application.session.cache && self.application.session.cache.conversation_data[self.id] && [
				"text:typing:on",
				"text:typing:off"
			].indexOf(event.type) === -1) {
				self.application.session.cache.setConversationDirty(self.id, true);
			}
			if (event.cid === self.id) {
				// this should emit the event object
				self.emit(event.type, from, new Event(self, event));
			}
			break;
	}
	//now update cached item, if the conversation is marked as dirty, don't bother as it will be refreshed anyway
	//TODO move this login in the cahce module
	if (self.application.session.cache && !self.application.session.cache.getConversationDirtyStatus(self.id) && message) {
		self.application.session.cache.addConversationEvent(self.id, message, self.sequence_number, event);
	}
};

module.exports = {
	Conversation: Conversation
};
},{"./conversationClientError":3,"./events/event":5,"./events/image_event":6,"./events/text_event":8,"./member":10,"./modules/media":13,"wildemitter":84}],3:[function(require,module,exports){
/**  
 * Conversation SDK
 *  Conversation Client - API Error wrapper
 * 
 * Copyright (c) Nexmo Inc. 2017
 */

var NexmoClientErrorTypes = require('./conversationClientErrorTypes');

function decorateError(instance, error) {

	Object.assign(instance, error);
	instance.message = 'type: ' + instance.type + ', description: ' + (instance.description ? instance.description : '');
	instance.stack = new Error().stack;
}

/**
 * Error constructor of an NexmoClient-error
 * @param {string} errorInput String client error
 */
var NexmoClientError = function(errorInput) {
	var error = NexmoClientErrorTypes[errorInput];
	// for other errors (libs/browser APIs) re-use the Client error 
	// to forward it but don't throw it away
	if (error) {
		// if error type exists in our list keep consistency
		decorateError(this, error);
	} else {
		//if the structure is not as expected, f/w as much as we can get
		this.message = (errorInput && errorInput.message) ? errorInput.message : errorInput;
		this.stack = (errorInput && errorInput.stack) ? errorInput.stack : new Error().stack;
	}

	// make sure the error.name matches the class name
	this.name = 'NexmoClientError';
}

NexmoClientError.prototype = Object.create(NexmoClientError.prototype);
NexmoClientError.prototype.constructor = NexmoClientError;


/**
 * Error constructor of an API-error
 * @param {object} error API error, always containing {type: <string>}
 */
var NexmoApiError = function(error) {

	decorateError(this, error);
	// make sure the error.name matches the class name
	this.name = 'NexmoApiError';
}

NexmoApiError.prototype = Object.create(NexmoApiError.prototype);
NexmoApiError.prototype.constructor = NexmoApiError;


module.exports = {
	NexmoClientError: NexmoClientError,
	NexmoApiError: NexmoApiError
}
},{"./conversationClientErrorTypes":4}],4:[function(require,module,exports){
/**  
 * Conversation SDK
 *  Conversation Client Error Types
 * 
 * Copyright (c) Nexmo Inc. 2017
 */

var ConversationClientErrorTypes = {
	"error:application:call:params": {
		type: "error:application:call:params",
		description: "not a valid String[] of usernames param"
	},
	"error:call:reject": {
		type: "error:call:reject",
		description: "failed to reject the call"
	},
	"error:getUserMedia:permissions": {
		type: "error:getUserMedia:permissions",
		description: "missing getUserMedia permissions"
	},
	"error:media:params": {
		type: "error:media:params",
		description: "currently supported params media type= {audio:{muted:false, earmuffed:false}}"
	},
	"error:self": {
		type: "error:self",
		description: "Conversation Object is missing self (me)"
	},
	"error:user:relogin": {
		type: "error:user:relogin",
		description: "please relogin"
	},
	"error:seen:own-message": {
		type: "error:seen:own-message",
		description: "attempt to send seen for own message"
	},
	"error:already-seen": {
		type: "error:already-seen",
		description: "already marked as seen"
	},
	"error:delivered:own-message": {
		type: "error:delivered:own-message",
		description: "attempt to send delivered for own message"
	},
	"error:already-delivered": {
		type: "error:already-delivered",
		description: "already marked as delivered"
	},
	"error:fetch-image": {
		type: "error:fetch-image",
		description: "xhr.status received other than 200"
	},
	"error:missing:params": {
		type: "error:missing:params",
		description: "missing parameters"
	},
	"error:invite:missing:params": {
		type: "error:missing:params",
		description: "This invite cannot be sent to empty username and user_id"
	},
	"error:audio:already-connecting": {
		type: "error:audio:already-connecting",
		description: "Audio call already in progress"
	},
	"error:audio:not-enabled": {
		type: "error:audio:not-enabled",
		description: "Audio is not enabled"
	},
	"error:media:already-connecting": {
		type: "error:media:already-connecting",
		description: "Media is already in progress"
	},
	"error:media:not-enabled": {
		type: "error:media:not-enabled",
		description: "Media is not enabled"
	},
	"error:media:unsupported-browser": {
		type: "error:media:unsupported-browser",
		description: "This action is not supported on this browser"
	},
	"error:media:extension": {
		type: "error:media:extension",
		description: "Chrome extension should be installed"
	}
};

module.exports = ConversationClientErrorTypes;
},{}],5:[function(require,module,exports){
/*
 * Conversation SDK
 *  Event Object Model
 *
 * Copyright (c) Nexmo Inc. 2017
 */

var WildEmitter = require('wildemitter');
var ConversationClientError = require('../conversationClientError');

var NexmoApiError = ConversationClientError.NexmoApiError;
var NexmoClientError = ConversationClientError.NexmoClientError;

/**
 * Conversation Event Object.
 * @class Event
 */
var Event = function(conversation, params) {
    this.conversation = conversation;

    //TODO: to move this to a constructor
    this._normalise = function(params) {
        //TODO: use 'deconstructing' Object;
        if (params) {
            for (var key in params) {
                switch (key) {
                    case "type":
                        this.type = params.type;
                        break;
                    case "cid":
                        this.cid = params.cid;
                        break;
                    case "from":
                        this.from = params.from;
                        break;
                    case "timestamp":
                        this.timestamp = params.timestamp;
                        break;
                    case "id":
                        this.id = params.id;
                        break;
                    case "body":
                        this.body = params.body;
                        if (this.body.user && this.body.user.user_id) {
                            this.body.user.id = this.body.user.user_id;
                            delete this.body.user.user_id;
                        }
                        break;
                }
            }
        }
    }
    this._normalise(params);
};

WildEmitter.mixin(Event);

/**
 * Delete the event
 * @param {number} [event_id=this.event_id] if the event id param is not present, "this" event will be default
 * @returns {Promise}
 */
Event.prototype.deleteEvent = function(event_id) {
    var self = this;
    var p = new Promise(function(resolve, reject) {
        self.conversation.application.session.sendRequest({
            type: 'event:delete',
            cid: self.conversation.id,
            from: self.conversation.me.id,
            body: {
                event_id: event_id || self.id
            }
        }, function(response) {
            if (response.type === 'event:delete:success') {
                resolve();
            } else {
                reject(new NexmoApiError(response));
            }
        });
    });
    return p;
};

/**
 * Mark as Delivered the event
 * @param {number} [event_id=this.event_id] if the event id is not provided, the self event will be used
 * @returns {Promise}
 */
Event.prototype.deliveredEvent = function(event_id) {
    if (this.type !== "text" && this.type !== "image") {
        this.type = "event";
    }
    var self = this;
    var p = new Promise(function(resolve, reject) {
        if (self.conversation.me.id === self.from) {
            reject(new NexmoClientError("error:delivered:own-message"));
        } else if (self.state && self.state.delivered_to && self.state.delivered_to[self.conversation.me.id]) {
            reject(new NexmoClientError("error:already-delivered"));
        } else {
            var params = {
                event_id: event_id || self.id
            };
            self.conversation.application.session.sendRequest({
                type: self.type + ':delivered',
                from: self.conversation.me.id,
                cid: self.conversation.id,
                body: params
            }, function(response) {
                if (response.type === self.type + ':delivered:success') {
                    resolve();
                } else {
                    reject(new NexmoApiError(response));
                }
            });
            resolve();
        }
    });
    return p;
};

/**
 * Mark as Seen the event
 * @param {number} [event_id=this.event_id] if the event id is not provided, the self event will be used
 * @returns {Promise}
 */
Event.prototype.seenEvent = function(event_id) {
    if (this.type !== "text" && this.type !== "image") {
        this.type = "event";
    }
    var self = this;
    var p = new Promise(function(resolve, reject) {
        if (self.conversation.me.id === self.from) {
            reject(new NexmoClientError("error:seen:own-message"));
        } else if (self.state && self.state.seen_by && self.state.seen_by[self.conversation.me.id]) {
            reject(new NexmoClientError("error:already-seen"));
        } else {
            var params = {
                event_id: event_id || self.id
            };
            self.conversation.application.session.sendRequest({
                type: self.type + ':seen',
                from: self.conversation.me.id,
                cid: self.conversation.id,
                body: params
            }, function(response) {
                if (response.type === self.type + ':seen:success') {
                    resolve();
                } else {
                    reject(new NexmoApiError(response));
                }
            });
        }
    });
    return p;
}

module.exports = {
    Event: Event
};
},{"../conversationClientError":3,"wildemitter":84}],6:[function(require,module,exports){
/*
 * Conversation SDK
 *  Image Event Object Model
 *
 * Copyright (c) Nexmo Inc. 2017
 */

var Event = require('./event').Event;

// Conversation Client Error
var ConversationClientError = require('../conversationClientError');

var NexmoApiError = ConversationClientError.NexmoApiError;
var NexmoClientError = ConversationClientError.NexmoClientError;

/**
 * An image message
 * 
 * @class ImageEvent
 */

module.exports = class ImageEvent extends Event {
    constructor(conversation, params) {
        super(conversation, params);
        this.conversation = conversation;
        this.state = {
            seen_by: {},
            delivered_to: {}
        };
        if (params && params.body) {
            if (params.body.timestamp)
                this.timestamp = params.body.timestamp;
        }
        // Map the params
        for (var key in params) {
            this[key] = params[key];
        }
    }


    /**
     * Set the message status to 'seen'
     */
    seen() {
        this.type = "image";
        return this.seenEvent();
    };


    /**
     * Set the message status to 'delivered'
     */
    delivered() {
        this.type = "image";
        return this.deliveredEvent();
    };

    /**
     * Delete the image event
     * @returns {Promise}
     */
    del() {
        // //          delete the image from media service
        // //          ?cmd=remove
        // //          &id=....
        // var representations = self.body.representations;
        // var imageDataObject = (representations instanceof Object) ? representations : JSON.parse(representations);
        // var url = imageDataObject[type].url + "?cmd=remove&id=" + imageDataObject.id;
        // var xhr = new XMLHttpRequest();
        // var token = JSON.parse(localStorage.getItem("NXMO_user_data")).token;
        // xhr.open("GET", url);
        // xhr.setRequestHeader("Authorization", "Bearer " + token);
        // xhr.responseType = 'arraybuffer';
        // xhr.onload = function() { //Call a function when the state changes.
        //     if (xhr.readyState === 4 && xhr.status === 200) {
        return this.deleteEvent();
    };
    /**
     * Download an Image from Media service //3 representations
     * @param {string} [type="thumbnail"] original, medium, thumbnail, 
     * @param {string} [representations=this.body.representations]  the ImageEvent.body for the image to download
     * @returns {string} "data:image/jpeg;base64..."
     * @example <caption>Downloading an image from the imageEvent</caption>
     * imageEvent.fetchImage().then(function(imagedata) {
     *                      imageEvent.body.thumbnail = imagedata;
     *                      //console.log('<img src="'+imagedata+'"/>');
     *                      
     *                      //to cancel the request:
     *                      current_user.conversation.abortSendImage(imageRequest); 
     *                       });
     */
    fetchImage(type, representations) {
        type = type || "thumbnail";
        representations = representations || this.body.representations;
        var p = new Promise(function(resolve, reject) {
            if (!localStorage.getItem("NXMO_user_data")) {
                reject(new NexmoClientError("error:user:relogin"));
            } else {
                var imageDataObject = (representations instanceof Object) ? representations : JSON.parse(representations);
                var url = imageDataObject[type].url;
                var xhr = new XMLHttpRequest();
                var token = JSON.parse(localStorage.getItem("NXMO_user_data")).token;
                xhr.open("GET", url);
                xhr.setRequestHeader("Authorization", "Bearer " + token);
                xhr.responseType = 'arraybuffer';
                xhr.onload = function() { //Call a function when the state changes.
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        var responseArray = new Uint8Array(this.response);
                        // Convert the int array to a binary String
                        // We have to use apply() as we are converting an *array*
                        // and String.fromCharCode() takes one or more single values, not
                        // an array.
                        //support large image files (Chunking)
                        var res = "";
                        var chunk = 8 * 1024;
                        var i;
                        for (i = 0; i < responseArray.length / chunk; i++) {
                            res += String.fromCharCode.apply(null, responseArray.subarray(i * chunk, (i + 1) * chunk));
                        }
                        res += String.fromCharCode.apply(null, responseArray.subarray(i * chunk));
                        var b64 = btoa(res);
                        var dataUrl = "data:image/jpeg;base64," + b64;
                        resolve(dataUrl);
                    } else {
                        // Previous state reject(xhr.status); -- Untested
                        reject(new NexmoClientError("error:fetch-image"));
                    }
                };
                xhr.send();
            }
        });
        return p;
    }
}
},{"../conversationClientError":3,"./event":5}],7:[function(require,module,exports){
/*
 * Conversation SDK
 *  Message Object Model
 *
 * Copyright (c) Nexmo Inc. 2015
 */

var Event = require('./event').Event;

var Recording = function(conversation, params) {
    this.conversation = conversation;
    // Map the params
    for (var key in params) {
        this[key] = params[key];
    }
    // call WildEmitter constructor
};

Recording.prototype = Object.create(Event.prototype);

Recording.prototype.stop = function(params) {
    // Invoke the delete on the event object
    this.del(params);
};

Recording.prototype._handleEvent = function(event) {
    var self = this;
    switch (event.type) {
        default: self.emit(event.type, event.body);
            break;
    }
};

module.exports = {
    Recording: Recording
};
},{"./event":5}],8:[function(require,module,exports){
/*
 * Conversation SDK
 *  Text Event Object Model
 *
 * Copyright (c) Nexmo Inc. 2017
 */

var Event = require('./event').Event;

// Conversation Client Error
var ConversationClientError = require('../conversationClientError');

var NexmoApiError = ConversationClientError.NexmoApiError;
var NexmoClientError = ConversationClientError.NexmoClientError;

/**
 * A text event
 *
 * @class TextEvent
 */
class TextEvent extends Event {
    constructor(conversation, params) {
        super(conversation, params);
        this.conversation = conversation;
        this.state = {
            seen_by: {},
            delivered_to: {}
        };
        if (params && params.body) {
            if (params.body.timestamp)
                this.timestamp = params.body.timestamp;
        }
        // Map the params
        for (var key in params) {
            this[key] = params[key];
        }
    }
}

/**
 * Set the message status to 'seen'
 * @returns {Promise}
 */
TextEvent.prototype.seen = function() {
    this.type = "text";
    return this.seenEvent();
};

/**
 * Set the message status to 'delivered'. 
 * handled by the SDK
 * @returns {Promise}
 */
TextEvent.prototype.delivered = function() {
    this.type = "text";
    return this.deliveredEvent();
};

/**
 * Delete the event
 * @returns {Promise}
 */
TextEvent.prototype.del = function() {
    return this.deleteEvent();
};

module.exports = {
    TextEvent: TextEvent
};

},{"../conversationClientError":3,"./event":5}],9:[function(require,module,exports){
(function (global){

var ConversationClient = global.ConversationClient || {};
ConversationClient = require('./sdk')

global.ConversationClient = ConversationClient;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./sdk":18}],10:[function(require,module,exports){
/*
 * Conversation SDK
 *  Member Object Model
 *
 * Copyright (c) Nexmo Inc. 2015
 */

var WildEmitter = require('wildemitter');
var User = require('./user').User;
var Event = require('./events/event').Event;
var TextEvent = require('./events/text_event').TextEvent;
var ImageEvent = require('./events/image_event');

// Conversation Client Error
var ConversationClientError = require('./conversationClientError');

var NexmoApiError = ConversationClientError.NexmoApiError;
var NexmoClientError = ConversationClientError.NexmoClientError;

/**
 * An individual user (i.e. conversation member).
 * @class
 * @param {Conversation} conversation
 * @param {object} params 
 */
var Member = function(conversation, params) {
    this.conversation = conversation;

    //TODO: to move this to a constructor
    this._normalise = function(params) {
        if (params) {
            for (var key in params) {
                switch (key) {
                    case "member_id":
                        this.id = params.member_id;
                        break;
                    case "timestamp":
                        this.timestamp = params.timestamp;
                        break;
                    case "state":
                        this.state = params.state;
                        break;
                    default:
                        this[key] = params[key];
                }
            }

            if (params.from) {
                if (params.from) this.id = params.from;
            }
            this.user = this.user || {};
            if (params.user_id) {
                this.user.id = params.user_id;
            }
            if (params.name) {
                this.user.name = params.name;
            }
            if (params.user) {
                this.user = {
                    name: params.user.name,
                    id: params.user.user_id || params.user.id
                };
            }
            if (params.invited_by) this.invited_by = params.invited_by;
            this.channel = params.channel || {
                type: "app"
            };
            //join conversation returns our member with only id, 
            // compare it for now and use the username we have in the application object
            if (this.conversation.application.me && params.user_id === this.conversation.application.me.id) {
                this.user.name = this.conversation.application.me.name;
            }

            //make sure we don't keep a member.user_id, username in any flow
            delete this.user_id;
            delete this.name;
            delete this.user.user_id;
        }
    }
    this._normalise(params);
};

WildEmitter.mixin(Member);

/*
 * Play the given stream only to this member within the conversation
 * 
 * @param {string} [params] 
 * 
 * @returns {Promise<Event>} - not tested yet
 */
Member.prototype.playStream = function(params) {
    var self = this;
    var p = new Promise(function(resolve, reject) {
        self.conversation.application.session.sendRequest({
            type: 'audio:play',
            cid: self.id,
            to: self.id,
            body: params
        }, function(response) {
            if (response.type === 'audio:play:success') {
                var event = new Event(self.conversation, response);
                resolve(event);
            } else {
                reject(new NexmoApiError(response));
            }
        });
    });
    return p;
};

/** 
 * Speak the given text only to this member within the conversation
 * 
 * @param {string} [params] 
 * 
 * @returns {Promise<Event>}
 */
Member.prototype.sayText = function(params) {
    var self = this;
    var p = new Promise(function(resolve, reject) {
        self.conversation.application.session.sendRequest({
            type: 'audio:say',
            cid: self.id,
            from: self.conversation.me.id,
            to: self.id,
            body: params
        }, function(response) {
            if (response.type === 'audio:say:success') {
                var event = new Event(self.conversation, response);
                resolve(event);
            } else {
                reject(new NexmoApiError(response));
            }
        });
    });
    return p;
};

/**
 * Kick this member from the conversation
 * 
 * @returns {Promise}
 */
Member.prototype.kick = function() {
    var self = this;
    var p = new Promise(function(resolve, reject) {
        self.conversation.application.session.sendRequest({
            type: 'conversation:member:delete',
            cid: self.conversation.id,
            from: self.conversation.me.id,
            to: self.id,
            body: {
                "member_id": self.id
            }
        }, function(response) {
            if (response.type === 'conversation:member:delete:success') {
                resolve(response.body);
            } else {
                reject(new NexmoApiError(response));
            }
        });
    });
    return p;
};

/**
 * Mute this member
 * @param {Boolean} [mute] is muted
 *
 * @returns {Promise} -
 *
 */
Member.prototype.mute = function(mute) {
    var self = this;
    var params = {};
    var p = new Promise(function(resolve, reject) {
        var type = 'audio:mute:off';
        if (mute) {
            type = 'audio:mute:on';
        }
        self.conversation.application.session.sendRequest({
            type: type,
            cid: self.id,
            to: self.id,
            body: params
        }, function(response) {
            if (response.type === 'audio:mute:success') {
                resolve(response.body);
            } else {
                reject(new NexmoApiError(response));
            }
        });
    });
    return p;
};

/*
 * Control the volume of this member
 * 
 * @param {string} [params] 
 * 
 * @returns {Promise} - not tested yet
 */
Member.prototype.volume = function(up) {
    var self = this;
    var params = {};
    var p = new Promise(function(resolve, reject) {
        var type = 'audio:volume:down';
        if (up) {
            type = 'audio:volume:up';
        }
        self.conversation.application.session.sendRequest({
            type: type,
            cid: self.id,
            to: self.id,
            body: params
        }, function(response) {
            if (response.type === 'audio:volume:success') {
                resolve(response.body);
            } else {
                reject(new NexmoApiError(response));
            }
        });
    });
    return p;
};

/**
 * Earmuff this member
 * 
 * @param {Boolean} [params] 
 * 
 * @returns {Promise}
 *
 */
Member.prototype.earmuff = function(earmuff) {
    var self = this;
    var params = {};
    var p = new Promise(function(resolve, reject) {
        if (self.me === null) {
            reject(new NexmoClientError("error:self"));
        } else {
            var type = 'audio:earmuff:off';
            if (earmuff) {
                type = 'audio:earmuff:on';
            }
            self.conversation.application.session.sendRequest({
                type: type,
                cid: self.id,
                to: self.id,
                body: params
            }, function(response) {
                if (response.type === 'audio:earmuff:success') {
                    resolve(response.body);
                } else {
                    reject(new NexmoApiError(response));
                }
            });
        }
    });
    return p;
};

/*
 * Record this member
 * 
 * @param {string} [params] 
 * 
 * @returns {Promise} - not tested yet
 */
Member.prototype.record = function(params) {
    var self = this;
    var p = new Promise(function(resolve, reject) {
        self.conversation.application.session.sendRequest({
            type: 'audio:record',
            cid: self.id,
            to: self.id,
            body: params
        }, function(response) {
            if (response.type === 'audio:record:success') {
                var event = new Event(this.conversation, response);
                resolve(event);
            } else {
                reject(new NexmoApiError(response));
            }
        });
    });
    return p;
};

Member.prototype._handleEvent = function(event) {
    switch (event.type) {
        case 'member:invited':
            this._normalise(event.body);
            this.state = 'INVITED';
            this.timestamp.invited = event.body.timestamp.invited;
            break;
        case 'member:joined':
            this._normalise(event.body);
            this.state = 'JOINED';
            this.timestamp.joined = event.body.timestamp.joined;
            break;
        case 'member:left':
            this._normalise(event.body);
            this.state = 'LEFT';
            this.timestamp.left = event.body.timestamp.left;
            break;
        case 'member:media':
            this.media = event.body;
            break;
        default:
            break;
    }
};

module.exports = {
    Member: Member
};
},{"./conversationClientError":3,"./events/event":5,"./events/image_event":6,"./events/text_event":8,"./user":19,"wildemitter":84}],11:[function(require,module,exports){
//workaround to keep the web worker in the same file
//we create the worker's code
//we convert it to a blob object and pass it to the worker constructor through the createObjectURL

var Cache_worker = function() {
	var worker = {
		get function() {
			return function() {
				var IDBTransaction = self.IDBTransaction || self.webkitIDBTransaction;

				if (IDBTransaction) {
					IDBTransaction.READ_WRITE = IDBTransaction.READ_WRITE || 'readwrite';
					IDBTransaction.READ_ONLY = IDBTransaction.READ_ONLY || 'readonly';
				}

				/***
				 * Create database
				 * */
				var request = indexedDB.open('ConversationClient', 1);
				var dbReady = false;
				var pendingMessages = [];

				request.onupgradeneeded = function(e) {
					// e is an instance of IDBVersionChangeEvent
					var idb = e.target.result;

					//conversations store
					if (idb.objectStoreNames.contains('conversations')) {
						idb.deleteObjectStore('conversations');
					}

					var store = idb.createObjectStore('conversations', {
						keyPath: 'cid'
					});
					// createIndex operations possible to be pefromed on store.createIndex
					// store.createIndex('by_cid', 'cid', { unique: true });

					//conversation list store

					if (idb.objectStoreNames.contains('conversations_list')) {
						idb.deleteObjectStore('conversations_list');
					}

					var store_list = idb.createObjectStore('conversations_list', {
						keyPath: 'name'
					});
					// createIndex operations possible to be pefromed on store.createIndex
					// store_list.createIndex('by_name', 'name', { unique: true });


				};

				request.onsuccess = function() { /* add, update, delete, ... */
					dbReady = true;
					pendingMessages.forEach(function(e) {
						onmessage(e);
					});
					self.postMessage({
						worker_action: 'db:initialised'
					});
				};
				request.onblocked = function() {
					console.log('DB open blocked', e);
				};
				request.onerror = function() { /* handle error */
					console.log(e, 'error in DB', e);
				};
				request.onabort = function() { /* handle error */
					console.log(e, 'transaction will automatically abort due the failed request', e);
				};
				request.oncomplete = function() {
					// All requests have succeeded and the transaction has committed.
					console.log('oncomplete', e);
				};
				//worker events
				onmessageerror = function(error) {
					console.log('on message error invoked', error);
				};
				onmessage = function(e) {
					var tx;
					var eventStore;

					if (!dbReady) {
						console.log('adding pending request');
						pendingMessages.push(e);
						return;
					}
					console.log('processing event: ', e.data);

					if (request) {
						switch (e.data.worker_action) {
							case 'conversations:invalidate':
								request = indexedDB.deleteDatabase('ConversationClient');
								// .onsuccess = function(event) {
								// 	self.postMessage({
								// 		worker_action: 'conversations:invalidate',
								// 		result: event
								// 	});
								// 	console.log("Database deleted successfully");
								close();
								// 	console.log('closing down the worker');
								// 	console.log(event.result); // should be undefined
								// };
								self.postMessage({
									worker_action: 'conversations:invalidate:success',
								});
								break;
							case 'conversation:storage:add':
								tx = request.result.transaction('conversations', IDBTransaction.READ_WRITE);
								eventStore = tx.objectStore('conversations');
								eventStore.put({
									cid: e.data.body.id,
									conversation: e.data
								}).onsuccess = function(event) {
									console.log('conversations updated');
									var countRequest = eventStore.count();
									countRequest.onsuccess = function() {
										self.postMessage({
											worker_action: 'conversations:idb:count',
											conversations_idb_count: countRequest.result
										});
									};
								};
								break;
							case 'user:conversations:storage:add':
								tx = request.result.transaction('conversations_list', IDBTransaction.READ_WRITE);
								eventStore = tx.objectStore('conversations_list');
								eventStore.put({
									name: 'username',
									data: e.data
								}).onsuccess = function(event) { };
								break;
							case 'user:conversations:storage:get':
								tx = request.result.transaction('conversations_list', IDBTransaction.READ_ONLY);
								eventStore = tx.objectStore('conversations_list');
								eventStore.getAll().onsuccess = function(event) {
									if (!event.target.result) return;
									event.target.result.worker_action = e.data.worker_action;
									self.postMessage(event.target.result);
								};
								break;
							//TODO
							//make it smarter to identify when a worker has not finish its work before the next event
							//provide an event e.g. onComplete from a worker's task
							case 'conversation:storage:delete':
								tx = request.result.transaction('conversations', IDBTransaction.READ_WRITE);
								eventStore = tx.objectStore('conversations');
								eventStore.delete(e.data.cid).onsuccess = function(event) {
									console.log('conversation deleted');
								};
								break;
							case 'events:storage:updateEvents':
								tx = request.result.transaction('conversations', IDBTransaction.READ_WRITE);
								eventStore = tx.objectStore('conversations');
								eventStore.get(e.data.cid).onsuccess = function(event) {
									if (!event.target.result) return;
									event.target.result.conversation.body.events = e.data;
									var putCommand = eventStore.put(event.target.result);
									putCommand.onsuccess = function(event) {
										//console.log('event updated');
									};
									putCommand.onerror = function(event) {
										//console.log(event);
									};
								};
								break;
							case 'events:storage:add':
								tx = request.result.transaction('conversations', IDBTransaction.READ_WRITE);
								eventStore = tx.objectStore('conversations');
								eventStore.get(e.data.cid).onsuccess = function(event) {
									if (!event.target.result || !event.target.result.conversation.body.events) return;
									event.target.result.conversation.body.events.body[e.data.id] = e.data;
									var putCommand = eventStore.put(event.target.result).onsuccess = function(event) {
										console.log('conversations updated');
									};
								};
								break;
							case 'events:storage:get':
								tx = request.result.transaction('conversations', IDBTransaction.READ_ONLY);
								eventStore = tx.objectStore('conversations');
								eventStore.get(e.data.cid).onsuccess = function(event) {
									if (!event.target.result) return;
									event.target.result.worker_action = e.data.worker_action;
									self.postMessage(event.target.result.conversations);
								};
								break;
							case 'events:storage:getAll':
								tx = request.result.transaction('conversations', IDBTransaction.READ_ONLY);
								eventStore = tx.objectStore('conversations');
								eventStore.getAll().onsuccess = function(event) {
									if (!event.target.result) return;
									event.target.result.worker_action = e.data.worker_action;
									self.postMessage(event.target.result);
								};
								break;
						}
					}
				};
			};
		}
	};

	if (typeof Blob !== 'undefined') {
		var code = worker.function.toString();
		code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));
		var cache_worker_blob = new Blob([code], {
			type: 'application/javascript'
		});
		this.cache_worker_blob = cache_worker_blob;
	}
};
module.exports = Cache_worker;
},{}],12:[function(require,module,exports){
/*
 * Conversation SDK
 *  Call Object Model
 *
 * Copyright (c) Nexmo Inc. 2018
 */

var WildEmitter = require('wildemitter');
var ConversationClientError = require('../conversationClientError');
var logger = require('loglevel');

// var NexmoApiError = ConversationClientError.NexmoApiError;
var NexmoClientError = ConversationClientError.NexmoClientError;

/**
 * Conversation Call Object.
 * @class Call
 * @param {Application} application - The Application object.
 * @param {Conversation} conversation - The Conversation object that belongs to this call.
 * @param {Member} from - The member that initiated the call.
 * @property {Conversation} conversation -  The Conversation object that belongs to this call.
 * @property {Member} from - The caller. The member object of the caller ( not a reference to the one in conversation.members)
 * @property {Member[]} to - The callees. The members that receive the call (not a reference to conversation.members)
 * @property {CALL_STATES} state - The status of the current call
 * @fires Application#member:call
 * @fires Call#call:member:state
 * @fires Call#call:state:changed
 */

/**
 * Call listening for member state changed events.
 *
 * @event Call#call:member:state
 * @property {Member} from - the member that is changed
 * @property {MEMBER_CALL_STATES} state - the new state
 * @property {Event} event -  the actual event
 * @example <caption>listen for member state events</caption>
 *  call.on("call:member:state",
 *      function(from, state, event) {
 *              console.log("member: " + member.user.name + " has " + state);
 *       });
 *   });
 */
/**
 * Call listening for call state changes.
 *
 * @event Call#call:state:changed
 * @property {CALL_STATES} state - the new state
 * @example <caption>listen for call state changes</caption>
 *  call.on("call:state:changed",
 *      function(state) {
 *              console.log("call: " +  state);
 *       });
 *   });
 */
var Call = function(application, conversation, from) {
	this.application = application;
	this.log = logger.getLogger("Call");
	this.from = from;
	/**
	 * Enum for Call Member states.
	 * @constant
	 * @enum {object}
	 */
	this.MEMBER_CALL_STATES = {
		/** A Member hung up the call */
		HUNGUP: 'hungup',
		/** A Member answered the call */
		ANSWERED: 'answered',
		/** A Member rejected the call */
		REJECTED: 'rejected'
	};
	/**
	 * Enum for Call states.
	 * @constant
	 * @enum {object}
	 * */
	this.CALL_STATES = {
		/** The call has invited members but no joined*/
		RINGING: 'ringing',
		/** The call has at least 2 members joined */
		ANSWERED: 'answered',
		/** The call had at least 2 members joined and now none */
		COMPLETED: 'completed',
		/** The call had no members that were joined */
		CANCELLED: 'cancelled',
		/** There was a problem setting up the call. No members are found */
		FAILED: 'failed'
	};
	this.state = this.CALL_STATES.RINGING; //start in ringing state
	this._setupConversationObject(conversation);
};

WildEmitter.mixin(Call);

/**
 * Attach member event listeners from the conversation
 * map them to call:member:state events
 * provided states member: hungup, rejected and answered
 * @private 
 */
Call.prototype._attachCallListeners = function() {
	var self = this;
	this.conversation.releaseGroup('call_module');
	this.conversation.on('member:left', 'call_module', function(from, event) {
		var state = self.MEMBER_CALL_STATES.HUNGUP;
		if (from.state === 'JOINED') {
			state = self.MEMBER_CALL_STATES.HUNGUP;
		} else {
			state = self.MEMBER_CALL_STATES.REJECTED;
		}
		self._updateCallState();
		self.emit('call:member:state', from, state, event);
		self._hangUpIfAllLeft();
	});
	this.conversation.on('member:joined', 'call_module', function(from, event) {
		var state = self.MEMBER_CALL_STATES.ANSWERED;
		self._updateCallState();
		self.emit('call:member:state', from, state, event);
	});
};

/**
 * Go through the members of the conversation and if .me is the only one (JOINED or INVITED)
 * call call.hangUp().
 * @returns {Promise} - empty promise or the call.hangUp promise chain
 * @private  
 */
Call.prototype._hangUpIfAllLeft = function() {
	if (!this.conversation.me || this.conversation.me.state === "LEFT") return Promise.resolve();
	if (Object.keys(this.conversation.members).length > 1) {
		for (var member_id in this.conversation.members) {
			if (!this.conversation.members[member_id]) continue;
			var member = this.conversation.members[member_id];
			if (member.state !== "LEFT" && (this.conversation.me.user.id !== member.user.id)) {
				return Promise.resolve();
			}
		}
		return this.hangUp();
	} else {
		return Promise.resolve();
	}
}
/**
 * Update the Call.state with the status of the call.
 * Run through the members of the call and identify if there is an ongoing call
 * @private
 */
Call.prototype._updateCallState = function() {
	if (!this.conversation) {
		this.state = this.CALL_STATES.FAILED;
	} else {
		var joined = 0;
		var had_joined = 0;
		var invited = 0;
		var were_invited = 0;

		if (Object.keys(this.conversation.members).length >= 1) {
			for (var member_id in this.conversation.members) {
				if (!this.conversation.members[member_id]) continue;
				var member = this.conversation.members[member_id];

				switch (member.state) {
					case 'JOINED':
						joined++;
						break;
					case 'LEFT':
						if (member.timestamp.joined) {
							had_joined++;
						}
						if (member.timestamp.invited) {
							were_invited++;
						}
						break;
					case 'INVITED':
						invited++;
						break;
				}
			}
		} else {
			this.state = this.CALL_STATES.FAILED;
		}
		if (joined === 1 && invited > 0)
			this.state = this.CALL_STATES.RINGING;
		if (joined >= 2)
			this.state = this.CALL_STATES.ANSWERED;
		if (joined === 0 && had_joined > 1)
			this.state = this.CALL_STATES.COMPLETED;
		if (joined <= 1 && had_joined <= 1 && invited === 0)
			this.state = this.CALL_STATES.CANCELLED;
		if (joined === 0 && had_joined === 0 && invited === 0 && were_invited === 0)
			this.state = this.CALL_STATES.FAILED;

	}
	this.emit('call:state:changed', this.state);
	return this.state;
}

/**
 * Set the conversation object of the Call
 * update call.from, and call.to attributes based on the conversation members
 * @private
 */
Call.prototype._setupConversationObject = function(conversation) {
	if (!conversation) return;
	this.conversation = conversation;
	if (!conversation.me) {
		this.log.debug("missing own member object");
	} else {
		this.to = Object.assign({}, conversation.members);
		if (this.from) {
			delete this.to[this.from.id];
		}
	}

	this._attachCallListeners();
}
/**
 * Trigger the call flow for the input users.
 * Create a conversation with prefix name "CALL_" 
 * and invite all the users.
 * If at least one user is successfully invited, enable the audio.
 * 
 * @param {string[]} usernames the usernames of the users to call
 * @returns {Promise[]} an array of the invite promises for the provided usernames
 * @private
 */
Call.prototype.createCall = function(usernames) {
	if (!usernames || !Array.isArray(usernames) || usernames.length === 0) {
		return Promise.reject(new NexmoClientError("error:application:call:params"));
	}
	var self = this;

	return self.application.newConversationAndJoin({ display_name: "CALL_" + self.application.me.name + "_" + usernames.join("_").replace(" ", "") })
		.then(function(conversation) {
			self.from = conversation.me;
			self.successful_invited_members = [];
			var invites = usernames.map(
				//check all invites, if at least one is resolved enable audio
				function(username) {

					// we need to catch rejections to allow all the chain to go through (all invites)
					// we then catch-reject a promise so that the errors are passing through the end of the chain
					return conversation.inviteWithAudio({ user_name: username })
						.then(function(member) {
							self.successful_invited_members.push(member);
							self.log.debug(member);
							return Promise.resolve(member);
						})
						.catch(function(error) {
							self.log.warn(error);
							// resolve the error to allow the promise.all to collect
							// and return all the promises
							return Promise.resolve(error);
						})
				});
			//helper function to process in Promise.all() the failed invites too
			var process_invites = function() {
				if (self.successful_invited_members.length > 0) {
					return conversation.media.enable({ audio: { muted: false, earmuffed: false } })
						.then(function() {
							return Promise.resolve(invites);
						})
				} else {
					return Promise.reject(invites);
				}
			};
			// we need to continue the invites even if one fails,
			// in process_invites we do the check if at least one was successful 
			return Promise.all(invites)
				.then(function() {
					self._setupConversationObject(conversation);
					return process_invites();
				});
		});

}

/**
 * Hangs up the call
 * Leave from the conversation
 * Disable the audio
 * 
 * @returns {Promise} 
 */
Call.prototype.hangUp = function() {
	return this.conversation.leave();
}

/**
 * Rejects an incoming call
 * Leave from the conversation that you are invited
 * 
 * @returns {Promise} 
 */
Call.prototype.reject = function() {
	var self = this;
	if (self.conversation) {
		return self.conversation.leave();
	} else {
		return Promise.reject(new NexmoClientError("error:call:reject"));
	}
}

/**
 * Answers an incoming call
 * Join the conversation that you are invited
 * 
 * @returns {Promise} 
 */
Call.prototype.answer = function() {
	var self = this;
	if (self.conversation) {
		return self.conversation.join().then(function() {
			return self.conversation.media.enable();
		});
	} else {
		return Promise.reject(new NexmoClientError("error:call:answer"));
	}
}

module.exports = {
	Call: Call
};

},{"../conversationClientError":3,"loglevel":50,"wildemitter":84}],13:[function(require,module,exports){
/*
 * Conversation SDK
 *  Media Object Model
 *
 * Copyright (c) Nexmo Inc. 2017
 */

var ConversationClientError = require('../conversationClientError');
var RtcHelper = require('./rtc_helper').RtcHelper;
var logger = require('loglevel');
var utils = require('../utils');

var rtcHelper = new RtcHelper();

var wsConnection;
if (!rtcHelper.isNode()) {
    wsConnection = require('./rtcstats/trace-ws')();
    require('./rtcstats/rtcstats')(
        wsConnection.trace,
        1000, // interval at which getStats will be polled,
        [''] // RTCPeerConnection prefixes to wrap.
    );
} else {
    wsConnection = {
        reset: function() { }
    }
}


var NexmoApiError = ConversationClientError.NexmoApiError;
var NexmoClientError = ConversationClientError.NexmoClientError;



/**
 * WebRTC Media class
 * @class Media
 */

var Media = function(conversation) {
    this.log = logger.getLogger("Media");
    if (conversation) {
        this.parentConversation = conversation;
        this.application = conversation.application;
    }

    this.log_rtcstats = logger.getLogger("RTCStats");
    wsConnection.reset({
        traceEnabled: this.application.session.config.rtcstarts_enables,
        rtcstatsUri: this.application.session.config.rtcstarts_url,
        logger: {
            log: this.log_rtcstats.debug
        }
    })

}

/**
 * Earmuff our member
 *
 * @param {Boolean} [params]
 *
 * @returns {Promise}
 */
Media.prototype.earmuff = function(earmuff) {
    var self = this;
    var params = {};
    var p = new Promise(function(resolve, reject) {
        if (self.me === null) {
            reject(new NexmoClientError("error:self"));
        } else {
            var type = 'audio:earmuff:off';
            if (earmuff) {
                type = 'audio:earmuff:on';
            }
            self.application.session.sendRequest({
                type: type,
                cid: self.parentConversation.id,
                to: self.parentConversation.me.id,
                body: params
            }, function(response) {
                var onoff = (earmuff) ? 'on' : 'off';
                if (response.type === 'audio:earmuff:' + onoff + ':success') {
                    resolve(response.body);
                } else {
                    reject(new NexmoApiError(response));
                }
            });
        }
    });
    return p;
};

Media.prototype._handleVideo = function(params) {
    var self = this;
    return Promise.resolve().then(function() {
        switch (params.video) {
            case 'both':
            case 'send_only':
            case true:
                return rtcHelper.getUserVideo().then(function(localStream) {
                    return self._handleVideoSend(localStream, params.video === 'send_only', params);
                });
            case 'receive_only':
                self.log.debug('video - receive_only not implemented yet');
                return Promise.reject(new NexmoApiError('Not implemented yet'));
            case 'none':
            case undefined:
            case false:
                self.log.debug('video - none or undefined ignoring');
                break;
            default:
                return Promise.reject(new NexmoApiError('Not supported'));
        }
    }).then(function() {
        switch (params.screenshare) {
            case 'send_only':
            case true:
                return rtcHelper.getUserScreen().then(function(localStream) {
                    return self._handleVideoSend(localStream, true, params);
                });
            case 'none':
            case false:
                self.log.debug('screen share - none or undefined ignoring');
                break;
            default:
                break;
        }
    })

};

Media.prototype._handleVideoSend = function(localStream, isSendOnly, params) {
    var self = this;
    var clientId = utils.allocateUUID();
    var pc = rtcHelper.createRTCPeerConnection({
        'iceServers': [self.application.session.config.iceServers],
        'iceTransportPolicy': 'all',
        'bundlePolicy': 'balanced',
        'rtcpMuxPolicy': 'require',
        'iceCandidatePoolSize': '0'
    }, {
            optional: [{
                'DtlsSrtpKeyAgreement': 'true'
            }]
        }, clientId);

    pc.trace('conversation_id', self.parentConversation.id);
    pc.trace('member_id', self.parentConversation.me.id);

    self.parentConversation.pc = pc;
    self.parentConversation.remoteMembers = [];
    self.parentConversation.localStream = localStream;
    // We want to be able to handle these events, for self member, before they get propagated out
    self.parentConversation.on('rtc:answer', 'media_module', function(event) {
        self.parentConversation.pc.setRemoteDescription(new RTCSessionDescription({
            type: 'answer',
            sdp: event.body.answer
        })).then(function() {
            self.log.debug('remote description is set');
        }).catch(function(e) {
            self.log.warn('set remote description failed with error', e);
        });
    });

    if (!isSendOnly) {
        self.parentConversation.on('rtc:offer', 'media_module', function(event) {
            self._handleNewOffer(params, event);
        });

        self.parentConversation.on('rtc:terminate', 'media_module', function(event) {
            self._handleParticipantRtcTerminate(event);
        })
    }

    pc.ontrack = function(evt) {
        self.log.debug('ontrack');
        self.application.activeStream.stream = evt.streams[0];
    };

    pc.addStream(localStream);
    var p = new Promise(function(resolve, reject) {
        pc.createOffer()
            .then(function(desc) {
                return pc.setLocalDescription(desc);
            })
            .then(function() {
                var event_to_emit = {
                    type: 'rtc:new',
                    cid: self.parentConversation.id,
                    from: self.parentConversation.me.id,
                    body: {
                        offer: {
                            sdp: self.parentConversation.pc.localDescription.sdp
                        },
                        video: isSendOnly ? 'send_only' : 'both'
                    }
                }
                if (params && params.label) {
                    event_to_emit.label = params.label;
                }
                self.log.debug('sending rtc:new event');
                self.application.session.sendRequest(event_to_emit,
                    function(response) {
                        if (response.type === 'rtc:new:success') {
                            self.log.debug('getting rtc:new:success');
                            self.application.activeStream.rtc_id = response.body.rtc_id;
                            pc.trace('rtc_id', self.application.activeStream.rtc_id);
                            resolve();
                        } else {
                            reject(new NexmoApiError(response));
                        }
                    });
            }).catch(function(e) {
                reject(new NexmoApiError(e));
            })
    })
    var promisesArray = [];
    pc.onicecandidate = function(event) {
        p.then(function() {
            var body = {};
            self._onIceCandidate(promisesArray, event, body);
        })
    }

    pc.oniceconnectionstatechange = function(status) {
        switch (pc.iceConnectionState) {
            //https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/iceConnectionState
            case 'disconnected':
            case 'failed':
                self.log.warn('One or more transports has terminated unexpectedly or in an error', status);
                break;
            default:
                self.log.debug('The ice connection status changed', pc.iceConnectionState);
                break;
        }
    }
    pc.onicegatheringstatechange = function() {
        switch (pc.iceGatheringState) {
            case 'new':
                self.log.debug('ice gathering new');
                break;
            case 'complete':
                self.log.debug('ice gathering complete');
                break;
            case 'gathering':
                self.log.debug('ice gathering gathering');
                break;
        }
    }
    //on member delete (ourself)
    //terminate media
    self.parentConversation.on('member:left', 'media_module', function(member) {
        if (member.user.id === self.application.me.id) {
            self.disable();
        }
    });
    self.log.debug('sending local stream');

    self.parentConversation.me.emit("media:stream:on", localStream);

    self.application.activeStream.ready = p;

    return p;
}

Media.prototype._sendIceRequest = function(body) {
    var self = this;
    return new Promise(function(resolve, reject) {
        var event_to_emit = {
            type: 'rtc:ice',
            cid: self.parentConversation.id,
            from: self.parentConversation.me.id,
            rtc_id: self.application.activeStream.rtc_id,
            body: body
        }

        self.application.session.sendRequest(event_to_emit,
            function(response) {
                if (response.type === 'rtc:ice:success') {
                    resolve();
                } else {
                    reject(new NexmoApiError(response));
                }
            });
    })
}

Media.prototype._onIceCandidate = function(promiseArray, event, body) {
    var self = this;
    var bodyToSend = body;

    if (event.candidate) {
        bodyToSend.candidates = event.candidate;
        self.log.debug('sending trickle candidates: ', bodyToSend);
        promiseArray.push(self._sendIceRequest(bodyToSend))
    } else {
        bodyToSend.candidates = {
            completed: true
        };
        return Promise.all(promiseArray)
            .then(self._sendIceRequest(bodyToSend))
            .then(function() {
                self.log.debug('successfully sent trickle candidates', bodyToSend);
            })
            .catch(function() {
                self.log.error('failed to sent trickle candidates', bodyToSend);
            });
    }
}

Media.prototype._handleNewOffer = function(params, event) {
    var self = this;

    var remoteMemberObject = {
        remote_member_id: event.body.member_id
    };

    for (var member_id in self.parentConversation.members) {
        if (member_id === event.body.member_id) {
            remoteMemberObject.remote_member = self.parentConversation.members[member_id];
        }
    }

    self.parentConversation.remoteMembers.push(remoteMemberObject);
    self.log.debug('handle rtc:offer for member ' + remoteMemberObject.remote_member_id);

    var clientId = utils.allocateUUID();
    remoteMemberObject.pc = rtcHelper.createRTCPeerConnection({
        'iceServers': [self.application.session.config.iceServers],
        'iceTransportPolicy': 'all',
        'bundlePolicy': 'balanced',
        'rtcpMuxPolicy': 'require',
        'iceCandidatePoolSize': '0'
    }, {
            optional: [{
                'DtlsSrtpKeyAgreement': 'true'
            }]
        }, clientId);

    remoteMemberObject.pc.trace('conversation_id', self.parentConversation.id);
    remoteMemberObject.pc.trace('member_id', self.parentConversation.me.id);
    remoteMemberObject.pc.trace('rtc_id', self.application.activeStream.rtc_id);
    remoteMemberObject.pc.trace('other_member_id', remoteMemberObject.remote_member_id);

    remoteMemberObject.pc.ontrack = function(evt) {
        if (remoteMemberObject.stream !== evt.streams[0]) {
            remoteMemberObject.stream = evt.streams[0];
            remoteMemberObject.remote_member.emit("media:stream:on", remoteMemberObject.stream);
        }
    };

    var p = Promise.resolve();
    var promisesArray = [];
    remoteMemberObject.pc.onicecandidate = function(event) {

        p = p.then(function() {
            var body = {
                other_member_id: remoteMemberObject.remote_member_id
            };
            self._onIceCandidate(promisesArray, event, body);
        })
    }

    remoteMemberObject.pc.oniceconnectionstatechange = function(status) {
        switch (remoteMemberObject.pc.iceConnectionState) {
            //https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/iceConnectionState
            case 'disconnected':
            case 'failed':
                self.log.warn('transports has terminated or failed for member ' + event.body.member_id, status);
                break;
            default:
                self.log.debug('The ice connection status changed for member ' + event.body.member_id, remoteMemberObject.pc.iceConnectionState);
                break;
        }
    };
    remoteMemberObject.pc.onicegatheringstatechange = function() {
        switch (remoteMemberObject.pc.iceGatheringState) {
            case 'new':
                self.log.debug('ice gathering new for member ' + event.body.member_id);
                break;
            case 'complete':
                self.log.debug('ice gathering complete for member ' + event.body.member_id);
                break;
            case 'gathering':
                self.log.debug('ice gathering gathering for member ' + event.body.member_id);
                break;
        }
    };

    remoteMemberObject.pc.setRemoteDescription(new RTCSessionDescription({
        type: 'offer',
        sdp: event.body.sdp
    }))
        .then(function() {
            return remoteMemberObject.pc.createAnswer()
        })
        .then(function(answer) {
            return remoteMemberObject.pc.setLocalDescription(answer);
        })
        .then(function () {
            return self.application.activeStream.ready;
        })
        .then(function() {
            var event_to_emit = {
                type: 'rtc:answer',
                cid: self.parentConversation.id,
                rtc_id: self.application.activeStream.rtc_id,
                from: self.parentConversation.me.id,
                body: {
                    other_member_id: remoteMemberObject.remote_member_id,
                    answer: remoteMemberObject.pc.localDescription.sdp
                }
            };

            if (params && params.label) {
                event_to_emit.label = params.label;
            }

            self.application.session.sendRequest(event_to_emit,
                function(response) {
                    if (response.type === 'rtc:answer:success') {
                        self.log.debug('successfully set answer for member ' + remoteMemberObject.remote_member_id);
                    } else {
                        self.log.error(response.type + ': failed to set answer for member ' + remoteMemberObject.remote_member_id);
                    }
                });
        });

};

Media.prototype._handleParticipantRtcTerminate = function(event) {
    var self = this;

    var member = self.parentConversation.remoteMembers.find(function(member) {
        return member.remote_member_id === event.body.member_id
    });

    if (!member) {
        self.log.error('rtc:terminate was sent with invalid member id');
        return;
    }

    self.parentConversation.remoteMembers = self.parentConversation.remoteMembers.filter(function(remoteMember) {
        return remoteMember.remote_member_id !== event.body.member_id
    });
    self._deleteMemberMedia(member);
    member.remote_member.emit("media:stream:off", undefined);
};

Media.prototype._deleteMemberMedia = function(member) {
    this._closeStream(member.stream);
    member.pc.close();
};


/**
 * Enable media participation in the conversation for this application (requires WebRTC)
 * @param {object} params - rtc params
 * @param {string} params.label - Label is an application defined tag, eg. ‘fullscreen’
 * @param {object} [params.audio=true] - audio enablement mode. possible values "both", "send_only", "receive_only", "none", true or false
 * * <!-- the following line should be added when deploying video to prod.
 * @param {object} [params.video=false] - video enablement mode. possible values "both", "send_only", "receive_only", "none", true or false
 * @param {object} [params.screenshare=false] -screen sharing enablement mode. possible values "send_only", "none", true or false -->
 * @returns {Promise<MediaStream>}
 * @example
 * Enable media in this conversation
 * function enable() {
 *   conversation.media.enable()
 *      .then(function(stream) {
	 		var media = document.createElement("video");
			var source = document.createElement("source");
			var media_div = document.createElement("div");

			media.appendChild(source);
			media_div.appendChild(media);
			document.insertBefore(media_div);

			// Older browsers may not have srcObject
			if ("srcObject" in media) {
				media.srcObject = stream;
			} else {
				// Avoid using this in new browsers, as it is going away.
				media.src = window.URL.createObjectURL(stream);
			}

			media.onloadedmetadata = function(e) {
				media.play();
			};
	*
 * 		 }).catch(function(error) {
 *           console.log(error);
 *       });
 * }
 *
 *
 *
 **/
Media.prototype.enable = function(params) {
    var self = this;
    var p = new Promise(function(resolve, reject) {
        function onError(error) {
            self.log.error(error);
            reject(new NexmoApiError(error));
        }
        if (self.parentConversation.me === null) {
            reject(new NexmoClientError('error:self'));
        } else {
            if (self.application.activeStream) {
                reject(new NexmoClientError('error:media:already-connecting'));
            }
            self.application.activeStream = {
                conversation: self.parentConversation
            };
            if (params && (params.video || params.screenshare)) {
                return self._handleVideo(params).then(resolve).catch(reject);
            }
            rtcHelper.getUserAudio().then(
                function(localStream) {
                    var clientId = utils.allocateUUID();
                    /* jshint -W117 */
                    var pc = rtcHelper.createRTCPeerConnection({
                        'iceServers': [self.application.session.config.iceServers],
                        'iceTransportPolicy': 'all',
                        'bundlePolicy': 'balanced',
                        'rtcpMuxPolicy': 'require',
                        'iceCandidatePoolSize': '0'
                    }, {
                            optional: [{
                                'DtlsSrtpKeyAgreement': 'true'
                            }]
                        }, clientId);

                    pc.trace('conversation_id', self.parentConversation.id);
                    pc.trace('member_id', self.parentConversation.me.id);

                    self.parentConversation.pc = pc;
                    self.parentConversation.localStream = localStream;
                    pc.ontrack = function(evt) {
                        self.application.activeStream.stream = evt.streams[0]
                        resolve(evt.streams[0]);
                    };
                    pc.addStream(localStream);
                    pc.createOffer(
                        function(desc) {
                            pc.setLocalDescription(desc, function() { }, onError);
                        },
                        onError);
                    pc.oniceconnectionstatechange = function(status) {
                        switch (pc.iceConnectionState) {
                            //https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/iceConnectionState
                            case 'disconnected':
                            case 'failed':
                                onError(status);
                                self.log.warn('One or more transports has terminated unexpectedly or in an error', status);
                                break;
                            default:
                                self.log.debug('The ice connection status changed', pc.iceConnectionState);
                                break;
                        }
                    }

                    pc.onicegatheringstatechange = function() {
                        switch (pc.iceGatheringState) {
                            case 'new':
                                self.log.debug('ice gathering new');
                                break;
                            case 'complete':
                                self.log.debug('ice gathering complete');
                                var event_to_emit = {
                                    type: 'rtc:new',
                                    cid: self.parentConversation.id,
                                    from: self.parentConversation.me.id,
                                    body: {
                                        offer: self.parentConversation.pc.localDescription
                                    }
                                }
                                if (params && params.label) {
                                    event_to_emit.label = params.label;
                                }
                                self.application.session.sendRequest(event_to_emit,
                                    function(response) {
                                        if (response.type === 'rtc:new:success') {
                                            self.application.activeStream.rtc_id = response.body.rtc_id;
                                            pc.trace('rtc_id', self.application.activeStream.rtc_id);
                                            //dont resolve yet, wait for the answer
                                            // resolve(response.type);
                                        } else {
                                            reject(new NexmoApiError(response));
                                        }
                                    });
                                break;
                            case 'gathering':
                                self.log.debug('ice gathering gathering');
                                break;
                        }
                    }
                }).then(function() {
                    // We want to be able to handle these events, for self member, before they get propagated out
                    self.parentConversation.on('rtc:answer', 'media_module', function(event) {
                        if (self.application.activeStream.rtc_id !== event.body.rtc_id) {
                            self.log.warn("RTC: skipping  rtc answer for different rtc_id");
                            return;
                        }
                        if (!self.parentConversation.pc) {
                            // self.log.warn('RTC: received an answer too late');
                            return;
                        }
                        self.parentConversation.pc.setRemoteDescription(new RTCSessionDescription({
                            type: 'answer',
                            sdp: event.body.answer
                        }),
                            function() {
                                self.log.debug('remote description is set');
                            },
                            onError);
                    });
                    //on member delete (ourself)
                    //terminate media
                    self.parentConversation.on('member:left', 'media_module', function(member) {
                        if (member.user.id === self.application.me.id && self.application.activeStream) {
                            self.disable();
                        }
                    });
                }).catch(function(error) {
                    reject(new NexmoClientError(error));
                });
        }
    });
    return p;
};

Media.prototype._closeStream = function(stream) {
    stream.getTracks().forEach(function(track) {
        track.stop();
    });
};

/**
 * Disable media partcipation in the conversation for this application
 *
 * @returns {Promise}
 * @example
 *
 * function disable() {
 *   conversation.media.disable()
 *      .then(function(response) {
 *       }).catch(function(error) {
 *           console.log(error);
 *       });
 * }
 *
 **/
Media.prototype.disable = function() {
    var self = this;
    var csRequestPromise = new Promise(function(resolve, reject) {
        if (!self.application.activeStream) {
            reject(new NexmoClientError('error:media:not-enabled'));
            return;
        }
        self.application.session.sendRequest({
            type: 'rtc:terminate',
            cid: self.parentConversation.id,
            from: self.parentConversation.me.id,
            rtc_id: self.application.activeStream.rtc_id
        }, function(response) {
            if (response.type === 'rtc:terminate:success') {
                resolve(response.type);
            } else {
                //make sure we have cleaned the objects
                reject(new NexmoApiError(response));
            }
        });
    });
    var closeResourcesPromise = Promise.resolve().then(function() {
        if (self.parentConversation.pc) self.parentConversation.pc.close();

        self.parentConversation.releaseGroup('media_module');

        if (self.parentConversation.remoteMembers) {
            self.parentConversation.remoteMembers.forEach(function(member) {
                self._deleteMemberMedia(member);
            });
        }

        // stop active stream
        self.log.debug(self.application);
        self.log.debug(self.parentConversation);
        if (self.application.localStream) {
            self._closeStream(self.application.localStream);
        }
        if (self.application.activeStream && self.application.activeStream.stream) {
            self._closeStream(self.application.activeStream.stream);
        }
        if (self.parentConversation.localStream) {
            self._closeStream(self.parentConversation.localStream);
        }
        delete self.parentConversation.pc;
        delete self.parentConversation.localStream;
        delete self.application.activeStream;
        delete self.parentConversation.remoteMembers;
    });
    return Promise.all([csRequestPromise, closeResourcesPromise]).then(function() {
        return Promise.resolve('rtc:terminate:success')
    }).catch(function(error) {
        return Promise.reject(error);
    });
};

/**
 * Mute this member
 *
 * @param {Boolean} [params] is muted
 *
 */
Media.prototype.mute = function(mute) {
    var self = this;
    var params = {};
    var p = new Promise(function(resolve, reject) {
        var type = 'audio:mute:off';
        if (mute) {
            type = 'audio:mute:on';
        }
        self.application.session.sendRequest({
            type: type,
            cid: self.parentConversation.id,
            to: self.parentConversation.me.id,
            body: params
        }, function(response) {
            var onoff = (mute) ? 'on' : 'off';
            if (response.type === 'audio:mute:' + onoff + ':success') {
                resolve(response.body);
            } else {
                reject(new NexmoApiError(response));
            }
        });
    });
    return p;
};


/**
 * Play a voice text in a conversation
 * @param {object} params
 * @param {string} params.text - the text to say in the conversation
 * @param {string} params.voice_name - 
 * @param {number} params.level - [0] -
 * @param {Boolean} params.queue -
 * @param {Boolean} params.loop -
 *
 * @returns {Promise<Event>}
 * @example
 *   conversation.media.say({text:'hi'})
 **/

Media.prototype.sayText = function(params) {
    var self = this;
    var p = new Promise(function(resolve, reject) {
        var msg = {
            type: 'audio:say',
            cid: self.parentConversation.id,
            body: {
                text: params.text,
                voice_name: params.voice_name || 'Amy',
                level: params.level || 1,
                queue: params.queue || true,
                loop: params.loop || 1,
                ssml: params.ssml || false
            }
        };
        self.application.session.sendRequest(msg, function(response) {
            if (response.type === 'audio:say:success') {
                msg.id = response.body.id;
                var event = new Event(self.parentConversation, response);
                resolve(event);
            } else {
                reject(new NexmoApiError(response));
            }
        });
    });
    return p;
};

/**
 * Record the audio stream in a conversation
 * @param {object} params
 * @param {string} params.format = (mp3, wav, ogg)
 * @param {Boolean} params.streamed -
 * @param {number} params.validity_time -
 * @param {Boolean} params.beep_start -
 * @param {Boolean} params.beep_stop -~
 * @param {Boolean} params.detect_speech -
 *
 * @returns {Promise<Event>}
 * @example
 *   conversation.audio.record()
 */

// Record this conversation that the message is addressed to.
// To stop the recording delete the message,
// which will result in an event
Media.prototype.record = function(params) {
    var self = this;
    var p = new Promise(function(resolve, reject) {
        var msg = {
            type: 'audio:record',
            cid: self.id,
            body: {
                format: params.format,
                destination_url: params.destination_url,
                streamed: params.streamed,
                validity_time: params.validity_time,
                beep_start: params.beep_start,
                beep_stop: params.beep_stop,
                detect_speech: params.detect_speech
            }
        };
        self.application.session.sendRequest(msg, function(response) {
            if (response.type === 'audio:record:success') {
                msg.id = response.body.id;
                var event = new Event(self.parentConversation, response);
                resolve(event);
            } else {
                reject(new NexmoApiError(response));
            }
        });
    });
    return p;
};

//pass in the recording url coming in the recording event to fetch the recording src that can be put in audio element
Media.prototype.fetchRecording = function(url) {
    var p = new Promise(function(resolve, reject) {
        if (!localStorage.getItem("NXMO_user_data")) {
            reject(new NexmoClientError("error:user:relogin"));
        } else {
            var xhr = new XMLHttpRequest();
            var token = JSON.parse(localStorage.getItem("NXMO_user_data")).token;
            xhr.open("GET", url);
            xhr.setRequestHeader("Authorization", "Bearer " + token);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.responseType = 'blob';
            xhr.onload = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var blob = new Blob([xhr.response], {
                        type: 'audio/ogg'
                    });
                    var objectUrl = URL.createObjectUrl(blob);
                    resolve(objectUrl);
                } else {
                    // Previous state reject(xhr.status); -- Untested
                    reject(new NexmoClientError("error:fetch-recording"));
                }
            };
            xhr.send();
        }
    });
    return p;

}


// Play a stream to the conversation
Media.prototype.playStream = function(params) {
    var self = this;
    var p = new Promise(function(resolve, reject) {
        var msg = {
            type: 'audio:play',
            cid: self.parentConversation.id,
            body: params
        };
        self.application.session.sendRequest(msg, function(response) {
            if (response.type === 'audio:play:success') {
                msg.id = response.body.id;
                var event = new Event(self.parentConversation, response);
                resolve(event);
            } else {
                reject(new NexmoApiError(response));
            }
        });
    });
    return p;
};

/**
 * Send start ringing event
 * @returns {Promise<Event>}
 * @example
 * Send ringing event
 * function startRinging() {
 *   conversation.media.startRinging()
 *      .then(function(response) {
 *       }).catch(function(error) {
 *           console.log(error);
 *       });
 * }
 *
 * conversation.on('audio:ringing:start', function(data)){
 * console.log("ringing");
 * }
 */
Media.prototype.startRinging = function() {
    var self = this;
    var p = new Promise(function(resolve, reject) {
        var msg = {
            type: 'audio:ringing:start',
            cid: self.parentConversation.id,
            from: self.parentConversation.me.id,
            body: {}
        };
        self.application.session.sendRequest(msg, function(response) {
            if (response.type === 'audio:ringing:start:success') {
                var event = new Event(self.parentConversation, response);
                resolve(event);
            } else {
                reject(new NexmoApiError(response));
            }
        });
    });
    return p;
};

/**
 * Send stop ringing event
 * @returns {Promise<Event>}
 * @example
 * Send ringing event
 * function stopRinging() {
 *   conversation.media.stopRinging()
 *      .then(function(response) {
 *       }).catch(function(error) {
 *           console.log(error);
 *       });
 * }
 *
 * conversation.on('audio:ringing:stop', function(data)){
 * console.log("ringing stopped");
 * }
 */
Media.prototype.stopRinging = function() {
    var self = this;
    var p = new Promise(function(resolve, reject) {
        var msg = {
            type: 'audio:ringing:stop',
            cid: self.parentConversation.id,
            from: self.parentConversation.me.id,
            body: {}
        };
        self.application.session.sendRequest(msg, function(response) {
            if (response.type === 'audio:ringing:stop:success') {
                var event = new Event(self.parentConversation, response);
                resolve(event);
            } else {
                reject(new NexmoApiError(response));
            }
        });
    });
    return p;
}

module.exports = {
    Media: Media
};

},{"../conversationClientError":3,"../utils":20,"./rtc_helper":15,"./rtcstats/rtcstats":16,"./rtcstats/trace-ws":17,"loglevel":50}],14:[function(require,module,exports){
var Cache_worker = require('./cache-worker.js');
var logger = require('loglevel');


var RTC_Cache = function(rtc) {
	var self = this;
	this.log = logger.getLogger("Cache");

	var cache_worker = new Cache_worker();

	this.worker = null;
	this.conversation_data = [];

	//load token from cache
	var NXMO_user_data = null;
	if (typeof(Storage) !== 'undefined') {
		NXMO_user_data = localStorage.getItem('NXMO_user_data');
		if (NXMO_user_data) {
			self.user_data = JSON.parse(NXMO_user_data);
		}
	}
	if (typeof window !== 'undefined' && !!window.Worker) {
		this.log.info('initialising cache webWorker');
		this.worker = new Worker(URL.createObjectURL(cache_worker.cache_worker_blob));

		this.worker.onmessage = function(event) {
			self.log.debug('[<--] (WebWorker): ', (event.data.worker_action));
			switch (event.data.worker_action) {
				case 'user:conversations:storage:get':
					self.conversations_cached = event.data;
					break;
				case 'events:storage:getAll':
					event.data.forEach(function(event) {
						self.conversation_data[event.cid] = event.conversation;
						self.conversation_data[event.cid].fromStorage = true;
					});
					break;
				case 'conversations:idb:count':
					self.conversations_idb_count = event.data.conversations_idb_count;
					break;
			}
			delete event.data.worker_action;
		};
	} else {
		this.log.warn('webWorker is not supported');
		return;
	}
	this.rtc = rtc;
	this.conversations_idb_count = 0;
};

RTC_Cache.prototype.init = function(rtc) {
	if (!this.worker) return;
	var self = this;
	rtc.connection.io.on('packet', function(packet) {
		if (!rtc.cache || packet.type !== 2 || packet.data[0] === 'echo') return;
		var response = packet.data[1];
		// Set the type of the response		
		response.type = packet.data[0];
		self.log.debug("[<--]", response.type, JSON.stringify(response));
		//use the cache object to determine if it's intended to be cached and cache it
		rtc.cache.add_response(response);
	});

	rtc.connection.io.on('reconnect', function() {
		if (self.user_data) {
			rtc.login(rtc.cache.user_data.token);
		}
	});

	self._sendRequest = rtc.sendRequest;
	rtc.sendRequest = function(request, callback) {
		var type = request.type;
		self.process_cache(type, request, callback, this).then(
			function(processed_response) {
				if (processed_response) {
					return callback(processed_response);
				} else {
					return self._sendRequest.call(self.rtc, request, callback);
				}
			});
	}
};
//generic request/response lazy caching
RTC_Cache.prototype.add_response = function(response) {
	if (!this.worker) return;
	var self = this;

	if (response.type === 'session:success') {
		//fetch the conversations list is expected right after the login
		self.worker.postMessage({
			worker_action: 'user:conversations:storage:get'
		});
	}
	if (this.conversation_data[response.cid]) {
		//we already have cached this conversation,
		//check if we got the events for it and create the events object
		if (response.type === 'conversation:events:success' && (this.conversation_data[response.cid] &&
				!this.conversation_data[response.cid].events)) {
			this.conversation_data[response.cid].events = response.body;
			if (this.worker) {
				response.worker_action = 'events:storage:updateEvents';
				this.worker.postMessage(response);
				this.log.debug('[-->] (WebWorker): ', JSON.stringify(response));
			}
		}
	}
	switch (response.type) {
		case 'conversation:get:success':
			//prepare conversation cache/storage item
			this.setConversationDirty(response.body.id, false);
			this.conversation_data[response.body.id] = response.body;
			if (this.worker) {
				response.worker_action = 'conversation:storage:add';
				this.worker.postMessage(response);
				this.log.debug('[-->] (WebWorker): ', JSON.stringify(response.body));
			}

			break;
		case 'user:conversations:success':
			//don't fetch here all the conversations
			self.conversations_cached = response;
			if (this.worker) {
				response.worker_action = 'user:conversations:storage:add';
				this.worker.postMessage(response);
				this.log.debug('[-->] (WebWorker): ', JSON.stringify(response));
			}
			break;
		default:
	}
};

RTC_Cache.prototype.update_conversation = function(conversation) {
	if (!this.worker) return;
	this.conversation_data[conversation.id] = conversation;
};

RTC_Cache.prototype.addConversationEvent = function(cid, message, sequence_number, event) {
	if (!this.worker) return;
	//message param has a value for events: text, image

	//******
	//now the message can have event from a member status : member:join 
	// we need to allow the event to be added with the flow below, but also trigger a way to filter events and specific actions for them 
	// e.g. an event:delete should also trigger a new command for the worker to go to the conversation[id] 
	// and find the event.id and empty the context + add the deleted timestamp --> same actions as when we receive here the delete:event
	// similarly another action needs to be triggered to add a member (and update a member object) 
	// FAILED ATTEMPT: [because of circular link in objects we cannot pass them to the worker]
	// based on the conversation.js:529 we will receive a member:joined event, this will update the conversation list in the runtime and will 
	// create the message to be passed in the worker, the message each time contains the object to update, so we won't need to re-do the work in the worker 
	//and process again the events.

	if (message && this.conversation_data[cid]) {

		if (!this.conversation_data[cid].events) {
			//in case we are between the empty conversation object and the second that includes the events we need to make the events array
			this.conversation_data[cid].events = [];
		}
		this.conversation_data[cid].events[message.id] = message;
		this.conversation_data[cid].sequence_number = sequence_number;
		event.worker_action = 'events:storage:add';
		// event.worker_action = "conversation:storage:add";
		// var simplified_conversation_data = {
		// 	cid: cid,
		// 	events: this.conversation_data[cid].events,
		// 	members: this.conversation_data[cid].members,
		// }
		this.worker.postMessage(event);
		this.log.debug('[-->] (WebWorker): ', JSON.stringify(event.worker_action));

	}
	//we can handle actions for the rest of the events here
};

RTC_Cache.prototype.process_cache = function(type, request, callback) {
	var self = this;
	//keep all the data to reply on reconnect
	var p = new Promise(function(resolve, reject) {
		if (type === 'session:success') {
			/// TODO Control when thishappens and move it to login
			worker.postMessage({
				worker_action: 'events:storage:getAll'
			});
			self.log.debug('[-->] (WebWorker): ', 'worker_action:events:storage:getAll');
		}
		//skip cache if conversation is dirty
		//TODO remove the "per-event" logic from here and find a more generic way to handle this
		if (type === 'user:conversations') {
			if (self.conversations_cached && self.conversations_cached.body) {
				self.conversations_cached.type = 'user:conversations:success'; //hack it to be processed
				resolve(self.conversations_cached);
				self.log.debug('[-->|<--] conversation list');
			} else {
				resolve(false);
			}
		}
		if ((self.conversation_data[request.cid] &&
				self.conversation_data[request.cid].isDirty)) {
			resolve(false);

		} else {
			if ((self.conversation_data[request.cid] &&
					((type === 'conversation:events' && (self.conversation_data[request.cid].events)) ||
						(type === 'conversation:get') && self.conversation_data[request.cid]))) {

				if (type === 'conversation:get' && !request.fromCache) {
					resolve({
						cid: request.cid,
						body: (!self.conversation_data[request.cid].fromStorage) ?
							self.conversation_data[request.cid] : self.conversation_data[request.cid].body,
						type: 'conversation:get:success'
					});
				} else if (type === 'conversation:events' || self.conversation_data[request.cid].events ||
					(self.conversation_data[request.cid].fromStorage && self.conversation_data[request.cid].body.events)) {
					resolve({
						fromCache: !self.conversation_data[request.cid].fromStorage,
						cid: request.cid,
						body: (!self.conversation_data[request.cid].fromStorage) ?
							self.conversation_data[request.cid].events : self.conversation_data[request.cid].body.events.body,
						type: 'conversation:events:success'
					});
				}
				self.log.debug('[-->|<--] ', type, JSON.stringify(self.conversation_data[request.cid].id || self.conversation_data[request.cid].cid));
				//TODO: Detect if this happened in offline mode, so we will need to mark as dirty
			} else {
				resolve(false);
			}
		}
	});
	return p;
};

RTC_Cache.prototype.setConversationDirty = function(conversation_id, value) {
	var self = this;
	if (self.conversation_data[conversation_id]) {
		self.conversation_data[conversation_id].isDirty = value;
		if (self.worker && value) {
			var event = {
				cid: conversation_id,
				worker_action: 'conversation:storage:delete'
			};
			self.worker.postMessage(event);
			self.log.debug('[-->] (WebWorker): ', JSON.stringify(event.worker_action));
		}
		//when setting a conversation to dirty, we need to remove it from persistent storage
	}
};

RTC_Cache.prototype.getConversationDirtyStatus = function(conversation_id) {
	if (this.conversation_data[conversation_id])
		return this.conversation_data[conversation_id].isDirty;
};

RTC_Cache.prototype.updateToken = function(user_data) {
	if (typeof(Storage) !== 'undefined') {
		localStorage.setItem('NXMO_user_data', JSON.stringify(user_data));
	}
};

RTC_Cache.prototype.invalidate = function() {
	if (!this.worker) return;
	var event = {
		worker_action: 'conversations:invalidate'
	};
	if (typeof(Storage) !== 'undefined') {
		localStorage.removeItem('NXMO_user_data');
	}
	this.worker.postMessage(event);
	this.log.debug('[-->] (WebWorker): ', JSON.stringify(event.worker_action));
};

module.exports = RTC_Cache;
},{"./cache-worker.js":11,"loglevel":50}],15:[function(require,module,exports){
/*
 * Conversation SDK
 *  RtcHelper Object Model
 *
 * Copyright (c) Nexmo Inc. 2017
 */

// Conversation Client Error
var ConversationClientError = require('../conversationClientError');
var adapter = require('webrtc-adapter');
var browserDetect = require('detect-browser');


var NexmoApiError = ConversationClientError.NexmoApiError;
var NexmoClientError = ConversationClientError.NexmoClientError;
var browser = browserDetect.detect();
/**
 * A single RtcHelper Object.
 * @class RtcHelper
 * @ignore
 */
var RtcHelper = function() {

};

RtcHelper.prototype.getUserAudio = function() {
    return navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
    });
};

RtcHelper.prototype.getUserVideo = function() {
    return navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    });
};

RtcHelper.prototype.getUserScreen = function() {
    var self = this;
    return self.checkBrowserRunOnHttps()
        .then(function() {
            return self.checkChromeExtensionIsInstalled();
        })
        .then(function() {
            return self.getShareScreenStream();
        })
};

RtcHelper.prototype.createRTCPeerConnection = function(config, constraints, clientId) {
    constraints.optional.push({ clientId: clientId });
    return new RTCPeerConnection(config, constraints);
};

RtcHelper.prototype.checkBrowserRunOnHttps = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        if (self._getWindowLocationProtocol() !== 'https:') {
            reject(new NexmoClientError('error:media:unsupported-browser'));
        }
        resolve();
    })

};

RtcHelper.prototype.checkChromeExtensionIsInstalled = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        if (self._getBrowserName() === 'chrome') {
            if (document.getElementById('janus-extension-installed') !== null) {
                resolve();
            } else {
                reject(new NexmoClientError('error:media:unsupported-browser'));
            }
        } else {
            // Firefox or others, no need for the extension (but this doesn't mean it will work)
            return resolve();
        }
    })

};

RtcHelper.prototype.getShareScreenStream = function() {
    var self = this;
    switch (self._getBrowserName()) {
        case 'chrome':
            return self.chromeGetShareScreenStream();
        case 'firefox':
        default:
            return Promise.reject(new NexmoClientError('error:media:unsupported-browser'));
    }
};

RtcHelper.prototype.chromeGetShareScreenStream = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        window.addEventListener('message', self.shareScreenEventHandler(resolve, reject));
        window.postMessage({
            type: 'janusGetScreen'
        }, '*');
    })

};

RtcHelper.prototype.shareScreenEventHandler = function(resolve, reject) {
    return function(event) {
        if (event.origin !== window.location.origin) {
            // console.log('Janus Extension - different domain');
            return reject(new NexmoClientError('Janus Extension - different domain'));
        }
        if (event.data.type === 'janusGotScreen') {
            if (event.data.sourceId !== '') {
                var constraints = {
                    audio: false,
                    video: {
                        mandatory: {
                            chromeMediaSource: 'desktop',
                            maxWidth: window.screen.width,
                            maxHeight: window.screen.height,
                            maxFrameRate: 15
                        },
                        optional: []
                    }
                };
                constraints.video.mandatory.chromeMediaSourceId = event.data.sourceId;
                return navigator.mediaDevices.getUserMedia(constraints).then((s) => {
                    return resolve(s);
                }).catch((e) => {
                    var errorDescription = 'Janus Extension shareScreenWebRTCService.getStream error: ' + e;
                    // console.log(errorDescription);
                    return reject(new NexmoClientError(errorDescription));
                });
            } else {
                return reject(new NexmoClientError('janusGotScreen - invalid source id'));
            }
        } else if (event.data.type === 'janusGetScreenPending') {
            // console.log('Janus Extension - janusGetScreenPending');
        } else {
            var eventDescription = 'Janus Extension - Other event: ' + event.data.type;
            // console.log(eventDescription);
        }
    }
};

RtcHelper.prototype.firefoxGetShareScreenStream = function() {
    Promise.reject(new NexmoClientError('Not support'));
};

RtcHelper.prototype._getWindowLocationProtocol = function() {
    return window.location.protocol;
}

RtcHelper.prototype._getBrowserName = function() {
    return browser.name;
}

RtcHelper.prototype.isNode = function() {
    return browser.name === 'node';
};

module.exports = {
    RtcHelper: RtcHelper
};

},{"../conversationClientError":3,"detect-browser":32,"webrtc-adapter":73}],16:[function(require,module,exports){
'use strict';

// transforms a maplike to an object. Mostly for getStats +
// JSON.parse(JSON.stringify())
function map2obj(m) {
    if (!m.entries) {
        return m;
    }
    var o = {};
    m.forEach(function(v, k) {
        o[k] = v;
    });
    return o;
}

// apply a delta compression to the stats report. Reduces size by ~90%.
// To reduce further, report keys could be compressed.
function deltaCompression(oldStats, newStats) {
    newStats = JSON.parse(JSON.stringify(newStats));
    Object.keys(newStats).forEach(function(id) {
        if (!oldStats[id]) {
            return;
        }
        var report = newStats[id];
        Object.keys(report).forEach(function(name) {
            if (report[name] === oldStats[id][name]) {
                delete newStats[id][name];
            }
            delete report.timestamp;
            if (Object.keys(report).length === 0) {
                delete newStats[id];
            }
        });
    });
    // TODO: moving the timestamp to the top-level is not compression but...
    newStats.timestamp = new Date();
    return newStats;
}

function mangleChromeStats(pc, response) {
    var standardReport = {};
    var reports = response.result();
    reports.forEach(function(report) {
        var standardStats = {
            id: report.id,
            timestamp: report.timestamp.getTime(),
            type: report.type,
        };
        report.names().forEach(function(name) {
            standardStats[name] = report.stat(name);
        });
        // backfill mediaType -- until https://codereview.chromium.org/1307633007/ lands.
        if (report.type === 'ssrc' && !standardStats.mediaType && standardStats.googTrackId) {
            // look up track kind in local or remote streams.
            var streams = pc.getRemoteStreams().concat(pc.getLocalStreams());
            for (var i = 0; i < streams.length && !standardStats.mediaType; i++) {
                var tracks = streams[i].getTracks();
                for (var j = 0; j < tracks.length; j++) {
                    if (tracks[j].id === standardStats.googTrackId) {
                        standardStats.mediaType = tracks[j].kind;
                        report.mediaType = tracks[j].kind;
                    }
                }
            }
        }
        standardReport[standardStats.id] = standardStats;
    });
    return standardReport;
}

function dumpStream(stream) {
    return {
        id: stream.id,
        tracks: stream.getTracks().map(function(track) {
            return {
                id: track.id,                 // unique identifier (GUID) for the track
                kind: track.kind,             // `audio` or `video`
                label: track.label,           // identified the track source
                enabled: track.enabled,       // application can control it
                muted: track.muted,           // application cannot control it (read-only)
                readyState: track.readyState, // `live` or `ended`
            };
        }),
    };
}

module.exports = function(trace, getStatsInterval, prefixesToWrap) {
    var peerconnectioncounter = 0;
    var isFirefox = !!window.mozRTCPeerConnection;
    var isEdge = !!window.RTCIceGatherer;
    var isSafari = !isFirefox && window.RTCPeerConnection && !window.webkitRTCPeerConnection;
    prefixesToWrap.forEach(function(prefix) {
        if (!window[prefix + 'RTCPeerConnection']) {
            return;
        }
        if (prefix === 'webkit' && isEdge) {
            // dont wrap webkitRTCPeerconnection in Edge.
            return;
        }
        var origPeerConnection = window[prefix + 'RTCPeerConnection'];
        var peerconnection = function(config, constraints) {
            var id = 'PC_' + peerconnectioncounter++;
            var pc = new origPeerConnection(config, constraints);
            trace('clientId', id, constraints.optional[constraints.optional.length -1].clientId);

            if (!config) {
                config = { nullConfig: true };
            }

            config = JSON.parse(JSON.stringify(config)); // deepcopy
            // don't log credentials
            ((config && config.iceServers) || []).forEach(function(server) {
                delete server.credential;
            });

            if (isFirefox) {
                config.browserType = 'moz';
            } else if (isEdge) {
                config.browserType = 'edge';
            } else {
                config.browserType = 'webkit';
            }
            trace('create', id, config);
            // TODO: do we want to log constraints here? They are chrome-proprietary.
            // http://stackoverflow.com/questions/31003928/what-do-each-of-these-experimental-goog-rtcpeerconnectionconstraints-do
            if (constraints) {
                trace('constraints', id, constraints);
            }

            pc.trace = function(key, value) {
                if (key && value) {
                    trace(key, id, value);
                }
            };

            ['createDataChannel', 'close', 'addTrack', 'removeTrack'].forEach(function(method) {
                if (origPeerConnection.prototype[method]) {
                    var nativeMethod = pc[method];
                    pc[method] = function() {
                        trace(method, id, arguments);
                        return nativeMethod.apply(pc, arguments);
                    };
                }
            });

            ['addStream', 'removeStream'].forEach(function(method) {
                if (origPeerConnection.prototype[method]) {
                    var nativeMethod = pc[method];
                    pc[method] = function(stream) {
                        var streamInfo = stream.getTracks().map(function(t) {
                            return t.kind + ':' + t.id;
                        });

                        trace(method, id, stream.id + ' ' + streamInfo);
                        return nativeMethod.call(pc, stream);
                    };
                }
            });

            ['createOffer', 'createAnswer'].forEach(function(method) {
                if (origPeerConnection.prototype[method]) {
                    var nativeMethod = pc[method];
                    pc[method] = function() {
                        var args = arguments;
                        var opts;
                        if (arguments.length === 1 && typeof arguments[0] === 'object') {
                            opts = arguments[0];
                        } else if (arguments.length === 3 && typeof arguments[2] === 'object') {
                            opts = arguments[2];
                        }
                        trace(method, id, opts);
                        return new Promise(function(resolve, reject) {
                            nativeMethod.apply(pc, [
                                function(description) {
                                    trace(method + 'OnSuccess', id, description);
                                    resolve(description);
                                    if (args.length > 0 && typeof args[0] === 'function') {
                                        args[0].apply(null, [description]);
                                    }
                                },
                                function(err) {
                                    trace(method + 'OnFailure', id, err.toString());
                                    reject(err);
                                    if (args.length > 1 && typeof args[1] === 'function') {
                                        args[1].apply(null, [err]);
                                    }
                                },
                                opts,
                            ]);
                        });
                    };
                }
            });

            ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'].forEach(function(method) {
                if (origPeerConnection.prototype[method]) {
                    var nativeMethod = pc[method];
                    pc[method] = function() {
                        var args = arguments;
                        trace(method, id, args[0]);
                        return new Promise(function(resolve, reject) {
                            nativeMethod.apply(pc, [args[0],
                                function() {
                                    trace(method + 'OnSuccess', id);
                                    resolve();
                                    if (args.length >= 2) {
                                        args[1].apply(null, []);
                                    }
                                },
                                function(err) {
                                    trace(method + 'OnFailure', id, err.toString());
                                    reject(err);
                                    if (args.length >= 3) {
                                        args[2].apply(null, [err]);
                                    }
                                }]
                            );
                        });
                    };
                }
            });

            pc.addEventListener('icecandidate', function(e) {
                trace('onicecandidate', id, e.candidate);
            });
            pc.addEventListener('addstream', function(e) {
                trace('onaddstream', id, e.stream.id + ' ' + e.stream.getTracks().map(function(t) { return t.kind + ':' + t.id; }));
            });
            pc.addEventListener('removestream', function(e) {
                trace('onremovestream', id, e.stream.id + ' ' + e.stream.getTracks().map(function(t) { return t.kind + ':' + t.id; }));
            });
            pc.addEventListener('signalingstatechange', function() {
                trace('onsignalingstatechange', id, pc.signalingState);
            });
            pc.addEventListener('iceconnectionstatechange', function() {
                trace('oniceconnectionstatechange', id, pc.iceConnectionState);
            });
            pc.addEventListener('icegatheringstatechange', function() {
                trace('onicegatheringstatechange', id, pc.iceGatheringState);
            });
            pc.addEventListener('negotiationneeded', function() {
                trace('onnegotiationneeded', id);
            });
            pc.addEventListener('datachannel', function(event) {
                trace('ondatachannel', id, [event.channel.id, event.channel.label]);
            });

            // TODO: do we want one big interval and all peerconnections
            //    queried in that or one setInterval per PC?
            //    we have to collect results anyway so...
            if (!isEdge) {
                var prev = {};
                var interval = window.setInterval(function() {
                    if (pc.signalingState === 'closed') {
                        window.clearInterval(interval);
                        return;
                    }
                    if (isFirefox || isSafari) {
                        pc.getStats(null).then(function(res) {
                            var now = map2obj(res);
                            var base = JSON.parse(JSON.stringify(now)); // our new prev
                            trace('getstats', id, deltaCompression(prev, now));
                            prev = base;
                        });
                    } else {
                        pc.getStats(function(res) {
                            var now = mangleChromeStats(pc, res);
                            var base = JSON.parse(JSON.stringify(now)); // our new prev
                            trace('getstats', id, deltaCompression(prev, now));
                            prev = base;
                        }, function(err) {
                            console.log(err);
                        });
                    }
                }, getStatsInterval);
            }
            return pc;
        };
        // wrap static methods. Currently just generateCertificate.
        if (origPeerConnection.generateCertificate) {
            Object.defineProperty(peerconnection, 'generateCertificate', {
                get: function() {
                    return arguments.length ?
                        origPeerConnection.generateCertificate.apply(null, arguments)
                        : origPeerConnection.generateCertificate;
                },
            });
        }
        window[prefix + 'RTCPeerConnection'] = peerconnection;
        window[prefix + 'RTCPeerConnection'].prototype = origPeerConnection.prototype;
    });

    // getUserMedia wrappers
    prefixesToWrap.forEach(function(prefix) {
        var name = prefix + (prefix.length ? 'GetUserMedia' : 'getUserMedia');
        if (!navigator[name]) {
            return;
        }
        var origGetUserMedia = navigator[name].bind(navigator);
        var gum = function() {
            trace('getUserMedia', null, arguments[0]);
            var cb = arguments[1];
            var eb = arguments[2];
            origGetUserMedia(arguments[0],
                function(stream) {
                    // we log the stream id, track ids and tracks readystate since that is ended GUM fails
                    // to acquire the cam (in chrome)
                    trace('getUserMediaOnSuccess', null, dumpStream(stream));
                    if (cb) {
                        cb(stream);
                    }
                },
                function(err) {
                    trace('getUserMediaOnFailure', null, err.name);
                    if (eb) {
                        eb(err);
                    }
                }
            );
        };
        navigator[name] = gum.bind(navigator);
    });

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
        var gum = function() {
            trace('navigator.mediaDevices.getUserMedia', null, arguments[0]);
            return origGetUserMedia.apply(navigator.mediaDevices, arguments)
                .then(function(stream) {
                    trace('navigator.mediaDevices.getUserMediaOnSuccess', null, dumpStream(stream));
                    return stream;
                }, function(err) {
                    trace('navigator.mediaDevices.getUserMediaOnFailure', null, err.name);
                    return Promise.reject(err);
                });
        };
        navigator.mediaDevices.getUserMedia = gum.bind(navigator.mediaDevices);
    }
};

},{}],17:[function(require,module,exports){
var PROTOCOL_VERSION = '1.0';
var MAX_BUFFER_LENGTH = 50;
var MAX_RECONNECT_RETRIES = 5;
var RECONNECT_RETRY_TIMEOUT = 5000;
module.exports = function() {
    var buffer = [];
    var retObj = {};
    var connection;
    var rtcstatsUri;
    var traceEnabled = false;
    var logger = {
        log: function() {},
    };
    var reconnectRetries = 0;

    retObj.reset = function(options) {
        var self = this;

        if (options && options.traceEnabled) {
            traceEnabled = options.traceEnabled;
        } else {
            traceEnabled = false;
        }

        if (options && options.logger) {
            logger = options.logger;
        }

        if (options && options.rtcstatsUri) {
            rtcstatsUri = options.rtcstatsUri;
        }

        self.reconnect();
    };

    retObj.reconnect = function() {
        var self = this;

        logger.log('TRACE-WS reconnect', connection ? connection.readyState : 'no connection');

        if (connection && connection.readyState !== WebSocket.CLOSED) {
            connection.onclose = undefined;
            connection.onerror = undefined;
            connection.close();
        }

        connection = undefined;

        if (reconnectRetries > MAX_RECONNECT_RETRIES) {
            return;
        }

        reconnectRetries++;

        if (rtcstatsUri && traceEnabled) {
            connection = new WebSocket(rtcstatsUri, PROTOCOL_VERSION);
            connection.onerror = function(e) {
                logger.log('TRACE-WS onerror', e);
            };

            connection.onopen = function() {
                reconnectRetries = 0;
                logger.log('TRACE-WS onopen', buffer.length);
                while (buffer.length) {
                    connection.send(JSON.stringify(buffer.shift()));
                }
            };

            connection.onclose = function(event) {
                logger.log('TRACE-WS onclose', event);
                setTimeout(function () {
                    self.reconnect();
                }, RECONNECT_RETRY_TIMEOUT);
            };
        }
    };

    retObj.trace = function() {
        if (!traceEnabled) {
            return;
        }

        var args = Array.prototype.slice.call(arguments);
        args.push(new Date().getTime());
        if (connection && connection.readyState === WebSocket.OPEN) {
            connection.send(JSON.stringify(args));
        } else {
            if (buffer.length <= MAX_BUFFER_LENGTH) {
                buffer.push(args);
            }
        }
    };

    return retObj;
};

},{}],18:[function(require,module,exports){
/*
 * Conversation SDK
 *  Main wrapper
 *
 * Copyright (c) Nexmo Inc. 2017
 */

var WildEmitter = require('wildemitter');
var socket_io = require('socket.io-client');
var logger = require('loglevel');
var prefix = require('loglevel-plugin-prefix');

var utils = require('./utils');
var RTC_Cache = require('./modules/rtc_cache');
var Application = require('./application').Application;
var User = require('./user').User;

prefix.reg(logger);

prefix.apply(logger, {
	template: '[%t] %l (NXM-%n):',
	timestampFormatter: function(date) {
		return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
	},
	levelFormatter: function(level) {
		return level.toUpperCase();
	},
	nameFormatter: function(name) {
		return name || 'SDK';
	}
});

// Conversation Client Error
var ConversationClientError = require('./conversationClientError');

var NexmoApiError = ConversationClientError.NexmoApiError;
var NexmoClientError = ConversationClientError.NexmoClientError;

/**
 * The parent ConversationClient class.
 *
 * @class ConversationClient
 * @param {object} [params]
 * @param {Boolean} params.debug=false set mode to debug
 * @param {string} params.url=nexmo_ws_url Nexmo Conversation Websocket url 
 * @param {string} params.path=/rtc Nexmo Conversation Websocket url path suffix
 * @param {Boolean} params.reconnection=true socket.io reconnection attribute
 * @param {Boolean} params.forceNew=true socket.io forceNew attribute
 * @param {Boolean} params.autoConnect=true socket.io autoConnect attribute
 * @param {string} params.ips_url=ips_url Nexmo IPS url for image upload
 * @param {string} params.environment='production' development / production environment
 * @param {object} params.iceServers={'stun:stun.l.google.com:19302'} iceServers for RTCPeerConnection
 *
 * @fires ConversationClient#ready
 */
function ConversationClient(params) {
	//save an array of instances
	var self = this;
	var options = params || {};
	var config = this.config = {
		autoConnect: true,
		bugsnag_key: 'cd2dcd56892c3cd260b12caf6eecf022',
		cache: true,
		debug: false,
		enable_log_reporter: true,
		environment: 'production',
		forceNew: true,
		ips_url: 'https://api.nexmo.com/v1/image',
		path: '/rtc',
		reconnection: true,
		repository: 'https://github.com/Nexmo/conversation-js-sdk',
		SDK_version: '0.1.17',
		url: 'https://ws.nexmo.com',
		iceServers: {
			urls: 'stun:stun.l.google.com:19302'
		},
		rtcstarts_enables: false,
		rtcstarts_url: '@@rtcstarts_url'
	};
	var item,
		connection;
	this.sessionReady = false;
	this.requests = {};
	this.application = null;

	// set our config from options
	for (item in options) {
		this.config[item] = options[item];
	}

	if (config.debug === true) {
		logger.setLevel("debug");
	} else {
		logger.setLevel("silent");
	}
	this.log = logger.noConflict();

	//inject bug reporting tool
	if (config.enable_log_reporter) {
		function j(u, c) {
			var h = document.getElementsByTagName('head')[0],
				s = document.createElement('script');
			s.async = true;
			s.src = u;
			s.onload = s.onreadystatechange = function() {
				if (!s.readyState || /loaded|complete/.test(s.readyState)) {
					s.onload = s.onreadystatechange = null;
					s = undefined;
					if (c) {
						c();
					}
				}
			};
			h.insertBefore(s, h.firstChild);
		}


		if (typeof document !== "undefined") {
			j("//d2wy8f7a9ursnm.cloudfront.net/bugsnag-3.min.js", function() {
				if (typeof Bugsnag !== "undefined") {
					if (!Bugsnag.apiKey) {
						Bugsnag.apiKey = self.config.bugsnag_key;
						Bugsnag.releaseStage = self.config.environment;
						Bugsnag.appVersion = self.config.SDK_version;
						Bugsnag.repository = self.config.repository;
						Bugsnag.disableAutoBreadcrumbs();
					}
				}
			});
		}
	}

	// Create the socket.io connection and allow multiple instances
	connection = socket_io.connect(config.url, {
		path: config.path,
		forceNew: config.forceNew,
		reconnection: config.reconnection,
		autoConnect: config.autoConnect
	});

	this.connection = connection;

	if (config.cache) {
		this.cache = new RTC_Cache(this);
		this.cache.init(this);
	}

	/**
	 * Ready event.
	 *
	 * @event ConversationClient#ready
	 * @example <caption>Listen to websocket ready event </caption>
	 *     rtc.on("ready", function() {
	 *      console.log("connection ready");
	 *     });
	 */
	connection.on('connect', function() {
		self.emit('ready');
		self.sessionReady = true;
	});

	// Listen to socket.io events
	/**
	 * Connecting event.
	 *
	 * @event ConversationClient#connecting
	 * @example <caption>Listen to websocket connecting event </caption>
	 *     rtc.on("connecting", function() {
	 *      console.log("connecting");
	 *     });
	 */
	connection.on('connecting', function() {
		self.emit('connecting');
	});
	/**
	 * Disconnect event.
	 *
	 * @event ConversationClient#disconnect
	 * @example <caption>Listen to websocket disconnect event </caption>
	 *     rtc.on("disconnect", function() {
	 *      console.log("disconnect");
	 *     });
	 */
	connection.on('disconnect', function() {
		self.emit('disconnect');
	});
	/**
	 * Reconnect event.
	 *
	 * @event ConversationClient#reconnect
	 * @example <caption>Listen to websocket reconnect event </caption>
	 *     rtc.on("reconnect", function(retry_number) {
	 *      console.log("reconnect", retry_number);
	 *     });
	 */
	connection.on('reconnect', function(retry_number) {
		self.emit('reconnect', retry_number);
		if (self.cache && self.cache.user_data) {
			self.login(self.cache.user_data.token);
		}
	});
	/**
	 * Reconnecting event.
	 *
	 * @event ConversationClient#reconnecting
	 * @example <caption>Listen to websocket reconnecting event </caption>
	 *     rtc.on("reconnecting", function(retry_number) {
	 *      console.log("reconnecting", retry_number);
	 *     });
	 */
	connection.on('reconnecting', function(retry_number) {
		self.emit('reconnecting', retry_number);
	});
	/**x
	 * Error event.
	 *
	 * @event ConversationClient#error
	 * @example <caption>Listen to websocket error event </caption>
	 *     rtc.on("error", function(error) {
	 *      console.log("error", error);
	 *     });
	 */
	connection.on('error', function(error) {
		self.emit('error', new NexmoClientError(error))
		self.log.error("Socket.io reported a generic error", error);
	});

	connection.io.on('packet', function(packet) {
		if (packet.type !== 2) return;
		if (packet.data[0] === 'echo') return; //ignore echo events
		var response = packet.data[1];
		// Set the type of the response		
		response.type = packet.data[0];
		self.log.debug("<--", response.type, JSON.stringify(response));
		if (response.rid in self.requests) {
			var callback = self.requests[response.rid].callback;
			delete self.requests[response.rid];
			delete response.delay;
			callback(response);
		} else {
			// This is an unsolicited event
			//we are skipping here global application events.
			if (self.application)
				self.application._handleEvent(response);
		}
	});
}

WildEmitter.mixin(ConversationClient);

/**
 * Conversation listening for text events.
 *
 * @event Conversation#text
 *
 * @property {Member} sender - The sender of the text
 * @property {Text} text - The text message received
 * @example <caption>listen for text events</caption>
 * conversation.on("text",
 *   function(sender, message) {
 *      console.log(sender,message);
 *
 * // Identify your own message.
 *      if (message.from !== conversation.me.id)
 *
 * // Identify if the event corresponds to the currently open conversation.
 *      if (message.cid === conversation.id)
 * });
 */
/**
 *
 *  Conversation listening for image events.
 *
 * @event Conversation#image
 *
 * @property {Member} sender - The sender of the image
 * @property {ImageEvent} image - The image message received
 * @example <caption>listen for image events</caption>
 * conversation.on("image",
 *   function(sender, image) {
 *      console.log(sender,image);
 *
 * // Identify your own imageEvent.
 *      if (image.from !== conversation.me.id)
 *
 *  // Identify if the event corresponds to the currently open conversation.
 *      if (image.cid === conversation.id)
 * });
 */
/**
 * Conversation listening for deleted events.
 *
 * @event Conversation#event:delete
 *
 * @property {Member} member - the member who deleted an event
 * @property {Event} event - deleted event: event.id
 * @example <caption>get details about the deleted event</caption>
 * conversation.on("event:delete",
 *   function(member, event) {
 *      console.log(event.id);
 *      console.log(event.body.timestamp.deleted);
 * });
 */
/**
 * Conversation listening for new members.
 *
 * @event Conversation#member:joined
 *
 * @property {Member} member - the member that joined
 * @property {Event} event - the join event
 * @example <caption>get the name of the new member</caption>
 * conversation.on("member:joined",
 *   function(member, event) {
 * 		console.log(event.id)
 *      console.log(member.user.name+ " joined the conversation");
 * });
 */
/**
 * Conversation listening for members being invited.
 *
 * @event Conversation#member:invited
 *
 * @property {Member} member - the member that is invited
 * @property {Event} event - data regarding the receiver of the invitation
 * @example <caption>get the name of the invited member</caption>
 * conversation.on("member:invited",
 *   function(member, event ) {
 *      console.log(member.user.name + " invited to the conversation");
 * });
 */
/**
 * Conversation listening for members leaving (kicked or left).
 *
 * @event Conversation#member:left
 *
 * @property {Member} member - the member that has left
 * @property {Event} event - data regarding the receiver of the invitation
 * @example <caption>get the username of the member that left</caption>
 * conversation.on("member:left",
 *   function(member , event ) {
 *      console.log(member.user.name + " left");
 * });
 */
/**
 * Conversation listening for members typing.
 *
 * @event Conversation#text:typing:on
 *
 * @property {Member} member - the member that started typing
 * @property {Event} event - the start typing event
 * @example <caption>get the username of the member that is typing</caption>
 * conversation.on("text:typing:on",
 *   function(data) {
 *      console.log(data.name + " is typing...");
 * });
 */
/**
 * Conversation listening for members stopped typing.
 *
 * @event Conversation#text:typing:off
 * 
 * @property {Member} member - the member that stopped typing
 * @property {Event} event - the stop typing event
 * @example <caption>get the username of the member that stopped typing</caption>
 * conversation.on("text:typing:off",
 *   function(data) {
 *      console.log(data.name + " stopped typing...");
 * });
 */
/**
 * Conversation listening for members' seen texts.
 *
 * @event Conversation#text:seen
 *
 * @property {Member} member - the member that saw the text
 * @property {Text} text - the text that was seen
 * @example <caption>listen for seen text events</caption>
 * conversation.on("text:seen",
 *   function(data, text) {
 *      console.log(text);
 *
 * // Check if the event belongs to this conversation
 *      if (text.cid === conversation.id)
 *
 * // Get the list of members that have seen this event
 *      for (var member_id in text.state.seen_by) {
 *          if (conversation.me.id !== member_id) {
 *              console.log(conversation.members[member_id].name);
 *          }
 *       }
 * });
 */
/**
 * Conversation listening for members' seen images.
 * @event Conversation#image:seen
 *
 * @property {Member} member - the member that saw the image
 * @property {ImageEvent} image - the image that was seen
 * @example <caption>listen for seen image events</caption>
 * conversation.on("image:seen",
 *   function(data, image) {
 *      console.log(image);
 *
 * // Check if the event belongs to this conversation
 *      if (image.cid === conversation.id)
 * // Get the list of members that have seen this event
 *      for (var member_id in image.state.seen_by) {
 *           if (conversation.me.id !== member_id) {
 *               console.log(conversation.members[member_id].name);
 *            }
 *       }
 * });
 */
/**
 * Conversation listening for members media changes (audio, video,text)
 *
 * Change in media presence state. They are in the conversation with text, audio or video.
 * 
 * @event Conversation#member:media
 *
 * @property {Member} member - the member object linked to this event 
 * @property {Event} event - information about media presence state
 * @property {boolean} event.body.audio  - is audio enabled
 * @example <caption>get every member's media change events </caption>
 * conversation.on("member:media",
 *   function(from, media ) {
 *      console.log(from.media.audio); //true
 * 		console.log(event.body.media); //{"audio":true}
 * });
 */
ConversationClient.prototype.sendRequest = function(request, callback) {
	// Add a message ID to the request and set up a listener for the reply (or error)
	var self = this;
	request.tid = utils.allocateUUID();
	var type = request.type;
	delete request.type;
	self.log.debug("-->", type, JSON.stringify(request));
	self.connection.emit(type, request);
	self.requests[request.tid] = {
		type: type,
		request: request,
		callback: callback
	};
};

/**
 * Login to the cloud.
 *x
 * @param {string} params.token - the login token
 */
ConversationClient.prototype.login = function(token) {
	var self = this;

	// return a promise for the application
	var p = new Promise(function(resolve, reject) {
		//make sure the token gets removed from localstorage until we work the retry mechanism
		if (typeof (Storage) !== "undefined") {
			localStorage.removeItem("NXMO_user_data");
		}
		self.sendRequest({
			type: 'session:login',
			body: {
				token: token,
				SDK_version: self.config.SDK_version,
				//device_id: //can use https://github.com/Valve/fingerprintjs2,
				OS_family: 'js',
				OS_revision: (typeof navigator !== "undefined") ? navigator.userAgent : (typeof window !== "undefined") ? window.navigator.userAgent : "Generic JS navigator"
			}
		},
			function(response) {
				if (response.type === "session:success") {
					var application = new Application(self);
					var me = new User(application, {
						id: response.body.user_id,
						name: response.body.name
					});
					self.application = application;
					self.application.me = me;
					if (self.cache) self.cache.updateToken({
						token: token,
						username: response.body.name
					});
					// Retrieve the existing conversation data for this user
					application.getConversations()
						.then(function() {
							// Complete the login process
							resolve(self.application);
							if (typeof Bugsnag !== "undefined") {

								Bugsnag.user = {
									id: application.me.id
								};
							}
						}, function(reason) {
							reject(new NexmoApiError(reason));
						});
				} else {
					reject(new NexmoApiError(response));
					//todo move this in cache module
					if (self.cache && self.cache.worker) {
						self.cache.worker.terminate();
					}
				}
			}
		);
	});
	return p;
};

/**
 * logout from the cloud.
 *
 */

ConversationClient.prototype.logout = function() {
	var self = this;
	// return a promise for the application
	var p = new Promise(function(resolve, reject) {

		var logoutRequest = function() {
			return self.sendRequest({
				type: 'session:logout',
				body: {}
			}, function(response) {
				if (response.type === "session:logged-out" || response.type === "session:terminated") {
					//TODO make sure this is successful and add to the chain
					//TODO move this in cache module
					self.disconnect();
					if (self.cache) self.cache.invalidate();

					if (self.application) {
						for (var conversation_id in self.application.conversations) {
							//unregister all events
							self.application.conversations[conversation_id].releaseGroup(conversation_id);
						}
					}
					delete self.application;
					delete self.cache;
					self.callbacks = {};
					//self.connection is safe to stay
					//self.log is safe to stay
					self.requests = {};
					self.sessionReady = false;
					resolve(response);
				} else {
					// Previous state reject(response.reason); -- Untested
					reject(new NexmoApiError(response));
					if (typeof Bugsnag !== "undefined") Bugsnag.notifyException(Error(response.reason));
				}
			});
		}

		// prepare for logout
		if (self.application && self.application.activeStream) {
			self.application.activeStream.conversation.media.disable()
				// mimicking .finally
				.then(function() { }).catch(function() { }).then(function() {
					logoutRequest();
				});
		} else {
			logoutRequest();

		}
	});
	return p;
};

/**
 * Disconnect from the cloud.
 *
 */

ConversationClient.prototype.disconnect = function() {
	return this.connection.disconnect();
};
/**
 * Connect from the cloud.
 *
 */
ConversationClient.prototype.connect = function() {
	return this.connection.connect();
};

module.exports = ConversationClient;
},{"./application":1,"./conversationClientError":3,"./modules/rtc_cache":14,"./user":19,"./utils":20,"loglevel":50,"loglevel-plugin-prefix":49,"socket.io-client":58,"wildemitter":84}],19:[function(require,module,exports){
/*
 * Conversation SDK
 *  User Object Model
 *
 * Copyright (c) Nexmo Inc. 2015
 */

var WildEmitter = require('wildemitter');

// Conversation Client Error
// var ConversationClientError = require('./conversationClientError');

// var NexmoApiError = ConversationClientError.NexmoApiError;
// var NexmoClientError = ConversationClientError.NexmoClientError;

var User = function(application, params) {
    this.application = application;
    // Map the params
    for (var key in params) {
        this[key] = params[key];
    }
};

WildEmitter.mixin(User);

module.exports = {
    User: User
};
},{"wildemitter":84}],20:[function(require,module,exports){
// 
// Conversation Service
//  Utility functions
//
// (c) Nexmo Inc. 2017

var uuid = require('uuid');

var allocateUUID = function() {
    return uuid.v4();
};

/**
 * Get the Member from the username of a conversation
 * 
 * @param {string} username the username of the member to get
 * @param {Conversation} conversation the Conversation to search in
 * @returns {Member} the requested Member
 * @private
 */
var getMemberFromNameOrNull = function(conversation, username) {
    if (!conversation || !username) return null;
    for (var member_id in conversation.members) {
        if (conversation.members[member_id].user.name === username) {
            return conversation.members[member_id];
        }
    }
    return null; //TODO make it sdk error
};

module.exports = {
    allocateUUID: allocateUUID,
    getMemberFromNameOrNull: getMemberFromNameOrNull
};
},{"uuid":68}],21:[function(require,module,exports){
module.exports = after

function after(count, callback, err_cb) {
    var bail = false
    err_cb = err_cb || noop
    proxy.count = count

    return (count === 0) ? callback() : proxy

    function proxy(err, result) {
        if (proxy.count <= 0) {
            throw new Error('after called too many times')
        }
        --proxy.count

        // after first error, rest are passed to err_cb
        if (err) {
            bail = true
            callback(err)
            // future error callbacks will go to error handler
            callback = err_cb
        } else if (proxy.count === 0 && !bail) {
            callback(null, result)
        }
    }
}

function noop() {}

},{}],22:[function(require,module,exports){
/**
 * An abstraction for slicing an arraybuffer even when
 * ArrayBuffer.prototype.slice is not supported
 *
 * @api public
 */

module.exports = function(arraybuffer, start, end) {
  var bytes = arraybuffer.byteLength;
  start = start || 0;
  end = end || bytes;

  if (arraybuffer.slice) { return arraybuffer.slice(start, end); }

  if (start < 0) { start += bytes; }
  if (end < 0) { end += bytes; }
  if (end > bytes) { end = bytes; }

  if (start >= bytes || start >= end || bytes === 0) {
    return new ArrayBuffer(0);
  }

  var abv = new Uint8Array(arraybuffer);
  var result = new Uint8Array(end - start);
  for (var i = start, ii = 0; i < end; i++, ii++) {
    result[ii] = abv[i];
  }
  return result.buffer;
};

},{}],23:[function(require,module,exports){

/**
 * Expose `Backoff`.
 */

module.exports = Backoff;

/**
 * Initialize backoff timer with `opts`.
 *
 * - `min` initial timeout in milliseconds [100]
 * - `max` max timeout [10000]
 * - `jitter` [0]
 * - `factor` [2]
 *
 * @param {Object} opts
 * @api public
 */

function Backoff(opts) {
  opts = opts || {};
  this.ms = opts.min || 100;
  this.max = opts.max || 10000;
  this.factor = opts.factor || 2;
  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
  this.attempts = 0;
}

/**
 * Return the backoff duration.
 *
 * @return {Number}
 * @api public
 */

Backoff.prototype.duration = function(){
  var ms = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var rand =  Math.random();
    var deviation = Math.floor(rand * this.jitter * ms);
    ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
  }
  return Math.min(ms, this.max) | 0;
};

/**
 * Reset the number of attempts.
 *
 * @api public
 */

Backoff.prototype.reset = function(){
  this.attempts = 0;
};

/**
 * Set the minimum duration
 *
 * @api public
 */

Backoff.prototype.setMin = function(min){
  this.ms = min;
};

/**
 * Set the maximum duration
 *
 * @api public
 */

Backoff.prototype.setMax = function(max){
  this.max = max;
};

/**
 * Set the jitter
 *
 * @api public
 */

Backoff.prototype.setJitter = function(jitter){
  this.jitter = jitter;
};


},{}],24:[function(require,module,exports){
/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
(function(){
  "use strict";

  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  // Use a lookup table to find the index.
  var lookup = new Uint8Array(256);
  for (var i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }

  exports.encode = function(arraybuffer) {
    var bytes = new Uint8Array(arraybuffer),
    i, len = bytes.length, base64 = "";

    for (i = 0; i < len; i+=3) {
      base64 += chars[bytes[i] >> 2];
      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
      base64 += chars[bytes[i + 2] & 63];
    }

    if ((len % 3) === 2) {
      base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + "==";
    }

    return base64;
  };

  exports.decode =  function(base64) {
    var bufferLength = base64.length * 0.75,
    len = base64.length, i, p = 0,
    encoded1, encoded2, encoded3, encoded4;

    if (base64[base64.length - 1] === "=") {
      bufferLength--;
      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength),
    bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i+=4) {
      encoded1 = lookup[base64.charCodeAt(i)];
      encoded2 = lookup[base64.charCodeAt(i+1)];
      encoded3 = lookup[base64.charCodeAt(i+2)];
      encoded4 = lookup[base64.charCodeAt(i+3)];

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
  };
})();

},{}],25:[function(require,module,exports){
(function (global){
/**
 * Create a blob builder even when vendor prefixes exist
 */

var BlobBuilder = global.BlobBuilder
  || global.WebKitBlobBuilder
  || global.MSBlobBuilder
  || global.MozBlobBuilder;

/**
 * Check if Blob constructor is supported
 */

var blobSupported = (function() {
  try {
    var a = new Blob(['hi']);
    return a.size === 2;
  } catch(e) {
    return false;
  }
})();

/**
 * Check if Blob constructor supports ArrayBufferViews
 * Fails in Safari 6, so we need to map to ArrayBuffers there.
 */

var blobSupportsArrayBufferView = blobSupported && (function() {
  try {
    var b = new Blob([new Uint8Array([1,2])]);
    return b.size === 2;
  } catch(e) {
    return false;
  }
})();

/**
 * Check if BlobBuilder is supported
 */

var blobBuilderSupported = BlobBuilder
  && BlobBuilder.prototype.append
  && BlobBuilder.prototype.getBlob;

/**
 * Helper function that maps ArrayBufferViews to ArrayBuffers
 * Used by BlobBuilder constructor and old browsers that didn't
 * support it in the Blob constructor.
 */

function mapArrayBufferViews(ary) {
  for (var i = 0; i < ary.length; i++) {
    var chunk = ary[i];
    if (chunk.buffer instanceof ArrayBuffer) {
      var buf = chunk.buffer;

      // if this is a subarray, make a copy so we only
      // include the subarray region from the underlying buffer
      if (chunk.byteLength !== buf.byteLength) {
        var copy = new Uint8Array(chunk.byteLength);
        copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
        buf = copy.buffer;
      }

      ary[i] = buf;
    }
  }
}

function BlobBuilderConstructor(ary, options) {
  options = options || {};

  var bb = new BlobBuilder();
  mapArrayBufferViews(ary);

  for (var i = 0; i < ary.length; i++) {
    bb.append(ary[i]);
  }

  return (options.type) ? bb.getBlob(options.type) : bb.getBlob();
};

function BlobConstructor(ary, options) {
  mapArrayBufferViews(ary);
  return new Blob(ary, options || {});
};

module.exports = (function() {
  if (blobSupported) {
    return blobSupportsArrayBufferView ? global.Blob : BlobConstructor;
  } else if (blobBuilderSupported) {
    return BlobBuilderConstructor;
  } else {
    return undefined;
  }
})();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],26:[function(require,module,exports){

},{}],27:[function(require,module,exports){
/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */

module.exports = function(obj, fn){
  if ('string' == typeof fn) fn = obj[fn];
  if ('function' != typeof fn) throw new Error('bind() requires a function');
  var args = slice.call(arguments, 2);
  return function(){
    return fn.apply(obj, args.concat(slice.call(arguments)));
  }
};

},{}],28:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

if (typeof module !== 'undefined') {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],29:[function(require,module,exports){

module.exports = function(a, b){
  var fn = function(){};
  fn.prototype = b.prototype;
  a.prototype = new fn;
  a.prototype.constructor = a;
};
},{}],30:[function(require,module,exports){
(function (process){
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = require('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}

}).call(this,require('_process'))
},{"./debug":31,"_process":55}],31:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":51}],32:[function(require,module,exports){
(function (process){
/**
  # detect-browser

  This is a package that attempts to detect a browser vendor and version (in
  a semver compatible format) using a navigator useragent in a browser or
  `process.version` in node.

  ## NOTE: Version 2.x release

  Release 2.0 introduces a breaking API change (hence the major release)
  which requires invocation of a `detect` function rather than just inclusion of
  the module.  PR [#46](https://github.com/DamonOehlman/detect-browser/pull/46)
  provides more context as to why this change has been made.

  ## Example Usage

  <<< examples/simple.js

  Or you can use a switch statement:

  <<< examples/switch.js

  ## Adding additional browser support

  The current list of browsers that can be detected by `detect-browser` is
  not exhaustive. If you have a browser that you would like to add support for
  then please submit a pull request with the implementation.

  Creating an acceptable implementation requires two things:

  1. A test demonstrating that the regular expression you have defined identifies
     your new browser correctly.  Examples of this can be found in the 
     `test/logic.js` file.

  2. Write the actual regex to the `lib/detectBrowser.js` file. In most cases adding
     the regex to the list of existing regexes will be suitable (if usage of `detect-brower`
     returns `undefined` for instance), but in some cases you might have to add it before
     an existing regex.  This would be true for a case where you have a browser that
     is a specialised variant of an existing browser but is identified as the
     non-specialised case.

  When writing the regular expression remember that you would write it containing a
  single [capturing group](https://regexone.com/lesson/capturing_groups) which
  captures the version number of the browser.

**/

function detect() {
  var nodeVersion = getNodeVersion();
  if (nodeVersion) {
    return nodeVersion;
  } else if (typeof navigator !== 'undefined') {
    return parseUserAgent(navigator.userAgent);
  }

  return null;
}

function detectOS(userAgentString) {
  var rules = getOperatingSystemRules();
  var detected = rules.filter(function (os) {
    return os.rule && os.rule.test(userAgentString);
  })[0];

  return detected ? detected.name : null;
}

function getNodeVersion() {
  var isNode = typeof navigator === 'undefined' && typeof process !== 'undefined';
  return isNode ? {
    name: 'node',
    version: process.version.slice(1),
    os: require('os').type().toLowerCase()
  } : null;
}

function parseUserAgent(userAgentString) {
  var browsers = getBrowserRules();
  if (!userAgentString) {
    return null;
  }

  var detected = browsers.map(function(browser) {
    var match = browser.rule.exec(userAgentString);
    var version = match && match[1].split(/[._]/).slice(0,3);

    if (version && version.length < 3) {
      version = version.concat(version.length == 1 ? [0, 0] : [0]);
    }

    return match && {
      name: browser.name,
      version: version.join('.')
    };
  }).filter(Boolean)[0] || null;

  if (detected) {
    detected.os = detectOS(userAgentString);
  }

  return detected;
}

function getBrowserRules() {
  return buildRules([
    [ 'edge', /Edge\/([0-9\._]+)/ ],
    [ 'yandexbrowser', /YaBrowser\/([0-9\._]+)/ ],
    [ 'vivaldi', /Vivaldi\/([0-9\.]+)/ ],
    [ 'kakaotalk', /KAKAOTALK\s([0-9\.]+)/ ],
    [ 'chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/ ],
    [ 'phantomjs', /PhantomJS\/([0-9\.]+)(:?\s|$)/ ],
    [ 'crios', /CriOS\/([0-9\.]+)(:?\s|$)/ ],
    [ 'firefox', /Firefox\/([0-9\.]+)(?:\s|$)/ ],
    [ 'fxios', /FxiOS\/([0-9\.]+)/ ],
    [ 'opera', /Opera\/([0-9\.]+)(?:\s|$)/ ],
    [ 'opera', /OPR\/([0-9\.]+)(:?\s|$)$/ ],
    [ 'ie', /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/ ],
    [ 'ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/ ],
    [ 'ie', /MSIE\s(7\.0)/ ],
    [ 'bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/ ],
    [ 'android', /Android\s([0-9\.]+)/ ],
    [ 'ios', /Version\/([0-9\._]+).*Mobile.*Safari.*/ ],
    [ 'safari', /Version\/([0-9\._]+).*Safari/ ]
  ]);
}

function getOperatingSystemRules() {
  return buildRules([
    [ 'iOS', /iP(hone|od|ad)/ ],
    [ 'Android OS', /Android/ ],
    [ 'BlackBerry OS', /BlackBerry|BB10/ ],
    [ 'Windows Mobile', /IEMobile/ ],
    [ 'Amazon OS', /Kindle/ ],
    [ 'Windows 3.11', /Win16/ ],
    [ 'Windows 95', /(Windows 95)|(Win95)|(Windows_95)/ ],
    [ 'Windows 98', /(Windows 98)|(Win98)/ ],
    [ 'Windows 2000', /(Windows NT 5.0)|(Windows 2000)/ ],
    [ 'Windows XP', /(Windows NT 5.1)|(Windows XP)/ ],
    [ 'Windows Server 2003', /(Windows NT 5.2)/ ],
    [ 'Windows Vista', /(Windows NT 6.0)/ ],
    [ 'Windows 7', /(Windows NT 6.1)/ ],
    [ 'Windows 8', /(Windows NT 6.2)/ ],
    [ 'Windows 8.1', /(Windows NT 6.3)/ ],
    [ 'Windows 10', /(Windows NT 10.0)/ ],
    [ 'Windows ME', /Windows ME/ ],
    [ 'Open BSD', /OpenBSD/ ],
    [ 'Sun OS', /SunOS/ ],
    [ 'Linux', /(Linux)|(X11)/ ],
    [ 'Mac OS', /(Mac_PowerPC)|(Macintosh)/ ],
    [ 'QNX', /QNX/ ],
    [ 'BeOS', /BeOS/ ],
    [ 'OS/2', /OS\/2/ ],
    [ 'Search Bot', /(nuhk)|(Googlebot)|(Yammybot)|(Openbot)|(Slurp)|(MSNBot)|(Ask Jeeves\/Teoma)|(ia_archiver)/ ]
  ]);
}

function buildRules(ruleTuples) {
  return ruleTuples.map(function(tuple) {
    return {
      name: tuple[0],
      rule: tuple[1]
    };
  });
}

module.exports = {
  detect: detect,
  detectOS: detectOS,
  getNodeVersion: getNodeVersion,
  parseUserAgent: parseUserAgent
};

}).call(this,require('_process'))
},{"_process":55,"os":52}],33:[function(require,module,exports){

module.exports = require('./socket');

/**
 * Exports parser
 *
 * @api public
 *
 */
module.exports.parser = require('engine.io-parser');

},{"./socket":34,"engine.io-parser":42}],34:[function(require,module,exports){
(function (global){
/**
 * Module dependencies.
 */

var transports = require('./transports/index');
var Emitter = require('component-emitter');
var debug = require('debug')('engine.io-client:socket');
var index = require('indexof');
var parser = require('engine.io-parser');
var parseuri = require('parseuri');
var parseqs = require('parseqs');

/**
 * Module exports.
 */

module.exports = Socket;

/**
 * Socket constructor.
 *
 * @param {String|Object} uri or options
 * @param {Object} options
 * @api public
 */

function Socket (uri, opts) {
  if (!(this instanceof Socket)) return new Socket(uri, opts);

  opts = opts || {};

  if (uri && 'object' === typeof uri) {
    opts = uri;
    uri = null;
  }

  if (uri) {
    uri = parseuri(uri);
    opts.hostname = uri.host;
    opts.secure = uri.protocol === 'https' || uri.protocol === 'wss';
    opts.port = uri.port;
    if (uri.query) opts.query = uri.query;
  } else if (opts.host) {
    opts.hostname = parseuri(opts.host).host;
  }

  this.secure = null != opts.secure ? opts.secure
    : (global.location && 'https:' === location.protocol);

  if (opts.hostname && !opts.port) {
    // if no port is specified manually, use the protocol default
    opts.port = this.secure ? '443' : '80';
  }

  this.agent = opts.agent || false;
  this.hostname = opts.hostname ||
    (global.location ? location.hostname : 'localhost');
  this.port = opts.port || (global.location && location.port
      ? location.port
      : (this.secure ? 443 : 80));
  this.query = opts.query || {};
  if ('string' === typeof this.query) this.query = parseqs.decode(this.query);
  this.upgrade = false !== opts.upgrade;
  this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
  this.forceJSONP = !!opts.forceJSONP;
  this.jsonp = false !== opts.jsonp;
  this.forceBase64 = !!opts.forceBase64;
  this.enablesXDR = !!opts.enablesXDR;
  this.timestampParam = opts.timestampParam || 't';
  this.timestampRequests = opts.timestampRequests;
  this.transports = opts.transports || ['polling', 'websocket'];
  this.transportOptions = opts.transportOptions || {};
  this.readyState = '';
  this.writeBuffer = [];
  this.prevBufferLen = 0;
  this.policyPort = opts.policyPort || 843;
  this.rememberUpgrade = opts.rememberUpgrade || false;
  this.binaryType = null;
  this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
  this.perMessageDeflate = false !== opts.perMessageDeflate ? (opts.perMessageDeflate || {}) : false;

  if (true === this.perMessageDeflate) this.perMessageDeflate = {};
  if (this.perMessageDeflate && null == this.perMessageDeflate.threshold) {
    this.perMessageDeflate.threshold = 1024;
  }

  // SSL options for Node.js client
  this.pfx = opts.pfx || null;
  this.key = opts.key || null;
  this.passphrase = opts.passphrase || null;
  this.cert = opts.cert || null;
  this.ca = opts.ca || null;
  this.ciphers = opts.ciphers || null;
  this.rejectUnauthorized = opts.rejectUnauthorized === undefined ? true : opts.rejectUnauthorized;
  this.forceNode = !!opts.forceNode;

  // other options for Node.js client
  var freeGlobal = typeof global === 'object' && global;
  if (freeGlobal.global === freeGlobal) {
    if (opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0) {
      this.extraHeaders = opts.extraHeaders;
    }

    if (opts.localAddress) {
      this.localAddress = opts.localAddress;
    }
  }

  // set on handshake
  this.id = null;
  this.upgrades = null;
  this.pingInterval = null;
  this.pingTimeout = null;

  // set on heartbeat
  this.pingIntervalTimer = null;
  this.pingTimeoutTimer = null;

  this.open();
}

Socket.priorWebsocketSuccess = false;

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Protocol version.
 *
 * @api public
 */

Socket.protocol = parser.protocol; // this is an int

/**
 * Expose deps for legacy compatibility
 * and standalone browser access.
 */

Socket.Socket = Socket;
Socket.Transport = require('./transport');
Socket.transports = require('./transports/index');
Socket.parser = require('engine.io-parser');

/**
 * Creates transport of the given type.
 *
 * @param {String} transport name
 * @return {Transport}
 * @api private
 */

Socket.prototype.createTransport = function (name) {
  debug('creating transport "%s"', name);
  var query = clone(this.query);

  // append engine.io protocol identifier
  query.EIO = parser.protocol;

  // transport name
  query.transport = name;

  // per-transport options
  var options = this.transportOptions[name] || {};

  // session id if we already have one
  if (this.id) query.sid = this.id;

  var transport = new transports[name]({
    query: query,
    socket: this,
    agent: options.agent || this.agent,
    hostname: options.hostname || this.hostname,
    port: options.port || this.port,
    secure: options.secure || this.secure,
    path: options.path || this.path,
    forceJSONP: options.forceJSONP || this.forceJSONP,
    jsonp: options.jsonp || this.jsonp,
    forceBase64: options.forceBase64 || this.forceBase64,
    enablesXDR: options.enablesXDR || this.enablesXDR,
    timestampRequests: options.timestampRequests || this.timestampRequests,
    timestampParam: options.timestampParam || this.timestampParam,
    policyPort: options.policyPort || this.policyPort,
    pfx: options.pfx || this.pfx,
    key: options.key || this.key,
    passphrase: options.passphrase || this.passphrase,
    cert: options.cert || this.cert,
    ca: options.ca || this.ca,
    ciphers: options.ciphers || this.ciphers,
    rejectUnauthorized: options.rejectUnauthorized || this.rejectUnauthorized,
    perMessageDeflate: options.perMessageDeflate || this.perMessageDeflate,
    extraHeaders: options.extraHeaders || this.extraHeaders,
    forceNode: options.forceNode || this.forceNode,
    localAddress: options.localAddress || this.localAddress,
    requestTimeout: options.requestTimeout || this.requestTimeout,
    protocols: options.protocols || void (0)
  });

  return transport;
};

function clone (obj) {
  var o = {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = obj[i];
    }
  }
  return o;
}

/**
 * Initializes transport to use and starts probe.
 *
 * @api private
 */
Socket.prototype.open = function () {
  var transport;
  if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') !== -1) {
    transport = 'websocket';
  } else if (0 === this.transports.length) {
    // Emit error on next tick so it can be listened to
    var self = this;
    setTimeout(function () {
      self.emit('error', 'No transports available');
    }, 0);
    return;
  } else {
    transport = this.transports[0];
  }
  this.readyState = 'opening';

  // Retry with the next transport if the transport is disabled (jsonp: false)
  try {
    transport = this.createTransport(transport);
  } catch (e) {
    this.transports.shift();
    this.open();
    return;
  }

  transport.open();
  this.setTransport(transport);
};

/**
 * Sets the current transport. Disables the existing one (if any).
 *
 * @api private
 */

Socket.prototype.setTransport = function (transport) {
  debug('setting transport %s', transport.name);
  var self = this;

  if (this.transport) {
    debug('clearing existing transport %s', this.transport.name);
    this.transport.removeAllListeners();
  }

  // set up transport
  this.transport = transport;

  // set up transport listeners
  transport
  .on('drain', function () {
    self.onDrain();
  })
  .on('packet', function (packet) {
    self.onPacket(packet);
  })
  .on('error', function (e) {
    self.onError(e);
  })
  .on('close', function () {
    self.onClose('transport close');
  });
};

/**
 * Probes a transport.
 *
 * @param {String} transport name
 * @api private
 */

Socket.prototype.probe = function (name) {
  debug('probing transport "%s"', name);
  var transport = this.createTransport(name, { probe: 1 });
  var failed = false;
  var self = this;

  Socket.priorWebsocketSuccess = false;

  function onTransportOpen () {
    if (self.onlyBinaryUpgrades) {
      var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
      failed = failed || upgradeLosesBinary;
    }
    if (failed) return;

    debug('probe transport "%s" opened', name);
    transport.send([{ type: 'ping', data: 'probe' }]);
    transport.once('packet', function (msg) {
      if (failed) return;
      if ('pong' === msg.type && 'probe' === msg.data) {
        debug('probe transport "%s" pong', name);
        self.upgrading = true;
        self.emit('upgrading', transport);
        if (!transport) return;
        Socket.priorWebsocketSuccess = 'websocket' === transport.name;

        debug('pausing current transport "%s"', self.transport.name);
        self.transport.pause(function () {
          if (failed) return;
          if ('closed' === self.readyState) return;
          debug('changing transport and sending upgrade packet');

          cleanup();

          self.setTransport(transport);
          transport.send([{ type: 'upgrade' }]);
          self.emit('upgrade', transport);
          transport = null;
          self.upgrading = false;
          self.flush();
        });
      } else {
        debug('probe transport "%s" failed', name);
        var err = new Error('probe error');
        err.transport = transport.name;
        self.emit('upgradeError', err);
      }
    });
  }

  function freezeTransport () {
    if (failed) return;

    // Any callback called by transport should be ignored since now
    failed = true;

    cleanup();

    transport.close();
    transport = null;
  }

  // Handle any error that happens while probing
  function onerror (err) {
    var error = new Error('probe error: ' + err);
    error.transport = transport.name;

    freezeTransport();

    debug('probe transport "%s" failed because of error: %s', name, err);

    self.emit('upgradeError', error);
  }

  function onTransportClose () {
    onerror('transport closed');
  }

  // When the socket is closed while we're probing
  function onclose () {
    onerror('socket closed');
  }

  // When the socket is upgraded while we're probing
  function onupgrade (to) {
    if (transport && to.name !== transport.name) {
      debug('"%s" works - aborting "%s"', to.name, transport.name);
      freezeTransport();
    }
  }

  // Remove all listeners on the transport and on self
  function cleanup () {
    transport.removeListener('open', onTransportOpen);
    transport.removeListener('error', onerror);
    transport.removeListener('close', onTransportClose);
    self.removeListener('close', onclose);
    self.removeListener('upgrading', onupgrade);
  }

  transport.once('open', onTransportOpen);
  transport.once('error', onerror);
  transport.once('close', onTransportClose);

  this.once('close', onclose);
  this.once('upgrading', onupgrade);

  transport.open();
};

/**
 * Called when connection is deemed open.
 *
 * @api public
 */

Socket.prototype.onOpen = function () {
  debug('socket open');
  this.readyState = 'open';
  Socket.priorWebsocketSuccess = 'websocket' === this.transport.name;
  this.emit('open');
  this.flush();

  // we check for `readyState` in case an `open`
  // listener already closed the socket
  if ('open' === this.readyState && this.upgrade && this.transport.pause) {
    debug('starting upgrade probes');
    for (var i = 0, l = this.upgrades.length; i < l; i++) {
      this.probe(this.upgrades[i]);
    }
  }
};

/**
 * Handles a packet.
 *
 * @api private
 */

Socket.prototype.onPacket = function (packet) {
  if ('opening' === this.readyState || 'open' === this.readyState ||
      'closing' === this.readyState) {
    debug('socket receive: type "%s", data "%s"', packet.type, packet.data);

    this.emit('packet', packet);

    // Socket is live - any packet counts
    this.emit('heartbeat');

    switch (packet.type) {
      case 'open':
        this.onHandshake(JSON.parse(packet.data));
        break;

      case 'pong':
        this.setPing();
        this.emit('pong');
        break;

      case 'error':
        var err = new Error('server error');
        err.code = packet.data;
        this.onError(err);
        break;

      case 'message':
        this.emit('data', packet.data);
        this.emit('message', packet.data);
        break;
    }
  } else {
    debug('packet received with socket readyState "%s"', this.readyState);
  }
};

/**
 * Called upon handshake completion.
 *
 * @param {Object} handshake obj
 * @api private
 */

Socket.prototype.onHandshake = function (data) {
  this.emit('handshake', data);
  this.id = data.sid;
  this.transport.query.sid = data.sid;
  this.upgrades = this.filterUpgrades(data.upgrades);
  this.pingInterval = data.pingInterval;
  this.pingTimeout = data.pingTimeout;
  this.onOpen();
  // In case open handler closes socket
  if ('closed' === this.readyState) return;
  this.setPing();

  // Prolong liveness of socket on heartbeat
  this.removeListener('heartbeat', this.onHeartbeat);
  this.on('heartbeat', this.onHeartbeat);
};

/**
 * Resets ping timeout.
 *
 * @api private
 */

Socket.prototype.onHeartbeat = function (timeout) {
  clearTimeout(this.pingTimeoutTimer);
  var self = this;
  self.pingTimeoutTimer = setTimeout(function () {
    if ('closed' === self.readyState) return;
    self.onClose('ping timeout');
  }, timeout || (self.pingInterval + self.pingTimeout));
};

/**
 * Pings server every `this.pingInterval` and expects response
 * within `this.pingTimeout` or closes connection.
 *
 * @api private
 */

Socket.prototype.setPing = function () {
  var self = this;
  clearTimeout(self.pingIntervalTimer);
  self.pingIntervalTimer = setTimeout(function () {
    debug('writing ping packet - expecting pong within %sms', self.pingTimeout);
    self.ping();
    self.onHeartbeat(self.pingTimeout);
  }, self.pingInterval);
};

/**
* Sends a ping packet.
*
* @api private
*/

Socket.prototype.ping = function () {
  var self = this;
  this.sendPacket('ping', function () {
    self.emit('ping');
  });
};

/**
 * Called on `drain` event
 *
 * @api private
 */

Socket.prototype.onDrain = function () {
  this.writeBuffer.splice(0, this.prevBufferLen);

  // setting prevBufferLen = 0 is very important
  // for example, when upgrading, upgrade packet is sent over,
  // and a nonzero prevBufferLen could cause problems on `drain`
  this.prevBufferLen = 0;

  if (0 === this.writeBuffer.length) {
    this.emit('drain');
  } else {
    this.flush();
  }
};

/**
 * Flush write buffers.
 *
 * @api private
 */

Socket.prototype.flush = function () {
  if ('closed' !== this.readyState && this.transport.writable &&
    !this.upgrading && this.writeBuffer.length) {
    debug('flushing %d packets in socket', this.writeBuffer.length);
    this.transport.send(this.writeBuffer);
    // keep track of current length of writeBuffer
    // splice writeBuffer and callbackBuffer on `drain`
    this.prevBufferLen = this.writeBuffer.length;
    this.emit('flush');
  }
};

/**
 * Sends a message.
 *
 * @param {String} message.
 * @param {Function} callback function.
 * @param {Object} options.
 * @return {Socket} for chaining.
 * @api public
 */

Socket.prototype.write =
Socket.prototype.send = function (msg, options, fn) {
  this.sendPacket('message', msg, options, fn);
  return this;
};

/**
 * Sends a packet.
 *
 * @param {String} packet type.
 * @param {String} data.
 * @param {Object} options.
 * @param {Function} callback function.
 * @api private
 */

Socket.prototype.sendPacket = function (type, data, options, fn) {
  if ('function' === typeof data) {
    fn = data;
    data = undefined;
  }

  if ('function' === typeof options) {
    fn = options;
    options = null;
  }

  if ('closing' === this.readyState || 'closed' === this.readyState) {
    return;
  }

  options = options || {};
  options.compress = false !== options.compress;

  var packet = {
    type: type,
    data: data,
    options: options
  };
  this.emit('packetCreate', packet);
  this.writeBuffer.push(packet);
  if (fn) this.once('flush', fn);
  this.flush();
};

/**
 * Closes the connection.
 *
 * @api private
 */

Socket.prototype.close = function () {
  if ('opening' === this.readyState || 'open' === this.readyState) {
    this.readyState = 'closing';

    var self = this;

    if (this.writeBuffer.length) {
      this.once('drain', function () {
        if (this.upgrading) {
          waitForUpgrade();
        } else {
          close();
        }
      });
    } else if (this.upgrading) {
      waitForUpgrade();
    } else {
      close();
    }
  }

  function close () {
    self.onClose('forced close');
    debug('socket closing - telling transport to close');
    self.transport.close();
  }

  function cleanupAndClose () {
    self.removeListener('upgrade', cleanupAndClose);
    self.removeListener('upgradeError', cleanupAndClose);
    close();
  }

  function waitForUpgrade () {
    // wait for upgrade to finish since we can't send packets while pausing a transport
    self.once('upgrade', cleanupAndClose);
    self.once('upgradeError', cleanupAndClose);
  }

  return this;
};

/**
 * Called upon transport error
 *
 * @api private
 */

Socket.prototype.onError = function (err) {
  debug('socket error %j', err);
  Socket.priorWebsocketSuccess = false;
  this.emit('error', err);
  this.onClose('transport error', err);
};

/**
 * Called upon transport close.
 *
 * @api private
 */

Socket.prototype.onClose = function (reason, desc) {
  if ('opening' === this.readyState || 'open' === this.readyState || 'closing' === this.readyState) {
    debug('socket close with reason: "%s"', reason);
    var self = this;

    // clear timers
    clearTimeout(this.pingIntervalTimer);
    clearTimeout(this.pingTimeoutTimer);

    // stop event from firing again for transport
    this.transport.removeAllListeners('close');

    // ensure transport won't stay open
    this.transport.close();

    // ignore further transport communication
    this.transport.removeAllListeners();

    // set ready state
    this.readyState = 'closed';

    // clear session id
    this.id = null;

    // emit close event
    this.emit('close', reason, desc);

    // clean buffers after, so users can still
    // grab the buffers on `close` event
    self.writeBuffer = [];
    self.prevBufferLen = 0;
  }
};

/**
 * Filters upgrades, returning only those matching client transports.
 *
 * @param {Array} server upgrades
 * @api private
 *
 */

Socket.prototype.filterUpgrades = function (upgrades) {
  var filteredUpgrades = [];
  for (var i = 0, j = upgrades.length; i < j; i++) {
    if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
  }
  return filteredUpgrades;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./transport":35,"./transports/index":36,"component-emitter":28,"debug":30,"engine.io-parser":42,"indexof":48,"parseqs":53,"parseuri":54}],35:[function(require,module,exports){
/**
 * Module dependencies.
 */

var parser = require('engine.io-parser');
var Emitter = require('component-emitter');

/**
 * Module exports.
 */

module.exports = Transport;

/**
 * Transport abstract constructor.
 *
 * @param {Object} options.
 * @api private
 */

function Transport (opts) {
  this.path = opts.path;
  this.hostname = opts.hostname;
  this.port = opts.port;
  this.secure = opts.secure;
  this.query = opts.query;
  this.timestampParam = opts.timestampParam;
  this.timestampRequests = opts.timestampRequests;
  this.readyState = '';
  this.agent = opts.agent || false;
  this.socket = opts.socket;
  this.enablesXDR = opts.enablesXDR;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;
  this.forceNode = opts.forceNode;

  // other options for Node.js client
  this.extraHeaders = opts.extraHeaders;
  this.localAddress = opts.localAddress;
}

/**
 * Mix in `Emitter`.
 */

Emitter(Transport.prototype);

/**
 * Emits an error.
 *
 * @param {String} str
 * @return {Transport} for chaining
 * @api public
 */

Transport.prototype.onError = function (msg, desc) {
  var err = new Error(msg);
  err.type = 'TransportError';
  err.description = desc;
  this.emit('error', err);
  return this;
};

/**
 * Opens the transport.
 *
 * @api public
 */

Transport.prototype.open = function () {
  if ('closed' === this.readyState || '' === this.readyState) {
    this.readyState = 'opening';
    this.doOpen();
  }

  return this;
};

/**
 * Closes the transport.
 *
 * @api private
 */

Transport.prototype.close = function () {
  if ('opening' === this.readyState || 'open' === this.readyState) {
    this.doClose();
    this.onClose();
  }

  return this;
};

/**
 * Sends multiple packets.
 *
 * @param {Array} packets
 * @api private
 */

Transport.prototype.send = function (packets) {
  if ('open' === this.readyState) {
    this.write(packets);
  } else {
    throw new Error('Transport not open');
  }
};

/**
 * Called upon open
 *
 * @api private
 */

Transport.prototype.onOpen = function () {
  this.readyState = 'open';
  this.writable = true;
  this.emit('open');
};

/**
 * Called with data.
 *
 * @param {String} data
 * @api private
 */

Transport.prototype.onData = function (data) {
  var packet = parser.decodePacket(data, this.socket.binaryType);
  this.onPacket(packet);
};

/**
 * Called with a decoded packet.
 */

Transport.prototype.onPacket = function (packet) {
  this.emit('packet', packet);
};

/**
 * Called upon close.
 *
 * @api private
 */

Transport.prototype.onClose = function () {
  this.readyState = 'closed';
  this.emit('close');
};

},{"component-emitter":28,"engine.io-parser":42}],36:[function(require,module,exports){
(function (global){
/**
 * Module dependencies
 */

var XMLHttpRequest = require('xmlhttprequest-ssl');
var XHR = require('./polling-xhr');
var JSONP = require('./polling-jsonp');
var websocket = require('./websocket');

/**
 * Export transports.
 */

exports.polling = polling;
exports.websocket = websocket;

/**
 * Polling transport polymorphic constructor.
 * Decides on xhr vs jsonp based on feature detection.
 *
 * @api private
 */

function polling (opts) {
  var xhr;
  var xd = false;
  var xs = false;
  var jsonp = false !== opts.jsonp;

  if (global.location) {
    var isSSL = 'https:' === location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    xd = opts.hostname !== location.hostname || port !== opts.port;
    xs = opts.secure !== isSSL;
  }

  opts.xdomain = xd;
  opts.xscheme = xs;
  xhr = new XMLHttpRequest(opts);

  if ('open' in xhr && !opts.forceJSONP) {
    return new XHR(opts);
  } else {
    if (!jsonp) throw new Error('JSONP disabled');
    return new JSONP(opts);
  }
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./polling-jsonp":37,"./polling-xhr":38,"./websocket":40,"xmlhttprequest-ssl":41}],37:[function(require,module,exports){
(function (global){

/**
 * Module requirements.
 */

var Polling = require('./polling');
var inherit = require('component-inherit');

/**
 * Module exports.
 */

module.exports = JSONPPolling;

/**
 * Cached regular expressions.
 */

var rNewline = /\n/g;
var rEscapedNewline = /\\n/g;

/**
 * Global JSONP callbacks.
 */

var callbacks;

/**
 * Noop.
 */

function empty () { }

/**
 * JSONP Polling constructor.
 *
 * @param {Object} opts.
 * @api public
 */

function JSONPPolling (opts) {
  Polling.call(this, opts);

  this.query = this.query || {};

  // define global callbacks array if not present
  // we do this here (lazily) to avoid unneeded global pollution
  if (!callbacks) {
    // we need to consider multiple engines in the same page
    if (!global.___eio) global.___eio = [];
    callbacks = global.___eio;
  }

  // callback identifier
  this.index = callbacks.length;

  // add callback to jsonp global
  var self = this;
  callbacks.push(function (msg) {
    self.onData(msg);
  });

  // append to query string
  this.query.j = this.index;

  // prevent spurious errors from being emitted when the window is unloaded
  if (global.document && global.addEventListener) {
    global.addEventListener('beforeunload', function () {
      if (self.script) self.script.onerror = empty;
    }, false);
  }
}

/**
 * Inherits from Polling.
 */

inherit(JSONPPolling, Polling);

/*
 * JSONP only supports binary as base64 encoded strings
 */

JSONPPolling.prototype.supportsBinary = false;

/**
 * Closes the socket.
 *
 * @api private
 */

JSONPPolling.prototype.doClose = function () {
  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  if (this.form) {
    this.form.parentNode.removeChild(this.form);
    this.form = null;
    this.iframe = null;
  }

  Polling.prototype.doClose.call(this);
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

JSONPPolling.prototype.doPoll = function () {
  var self = this;
  var script = document.createElement('script');

  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  script.async = true;
  script.src = this.uri();
  script.onerror = function (e) {
    self.onError('jsonp poll error', e);
  };

  var insertAt = document.getElementsByTagName('script')[0];
  if (insertAt) {
    insertAt.parentNode.insertBefore(script, insertAt);
  } else {
    (document.head || document.body).appendChild(script);
  }
  this.script = script;

  var isUAgecko = 'undefined' !== typeof navigator && /gecko/i.test(navigator.userAgent);

  if (isUAgecko) {
    setTimeout(function () {
      var iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      document.body.removeChild(iframe);
    }, 100);
  }
};

/**
 * Writes with a hidden iframe.
 *
 * @param {String} data to send
 * @param {Function} called upon flush.
 * @api private
 */

JSONPPolling.prototype.doWrite = function (data, fn) {
  var self = this;

  if (!this.form) {
    var form = document.createElement('form');
    var area = document.createElement('textarea');
    var id = this.iframeId = 'eio_iframe_' + this.index;
    var iframe;

    form.className = 'socketio';
    form.style.position = 'absolute';
    form.style.top = '-1000px';
    form.style.left = '-1000px';
    form.target = id;
    form.method = 'POST';
    form.setAttribute('accept-charset', 'utf-8');
    area.name = 'd';
    form.appendChild(area);
    document.body.appendChild(form);

    this.form = form;
    this.area = area;
  }

  this.form.action = this.uri();

  function complete () {
    initIframe();
    fn();
  }

  function initIframe () {
    if (self.iframe) {
      try {
        self.form.removeChild(self.iframe);
      } catch (e) {
        self.onError('jsonp polling iframe removal error', e);
      }
    }

    try {
      // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
      var html = '<iframe src="javascript:0" name="' + self.iframeId + '">';
      iframe = document.createElement(html);
    } catch (e) {
      iframe = document.createElement('iframe');
      iframe.name = self.iframeId;
      iframe.src = 'javascript:0';
    }

    iframe.id = self.iframeId;

    self.form.appendChild(iframe);
    self.iframe = iframe;
  }

  initIframe();

  // escape \n to prevent it from being converted into \r\n by some UAs
  // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
  data = data.replace(rEscapedNewline, '\\\n');
  this.area.value = data.replace(rNewline, '\\n');

  try {
    this.form.submit();
  } catch (e) {}

  if (this.iframe.attachEvent) {
    this.iframe.onreadystatechange = function () {
      if (self.iframe.readyState === 'complete') {
        complete();
      }
    };
  } else {
    this.iframe.onload = complete;
  }
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./polling":39,"component-inherit":29}],38:[function(require,module,exports){
(function (global){
/**
 * Module requirements.
 */

var XMLHttpRequest = require('xmlhttprequest-ssl');
var Polling = require('./polling');
var Emitter = require('component-emitter');
var inherit = require('component-inherit');
var debug = require('debug')('engine.io-client:polling-xhr');

/**
 * Module exports.
 */

module.exports = XHR;
module.exports.Request = Request;

/**
 * Empty function
 */

function empty () {}

/**
 * XHR Polling constructor.
 *
 * @param {Object} opts
 * @api public
 */

function XHR (opts) {
  Polling.call(this, opts);
  this.requestTimeout = opts.requestTimeout;
  this.extraHeaders = opts.extraHeaders;

  if (global.location) {
    var isSSL = 'https:' === location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    this.xd = opts.hostname !== global.location.hostname ||
      port !== opts.port;
    this.xs = opts.secure !== isSSL;
  }
}

/**
 * Inherits from Polling.
 */

inherit(XHR, Polling);

/**
 * XHR supports binary
 */

XHR.prototype.supportsBinary = true;

/**
 * Creates a request.
 *
 * @param {String} method
 * @api private
 */

XHR.prototype.request = function (opts) {
  opts = opts || {};
  opts.uri = this.uri();
  opts.xd = this.xd;
  opts.xs = this.xs;
  opts.agent = this.agent || false;
  opts.supportsBinary = this.supportsBinary;
  opts.enablesXDR = this.enablesXDR;

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;
  opts.requestTimeout = this.requestTimeout;

  // other options for Node.js client
  opts.extraHeaders = this.extraHeaders;

  return new Request(opts);
};

/**
 * Sends data.
 *
 * @param {String} data to send.
 * @param {Function} called upon flush.
 * @api private
 */

XHR.prototype.doWrite = function (data, fn) {
  var isBinary = typeof data !== 'string' && data !== undefined;
  var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
  var self = this;
  req.on('success', fn);
  req.on('error', function (err) {
    self.onError('xhr post error', err);
  });
  this.sendXhr = req;
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

XHR.prototype.doPoll = function () {
  debug('xhr poll');
  var req = this.request();
  var self = this;
  req.on('data', function (data) {
    self.onData(data);
  });
  req.on('error', function (err) {
    self.onError('xhr poll error', err);
  });
  this.pollXhr = req;
};

/**
 * Request constructor
 *
 * @param {Object} options
 * @api public
 */

function Request (opts) {
  this.method = opts.method || 'GET';
  this.uri = opts.uri;
  this.xd = !!opts.xd;
  this.xs = !!opts.xs;
  this.async = false !== opts.async;
  this.data = undefined !== opts.data ? opts.data : null;
  this.agent = opts.agent;
  this.isBinary = opts.isBinary;
  this.supportsBinary = opts.supportsBinary;
  this.enablesXDR = opts.enablesXDR;
  this.requestTimeout = opts.requestTimeout;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;

  // other options for Node.js client
  this.extraHeaders = opts.extraHeaders;

  this.create();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Creates the XHR object and sends the request.
 *
 * @api private
 */

Request.prototype.create = function () {
  var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;

  var xhr = this.xhr = new XMLHttpRequest(opts);
  var self = this;

  try {
    debug('xhr open %s: %s', this.method, this.uri);
    xhr.open(this.method, this.uri, this.async);
    try {
      if (this.extraHeaders) {
        xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
        for (var i in this.extraHeaders) {
          if (this.extraHeaders.hasOwnProperty(i)) {
            xhr.setRequestHeader(i, this.extraHeaders[i]);
          }
        }
      }
    } catch (e) {}

    if ('POST' === this.method) {
      try {
        if (this.isBinary) {
          xhr.setRequestHeader('Content-type', 'application/octet-stream');
        } else {
          xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
        }
      } catch (e) {}
    }

    try {
      xhr.setRequestHeader('Accept', '*/*');
    } catch (e) {}

    // ie6 check
    if ('withCredentials' in xhr) {
      xhr.withCredentials = true;
    }

    if (this.requestTimeout) {
      xhr.timeout = this.requestTimeout;
    }

    if (this.hasXDR()) {
      xhr.onload = function () {
        self.onLoad();
      };
      xhr.onerror = function () {
        self.onError(xhr.responseText);
      };
    } else {
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 2) {
          var contentType;
          try {
            contentType = xhr.getResponseHeader('Content-Type');
          } catch (e) {}
          if (contentType === 'application/octet-stream') {
            xhr.responseType = 'arraybuffer';
          }
        }
        if (4 !== xhr.readyState) return;
        if (200 === xhr.status || 1223 === xhr.status) {
          self.onLoad();
        } else {
          // make sure the `error` event handler that's user-set
          // does not throw in the same tick and gets caught here
          setTimeout(function () {
            self.onError(xhr.status);
          }, 0);
        }
      };
    }

    debug('xhr data %s', this.data);
    xhr.send(this.data);
  } catch (e) {
    // Need to defer since .create() is called directly fhrom the constructor
    // and thus the 'error' event can only be only bound *after* this exception
    // occurs.  Therefore, also, we cannot throw here at all.
    setTimeout(function () {
      self.onError(e);
    }, 0);
    return;
  }

  if (global.document) {
    this.index = Request.requestsCount++;
    Request.requests[this.index] = this;
  }
};

/**
 * Called upon successful response.
 *
 * @api private
 */

Request.prototype.onSuccess = function () {
  this.emit('success');
  this.cleanup();
};

/**
 * Called if we have data.
 *
 * @api private
 */

Request.prototype.onData = function (data) {
  this.emit('data', data);
  this.onSuccess();
};

/**
 * Called upon error.
 *
 * @api private
 */

Request.prototype.onError = function (err) {
  this.emit('error', err);
  this.cleanup(true);
};

/**
 * Cleans up house.
 *
 * @api private
 */

Request.prototype.cleanup = function (fromError) {
  if ('undefined' === typeof this.xhr || null === this.xhr) {
    return;
  }
  // xmlhttprequest
  if (this.hasXDR()) {
    this.xhr.onload = this.xhr.onerror = empty;
  } else {
    this.xhr.onreadystatechange = empty;
  }

  if (fromError) {
    try {
      this.xhr.abort();
    } catch (e) {}
  }

  if (global.document) {
    delete Request.requests[this.index];
  }

  this.xhr = null;
};

/**
 * Called upon load.
 *
 * @api private
 */

Request.prototype.onLoad = function () {
  var data;
  try {
    var contentType;
    try {
      contentType = this.xhr.getResponseHeader('Content-Type');
    } catch (e) {}
    if (contentType === 'application/octet-stream') {
      data = this.xhr.response || this.xhr.responseText;
    } else {
      data = this.xhr.responseText;
    }
  } catch (e) {
    this.onError(e);
  }
  if (null != data) {
    this.onData(data);
  }
};

/**
 * Check if it has XDomainRequest.
 *
 * @api private
 */

Request.prototype.hasXDR = function () {
  return 'undefined' !== typeof global.XDomainRequest && !this.xs && this.enablesXDR;
};

/**
 * Aborts the request.
 *
 * @api public
 */

Request.prototype.abort = function () {
  this.cleanup();
};

/**
 * Aborts pending requests when unloading the window. This is needed to prevent
 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
 * emitted.
 */

Request.requestsCount = 0;
Request.requests = {};

if (global.document) {
  if (global.attachEvent) {
    global.attachEvent('onunload', unloadHandler);
  } else if (global.addEventListener) {
    global.addEventListener('beforeunload', unloadHandler, false);
  }
}

function unloadHandler () {
  for (var i in Request.requests) {
    if (Request.requests.hasOwnProperty(i)) {
      Request.requests[i].abort();
    }
  }
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./polling":39,"component-emitter":28,"component-inherit":29,"debug":30,"xmlhttprequest-ssl":41}],39:[function(require,module,exports){
/**
 * Module dependencies.
 */

var Transport = require('../transport');
var parseqs = require('parseqs');
var parser = require('engine.io-parser');
var inherit = require('component-inherit');
var yeast = require('yeast');
var debug = require('debug')('engine.io-client:polling');

/**
 * Module exports.
 */

module.exports = Polling;

/**
 * Is XHR2 supported?
 */

var hasXHR2 = (function () {
  var XMLHttpRequest = require('xmlhttprequest-ssl');
  var xhr = new XMLHttpRequest({ xdomain: false });
  return null != xhr.responseType;
})();

/**
 * Polling interface.
 *
 * @param {Object} opts
 * @api private
 */

function Polling (opts) {
  var forceBase64 = (opts && opts.forceBase64);
  if (!hasXHR2 || forceBase64) {
    this.supportsBinary = false;
  }
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(Polling, Transport);

/**
 * Transport name.
 */

Polling.prototype.name = 'polling';

/**
 * Opens the socket (triggers polling). We write a PING message to determine
 * when the transport is open.
 *
 * @api private
 */

Polling.prototype.doOpen = function () {
  this.poll();
};

/**
 * Pauses polling.
 *
 * @param {Function} callback upon buffers are flushed and transport is paused
 * @api private
 */

Polling.prototype.pause = function (onPause) {
  var self = this;

  this.readyState = 'pausing';

  function pause () {
    debug('paused');
    self.readyState = 'paused';
    onPause();
  }

  if (this.polling || !this.writable) {
    var total = 0;

    if (this.polling) {
      debug('we are currently polling - waiting to pause');
      total++;
      this.once('pollComplete', function () {
        debug('pre-pause polling complete');
        --total || pause();
      });
    }

    if (!this.writable) {
      debug('we are currently writing - waiting to pause');
      total++;
      this.once('drain', function () {
        debug('pre-pause writing complete');
        --total || pause();
      });
    }
  } else {
    pause();
  }
};

/**
 * Starts polling cycle.
 *
 * @api public
 */

Polling.prototype.poll = function () {
  debug('polling');
  this.polling = true;
  this.doPoll();
  this.emit('poll');
};

/**
 * Overloads onData to detect payloads.
 *
 * @api private
 */

Polling.prototype.onData = function (data) {
  var self = this;
  debug('polling got data %s', data);
  var callback = function (packet, index, total) {
    // if its the first message we consider the transport open
    if ('opening' === self.readyState) {
      self.onOpen();
    }

    // if its a close packet, we close the ongoing requests
    if ('close' === packet.type) {
      self.onClose();
      return false;
    }

    // otherwise bypass onData and handle the message
    self.onPacket(packet);
  };

  // decode payload
  parser.decodePayload(data, this.socket.binaryType, callback);

  // if an event did not trigger closing
  if ('closed' !== this.readyState) {
    // if we got data we're not polling
    this.polling = false;
    this.emit('pollComplete');

    if ('open' === this.readyState) {
      this.poll();
    } else {
      debug('ignoring poll - transport state "%s"', this.readyState);
    }
  }
};

/**
 * For polling, send a close packet.
 *
 * @api private
 */

Polling.prototype.doClose = function () {
  var self = this;

  function close () {
    debug('writing close packet');
    self.write([{ type: 'close' }]);
  }

  if ('open' === this.readyState) {
    debug('transport open - closing');
    close();
  } else {
    // in case we're trying to close while
    // handshaking is in progress (GH-164)
    debug('transport not open - deferring close');
    this.once('open', close);
  }
};

/**
 * Writes a packets payload.
 *
 * @param {Array} data packets
 * @param {Function} drain callback
 * @api private
 */

Polling.prototype.write = function (packets) {
  var self = this;
  this.writable = false;
  var callbackfn = function () {
    self.writable = true;
    self.emit('drain');
  };

  parser.encodePayload(packets, this.supportsBinary, function (data) {
    self.doWrite(data, callbackfn);
  });
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

Polling.prototype.uri = function () {
  var query = this.query || {};
  var schema = this.secure ? 'https' : 'http';
  var port = '';

  // cache busting is forced
  if (false !== this.timestampRequests) {
    query[this.timestampParam] = yeast();
  }

  if (!this.supportsBinary && !query.sid) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // avoid port if default for schema
  if (this.port && (('https' === schema && Number(this.port) !== 443) ||
     ('http' === schema && Number(this.port) !== 80))) {
    port = ':' + this.port;
  }

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  var ipv6 = this.hostname.indexOf(':') !== -1;
  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
};

},{"../transport":35,"component-inherit":29,"debug":30,"engine.io-parser":42,"parseqs":53,"xmlhttprequest-ssl":41,"yeast":85}],40:[function(require,module,exports){
(function (global){
/**
 * Module dependencies.
 */

var Transport = require('../transport');
var parser = require('engine.io-parser');
var parseqs = require('parseqs');
var inherit = require('component-inherit');
var yeast = require('yeast');
var debug = require('debug')('engine.io-client:websocket');
var BrowserWebSocket = global.WebSocket || global.MozWebSocket;
var NodeWebSocket;
if (typeof window === 'undefined') {
  try {
    NodeWebSocket = require('ws');
  } catch (e) { }
}

/**
 * Get either the `WebSocket` or `MozWebSocket` globals
 * in the browser or try to resolve WebSocket-compatible
 * interface exposed by `ws` for Node-like environment.
 */

var WebSocket = BrowserWebSocket;
if (!WebSocket && typeof window === 'undefined') {
  WebSocket = NodeWebSocket;
}

/**
 * Module exports.
 */

module.exports = WS;

/**
 * WebSocket transport constructor.
 *
 * @api {Object} connection options
 * @api public
 */

function WS (opts) {
  var forceBase64 = (opts && opts.forceBase64);
  if (forceBase64) {
    this.supportsBinary = false;
  }
  this.perMessageDeflate = opts.perMessageDeflate;
  this.usingBrowserWebSocket = BrowserWebSocket && !opts.forceNode;
  this.protocols = opts.protocols;
  if (!this.usingBrowserWebSocket) {
    WebSocket = NodeWebSocket;
  }
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(WS, Transport);

/**
 * Transport name.
 *
 * @api public
 */

WS.prototype.name = 'websocket';

/*
 * WebSockets support binary
 */

WS.prototype.supportsBinary = true;

/**
 * Opens socket.
 *
 * @api private
 */

WS.prototype.doOpen = function () {
  if (!this.check()) {
    // let probe timeout
    return;
  }

  var uri = this.uri();
  var protocols = this.protocols;
  var opts = {
    agent: this.agent,
    perMessageDeflate: this.perMessageDeflate
  };

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;
  if (this.extraHeaders) {
    opts.headers = this.extraHeaders;
  }
  if (this.localAddress) {
    opts.localAddress = this.localAddress;
  }

  try {
    this.ws = this.usingBrowserWebSocket ? (protocols ? new WebSocket(uri, protocols) : new WebSocket(uri)) : new WebSocket(uri, protocols, opts);
  } catch (err) {
    return this.emit('error', err);
  }

  if (this.ws.binaryType === undefined) {
    this.supportsBinary = false;
  }

  if (this.ws.supports && this.ws.supports.binary) {
    this.supportsBinary = true;
    this.ws.binaryType = 'nodebuffer';
  } else {
    this.ws.binaryType = 'arraybuffer';
  }

  this.addEventListeners();
};

/**
 * Adds event listeners to the socket
 *
 * @api private
 */

WS.prototype.addEventListeners = function () {
  var self = this;

  this.ws.onopen = function () {
    self.onOpen();
  };
  this.ws.onclose = function () {
    self.onClose();
  };
  this.ws.onmessage = function (ev) {
    self.onData(ev.data);
  };
  this.ws.onerror = function (e) {
    self.onError('websocket error', e);
  };
};

/**
 * Writes data to socket.
 *
 * @param {Array} array of packets.
 * @api private
 */

WS.prototype.write = function (packets) {
  var self = this;
  this.writable = false;

  // encodePacket efficient as it uses WS framing
  // no need for encodePayload
  var total = packets.length;
  for (var i = 0, l = total; i < l; i++) {
    (function (packet) {
      parser.encodePacket(packet, self.supportsBinary, function (data) {
        if (!self.usingBrowserWebSocket) {
          // always create a new object (GH-437)
          var opts = {};
          if (packet.options) {
            opts.compress = packet.options.compress;
          }

          if (self.perMessageDeflate) {
            var len = 'string' === typeof data ? global.Buffer.byteLength(data) : data.length;
            if (len < self.perMessageDeflate.threshold) {
              opts.compress = false;
            }
          }
        }

        // Sometimes the websocket has already been closed but the browser didn't
        // have a chance of informing us about it yet, in that case send will
        // throw an error
        try {
          if (self.usingBrowserWebSocket) {
            // TypeError is thrown when passing the second argument on Safari
            self.ws.send(data);
          } else {
            self.ws.send(data, opts);
          }
        } catch (e) {
          debug('websocket closed before onclose event');
        }

        --total || done();
      });
    })(packets[i]);
  }

  function done () {
    self.emit('flush');

    // fake drain
    // defer to next tick to allow Socket to clear writeBuffer
    setTimeout(function () {
      self.writable = true;
      self.emit('drain');
    }, 0);
  }
};

/**
 * Called upon close
 *
 * @api private
 */

WS.prototype.onClose = function () {
  Transport.prototype.onClose.call(this);
};

/**
 * Closes socket.
 *
 * @api private
 */

WS.prototype.doClose = function () {
  if (typeof this.ws !== 'undefined') {
    this.ws.close();
  }
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

WS.prototype.uri = function () {
  var query = this.query || {};
  var schema = this.secure ? 'wss' : 'ws';
  var port = '';

  // avoid port if default for schema
  if (this.port && (('wss' === schema && Number(this.port) !== 443) ||
    ('ws' === schema && Number(this.port) !== 80))) {
    port = ':' + this.port;
  }

  // append timestamp to URI
  if (this.timestampRequests) {
    query[this.timestampParam] = yeast();
  }

  // communicate binary support capabilities
  if (!this.supportsBinary) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  var ipv6 = this.hostname.indexOf(':') !== -1;
  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
};

/**
 * Feature detection for WebSocket.
 *
 * @return {Boolean} whether this transport is available.
 * @api public
 */

WS.prototype.check = function () {
  return !!WebSocket && !('__initialize' in WebSocket && this.name === WS.prototype.name);
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../transport":35,"component-inherit":29,"debug":30,"engine.io-parser":42,"parseqs":53,"ws":26,"yeast":85}],41:[function(require,module,exports){
(function (global){
// browser shim for xmlhttprequest module

var hasCORS = require('has-cors');

module.exports = function (opts) {
  var xdomain = opts.xdomain;

  // scheme must be same when usign XDomainRequest
  // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
  var xscheme = opts.xscheme;

  // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
  // https://github.com/Automattic/engine.io-client/pull/217
  var enablesXDR = opts.enablesXDR;

  // XMLHttpRequest can be disabled on IE
  try {
    if ('undefined' !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
      return new XMLHttpRequest();
    }
  } catch (e) { }

  // Use XDomainRequest for IE8 if enablesXDR is true
  // because loading bar keeps flashing when using jsonp-polling
  // https://github.com/yujiosaka/socke.io-ie8-loading-example
  try {
    if ('undefined' !== typeof XDomainRequest && !xscheme && enablesXDR) {
      return new XDomainRequest();
    }
  } catch (e) { }

  if (!xdomain) {
    try {
      return new global[['Active'].concat('Object').join('X')]('Microsoft.XMLHTTP');
    } catch (e) { }
  }
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"has-cors":47}],42:[function(require,module,exports){
(function (global){
/**
 * Module dependencies.
 */

var keys = require('./keys');
var hasBinary = require('has-binary2');
var sliceBuffer = require('arraybuffer.slice');
var after = require('after');
var utf8 = require('./utf8');

var base64encoder;
if (global && global.ArrayBuffer) {
  base64encoder = require('base64-arraybuffer');
}

/**
 * Check if we are running an android browser. That requires us to use
 * ArrayBuffer with polling transports...
 *
 * http://ghinda.net/jpeg-blob-ajax-android/
 */

var isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

/**
 * Check if we are running in PhantomJS.
 * Uploading a Blob with PhantomJS does not work correctly, as reported here:
 * https://github.com/ariya/phantomjs/issues/11395
 * @type boolean
 */
var isPhantomJS = typeof navigator !== 'undefined' && /PhantomJS/i.test(navigator.userAgent);

/**
 * When true, avoids using Blobs to encode payloads.
 * @type boolean
 */
var dontSendBlobs = isAndroid || isPhantomJS;

/**
 * Current protocol version.
 */

exports.protocol = 3;

/**
 * Packet types.
 */

var packets = exports.packets = {
    open:     0    // non-ws
  , close:    1    // non-ws
  , ping:     2
  , pong:     3
  , message:  4
  , upgrade:  5
  , noop:     6
};

var packetslist = keys(packets);

/**
 * Premade error packet.
 */

var err = { type: 'error', data: 'parser error' };

/**
 * Create a blob api even for blob builder when vendor prefixes exist
 */

var Blob = require('blob');

/**
 * Encodes a packet.
 *
 *     <packet type id> [ <data> ]
 *
 * Example:
 *
 *     5hello world
 *     3
 *     4
 *
 * Binary is encoded in an identical principle
 *
 * @api private
 */

exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
  if (typeof supportsBinary === 'function') {
    callback = supportsBinary;
    supportsBinary = false;
  }

  if (typeof utf8encode === 'function') {
    callback = utf8encode;
    utf8encode = null;
  }

  var data = (packet.data === undefined)
    ? undefined
    : packet.data.buffer || packet.data;

  if (global.ArrayBuffer && data instanceof ArrayBuffer) {
    return encodeArrayBuffer(packet, supportsBinary, callback);
  } else if (Blob && data instanceof global.Blob) {
    return encodeBlob(packet, supportsBinary, callback);
  }

  // might be an object with { base64: true, data: dataAsBase64String }
  if (data && data.base64) {
    return encodeBase64Object(packet, callback);
  }

  // Sending data as a utf-8 string
  var encoded = packets[packet.type];

  // data fragment is optional
  if (undefined !== packet.data) {
    encoded += utf8encode ? utf8.encode(String(packet.data), { strict: false }) : String(packet.data);
  }

  return callback('' + encoded);

};

function encodeBase64Object(packet, callback) {
  // packet data is an object { base64: true, data: dataAsBase64String }
  var message = 'b' + exports.packets[packet.type] + packet.data.data;
  return callback(message);
}

/**
 * Encode packet helpers for binary types
 */

function encodeArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var data = packet.data;
  var contentArray = new Uint8Array(data);
  var resultBuffer = new Uint8Array(1 + data.byteLength);

  resultBuffer[0] = packets[packet.type];
  for (var i = 0; i < contentArray.length; i++) {
    resultBuffer[i+1] = contentArray[i];
  }

  return callback(resultBuffer.buffer);
}

function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var fr = new FileReader();
  fr.onload = function() {
    packet.data = fr.result;
    exports.encodePacket(packet, supportsBinary, true, callback);
  };
  return fr.readAsArrayBuffer(packet.data);
}

function encodeBlob(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  if (dontSendBlobs) {
    return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
  }

  var length = new Uint8Array(1);
  length[0] = packets[packet.type];
  var blob = new Blob([length.buffer, packet.data]);

  return callback(blob);
}

/**
 * Encodes a packet with binary data in a base64 string
 *
 * @param {Object} packet, has `type` and `data`
 * @return {String} base64 encoded message
 */

exports.encodeBase64Packet = function(packet, callback) {
  var message = 'b' + exports.packets[packet.type];
  if (Blob && packet.data instanceof global.Blob) {
    var fr = new FileReader();
    fr.onload = function() {
      var b64 = fr.result.split(',')[1];
      callback(message + b64);
    };
    return fr.readAsDataURL(packet.data);
  }

  var b64data;
  try {
    b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
  } catch (e) {
    // iPhone Safari doesn't let you apply with typed arrays
    var typed = new Uint8Array(packet.data);
    var basic = new Array(typed.length);
    for (var i = 0; i < typed.length; i++) {
      basic[i] = typed[i];
    }
    b64data = String.fromCharCode.apply(null, basic);
  }
  message += global.btoa(b64data);
  return callback(message);
};

/**
 * Decodes a packet. Changes format to Blob if requested.
 *
 * @return {Object} with `type` and `data` (if any)
 * @api private
 */

exports.decodePacket = function (data, binaryType, utf8decode) {
  if (data === undefined) {
    return err;
  }
  // String data
  if (typeof data === 'string') {
    if (data.charAt(0) === 'b') {
      return exports.decodeBase64Packet(data.substr(1), binaryType);
    }

    if (utf8decode) {
      data = tryDecode(data);
      if (data === false) {
        return err;
      }
    }
    var type = data.charAt(0);

    if (Number(type) != type || !packetslist[type]) {
      return err;
    }

    if (data.length > 1) {
      return { type: packetslist[type], data: data.substring(1) };
    } else {
      return { type: packetslist[type] };
    }
  }

  var asArray = new Uint8Array(data);
  var type = asArray[0];
  var rest = sliceBuffer(data, 1);
  if (Blob && binaryType === 'blob') {
    rest = new Blob([rest]);
  }
  return { type: packetslist[type], data: rest };
};

function tryDecode(data) {
  try {
    data = utf8.decode(data, { strict: false });
  } catch (e) {
    return false;
  }
  return data;
}

/**
 * Decodes a packet encoded in a base64 string
 *
 * @param {String} base64 encoded message
 * @return {Object} with `type` and `data` (if any)
 */

exports.decodeBase64Packet = function(msg, binaryType) {
  var type = packetslist[msg.charAt(0)];
  if (!base64encoder) {
    return { type: type, data: { base64: true, data: msg.substr(1) } };
  }

  var data = base64encoder.decode(msg.substr(1));

  if (binaryType === 'blob' && Blob) {
    data = new Blob([data]);
  }

  return { type: type, data: data };
};

/**
 * Encodes multiple messages (payload).
 *
 *     <length>:data
 *
 * Example:
 *
 *     11:hello world2:hi
 *
 * If any contents are binary, they will be encoded as base64 strings. Base64
 * encoded strings are marked with a b before the length specifier
 *
 * @param {Array} packets
 * @api private
 */

exports.encodePayload = function (packets, supportsBinary, callback) {
  if (typeof supportsBinary === 'function') {
    callback = supportsBinary;
    supportsBinary = null;
  }

  var isBinary = hasBinary(packets);

  if (supportsBinary && isBinary) {
    if (Blob && !dontSendBlobs) {
      return exports.encodePayloadAsBlob(packets, callback);
    }

    return exports.encodePayloadAsArrayBuffer(packets, callback);
  }

  if (!packets.length) {
    return callback('0:');
  }

  function setLengthHeader(message) {
    return message.length + ':' + message;
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, !isBinary ? false : supportsBinary, false, function(message) {
      doneCallback(null, setLengthHeader(message));
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(results.join(''));
  });
};

/**
 * Async array map using after
 */

function map(ary, each, done) {
  var result = new Array(ary.length);
  var next = after(ary.length, done);

  var eachWithIndex = function(i, el, cb) {
    each(el, function(error, msg) {
      result[i] = msg;
      cb(error, result);
    });
  };

  for (var i = 0; i < ary.length; i++) {
    eachWithIndex(i, ary[i], next);
  }
}

/*
 * Decodes data when a payload is maybe expected. Possible binary contents are
 * decoded from their base64 representation
 *
 * @param {String} data, callback method
 * @api public
 */

exports.decodePayload = function (data, binaryType, callback) {
  if (typeof data !== 'string') {
    return exports.decodePayloadAsBinary(data, binaryType, callback);
  }

  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var packet;
  if (data === '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

  var length = '', n, msg;

  for (var i = 0, l = data.length; i < l; i++) {
    var chr = data.charAt(i);

    if (chr !== ':') {
      length += chr;
      continue;
    }

    if (length === '' || (length != (n = Number(length)))) {
      // parser error - ignoring payload
      return callback(err, 0, 1);
    }

    msg = data.substr(i + 1, n);

    if (length != msg.length) {
      // parser error - ignoring payload
      return callback(err, 0, 1);
    }

    if (msg.length) {
      packet = exports.decodePacket(msg, binaryType, false);

      if (err.type === packet.type && err.data === packet.data) {
        // parser error in individual packet - ignoring payload
        return callback(err, 0, 1);
      }

      var ret = callback(packet, i + n, l);
      if (false === ret) return;
    }

    // advance cursor
    i += n;
    length = '';
  }

  if (length !== '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

};

/**
 * Encodes multiple messages (payload) as binary.
 *
 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
 * 255><data>
 *
 * Example:
 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
 *
 * @param {Array} packets
 * @return {ArrayBuffer} encoded payload
 * @api private
 */

exports.encodePayloadAsArrayBuffer = function(packets, callback) {
  if (!packets.length) {
    return callback(new ArrayBuffer(0));
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(data) {
      return doneCallback(null, data);
    });
  }

  map(packets, encodeOne, function(err, encodedPackets) {
    var totalLength = encodedPackets.reduce(function(acc, p) {
      var len;
      if (typeof p === 'string'){
        len = p.length;
      } else {
        len = p.byteLength;
      }
      return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
    }, 0);

    var resultArray = new Uint8Array(totalLength);

    var bufferIndex = 0;
    encodedPackets.forEach(function(p) {
      var isString = typeof p === 'string';
      var ab = p;
      if (isString) {
        var view = new Uint8Array(p.length);
        for (var i = 0; i < p.length; i++) {
          view[i] = p.charCodeAt(i);
        }
        ab = view.buffer;
      }

      if (isString) { // not true binary
        resultArray[bufferIndex++] = 0;
      } else { // true binary
        resultArray[bufferIndex++] = 1;
      }

      var lenStr = ab.byteLength.toString();
      for (var i = 0; i < lenStr.length; i++) {
        resultArray[bufferIndex++] = parseInt(lenStr[i]);
      }
      resultArray[bufferIndex++] = 255;

      var view = new Uint8Array(ab);
      for (var i = 0; i < view.length; i++) {
        resultArray[bufferIndex++] = view[i];
      }
    });

    return callback(resultArray.buffer);
  });
};

/**
 * Encode as Blob
 */

exports.encodePayloadAsBlob = function(packets, callback) {
  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(encoded) {
      var binaryIdentifier = new Uint8Array(1);
      binaryIdentifier[0] = 1;
      if (typeof encoded === 'string') {
        var view = new Uint8Array(encoded.length);
        for (var i = 0; i < encoded.length; i++) {
          view[i] = encoded.charCodeAt(i);
        }
        encoded = view.buffer;
        binaryIdentifier[0] = 0;
      }

      var len = (encoded instanceof ArrayBuffer)
        ? encoded.byteLength
        : encoded.size;

      var lenStr = len.toString();
      var lengthAry = new Uint8Array(lenStr.length + 1);
      for (var i = 0; i < lenStr.length; i++) {
        lengthAry[i] = parseInt(lenStr[i]);
      }
      lengthAry[lenStr.length] = 255;

      if (Blob) {
        var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
        doneCallback(null, blob);
      }
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(new Blob(results));
  });
};

/*
 * Decodes data when a payload is maybe expected. Strings are decoded by
 * interpreting each byte as a key code for entries marked to start with 0. See
 * description of encodePayloadAsBinary
 *
 * @param {ArrayBuffer} data, callback method
 * @api public
 */

exports.decodePayloadAsBinary = function (data, binaryType, callback) {
  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var bufferTail = data;
  var buffers = [];

  while (bufferTail.byteLength > 0) {
    var tailArray = new Uint8Array(bufferTail);
    var isString = tailArray[0] === 0;
    var msgLength = '';

    for (var i = 1; ; i++) {
      if (tailArray[i] === 255) break;

      // 310 = char length of Number.MAX_VALUE
      if (msgLength.length > 310) {
        return callback(err, 0, 1);
      }

      msgLength += tailArray[i];
    }

    bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
    msgLength = parseInt(msgLength);

    var msg = sliceBuffer(bufferTail, 0, msgLength);
    if (isString) {
      try {
        msg = String.fromCharCode.apply(null, new Uint8Array(msg));
      } catch (e) {
        // iPhone Safari doesn't let you apply to typed arrays
        var typed = new Uint8Array(msg);
        msg = '';
        for (var i = 0; i < typed.length; i++) {
          msg += String.fromCharCode(typed[i]);
        }
      }
    }

    buffers.push(msg);
    bufferTail = sliceBuffer(bufferTail, msgLength);
  }

  var total = buffers.length;
  buffers.forEach(function(buffer, i) {
    callback(exports.decodePacket(buffer, binaryType, true), i, total);
  });
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./keys":43,"./utf8":44,"after":21,"arraybuffer.slice":22,"base64-arraybuffer":24,"blob":25,"has-binary2":45}],43:[function(require,module,exports){

/**
 * Gets the keys for an object.
 *
 * @return {Array} keys
 * @api private
 */

module.exports = Object.keys || function keys (obj){
  var arr = [];
  var has = Object.prototype.hasOwnProperty;

  for (var i in obj) {
    if (has.call(obj, i)) {
      arr.push(i);
    }
  }
  return arr;
};

},{}],44:[function(require,module,exports){
(function (global){
/*! https://mths.be/utf8js v2.1.2 by @mathias */
;(function(root) {

	// Detect free variables `exports`
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code,
	// and use it as `root`
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var stringFromCharCode = String.fromCharCode;

	// Taken from https://mths.be/punycode
	function ucs2decode(string) {
		var output = [];
		var counter = 0;
		var length = string.length;
		var value;
		var extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	// Taken from https://mths.be/punycode
	function ucs2encode(array) {
		var length = array.length;
		var index = -1;
		var value;
		var output = '';
		while (++index < length) {
			value = array[index];
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
		}
		return output;
	}

	function checkScalarValue(codePoint, strict) {
		if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
			if (strict) {
				throw Error(
					'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
					' is not a scalar value'
				);
			}
			return false;
		}
		return true;
	}
	/*--------------------------------------------------------------------------*/

	function createByte(codePoint, shift) {
		return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
	}

	function encodeCodePoint(codePoint, strict) {
		if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
			return stringFromCharCode(codePoint);
		}
		var symbol = '';
		if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
			symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
		}
		else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
			if (!checkScalarValue(codePoint, strict)) {
				codePoint = 0xFFFD;
			}
			symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
			symbol += createByte(codePoint, 6);
		}
		else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
			symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
			symbol += createByte(codePoint, 12);
			symbol += createByte(codePoint, 6);
		}
		symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
		return symbol;
	}

	function utf8encode(string, opts) {
		opts = opts || {};
		var strict = false !== opts.strict;

		var codePoints = ucs2decode(string);
		var length = codePoints.length;
		var index = -1;
		var codePoint;
		var byteString = '';
		while (++index < length) {
			codePoint = codePoints[index];
			byteString += encodeCodePoint(codePoint, strict);
		}
		return byteString;
	}

	/*--------------------------------------------------------------------------*/

	function readContinuationByte() {
		if (byteIndex >= byteCount) {
			throw Error('Invalid byte index');
		}

		var continuationByte = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		if ((continuationByte & 0xC0) == 0x80) {
			return continuationByte & 0x3F;
		}

		// If we end up here, it’s not a continuation byte
		throw Error('Invalid continuation byte');
	}

	function decodeSymbol(strict) {
		var byte1;
		var byte2;
		var byte3;
		var byte4;
		var codePoint;

		if (byteIndex > byteCount) {
			throw Error('Invalid byte index');
		}

		if (byteIndex == byteCount) {
			return false;
		}

		// Read first byte
		byte1 = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		// 1-byte sequence (no continuation bytes)
		if ((byte1 & 0x80) == 0) {
			return byte1;
		}

		// 2-byte sequence
		if ((byte1 & 0xE0) == 0xC0) {
			byte2 = readContinuationByte();
			codePoint = ((byte1 & 0x1F) << 6) | byte2;
			if (codePoint >= 0x80) {
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 3-byte sequence (may include unpaired surrogates)
		if ((byte1 & 0xF0) == 0xE0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
			if (codePoint >= 0x0800) {
				return checkScalarValue(codePoint, strict) ? codePoint : 0xFFFD;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 4-byte sequence
		if ((byte1 & 0xF8) == 0xF0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			byte4 = readContinuationByte();
			codePoint = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0C) |
				(byte3 << 0x06) | byte4;
			if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
				return codePoint;
			}
		}

		throw Error('Invalid UTF-8 detected');
	}

	var byteArray;
	var byteCount;
	var byteIndex;
	function utf8decode(byteString, opts) {
		opts = opts || {};
		var strict = false !== opts.strict;

		byteArray = ucs2decode(byteString);
		byteCount = byteArray.length;
		byteIndex = 0;
		var codePoints = [];
		var tmp;
		while ((tmp = decodeSymbol(strict)) !== false) {
			codePoints.push(tmp);
		}
		return ucs2encode(codePoints);
	}

	/*--------------------------------------------------------------------------*/

	var utf8 = {
		'version': '2.1.2',
		'encode': utf8encode,
		'decode': utf8decode
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
			return utf8;
		}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = utf8;
		} else { // in Narwhal or RingoJS v0.7.0-
			var object = {};
			var hasOwnProperty = object.hasOwnProperty;
			for (var key in utf8) {
				hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.utf8 = utf8;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],45:[function(require,module,exports){
(function (global){
/* global Blob File */

/*
 * Module requirements.
 */

var isArray = require('isarray');

var toString = Object.prototype.toString;
var withNativeBlob = typeof global.Blob === 'function' || toString.call(global.Blob) === '[object BlobConstructor]';
var withNativeFile = typeof global.File === 'function' || toString.call(global.File) === '[object FileConstructor]';

/**
 * Module exports.
 */

module.exports = hasBinary;

/**
 * Checks for binary data.
 *
 * Supports Buffer, ArrayBuffer, Blob and File.
 *
 * @param {Object} anything
 * @api public
 */

function hasBinary (obj) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  if (isArray(obj)) {
    for (var i = 0, l = obj.length; i < l; i++) {
      if (hasBinary(obj[i])) {
        return true;
      }
    }
    return false;
  }

  if ((typeof global.Buffer === 'function' && global.Buffer.isBuffer && global.Buffer.isBuffer(obj)) ||
     (typeof global.ArrayBuffer === 'function' && obj instanceof ArrayBuffer) ||
     (withNativeBlob && obj instanceof Blob) ||
     (withNativeFile && obj instanceof File)
    ) {
    return true;
  }

  // see: https://github.com/Automattic/has-binary/pull/4
  if (obj.toJSON && typeof obj.toJSON === 'function' && arguments.length === 1) {
    return hasBinary(obj.toJSON(), true);
  }

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
      return true;
    }
  }

  return false;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"isarray":46}],46:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],47:[function(require,module,exports){

/**
 * Module exports.
 *
 * Logic borrowed from Modernizr:
 *
 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
 */

try {
  module.exports = typeof XMLHttpRequest !== 'undefined' &&
    'withCredentials' in new XMLHttpRequest();
} catch (err) {
  // if XMLHttp support is disabled in IE then it will throw
  // when trying to create
  module.exports = false;
}

},{}],48:[function(require,module,exports){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],49:[function(require,module,exports){
(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.prefix = factory(root);
  }
}(this, function (root) {
  'use strict';

  var merge = function (target) {
    var i = 1;
    var length = arguments.length;
    var key;
    for (; i < length; i++) {
      for (key in arguments[i]) {
        if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
          target[key] = arguments[i][key];
        }
      }
    }
    return target;
  };

  var defaults = {
    template: '[%t] %l:',
    levelFormatter: function (level) {
      return level.toUpperCase();
    },
    nameFormatter: function (name) {
      return name || 'root';
    },
    timestampFormatter: function (date) {
      return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
    },
    format: undefined
  };

  var loglevel;
  var configs = {};

  var reg = function (rootLogger) {
    if (!rootLogger || !rootLogger.getLogger) {
      throw new TypeError('Argument is not a root logger');
    }
    loglevel = rootLogger;
  };

  var apply = function (logger, config) {
    if (!logger || !logger.setLevel) {
      throw new TypeError('Argument is not a logger');
    }

    /* eslint-disable vars-on-top */
    var originalFactory = logger.methodFactory;
    var name = logger.name || '';
    var parent = configs[name] || configs[''] || defaults;
    /* eslint-enable vars-on-top */

    function methodFactory(methodName, logLevel, loggerName) {
      var originalMethod = originalFactory(methodName, logLevel, loggerName);
      var options = configs[loggerName] || configs[''];

      var hasTimestamp = options.template.indexOf('%t') !== -1;
      var hasLevel = options.template.indexOf('%l') !== -1;
      var hasName = options.template.indexOf('%n') !== -1;

      return function () {
        var content = '';

        var length = arguments.length;
        var args = Array(length);
        var key = 0;
        for (; key < length; key++) {
          args[key] = arguments[key];
        }

        // skip the root method for child loggers to prevent duplicate logic
        if (name || !configs[loggerName]) {
          /* eslint-disable vars-on-top */
          var timestamp = options.timestampFormatter(new Date());
          var level = options.levelFormatter(methodName);
          var lname = options.nameFormatter(loggerName);
          /* eslint-enable vars-on-top */

          if (options.format) {
            content += options.format(level, lname, timestamp);
          } else {
            content += options.template;
            if (hasTimestamp) {
              content = content.replace(/%t/, timestamp);
            }
            if (hasLevel) content = content.replace(/%l/, level);
            if (hasName) content = content.replace(/%n/, lname);
          }

          if (args.length && typeof args[0] === 'string') {
            // concat prefix with first argument to support string substitutions
            args[0] = content + ' ' + args[0];
          } else {
            args.unshift(content);
          }
        }

        originalMethod.apply(undefined, args);
      };
    }

    if (!configs[name]) {
      logger.methodFactory = methodFactory;
    }

    // for remove inherited format option if template option preset
    config = config || {};
    if (config.template) config.format = undefined;

    configs[name] = merge({}, parent, config);

    logger.setLevel(logger.getLevel());

    if (!loglevel) {
      logger.warn(
        'It is necessary to call the function reg() of loglevel-plugin-prefix before calling apply. From the next release, it will throw an error. See more: https://github.com/kutuluk/loglevel-plugin-prefix/blob/master/README.md'
      );
    }

    return logger;
  };

  var api = {
    reg: reg,
    apply: apply
  };

  var save;

  if (root) {
    save = root.prefix;
    api.noConflict = function () {
      if (root.prefix === api) {
        root.prefix = save;
      }
      return api;
    };
  }

  return api;
}));

},{}],50:[function(require,module,exports){
/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/
(function (root, definition) {
    "use strict";
    if (true) {
        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof module === 'object' && module.exports) {
        module.exports = definition();
    } else {
        root.log = definition();
    }
}(this, function () {
    "use strict";

    // Slightly dubious tricks to cut down minimized file size
    var noop = function() {};
    var undefinedType = "undefined";

    var logMethods = [
        "trace",
        "debug",
        "info",
        "warn",
        "error"
    ];

    // Cross-browser bind equivalent that works at least back to IE6
    function bindMethod(obj, methodName) {
        var method = obj[methodName];
        if (typeof method.bind === 'function') {
            return method.bind(obj);
        } else {
            try {
                return Function.prototype.bind.call(method, obj);
            } catch (e) {
                // Missing bind shim or IE8 + Modernizr, fallback to wrapping
                return function() {
                    return Function.prototype.apply.apply(method, [obj, arguments]);
                };
            }
        }
    }

    // Build the best logging method possible for this env
    // Wherever possible we want to bind, not wrap, to preserve stack traces
    function realMethod(methodName) {
        if (methodName === 'debug') {
            methodName = 'log';
        }

        if (typeof console === undefinedType) {
            return false; // No method possible, for now - fixed later by enableLoggingWhenConsoleArrives
        } else if (console[methodName] !== undefined) {
            return bindMethod(console, methodName);
        } else if (console.log !== undefined) {
            return bindMethod(console, 'log');
        } else {
            return noop;
        }
    }

    // These private functions always need `this` to be set properly

    function replaceLoggingMethods(level, loggerName) {
        /*jshint validthis:true */
        for (var i = 0; i < logMethods.length; i++) {
            var methodName = logMethods[i];
            this[methodName] = (i < level) ?
                noop :
                this.methodFactory(methodName, level, loggerName);
        }

        // Define log.log as an alias for log.debug
        this.log = this.debug;
    }

    // In old IE versions, the console isn't present until you first open it.
    // We build realMethod() replacements here that regenerate logging methods
    function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
        return function () {
            if (typeof console !== undefinedType) {
                replaceLoggingMethods.call(this, level, loggerName);
                this[methodName].apply(this, arguments);
            }
        };
    }

    // By default, we use closely bound real methods wherever possible, and
    // otherwise we wait for a console to appear, and then try again.
    function defaultMethodFactory(methodName, level, loggerName) {
        /*jshint validthis:true */
        return realMethod(methodName) ||
               enableLoggingWhenConsoleArrives.apply(this, arguments);
    }

    function Logger(name, defaultLevel, factory) {
      var self = this;
      var currentLevel;
      var storageKey = "loglevel";
      if (name) {
        storageKey += ":" + name;
      }

      function persistLevelIfPossible(levelNum) {
          var levelName = (logMethods[levelNum] || 'silent').toUpperCase();

          if (typeof window === undefinedType) return;

          // Use localStorage if available
          try {
              window.localStorage[storageKey] = levelName;
              return;
          } catch (ignore) {}

          // Use session cookie as fallback
          try {
              window.document.cookie =
                encodeURIComponent(storageKey) + "=" + levelName + ";";
          } catch (ignore) {}
      }

      function getPersistedLevel() {
          var storedLevel;

          if (typeof window === undefinedType) return;

          try {
              storedLevel = window.localStorage[storageKey];
          } catch (ignore) {}

          // Fallback to cookies if local storage gives us nothing
          if (typeof storedLevel === undefinedType) {
              try {
                  var cookie = window.document.cookie;
                  var location = cookie.indexOf(
                      encodeURIComponent(storageKey) + "=");
                  if (location !== -1) {
                      storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
                  }
              } catch (ignore) {}
          }

          // If the stored level is not valid, treat it as if nothing was stored.
          if (self.levels[storedLevel] === undefined) {
              storedLevel = undefined;
          }

          return storedLevel;
      }

      /*
       *
       * Public logger API - see https://github.com/pimterry/loglevel for details
       *
       */

      self.name = name;

      self.levels = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3,
          "ERROR": 4, "SILENT": 5};

      self.methodFactory = factory || defaultMethodFactory;

      self.getLevel = function () {
          return currentLevel;
      };

      self.setLevel = function (level, persist) {
          if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
              level = self.levels[level.toUpperCase()];
          }
          if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
              currentLevel = level;
              if (persist !== false) {  // defaults to true
                  persistLevelIfPossible(level);
              }
              replaceLoggingMethods.call(self, level, name);
              if (typeof console === undefinedType && level < self.levels.SILENT) {
                  return "No console available for logging";
              }
          } else {
              throw "log.setLevel() called with invalid level: " + level;
          }
      };

      self.setDefaultLevel = function (level) {
          if (!getPersistedLevel()) {
              self.setLevel(level, false);
          }
      };

      self.enableAll = function(persist) {
          self.setLevel(self.levels.TRACE, persist);
      };

      self.disableAll = function(persist) {
          self.setLevel(self.levels.SILENT, persist);
      };

      // Initialize with the right level
      var initialLevel = getPersistedLevel();
      if (initialLevel == null) {
          initialLevel = defaultLevel == null ? "WARN" : defaultLevel;
      }
      self.setLevel(initialLevel, false);
    }

    /*
     *
     * Top-level API
     *
     */

    var defaultLogger = new Logger();

    var _loggersByName = {};
    defaultLogger.getLogger = function getLogger(name) {
        if (typeof name !== "string" || name === "") {
          throw new TypeError("You must supply a name when creating a logger.");
        }

        var logger = _loggersByName[name];
        if (!logger) {
          logger = _loggersByName[name] = new Logger(
            name, defaultLogger.getLevel(), defaultLogger.methodFactory);
        }
        return logger;
    };

    // Grab the current global log variable in case of overwrite
    var _log = (typeof window !== undefinedType) ? window.log : undefined;
    defaultLogger.noConflict = function() {
        if (typeof window !== undefinedType &&
               window.log === defaultLogger) {
            window.log = _log;
        }

        return defaultLogger;
    };

    defaultLogger.getLoggers = function getLoggers() {
        return _loggersByName;
    };

    return defaultLogger;
}));

},{}],51:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

},{}],52:[function(require,module,exports){
exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

exports.homedir = function () {
	return '/'
};

},{}],53:[function(require,module,exports){
/**
 * Compiles a querystring
 * Returns string representation of the object
 *
 * @param {Object}
 * @api private
 */

exports.encode = function (obj) {
  var str = '';

  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (str.length) str += '&';
      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
    }
  }

  return str;
};

/**
 * Parses a simple querystring into an object
 *
 * @param {String} qs
 * @api private
 */

exports.decode = function(qs){
  var qry = {};
  var pairs = qs.split('&');
  for (var i = 0, l = pairs.length; i < l; i++) {
    var pair = pairs[i].split('=');
    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return qry;
};

},{}],54:[function(require,module,exports){
/**
 * Parses an URI
 *
 * @author Steven Levithan <stevenlevithan.com> (MIT license)
 * @api private
 */

var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

var parts = [
    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
];

module.exports = function parseuri(str) {
    var src = str,
        b = str.indexOf('['),
        e = str.indexOf(']');

    if (b != -1 && e != -1) {
        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
    }

    var m = re.exec(str || ''),
        uri = {},
        i = 14;

    while (i--) {
        uri[parts[i]] = m[i] || '';
    }

    if (b != -1 && e != -1) {
        uri.source = src;
        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
        uri.ipv6uri = true;
    }

    return uri;
};

},{}],55:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],56:[function(require,module,exports){
/*
 *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */
'use strict';

var SDPUtils = require('sdp');

function writeMediaSection(transceiver, caps, type, stream, dtlsRole) {
  var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

  // Map ICE parameters (ufrag, pwd) to SDP.
  sdp += SDPUtils.writeIceParameters(
      transceiver.iceGatherer.getLocalParameters());

  // Map DTLS parameters to SDP.
  sdp += SDPUtils.writeDtlsParameters(
      transceiver.dtlsTransport.getLocalParameters(),
      type === 'offer' ? 'actpass' : dtlsRole || 'active');

  sdp += 'a=mid:' + transceiver.mid + '\r\n';

  if (transceiver.rtpSender && transceiver.rtpReceiver) {
    sdp += 'a=sendrecv\r\n';
  } else if (transceiver.rtpSender) {
    sdp += 'a=sendonly\r\n';
  } else if (transceiver.rtpReceiver) {
    sdp += 'a=recvonly\r\n';
  } else {
    sdp += 'a=inactive\r\n';
  }

  if (transceiver.rtpSender) {
    var trackId = transceiver.rtpSender._initialTrackId ||
        transceiver.rtpSender.track.id;
    transceiver.rtpSender._initialTrackId = trackId;
    // spec.
    var msid = 'msid:' + (stream ? stream.id : '-') + ' ' +
        trackId + '\r\n';
    sdp += 'a=' + msid;
    // for Chrome. Legacy should no longer be required.
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
        ' ' + msid;

    // RTX
    if (transceiver.sendEncodingParameters[0].rtx) {
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
          ' ' + msid;
      sdp += 'a=ssrc-group:FID ' +
          transceiver.sendEncodingParameters[0].ssrc + ' ' +
          transceiver.sendEncodingParameters[0].rtx.ssrc +
          '\r\n';
    }
  }
  // FIXME: this should be written by writeRtpDescription.
  sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
      ' cname:' + SDPUtils.localCName + '\r\n';
  if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
        ' cname:' + SDPUtils.localCName + '\r\n';
  }
  return sdp;
}

// Edge does not like
// 1) stun: filtered after 14393 unless ?transport=udp is present
// 2) turn: that does not have all of turn:host:port?transport=udp
// 3) turn: with ipv6 addresses
// 4) turn: occurring muliple times
function filterIceServers(iceServers, edgeVersion) {
  var hasTurn = false;
  iceServers = JSON.parse(JSON.stringify(iceServers));
  return iceServers.filter(function(server) {
    if (server && (server.urls || server.url)) {
      var urls = server.urls || server.url;
      if (server.url && !server.urls) {
        console.warn('RTCIceServer.url is deprecated! Use urls instead.');
      }
      var isString = typeof urls === 'string';
      if (isString) {
        urls = [urls];
      }
      urls = urls.filter(function(url) {
        var validTurn = url.indexOf('turn:') === 0 &&
            url.indexOf('transport=udp') !== -1 &&
            url.indexOf('turn:[') === -1 &&
            !hasTurn;

        if (validTurn) {
          hasTurn = true;
          return true;
        }
        return url.indexOf('stun:') === 0 && edgeVersion >= 14393 &&
            url.indexOf('?transport=udp') === -1;
      });

      delete server.url;
      server.urls = isString ? urls[0] : urls;
      return !!urls.length;
    }
  });
}

// Determines the intersection of local and remote capabilities.
function getCommonCapabilities(localCapabilities, remoteCapabilities) {
  var commonCapabilities = {
    codecs: [],
    headerExtensions: [],
    fecMechanisms: []
  };

  var findCodecByPayloadType = function(pt, codecs) {
    pt = parseInt(pt, 10);
    for (var i = 0; i < codecs.length; i++) {
      if (codecs[i].payloadType === pt ||
          codecs[i].preferredPayloadType === pt) {
        return codecs[i];
      }
    }
  };

  var rtxCapabilityMatches = function(lRtx, rRtx, lCodecs, rCodecs) {
    var lCodec = findCodecByPayloadType(lRtx.parameters.apt, lCodecs);
    var rCodec = findCodecByPayloadType(rRtx.parameters.apt, rCodecs);
    return lCodec && rCodec &&
        lCodec.name.toLowerCase() === rCodec.name.toLowerCase();
  };

  localCapabilities.codecs.forEach(function(lCodec) {
    for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
      var rCodec = remoteCapabilities.codecs[i];
      if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() &&
          lCodec.clockRate === rCodec.clockRate) {
        if (lCodec.name.toLowerCase() === 'rtx' &&
            lCodec.parameters && rCodec.parameters.apt) {
          // for RTX we need to find the local rtx that has a apt
          // which points to the same local codec as the remote one.
          if (!rtxCapabilityMatches(lCodec, rCodec,
              localCapabilities.codecs, remoteCapabilities.codecs)) {
            continue;
          }
        }
        rCodec = JSON.parse(JSON.stringify(rCodec)); // deepcopy
        // number of channels is the highest common number of channels
        rCodec.numChannels = Math.min(lCodec.numChannels,
            rCodec.numChannels);
        // push rCodec so we reply with offerer payload type
        commonCapabilities.codecs.push(rCodec);

        // determine common feedback mechanisms
        rCodec.rtcpFeedback = rCodec.rtcpFeedback.filter(function(fb) {
          for (var j = 0; j < lCodec.rtcpFeedback.length; j++) {
            if (lCodec.rtcpFeedback[j].type === fb.type &&
                lCodec.rtcpFeedback[j].parameter === fb.parameter) {
              return true;
            }
          }
          return false;
        });
        // FIXME: also need to determine .parameters
        //  see https://github.com/openpeer/ortc/issues/569
        break;
      }
    }
  });

  localCapabilities.headerExtensions.forEach(function(lHeaderExtension) {
    for (var i = 0; i < remoteCapabilities.headerExtensions.length;
         i++) {
      var rHeaderExtension = remoteCapabilities.headerExtensions[i];
      if (lHeaderExtension.uri === rHeaderExtension.uri) {
        commonCapabilities.headerExtensions.push(rHeaderExtension);
        break;
      }
    }
  });

  // FIXME: fecMechanisms
  return commonCapabilities;
}

// is action=setLocalDescription with type allowed in signalingState
function isActionAllowedInSignalingState(action, type, signalingState) {
  return {
    offer: {
      setLocalDescription: ['stable', 'have-local-offer'],
      setRemoteDescription: ['stable', 'have-remote-offer']
    },
    answer: {
      setLocalDescription: ['have-remote-offer', 'have-local-pranswer'],
      setRemoteDescription: ['have-local-offer', 'have-remote-pranswer']
    }
  }[type][action].indexOf(signalingState) !== -1;
}

function maybeAddCandidate(iceTransport, candidate) {
  // Edge's internal representation adds some fields therefore
  // not all fieldѕ are taken into account.
  var alreadyAdded = iceTransport.getRemoteCandidates()
      .find(function(remoteCandidate) {
        return candidate.foundation === remoteCandidate.foundation &&
            candidate.ip === remoteCandidate.ip &&
            candidate.port === remoteCandidate.port &&
            candidate.priority === remoteCandidate.priority &&
            candidate.protocol === remoteCandidate.protocol &&
            candidate.type === remoteCandidate.type;
      });
  if (!alreadyAdded) {
    iceTransport.addRemoteCandidate(candidate);
  }
  return !alreadyAdded;
}


function makeError(name, description) {
  var e = new Error(description);
  e.name = name;
  return e;
}

module.exports = function(window, edgeVersion) {
  // https://w3c.github.io/mediacapture-main/#mediastream
  // Helper function to add the track to the stream and
  // dispatch the event ourselves.
  function addTrackToStreamAndFireEvent(track, stream) {
    stream.addTrack(track);
    stream.dispatchEvent(new window.MediaStreamTrackEvent('addtrack',
        {track: track}));
  }

  function removeTrackFromStreamAndFireEvent(track, stream) {
    stream.removeTrack(track);
    stream.dispatchEvent(new window.MediaStreamTrackEvent('removetrack',
        {track: track}));
  }

  function fireAddTrack(pc, track, receiver, streams) {
    var trackEvent = new Event('track');
    trackEvent.track = track;
    trackEvent.receiver = receiver;
    trackEvent.transceiver = {receiver: receiver};
    trackEvent.streams = streams;
    window.setTimeout(function() {
      pc._dispatchEvent('track', trackEvent);
    });
  }

  var RTCPeerConnection = function(config) {
    var pc = this;

    var _eventTarget = document.createDocumentFragment();
    ['addEventListener', 'removeEventListener', 'dispatchEvent']
        .forEach(function(method) {
          pc[method] = _eventTarget[method].bind(_eventTarget);
        });

    this.canTrickleIceCandidates = null;

    this.needNegotiation = false;

    this.localStreams = [];
    this.remoteStreams = [];

    this.localDescription = null;
    this.remoteDescription = null;

    this.signalingState = 'stable';
    this.iceConnectionState = 'new';
    this.iceGatheringState = 'new';

    config = JSON.parse(JSON.stringify(config || {}));

    this.usingBundle = config.bundlePolicy === 'max-bundle';
    if (config.rtcpMuxPolicy === 'negotiate') {
      throw(makeError('NotSupportedError',
          'rtcpMuxPolicy \'negotiate\' is not supported'));
    } else if (!config.rtcpMuxPolicy) {
      config.rtcpMuxPolicy = 'require';
    }

    switch (config.iceTransportPolicy) {
      case 'all':
      case 'relay':
        break;
      default:
        config.iceTransportPolicy = 'all';
        break;
    }

    switch (config.bundlePolicy) {
      case 'balanced':
      case 'max-compat':
      case 'max-bundle':
        break;
      default:
        config.bundlePolicy = 'balanced';
        break;
    }

    config.iceServers = filterIceServers(config.iceServers || [], edgeVersion);

    this._iceGatherers = [];
    if (config.iceCandidatePoolSize) {
      for (var i = config.iceCandidatePoolSize; i > 0; i--) {
        this._iceGatherers.push(new window.RTCIceGatherer({
          iceServers: config.iceServers,
          gatherPolicy: config.iceTransportPolicy
        }));
      }
    } else {
      config.iceCandidatePoolSize = 0;
    }

    this._config = config;

    // per-track iceGathers, iceTransports, dtlsTransports, rtpSenders, ...
    // everything that is needed to describe a SDP m-line.
    this.transceivers = [];

    this._sdpSessionId = SDPUtils.generateSessionId();
    this._sdpSessionVersion = 0;

    this._dtlsRole = undefined; // role for a=setup to use in answers.

    this._isClosed = false;
  };

  // set up event handlers on prototype
  RTCPeerConnection.prototype.onicecandidate = null;
  RTCPeerConnection.prototype.onaddstream = null;
  RTCPeerConnection.prototype.ontrack = null;
  RTCPeerConnection.prototype.onremovestream = null;
  RTCPeerConnection.prototype.onsignalingstatechange = null;
  RTCPeerConnection.prototype.oniceconnectionstatechange = null;
  RTCPeerConnection.prototype.onicegatheringstatechange = null;
  RTCPeerConnection.prototype.onnegotiationneeded = null;
  RTCPeerConnection.prototype.ondatachannel = null;

  RTCPeerConnection.prototype._dispatchEvent = function(name, event) {
    if (this._isClosed) {
      return;
    }
    this.dispatchEvent(event);
    if (typeof this['on' + name] === 'function') {
      this['on' + name](event);
    }
  };

  RTCPeerConnection.prototype._emitGatheringStateChange = function() {
    var event = new Event('icegatheringstatechange');
    this._dispatchEvent('icegatheringstatechange', event);
  };

  RTCPeerConnection.prototype.getConfiguration = function() {
    return this._config;
  };

  RTCPeerConnection.prototype.getLocalStreams = function() {
    return this.localStreams;
  };

  RTCPeerConnection.prototype.getRemoteStreams = function() {
    return this.remoteStreams;
  };

  // internal helper to create a transceiver object.
  // (whih is not yet the same as the WebRTC 1.0 transceiver)
  RTCPeerConnection.prototype._createTransceiver = function(kind) {
    var hasBundleTransport = this.transceivers.length > 0;
    var transceiver = {
      track: null,
      iceGatherer: null,
      iceTransport: null,
      dtlsTransport: null,
      localCapabilities: null,
      remoteCapabilities: null,
      rtpSender: null,
      rtpReceiver: null,
      kind: kind,
      mid: null,
      sendEncodingParameters: null,
      recvEncodingParameters: null,
      stream: null,
      associatedRemoteMediaStreams: [],
      wantReceive: true
    };
    if (this.usingBundle && hasBundleTransport) {
      transceiver.iceTransport = this.transceivers[0].iceTransport;
      transceiver.dtlsTransport = this.transceivers[0].dtlsTransport;
    } else {
      var transports = this._createIceAndDtlsTransports();
      transceiver.iceTransport = transports.iceTransport;
      transceiver.dtlsTransport = transports.dtlsTransport;
    }
    this.transceivers.push(transceiver);
    return transceiver;
  };

  RTCPeerConnection.prototype.addTrack = function(track, stream) {
    if (this._isClosed) {
      throw makeError('InvalidStateError',
          'Attempted to call addTrack on a closed peerconnection.');
    }

    var alreadyExists = this.transceivers.find(function(s) {
      return s.track === track;
    });

    if (alreadyExists) {
      throw makeError('InvalidAccessError', 'Track already exists.');
    }

    var transceiver;
    for (var i = 0; i < this.transceivers.length; i++) {
      if (!this.transceivers[i].track &&
          this.transceivers[i].kind === track.kind) {
        transceiver = this.transceivers[i];
      }
    }
    if (!transceiver) {
      transceiver = this._createTransceiver(track.kind);
    }

    this._maybeFireNegotiationNeeded();

    if (this.localStreams.indexOf(stream) === -1) {
      this.localStreams.push(stream);
    }

    transceiver.track = track;
    transceiver.stream = stream;
    transceiver.rtpSender = new window.RTCRtpSender(track,
        transceiver.dtlsTransport);
    return transceiver.rtpSender;
  };

  RTCPeerConnection.prototype.addStream = function(stream) {
    var pc = this;
    if (edgeVersion >= 15025) {
      stream.getTracks().forEach(function(track) {
        pc.addTrack(track, stream);
      });
    } else {
      // Clone is necessary for local demos mostly, attaching directly
      // to two different senders does not work (build 10547).
      // Fixed in 15025 (or earlier)
      var clonedStream = stream.clone();
      stream.getTracks().forEach(function(track, idx) {
        var clonedTrack = clonedStream.getTracks()[idx];
        track.addEventListener('enabled', function(event) {
          clonedTrack.enabled = event.enabled;
        });
      });
      clonedStream.getTracks().forEach(function(track) {
        pc.addTrack(track, clonedStream);
      });
    }
  };

  RTCPeerConnection.prototype.removeTrack = function(sender) {
    if (this._isClosed) {
      throw makeError('InvalidStateError',
          'Attempted to call removeTrack on a closed peerconnection.');
    }

    if (!(sender instanceof window.RTCRtpSender)) {
      throw new TypeError('Argument 1 of RTCPeerConnection.removeTrack ' +
          'does not implement interface RTCRtpSender.');
    }

    var transceiver = this.transceivers.find(function(t) {
      return t.rtpSender === sender;
    });

    if (!transceiver) {
      throw makeError('InvalidAccessError',
          'Sender was not created by this connection.');
    }
    var stream = transceiver.stream;

    transceiver.rtpSender.stop();
    transceiver.rtpSender = null;
    transceiver.track = null;
    transceiver.stream = null;

    // remove the stream from the set of local streams
    var localStreams = this.transceivers.map(function(t) {
      return t.stream;
    });
    if (localStreams.indexOf(stream) === -1 &&
        this.localStreams.indexOf(stream) > -1) {
      this.localStreams.splice(this.localStreams.indexOf(stream), 1);
    }

    this._maybeFireNegotiationNeeded();
  };

  RTCPeerConnection.prototype.removeStream = function(stream) {
    var pc = this;
    stream.getTracks().forEach(function(track) {
      var sender = pc.getSenders().find(function(s) {
        return s.track === track;
      });
      if (sender) {
        pc.removeTrack(sender);
      }
    });
  };

  RTCPeerConnection.prototype.getSenders = function() {
    return this.transceivers.filter(function(transceiver) {
      return !!transceiver.rtpSender;
    })
    .map(function(transceiver) {
      return transceiver.rtpSender;
    });
  };

  RTCPeerConnection.prototype.getReceivers = function() {
    return this.transceivers.filter(function(transceiver) {
      return !!transceiver.rtpReceiver;
    })
    .map(function(transceiver) {
      return transceiver.rtpReceiver;
    });
  };


  RTCPeerConnection.prototype._createIceGatherer = function(sdpMLineIndex,
      usingBundle) {
    var pc = this;
    if (usingBundle && sdpMLineIndex > 0) {
      return this.transceivers[0].iceGatherer;
    } else if (this._iceGatherers.length) {
      return this._iceGatherers.shift();
    }
    var iceGatherer = new window.RTCIceGatherer({
      iceServers: this._config.iceServers,
      gatherPolicy: this._config.iceTransportPolicy
    });
    Object.defineProperty(iceGatherer, 'state',
        {value: 'new', writable: true}
    );

    this.transceivers[sdpMLineIndex].bufferedCandidateEvents = [];
    this.transceivers[sdpMLineIndex].bufferCandidates = function(event) {
      var end = !event.candidate || Object.keys(event.candidate).length === 0;
      // polyfill since RTCIceGatherer.state is not implemented in
      // Edge 10547 yet.
      iceGatherer.state = end ? 'completed' : 'gathering';
      if (pc.transceivers[sdpMLineIndex].bufferedCandidateEvents !== null) {
        pc.transceivers[sdpMLineIndex].bufferedCandidateEvents.push(event);
      }
    };
    iceGatherer.addEventListener('localcandidate',
      this.transceivers[sdpMLineIndex].bufferCandidates);
    return iceGatherer;
  };

  // start gathering from an RTCIceGatherer.
  RTCPeerConnection.prototype._gather = function(mid, sdpMLineIndex) {
    var pc = this;
    var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
    if (iceGatherer.onlocalcandidate) {
      return;
    }
    var bufferedCandidateEvents =
      this.transceivers[sdpMLineIndex].bufferedCandidateEvents;
    this.transceivers[sdpMLineIndex].bufferedCandidateEvents = null;
    iceGatherer.removeEventListener('localcandidate',
      this.transceivers[sdpMLineIndex].bufferCandidates);
    iceGatherer.onlocalcandidate = function(evt) {
      if (pc.usingBundle && sdpMLineIndex > 0) {
        // if we know that we use bundle we can drop candidates with
        // ѕdpMLineIndex > 0. If we don't do this then our state gets
        // confused since we dispose the extra ice gatherer.
        return;
      }
      var event = new Event('icecandidate');
      event.candidate = {sdpMid: mid, sdpMLineIndex: sdpMLineIndex};

      var cand = evt.candidate;
      // Edge emits an empty object for RTCIceCandidateComplete‥
      var end = !cand || Object.keys(cand).length === 0;
      if (end) {
        // polyfill since RTCIceGatherer.state is not implemented in
        // Edge 10547 yet.
        if (iceGatherer.state === 'new' || iceGatherer.state === 'gathering') {
          iceGatherer.state = 'completed';
        }
      } else {
        if (iceGatherer.state === 'new') {
          iceGatherer.state = 'gathering';
        }
        // RTCIceCandidate doesn't have a component, needs to be added
        cand.component = 1;
        var serializedCandidate = SDPUtils.writeCandidate(cand);
        event.candidate = Object.assign(event.candidate,
            SDPUtils.parseCandidate(serializedCandidate));
        event.candidate.candidate = serializedCandidate;
      }

      // update local description.
      var sections = SDPUtils.getMediaSections(pc.localDescription.sdp);
      if (!end) {
        sections[event.candidate.sdpMLineIndex] +=
            'a=' + event.candidate.candidate + '\r\n';
      } else {
        sections[event.candidate.sdpMLineIndex] +=
            'a=end-of-candidates\r\n';
      }
      pc.localDescription.sdp =
          SDPUtils.getDescription(pc.localDescription.sdp) +
          sections.join('');
      var complete = pc.transceivers.every(function(transceiver) {
        return transceiver.iceGatherer &&
            transceiver.iceGatherer.state === 'completed';
      });

      if (pc.iceGatheringState !== 'gathering') {
        pc.iceGatheringState = 'gathering';
        pc._emitGatheringStateChange();
      }

      // Emit candidate. Also emit null candidate when all gatherers are
      // complete.
      if (!end) {
        pc._dispatchEvent('icecandidate', event);
      }
      if (complete) {
        pc._dispatchEvent('icecandidate', new Event('icecandidate'));
        pc.iceGatheringState = 'complete';
        pc._emitGatheringStateChange();
      }
    };

    // emit already gathered candidates.
    window.setTimeout(function() {
      bufferedCandidateEvents.forEach(function(e) {
        iceGatherer.onlocalcandidate(e);
      });
    }, 0);
  };

  // Create ICE transport and DTLS transport.
  RTCPeerConnection.prototype._createIceAndDtlsTransports = function() {
    var pc = this;
    var iceTransport = new window.RTCIceTransport(null);
    iceTransport.onicestatechange = function() {
      pc._updateConnectionState();
    };

    var dtlsTransport = new window.RTCDtlsTransport(iceTransport);
    dtlsTransport.ondtlsstatechange = function() {
      pc._updateConnectionState();
    };
    dtlsTransport.onerror = function() {
      // onerror does not set state to failed by itself.
      Object.defineProperty(dtlsTransport, 'state',
          {value: 'failed', writable: true});
      pc._updateConnectionState();
    };

    return {
      iceTransport: iceTransport,
      dtlsTransport: dtlsTransport
    };
  };

  // Destroy ICE gatherer, ICE transport and DTLS transport.
  // Without triggering the callbacks.
  RTCPeerConnection.prototype._disposeIceAndDtlsTransports = function(
      sdpMLineIndex) {
    var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
    if (iceGatherer) {
      delete iceGatherer.onlocalcandidate;
      delete this.transceivers[sdpMLineIndex].iceGatherer;
    }
    var iceTransport = this.transceivers[sdpMLineIndex].iceTransport;
    if (iceTransport) {
      delete iceTransport.onicestatechange;
      delete this.transceivers[sdpMLineIndex].iceTransport;
    }
    var dtlsTransport = this.transceivers[sdpMLineIndex].dtlsTransport;
    if (dtlsTransport) {
      delete dtlsTransport.ondtlsstatechange;
      delete dtlsTransport.onerror;
      delete this.transceivers[sdpMLineIndex].dtlsTransport;
    }
  };

  // Start the RTP Sender and Receiver for a transceiver.
  RTCPeerConnection.prototype._transceive = function(transceiver,
      send, recv) {
    var params = getCommonCapabilities(transceiver.localCapabilities,
        transceiver.remoteCapabilities);
    if (send && transceiver.rtpSender) {
      params.encodings = transceiver.sendEncodingParameters;
      params.rtcp = {
        cname: SDPUtils.localCName,
        compound: transceiver.rtcpParameters.compound
      };
      if (transceiver.recvEncodingParameters.length) {
        params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
      }
      transceiver.rtpSender.send(params);
    }
    if (recv && transceiver.rtpReceiver && params.codecs.length > 0) {
      // remove RTX field in Edge 14942
      if (transceiver.kind === 'video'
          && transceiver.recvEncodingParameters
          && edgeVersion < 15019) {
        transceiver.recvEncodingParameters.forEach(function(p) {
          delete p.rtx;
        });
      }
      if (transceiver.recvEncodingParameters.length) {
        params.encodings = transceiver.recvEncodingParameters;
      }
      params.rtcp = {
        compound: transceiver.rtcpParameters.compound
      };
      if (transceiver.rtcpParameters.cname) {
        params.rtcp.cname = transceiver.rtcpParameters.cname;
      }
      if (transceiver.sendEncodingParameters.length) {
        params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
      }
      transceiver.rtpReceiver.receive(params);
    }
  };

  RTCPeerConnection.prototype.setLocalDescription = function(description) {
    var pc = this;

    // Note: pranswer is not supported.
    if (['offer', 'answer'].indexOf(description.type) === -1) {
      return Promise.reject(makeError('TypeError',
          'Unsupported type "' + description.type + '"'));
    }

    if (!isActionAllowedInSignalingState('setLocalDescription',
        description.type, pc.signalingState) || pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not set local ' + description.type +
          ' in state ' + pc.signalingState));
    }

    var sections;
    var sessionpart;
    if (description.type === 'offer') {
      // VERY limited support for SDP munging. Limited to:
      // * changing the order of codecs
      sections = SDPUtils.splitSections(description.sdp);
      sessionpart = sections.shift();
      sections.forEach(function(mediaSection, sdpMLineIndex) {
        var caps = SDPUtils.parseRtpParameters(mediaSection);
        pc.transceivers[sdpMLineIndex].localCapabilities = caps;
      });

      pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
        pc._gather(transceiver.mid, sdpMLineIndex);
      });
    } else if (description.type === 'answer') {
      sections = SDPUtils.splitSections(pc.remoteDescription.sdp);
      sessionpart = sections.shift();
      var isIceLite = SDPUtils.matchPrefix(sessionpart,
          'a=ice-lite').length > 0;
      sections.forEach(function(mediaSection, sdpMLineIndex) {
        var transceiver = pc.transceivers[sdpMLineIndex];
        var iceGatherer = transceiver.iceGatherer;
        var iceTransport = transceiver.iceTransport;
        var dtlsTransport = transceiver.dtlsTransport;
        var localCapabilities = transceiver.localCapabilities;
        var remoteCapabilities = transceiver.remoteCapabilities;

        // treat bundle-only as not-rejected.
        var rejected = SDPUtils.isRejected(mediaSection) &&
            SDPUtils.matchPrefix(mediaSection, 'a=bundle-only').length === 0;

        if (!rejected && !transceiver.isDatachannel) {
          var remoteIceParameters = SDPUtils.getIceParameters(
              mediaSection, sessionpart);
          var remoteDtlsParameters = SDPUtils.getDtlsParameters(
              mediaSection, sessionpart);
          if (isIceLite) {
            remoteDtlsParameters.role = 'server';
          }

          if (!pc.usingBundle || sdpMLineIndex === 0) {
            pc._gather(transceiver.mid, sdpMLineIndex);
            if (iceTransport.state === 'new') {
              iceTransport.start(iceGatherer, remoteIceParameters,
                  isIceLite ? 'controlling' : 'controlled');
            }
            if (dtlsTransport.state === 'new') {
              dtlsTransport.start(remoteDtlsParameters);
            }
          }

          // Calculate intersection of capabilities.
          var params = getCommonCapabilities(localCapabilities,
              remoteCapabilities);

          // Start the RTCRtpSender. The RTCRtpReceiver for this
          // transceiver has already been started in setRemoteDescription.
          pc._transceive(transceiver,
              params.codecs.length > 0,
              false);
        }
      });
    }

    pc.localDescription = {
      type: description.type,
      sdp: description.sdp
    };
    if (description.type === 'offer') {
      pc._updateSignalingState('have-local-offer');
    } else {
      pc._updateSignalingState('stable');
    }

    return Promise.resolve();
  };

  RTCPeerConnection.prototype.setRemoteDescription = function(description) {
    var pc = this;

    // Note: pranswer is not supported.
    if (['offer', 'answer'].indexOf(description.type) === -1) {
      return Promise.reject(makeError('TypeError',
          'Unsupported type "' + description.type + '"'));
    }

    if (!isActionAllowedInSignalingState('setRemoteDescription',
        description.type, pc.signalingState) || pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not set remote ' + description.type +
          ' in state ' + pc.signalingState));
    }

    var streams = {};
    pc.remoteStreams.forEach(function(stream) {
      streams[stream.id] = stream;
    });
    var receiverList = [];
    var sections = SDPUtils.splitSections(description.sdp);
    var sessionpart = sections.shift();
    var isIceLite = SDPUtils.matchPrefix(sessionpart,
        'a=ice-lite').length > 0;
    var usingBundle = SDPUtils.matchPrefix(sessionpart,
        'a=group:BUNDLE ').length > 0;
    pc.usingBundle = usingBundle;
    var iceOptions = SDPUtils.matchPrefix(sessionpart,
        'a=ice-options:')[0];
    if (iceOptions) {
      pc.canTrickleIceCandidates = iceOptions.substr(14).split(' ')
          .indexOf('trickle') >= 0;
    } else {
      pc.canTrickleIceCandidates = false;
    }

    sections.forEach(function(mediaSection, sdpMLineIndex) {
      var lines = SDPUtils.splitLines(mediaSection);
      var kind = SDPUtils.getKind(mediaSection);
      // treat bundle-only as not-rejected.
      var rejected = SDPUtils.isRejected(mediaSection) &&
          SDPUtils.matchPrefix(mediaSection, 'a=bundle-only').length === 0;
      var protocol = lines[0].substr(2).split(' ')[2];

      var direction = SDPUtils.getDirection(mediaSection, sessionpart);
      var remoteMsid = SDPUtils.parseMsid(mediaSection);

      var mid = SDPUtils.getMid(mediaSection) || SDPUtils.generateIdentifier();

      // Reject datachannels which are not implemented yet.
      if (kind === 'application' && protocol === 'DTLS/SCTP') {
        pc.transceivers[sdpMLineIndex] = {
          mid: mid,
          isDatachannel: true
        };
        return;
      }

      var transceiver;
      var iceGatherer;
      var iceTransport;
      var dtlsTransport;
      var rtpReceiver;
      var sendEncodingParameters;
      var recvEncodingParameters;
      var localCapabilities;

      var track;
      // FIXME: ensure the mediaSection has rtcp-mux set.
      var remoteCapabilities = SDPUtils.parseRtpParameters(mediaSection);
      var remoteIceParameters;
      var remoteDtlsParameters;
      if (!rejected) {
        remoteIceParameters = SDPUtils.getIceParameters(mediaSection,
            sessionpart);
        remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection,
            sessionpart);
        remoteDtlsParameters.role = 'client';
      }
      recvEncodingParameters =
          SDPUtils.parseRtpEncodingParameters(mediaSection);

      var rtcpParameters = SDPUtils.parseRtcpParameters(mediaSection);

      var isComplete = SDPUtils.matchPrefix(mediaSection,
          'a=end-of-candidates', sessionpart).length > 0;
      var cands = SDPUtils.matchPrefix(mediaSection, 'a=candidate:')
          .map(function(cand) {
            return SDPUtils.parseCandidate(cand);
          })
          .filter(function(cand) {
            return cand.component === 1;
          });

      // Check if we can use BUNDLE and dispose transports.
      if ((description.type === 'offer' || description.type === 'answer') &&
          !rejected && usingBundle && sdpMLineIndex > 0 &&
          pc.transceivers[sdpMLineIndex]) {
        pc._disposeIceAndDtlsTransports(sdpMLineIndex);
        pc.transceivers[sdpMLineIndex].iceGatherer =
            pc.transceivers[0].iceGatherer;
        pc.transceivers[sdpMLineIndex].iceTransport =
            pc.transceivers[0].iceTransport;
        pc.transceivers[sdpMLineIndex].dtlsTransport =
            pc.transceivers[0].dtlsTransport;
        if (pc.transceivers[sdpMLineIndex].rtpSender) {
          pc.transceivers[sdpMLineIndex].rtpSender.setTransport(
              pc.transceivers[0].dtlsTransport);
        }
        if (pc.transceivers[sdpMLineIndex].rtpReceiver) {
          pc.transceivers[sdpMLineIndex].rtpReceiver.setTransport(
              pc.transceivers[0].dtlsTransport);
        }
      }
      if (description.type === 'offer' && !rejected) {
        transceiver = pc.transceivers[sdpMLineIndex] ||
            pc._createTransceiver(kind);
        transceiver.mid = mid;

        if (!transceiver.iceGatherer) {
          transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex,
              usingBundle);
        }

        if (cands.length && transceiver.iceTransport.state === 'new') {
          if (isComplete && (!usingBundle || sdpMLineIndex === 0)) {
            transceiver.iceTransport.setRemoteCandidates(cands);
          } else {
            cands.forEach(function(candidate) {
              maybeAddCandidate(transceiver.iceTransport, candidate);
            });
          }
        }

        localCapabilities = window.RTCRtpReceiver.getCapabilities(kind);

        // filter RTX until additional stuff needed for RTX is implemented
        // in adapter.js
        if (edgeVersion < 15019) {
          localCapabilities.codecs = localCapabilities.codecs.filter(
              function(codec) {
                return codec.name !== 'rtx';
              });
        }

        sendEncodingParameters = transceiver.sendEncodingParameters || [{
          ssrc: (2 * sdpMLineIndex + 2) * 1001
        }];

        // TODO: rewrite to use http://w3c.github.io/webrtc-pc/#set-associated-remote-streams
        var isNewTrack = false;
        if (direction === 'sendrecv' || direction === 'sendonly') {
          isNewTrack = !transceiver.rtpReceiver;
          rtpReceiver = transceiver.rtpReceiver ||
              new window.RTCRtpReceiver(transceiver.dtlsTransport, kind);

          if (isNewTrack) {
            var stream;
            track = rtpReceiver.track;
            // FIXME: does not work with Plan B.
            if (remoteMsid && remoteMsid.stream === '-') {
              // no-op. a stream id of '-' means: no associated stream.
            } else if (remoteMsid) {
              if (!streams[remoteMsid.stream]) {
                streams[remoteMsid.stream] = new window.MediaStream();
                Object.defineProperty(streams[remoteMsid.stream], 'id', {
                  get: function() {
                    return remoteMsid.stream;
                  }
                });
              }
              Object.defineProperty(track, 'id', {
                get: function() {
                  return remoteMsid.track;
                }
              });
              stream = streams[remoteMsid.stream];
            } else {
              if (!streams.default) {
                streams.default = new window.MediaStream();
              }
              stream = streams.default;
            }
            if (stream) {
              addTrackToStreamAndFireEvent(track, stream);
              transceiver.associatedRemoteMediaStreams.push(stream);
            }
            receiverList.push([track, rtpReceiver, stream]);
          }
        } else if (transceiver.rtpReceiver && transceiver.rtpReceiver.track) {
          transceiver.associatedRemoteMediaStreams.forEach(function(s) {
            var nativeTrack = s.getTracks().find(function(t) {
              return t.id === transceiver.rtpReceiver.track.id;
            });
            if (nativeTrack) {
              removeTrackFromStreamAndFireEvent(nativeTrack, s);
            }
          });
          transceiver.associatedRemoteMediaStreams = [];
        }

        transceiver.localCapabilities = localCapabilities;
        transceiver.remoteCapabilities = remoteCapabilities;
        transceiver.rtpReceiver = rtpReceiver;
        transceiver.rtcpParameters = rtcpParameters;
        transceiver.sendEncodingParameters = sendEncodingParameters;
        transceiver.recvEncodingParameters = recvEncodingParameters;

        // Start the RTCRtpReceiver now. The RTPSender is started in
        // setLocalDescription.
        pc._transceive(pc.transceivers[sdpMLineIndex],
            false,
            isNewTrack);
      } else if (description.type === 'answer' && !rejected) {
        transceiver = pc.transceivers[sdpMLineIndex];
        iceGatherer = transceiver.iceGatherer;
        iceTransport = transceiver.iceTransport;
        dtlsTransport = transceiver.dtlsTransport;
        rtpReceiver = transceiver.rtpReceiver;
        sendEncodingParameters = transceiver.sendEncodingParameters;
        localCapabilities = transceiver.localCapabilities;

        pc.transceivers[sdpMLineIndex].recvEncodingParameters =
            recvEncodingParameters;
        pc.transceivers[sdpMLineIndex].remoteCapabilities =
            remoteCapabilities;
        pc.transceivers[sdpMLineIndex].rtcpParameters = rtcpParameters;

        if (cands.length && iceTransport.state === 'new') {
          if ((isIceLite || isComplete) &&
              (!usingBundle || sdpMLineIndex === 0)) {
            iceTransport.setRemoteCandidates(cands);
          } else {
            cands.forEach(function(candidate) {
              maybeAddCandidate(transceiver.iceTransport, candidate);
            });
          }
        }

        if (!usingBundle || sdpMLineIndex === 0) {
          if (iceTransport.state === 'new') {
            iceTransport.start(iceGatherer, remoteIceParameters,
                'controlling');
          }
          if (dtlsTransport.state === 'new') {
            dtlsTransport.start(remoteDtlsParameters);
          }
        }

        pc._transceive(transceiver,
            direction === 'sendrecv' || direction === 'recvonly',
            direction === 'sendrecv' || direction === 'sendonly');

        // TODO: rewrite to use http://w3c.github.io/webrtc-pc/#set-associated-remote-streams
        if (rtpReceiver &&
            (direction === 'sendrecv' || direction === 'sendonly')) {
          track = rtpReceiver.track;
          if (remoteMsid) {
            if (!streams[remoteMsid.stream]) {
              streams[remoteMsid.stream] = new window.MediaStream();
            }
            addTrackToStreamAndFireEvent(track, streams[remoteMsid.stream]);
            receiverList.push([track, rtpReceiver, streams[remoteMsid.stream]]);
          } else {
            if (!streams.default) {
              streams.default = new window.MediaStream();
            }
            addTrackToStreamAndFireEvent(track, streams.default);
            receiverList.push([track, rtpReceiver, streams.default]);
          }
        } else {
          // FIXME: actually the receiver should be created later.
          delete transceiver.rtpReceiver;
        }
      }
    });

    if (pc._dtlsRole === undefined) {
      pc._dtlsRole = description.type === 'offer' ? 'active' : 'passive';
    }

    pc.remoteDescription = {
      type: description.type,
      sdp: description.sdp
    };
    if (description.type === 'offer') {
      pc._updateSignalingState('have-remote-offer');
    } else {
      pc._updateSignalingState('stable');
    }
    Object.keys(streams).forEach(function(sid) {
      var stream = streams[sid];
      if (stream.getTracks().length) {
        if (pc.remoteStreams.indexOf(stream) === -1) {
          pc.remoteStreams.push(stream);
          var event = new Event('addstream');
          event.stream = stream;
          window.setTimeout(function() {
            pc._dispatchEvent('addstream', event);
          });
        }

        receiverList.forEach(function(item) {
          var track = item[0];
          var receiver = item[1];
          if (stream.id !== item[2].id) {
            return;
          }
          fireAddTrack(pc, track, receiver, [stream]);
        });
      }
    });
    receiverList.forEach(function(item) {
      if (item[2]) {
        return;
      }
      fireAddTrack(pc, item[0], item[1], []);
    });

    // check whether addIceCandidate({}) was called within four seconds after
    // setRemoteDescription.
    window.setTimeout(function() {
      if (!(pc && pc.transceivers)) {
        return;
      }
      pc.transceivers.forEach(function(transceiver) {
        if (transceiver.iceTransport &&
            transceiver.iceTransport.state === 'new' &&
            transceiver.iceTransport.getRemoteCandidates().length > 0) {
          console.warn('Timeout for addRemoteCandidate. Consider sending ' +
              'an end-of-candidates notification');
          transceiver.iceTransport.addRemoteCandidate({});
        }
      });
    }, 4000);

    return Promise.resolve();
  };

  RTCPeerConnection.prototype.close = function() {
    this.transceivers.forEach(function(transceiver) {
      /* not yet
      if (transceiver.iceGatherer) {
        transceiver.iceGatherer.close();
      }
      */
      if (transceiver.iceTransport) {
        transceiver.iceTransport.stop();
      }
      if (transceiver.dtlsTransport) {
        transceiver.dtlsTransport.stop();
      }
      if (transceiver.rtpSender) {
        transceiver.rtpSender.stop();
      }
      if (transceiver.rtpReceiver) {
        transceiver.rtpReceiver.stop();
      }
    });
    // FIXME: clean up tracks, local streams, remote streams, etc
    this._isClosed = true;
    this._updateSignalingState('closed');
  };

  // Update the signaling state.
  RTCPeerConnection.prototype._updateSignalingState = function(newState) {
    this.signalingState = newState;
    var event = new Event('signalingstatechange');
    this._dispatchEvent('signalingstatechange', event);
  };

  // Determine whether to fire the negotiationneeded event.
  RTCPeerConnection.prototype._maybeFireNegotiationNeeded = function() {
    var pc = this;
    if (this.signalingState !== 'stable' || this.needNegotiation === true) {
      return;
    }
    this.needNegotiation = true;
    window.setTimeout(function() {
      if (pc.needNegotiation) {
        pc.needNegotiation = false;
        var event = new Event('negotiationneeded');
        pc._dispatchEvent('negotiationneeded', event);
      }
    }, 0);
  };

  // Update the connection state.
  RTCPeerConnection.prototype._updateConnectionState = function() {
    var newState;
    var states = {
      'new': 0,
      closed: 0,
      connecting: 0,
      checking: 0,
      connected: 0,
      completed: 0,
      disconnected: 0,
      failed: 0
    };
    this.transceivers.forEach(function(transceiver) {
      states[transceiver.iceTransport.state]++;
      states[transceiver.dtlsTransport.state]++;
    });
    // ICETransport.completed and connected are the same for this purpose.
    states.connected += states.completed;

    newState = 'new';
    if (states.failed > 0) {
      newState = 'failed';
    } else if (states.connecting > 0 || states.checking > 0) {
      newState = 'connecting';
    } else if (states.disconnected > 0) {
      newState = 'disconnected';
    } else if (states.new > 0) {
      newState = 'new';
    } else if (states.connected > 0 || states.completed > 0) {
      newState = 'connected';
    }

    if (newState !== this.iceConnectionState) {
      this.iceConnectionState = newState;
      var event = new Event('iceconnectionstatechange');
      this._dispatchEvent('iceconnectionstatechange', event);
    }
  };

  RTCPeerConnection.prototype.createOffer = function() {
    var pc = this;

    if (pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not call createOffer after close'));
    }

    var numAudioTracks = pc.transceivers.filter(function(t) {
      return t.kind === 'audio';
    }).length;
    var numVideoTracks = pc.transceivers.filter(function(t) {
      return t.kind === 'video';
    }).length;

    // Determine number of audio and video tracks we need to send/recv.
    var offerOptions = arguments[0];
    if (offerOptions) {
      // Reject Chrome legacy constraints.
      if (offerOptions.mandatory || offerOptions.optional) {
        throw new TypeError(
            'Legacy mandatory/optional constraints not supported.');
      }
      if (offerOptions.offerToReceiveAudio !== undefined) {
        if (offerOptions.offerToReceiveAudio === true) {
          numAudioTracks = 1;
        } else if (offerOptions.offerToReceiveAudio === false) {
          numAudioTracks = 0;
        } else {
          numAudioTracks = offerOptions.offerToReceiveAudio;
        }
      }
      if (offerOptions.offerToReceiveVideo !== undefined) {
        if (offerOptions.offerToReceiveVideo === true) {
          numVideoTracks = 1;
        } else if (offerOptions.offerToReceiveVideo === false) {
          numVideoTracks = 0;
        } else {
          numVideoTracks = offerOptions.offerToReceiveVideo;
        }
      }
    }

    pc.transceivers.forEach(function(transceiver) {
      if (transceiver.kind === 'audio') {
        numAudioTracks--;
        if (numAudioTracks < 0) {
          transceiver.wantReceive = false;
        }
      } else if (transceiver.kind === 'video') {
        numVideoTracks--;
        if (numVideoTracks < 0) {
          transceiver.wantReceive = false;
        }
      }
    });

    // Create M-lines for recvonly streams.
    while (numAudioTracks > 0 || numVideoTracks > 0) {
      if (numAudioTracks > 0) {
        pc._createTransceiver('audio');
        numAudioTracks--;
      }
      if (numVideoTracks > 0) {
        pc._createTransceiver('video');
        numVideoTracks--;
      }
    }

    var sdp = SDPUtils.writeSessionBoilerplate(pc._sdpSessionId,
        pc._sdpSessionVersion++);
    pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
      // For each track, create an ice gatherer, ice transport,
      // dtls transport, potentially rtpsender and rtpreceiver.
      var track = transceiver.track;
      var kind = transceiver.kind;
      var mid = transceiver.mid || SDPUtils.generateIdentifier();
      transceiver.mid = mid;

      if (!transceiver.iceGatherer) {
        transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex,
            pc.usingBundle);
      }

      var localCapabilities = window.RTCRtpSender.getCapabilities(kind);
      // filter RTX until additional stuff needed for RTX is implemented
      // in adapter.js
      if (edgeVersion < 15019) {
        localCapabilities.codecs = localCapabilities.codecs.filter(
            function(codec) {
              return codec.name !== 'rtx';
            });
      }
      localCapabilities.codecs.forEach(function(codec) {
        // work around https://bugs.chromium.org/p/webrtc/issues/detail?id=6552
        // by adding level-asymmetry-allowed=1
        if (codec.name === 'H264' &&
            codec.parameters['level-asymmetry-allowed'] === undefined) {
          codec.parameters['level-asymmetry-allowed'] = '1';
        }

        // for subsequent offers, we might have to re-use the payload
        // type of the last offer.
        if (transceiver.remoteCapabilities &&
            transceiver.remoteCapabilities.codecs) {
          transceiver.remoteCapabilities.codecs.forEach(function(remoteCodec) {
            if (codec.name.toLowerCase() === remoteCodec.name.toLowerCase() &&
                codec.clockRate === remoteCodec.clockRate) {
              codec.preferredPayloadType = remoteCodec.payloadType;
            }
          });
        }
      });
      localCapabilities.headerExtensions.forEach(function(hdrExt) {
        var remoteExtensions = transceiver.remoteCapabilities &&
            transceiver.remoteCapabilities.headerExtensions || [];
        remoteExtensions.forEach(function(rHdrExt) {
          if (hdrExt.uri === rHdrExt.uri) {
            hdrExt.id = rHdrExt.id;
          }
        });
      });

      // generate an ssrc now, to be used later in rtpSender.send
      var sendEncodingParameters = transceiver.sendEncodingParameters || [{
        ssrc: (2 * sdpMLineIndex + 1) * 1001
      }];
      if (track) {
        // add RTX
        if (edgeVersion >= 15019 && kind === 'video' &&
            !sendEncodingParameters[0].rtx) {
          sendEncodingParameters[0].rtx = {
            ssrc: sendEncodingParameters[0].ssrc + 1
          };
        }
      }

      if (transceiver.wantReceive) {
        transceiver.rtpReceiver = new window.RTCRtpReceiver(
            transceiver.dtlsTransport, kind);
      }

      transceiver.localCapabilities = localCapabilities;
      transceiver.sendEncodingParameters = sendEncodingParameters;
    });

    // always offer BUNDLE and dispose on return if not supported.
    if (pc._config.bundlePolicy !== 'max-compat') {
      sdp += 'a=group:BUNDLE ' + pc.transceivers.map(function(t) {
        return t.mid;
      }).join(' ') + '\r\n';
    }
    sdp += 'a=ice-options:trickle\r\n';

    pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
      sdp += writeMediaSection(transceiver, transceiver.localCapabilities,
          'offer', transceiver.stream, pc._dtlsRole);
      sdp += 'a=rtcp-rsize\r\n';

      if (transceiver.iceGatherer && pc.iceGatheringState !== 'new' &&
          (sdpMLineIndex === 0 || !pc.usingBundle)) {
        transceiver.iceGatherer.getLocalCandidates().forEach(function(cand) {
          cand.component = 1;
          sdp += 'a=' + SDPUtils.writeCandidate(cand) + '\r\n';
        });

        if (transceiver.iceGatherer.state === 'completed') {
          sdp += 'a=end-of-candidates\r\n';
        }
      }
    });

    var desc = new window.RTCSessionDescription({
      type: 'offer',
      sdp: sdp
    });
    return Promise.resolve(desc);
  };

  RTCPeerConnection.prototype.createAnswer = function() {
    var pc = this;

    if (pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not call createAnswer after close'));
    }

    var sdp = SDPUtils.writeSessionBoilerplate(pc._sdpSessionId,
        pc._sdpSessionVersion++);
    if (pc.usingBundle) {
      sdp += 'a=group:BUNDLE ' + pc.transceivers.map(function(t) {
        return t.mid;
      }).join(' ') + '\r\n';
    }
    var mediaSectionsInOffer = SDPUtils.getMediaSections(
        pc.remoteDescription.sdp).length;
    pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
      if (sdpMLineIndex + 1 > mediaSectionsInOffer) {
        return;
      }
      if (transceiver.isDatachannel) {
        sdp += 'm=application 0 DTLS/SCTP 5000\r\n' +
            'c=IN IP4 0.0.0.0\r\n' +
            'a=mid:' + transceiver.mid + '\r\n';
        return;
      }

      // FIXME: look at direction.
      if (transceiver.stream) {
        var localTrack;
        if (transceiver.kind === 'audio') {
          localTrack = transceiver.stream.getAudioTracks()[0];
        } else if (transceiver.kind === 'video') {
          localTrack = transceiver.stream.getVideoTracks()[0];
        }
        if (localTrack) {
          // add RTX
          if (edgeVersion >= 15019 && transceiver.kind === 'video' &&
              !transceiver.sendEncodingParameters[0].rtx) {
            transceiver.sendEncodingParameters[0].rtx = {
              ssrc: transceiver.sendEncodingParameters[0].ssrc + 1
            };
          }
        }
      }

      // Calculate intersection of capabilities.
      var commonCapabilities = getCommonCapabilities(
          transceiver.localCapabilities,
          transceiver.remoteCapabilities);

      var hasRtx = commonCapabilities.codecs.filter(function(c) {
        return c.name.toLowerCase() === 'rtx';
      }).length;
      if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
        delete transceiver.sendEncodingParameters[0].rtx;
      }

      sdp += writeMediaSection(transceiver, commonCapabilities,
          'answer', transceiver.stream, pc._dtlsRole);
      if (transceiver.rtcpParameters &&
          transceiver.rtcpParameters.reducedSize) {
        sdp += 'a=rtcp-rsize\r\n';
      }
    });

    var desc = new window.RTCSessionDescription({
      type: 'answer',
      sdp: sdp
    });
    return Promise.resolve(desc);
  };

  RTCPeerConnection.prototype.addIceCandidate = function(candidate) {
    var pc = this;
    var sections;
    if (candidate && !(candidate.sdpMLineIndex !== undefined ||
        candidate.sdpMid)) {
      return Promise.reject(new TypeError('sdpMLineIndex or sdpMid required'));
    }

    // TODO: needs to go into ops queue.
    return new Promise(function(resolve, reject) {
      if (!pc.remoteDescription) {
        return reject(makeError('InvalidStateError',
            'Can not add ICE candidate without a remote description'));
      } else if (!candidate || candidate.candidate === '') {
        for (var j = 0; j < pc.transceivers.length; j++) {
          if (pc.transceivers[j].isDatachannel) {
            continue;
          }
          pc.transceivers[j].iceTransport.addRemoteCandidate({});
          sections = SDPUtils.getMediaSections(pc.remoteDescription.sdp);
          sections[j] += 'a=end-of-candidates\r\n';
          pc.remoteDescription.sdp =
              SDPUtils.getDescription(pc.remoteDescription.sdp) +
              sections.join('');
          if (pc.usingBundle) {
            break;
          }
        }
      } else {
        var sdpMLineIndex = candidate.sdpMLineIndex;
        if (candidate.sdpMid) {
          for (var i = 0; i < pc.transceivers.length; i++) {
            if (pc.transceivers[i].mid === candidate.sdpMid) {
              sdpMLineIndex = i;
              break;
            }
          }
        }
        var transceiver = pc.transceivers[sdpMLineIndex];
        if (transceiver) {
          if (transceiver.isDatachannel) {
            return resolve();
          }
          var cand = Object.keys(candidate.candidate).length > 0 ?
              SDPUtils.parseCandidate(candidate.candidate) : {};
          // Ignore Chrome's invalid candidates since Edge does not like them.
          if (cand.protocol === 'tcp' && (cand.port === 0 || cand.port === 9)) {
            return resolve();
          }
          // Ignore RTCP candidates, we assume RTCP-MUX.
          if (cand.component && cand.component !== 1) {
            return resolve();
          }
          // when using bundle, avoid adding candidates to the wrong
          // ice transport. And avoid adding candidates added in the SDP.
          if (sdpMLineIndex === 0 || (sdpMLineIndex > 0 &&
              transceiver.iceTransport !== pc.transceivers[0].iceTransport)) {
            if (!maybeAddCandidate(transceiver.iceTransport, cand)) {
              return reject(makeError('OperationError',
                  'Can not add ICE candidate'));
            }
          }

          // update the remoteDescription.
          var candidateString = candidate.candidate.trim();
          if (candidateString.indexOf('a=') === 0) {
            candidateString = candidateString.substr(2);
          }
          sections = SDPUtils.getMediaSections(pc.remoteDescription.sdp);
          sections[sdpMLineIndex] += 'a=' +
              (cand.type ? candidateString : 'end-of-candidates')
              + '\r\n';
          pc.remoteDescription.sdp = sections.join('');
        } else {
          return reject(makeError('OperationError',
              'Can not add ICE candidate'));
        }
      }
      resolve();
    });
  };

  RTCPeerConnection.prototype.getStats = function() {
    var promises = [];
    this.transceivers.forEach(function(transceiver) {
      ['rtpSender', 'rtpReceiver', 'iceGatherer', 'iceTransport',
          'dtlsTransport'].forEach(function(method) {
            if (transceiver[method]) {
              promises.push(transceiver[method].getStats());
            }
          });
    });
    var fixStatsType = function(stat) {
      return {
        inboundrtp: 'inbound-rtp',
        outboundrtp: 'outbound-rtp',
        candidatepair: 'candidate-pair',
        localcandidate: 'local-candidate',
        remotecandidate: 'remote-candidate'
      }[stat.type] || stat.type;
    };
    return new Promise(function(resolve) {
      // shim getStats with maplike support
      var results = new Map();
      Promise.all(promises).then(function(res) {
        res.forEach(function(result) {
          Object.keys(result).forEach(function(id) {
            result[id].type = fixStatsType(result[id]);
            results.set(id, result[id]);
          });
        });
        resolve(results);
      });
    });
  };

  // legacy callback shims. Should be moved to adapter.js some days.
  var methods = ['createOffer', 'createAnswer'];
  methods.forEach(function(method) {
    var nativeMethod = RTCPeerConnection.prototype[method];
    RTCPeerConnection.prototype[method] = function() {
      var args = arguments;
      if (typeof args[0] === 'function' ||
          typeof args[1] === 'function') { // legacy
        return nativeMethod.apply(this, [arguments[2]])
        .then(function(description) {
          if (typeof args[0] === 'function') {
            args[0].apply(null, [description]);
          }
        }, function(error) {
          if (typeof args[1] === 'function') {
            args[1].apply(null, [error]);
          }
        });
      }
      return nativeMethod.apply(this, arguments);
    };
  });

  methods = ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'];
  methods.forEach(function(method) {
    var nativeMethod = RTCPeerConnection.prototype[method];
    RTCPeerConnection.prototype[method] = function() {
      var args = arguments;
      if (typeof args[1] === 'function' ||
          typeof args[2] === 'function') { // legacy
        return nativeMethod.apply(this, arguments)
        .then(function() {
          if (typeof args[1] === 'function') {
            args[1].apply(null);
          }
        }, function(error) {
          if (typeof args[2] === 'function') {
            args[2].apply(null, [error]);
          }
        });
      }
      return nativeMethod.apply(this, arguments);
    };
  });

  // getStats is special. It doesn't have a spec legacy method yet we support
  // getStats(something, cb) without error callbacks.
  ['getStats'].forEach(function(method) {
    var nativeMethod = RTCPeerConnection.prototype[method];
    RTCPeerConnection.prototype[method] = function() {
      var args = arguments;
      if (typeof args[1] === 'function') {
        return nativeMethod.apply(this, arguments)
        .then(function() {
          if (typeof args[1] === 'function') {
            args[1].apply(null);
          }
        });
      }
      return nativeMethod.apply(this, arguments);
    };
  });

  return RTCPeerConnection;
};

},{"sdp":57}],57:[function(require,module,exports){
 /* eslint-env node */
'use strict';

// SDP helpers.
var SDPUtils = {};

// Generate an alphanumeric identifier for cname or mids.
// TODO: use UUIDs instead? https://gist.github.com/jed/982883
SDPUtils.generateIdentifier = function() {
  return Math.random().toString(36).substr(2, 10);
};

// The RTCP CNAME used by all peerconnections from the same JS.
SDPUtils.localCName = SDPUtils.generateIdentifier();

// Splits SDP into lines, dealing with both CRLF and LF.
SDPUtils.splitLines = function(blob) {
  return blob.trim().split('\n').map(function(line) {
    return line.trim();
  });
};
// Splits SDP into sessionpart and mediasections. Ensures CRLF.
SDPUtils.splitSections = function(blob) {
  var parts = blob.split('\nm=');
  return parts.map(function(part, index) {
    return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
  });
};

// returns the session description.
SDPUtils.getDescription = function(blob) {
  var sections = SDPUtils.splitSections(blob);
  return sections && sections[0];
};

// returns the individual media sections.
SDPUtils.getMediaSections = function(blob) {
  var sections = SDPUtils.splitSections(blob);
  sections.shift();
  return sections;
};

// Returns lines that start with a certain prefix.
SDPUtils.matchPrefix = function(blob, prefix) {
  return SDPUtils.splitLines(blob).filter(function(line) {
    return line.indexOf(prefix) === 0;
  });
};

// Parses an ICE candidate line. Sample input:
// candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
// rport 55996"
SDPUtils.parseCandidate = function(line) {
  var parts;
  // Parse both variants.
  if (line.indexOf('a=candidate:') === 0) {
    parts = line.substring(12).split(' ');
  } else {
    parts = line.substring(10).split(' ');
  }

  var candidate = {
    foundation: parts[0],
    component: parseInt(parts[1], 10),
    protocol: parts[2].toLowerCase(),
    priority: parseInt(parts[3], 10),
    ip: parts[4],
    port: parseInt(parts[5], 10),
    // skip parts[6] == 'typ'
    type: parts[7]
  };

  for (var i = 8; i < parts.length; i += 2) {
    switch (parts[i]) {
      case 'raddr':
        candidate.relatedAddress = parts[i + 1];
        break;
      case 'rport':
        candidate.relatedPort = parseInt(parts[i + 1], 10);
        break;
      case 'tcptype':
        candidate.tcpType = parts[i + 1];
        break;
      case 'ufrag':
        candidate.ufrag = parts[i + 1]; // for backward compability.
        candidate.usernameFragment = parts[i + 1];
        break;
      default: // extension handling, in particular ufrag
        candidate[parts[i]] = parts[i + 1];
        break;
    }
  }
  return candidate;
};

// Translates a candidate object into SDP candidate attribute.
SDPUtils.writeCandidate = function(candidate) {
  var sdp = [];
  sdp.push(candidate.foundation);
  sdp.push(candidate.component);
  sdp.push(candidate.protocol.toUpperCase());
  sdp.push(candidate.priority);
  sdp.push(candidate.ip);
  sdp.push(candidate.port);

  var type = candidate.type;
  sdp.push('typ');
  sdp.push(type);
  if (type !== 'host' && candidate.relatedAddress &&
      candidate.relatedPort) {
    sdp.push('raddr');
    sdp.push(candidate.relatedAddress); // was: relAddr
    sdp.push('rport');
    sdp.push(candidate.relatedPort); // was: relPort
  }
  if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
    sdp.push('tcptype');
    sdp.push(candidate.tcpType);
  }
  if (candidate.ufrag) {
    sdp.push('ufrag');
    sdp.push(candidate.ufrag);
  }
  return 'candidate:' + sdp.join(' ');
};

// Parses an ice-options line, returns an array of option tags.
// a=ice-options:foo bar
SDPUtils.parseIceOptions = function(line) {
  return line.substr(14).split(' ');
}

// Parses an rtpmap line, returns RTCRtpCoddecParameters. Sample input:
// a=rtpmap:111 opus/48000/2
SDPUtils.parseRtpMap = function(line) {
  var parts = line.substr(9).split(' ');
  var parsed = {
    payloadType: parseInt(parts.shift(), 10) // was: id
  };

  parts = parts[0].split('/');

  parsed.name = parts[0];
  parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
  // was: channels
  parsed.numChannels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
  return parsed;
};

// Generate an a=rtpmap line from RTCRtpCodecCapability or
// RTCRtpCodecParameters.
SDPUtils.writeRtpMap = function(codec) {
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate +
      (codec.numChannels !== 1 ? '/' + codec.numChannels : '') + '\r\n';
};

// Parses an a=extmap line (headerextension from RFC 5285). Sample input:
// a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
// a=extmap:2/sendonly urn:ietf:params:rtp-hdrext:toffset
SDPUtils.parseExtmap = function(line) {
  var parts = line.substr(9).split(' ');
  return {
    id: parseInt(parts[0], 10),
    direction: parts[0].indexOf('/') > 0 ? parts[0].split('/')[1] : 'sendrecv',
    uri: parts[1]
  };
};

// Generates a=extmap line from RTCRtpHeaderExtensionParameters or
// RTCRtpHeaderExtension.
SDPUtils.writeExtmap = function(headerExtension) {
  return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) +
      (headerExtension.direction && headerExtension.direction !== 'sendrecv'
          ? '/' + headerExtension.direction
          : '') +
      ' ' + headerExtension.uri + '\r\n';
};

// Parses an ftmp line, returns dictionary. Sample input:
// a=fmtp:96 vbr=on;cng=on
// Also deals with vbr=on; cng=on
SDPUtils.parseFmtp = function(line) {
  var parsed = {};
  var kv;
  var parts = line.substr(line.indexOf(' ') + 1).split(';');
  for (var j = 0; j < parts.length; j++) {
    kv = parts[j].trim().split('=');
    parsed[kv[0].trim()] = kv[1];
  }
  return parsed;
};

// Generates an a=ftmp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeFmtp = function(codec) {
  var line = '';
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  if (codec.parameters && Object.keys(codec.parameters).length) {
    var params = [];
    Object.keys(codec.parameters).forEach(function(param) {
      params.push(param + '=' + codec.parameters[param]);
    });
    line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
  }
  return line;
};

// Parses an rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
// a=rtcp-fb:98 nack rpsi
SDPUtils.parseRtcpFb = function(line) {
  var parts = line.substr(line.indexOf(' ') + 1).split(' ');
  return {
    type: parts.shift(),
    parameter: parts.join(' ')
  };
};
// Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeRtcpFb = function(codec) {
  var lines = '';
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
    // FIXME: special handling for trr-int?
    codec.rtcpFeedback.forEach(function(fb) {
      lines += 'a=rtcp-fb:' + pt + ' ' + fb.type +
      (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') +
          '\r\n';
    });
  }
  return lines;
};

// Parses an RFC 5576 ssrc media attribute. Sample input:
// a=ssrc:3735928559 cname:something
SDPUtils.parseSsrcMedia = function(line) {
  var sp = line.indexOf(' ');
  var parts = {
    ssrc: parseInt(line.substr(7, sp - 7), 10)
  };
  var colon = line.indexOf(':', sp);
  if (colon > -1) {
    parts.attribute = line.substr(sp + 1, colon - sp - 1);
    parts.value = line.substr(colon + 1);
  } else {
    parts.attribute = line.substr(sp + 1);
  }
  return parts;
};

// Extracts the MID (RFC 5888) from a media section.
// returns the MID or undefined if no mid line was found.
SDPUtils.getMid = function(mediaSection) {
  var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];
  if (mid) {
    return mid.substr(6);
  }
}

SDPUtils.parseFingerprint = function(line) {
  var parts = line.substr(14).split(' ');
  return {
    algorithm: parts[0].toLowerCase(), // algorithm is case-sensitive in Edge.
    value: parts[1]
  };
};

// Extracts DTLS parameters from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the fingerprint line as input. See also getIceParameters.
SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
  var lines = SDPUtils.matchPrefix(mediaSection + sessionpart,
      'a=fingerprint:');
  // Note: a=setup line is ignored since we use the 'auto' role.
  // Note2: 'algorithm' is not case sensitive except in Edge.
  return {
    role: 'auto',
    fingerprints: lines.map(SDPUtils.parseFingerprint)
  };
};

// Serializes DTLS parameters to SDP.
SDPUtils.writeDtlsParameters = function(params, setupType) {
  var sdp = 'a=setup:' + setupType + '\r\n';
  params.fingerprints.forEach(function(fp) {
    sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
  });
  return sdp;
};
// Parses ICE information from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the ice-ufrag and ice-pwd lines as input.
SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
  var lines = SDPUtils.splitLines(mediaSection);
  // Search in session part, too.
  lines = lines.concat(SDPUtils.splitLines(sessionpart));
  var iceParameters = {
    usernameFragment: lines.filter(function(line) {
      return line.indexOf('a=ice-ufrag:') === 0;
    })[0].substr(12),
    password: lines.filter(function(line) {
      return line.indexOf('a=ice-pwd:') === 0;
    })[0].substr(10)
  };
  return iceParameters;
};

// Serializes ICE parameters to SDP.
SDPUtils.writeIceParameters = function(params) {
  return 'a=ice-ufrag:' + params.usernameFragment + '\r\n' +
      'a=ice-pwd:' + params.password + '\r\n';
};

// Parses the SDP media section and returns RTCRtpParameters.
SDPUtils.parseRtpParameters = function(mediaSection) {
  var description = {
    codecs: [],
    headerExtensions: [],
    fecMechanisms: [],
    rtcp: []
  };
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');
  for (var i = 3; i < mline.length; i++) { // find all codecs from mline[3..]
    var pt = mline[i];
    var rtpmapline = SDPUtils.matchPrefix(
        mediaSection, 'a=rtpmap:' + pt + ' ')[0];
    if (rtpmapline) {
      var codec = SDPUtils.parseRtpMap(rtpmapline);
      var fmtps = SDPUtils.matchPrefix(
          mediaSection, 'a=fmtp:' + pt + ' ');
      // Only the first a=fmtp:<pt> is considered.
      codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
      codec.rtcpFeedback = SDPUtils.matchPrefix(
          mediaSection, 'a=rtcp-fb:' + pt + ' ')
        .map(SDPUtils.parseRtcpFb);
      description.codecs.push(codec);
      // parse FEC mechanisms from rtpmap lines.
      switch (codec.name.toUpperCase()) {
        case 'RED':
        case 'ULPFEC':
          description.fecMechanisms.push(codec.name.toUpperCase());
          break;
        default: // only RED and ULPFEC are recognized as FEC mechanisms.
          break;
      }
    }
  }
  SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(function(line) {
    description.headerExtensions.push(SDPUtils.parseExtmap(line));
  });
  // FIXME: parse rtcp.
  return description;
};

// Generates parts of the SDP media section describing the capabilities /
// parameters.
SDPUtils.writeRtpDescription = function(kind, caps) {
  var sdp = '';

  // Build the mline.
  sdp += 'm=' + kind + ' ';
  sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
  sdp += ' UDP/TLS/RTP/SAVPF ';
  sdp += caps.codecs.map(function(codec) {
    if (codec.preferredPayloadType !== undefined) {
      return codec.preferredPayloadType;
    }
    return codec.payloadType;
  }).join(' ') + '\r\n';

  sdp += 'c=IN IP4 0.0.0.0\r\n';
  sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';

  // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
  caps.codecs.forEach(function(codec) {
    sdp += SDPUtils.writeRtpMap(codec);
    sdp += SDPUtils.writeFmtp(codec);
    sdp += SDPUtils.writeRtcpFb(codec);
  });
  var maxptime = 0;
  caps.codecs.forEach(function(codec) {
    if (codec.maxptime > maxptime) {
      maxptime = codec.maxptime;
    }
  });
  if (maxptime > 0) {
    sdp += 'a=maxptime:' + maxptime + '\r\n';
  }
  sdp += 'a=rtcp-mux\r\n';

  caps.headerExtensions.forEach(function(extension) {
    sdp += SDPUtils.writeExtmap(extension);
  });
  // FIXME: write fecMechanisms.
  return sdp;
};

// Parses the SDP media section and returns an array of
// RTCRtpEncodingParameters.
SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
  var encodingParameters = [];
  var description = SDPUtils.parseRtpParameters(mediaSection);
  var hasRed = description.fecMechanisms.indexOf('RED') !== -1;
  var hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;

  // filter a=ssrc:... cname:, ignore PlanB-msid
  var ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
  .map(function(line) {
    return SDPUtils.parseSsrcMedia(line);
  })
  .filter(function(parts) {
    return parts.attribute === 'cname';
  });
  var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
  var secondarySsrc;

  var flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID')
  .map(function(line) {
    var parts = line.split(' ');
    parts.shift();
    return parts.map(function(part) {
      return parseInt(part, 10);
    });
  });
  if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
    secondarySsrc = flows[0][1];
  }

  description.codecs.forEach(function(codec) {
    if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
      var encParam = {
        ssrc: primarySsrc,
        codecPayloadType: parseInt(codec.parameters.apt, 10),
        rtx: {
          ssrc: secondarySsrc
        }
      };
      encodingParameters.push(encParam);
      if (hasRed) {
        encParam = JSON.parse(JSON.stringify(encParam));
        encParam.fec = {
          ssrc: secondarySsrc,
          mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
        };
        encodingParameters.push(encParam);
      }
    }
  });
  if (encodingParameters.length === 0 && primarySsrc) {
    encodingParameters.push({
      ssrc: primarySsrc
    });
  }

  // we support both b=AS and b=TIAS but interpret AS as TIAS.
  var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
  if (bandwidth.length) {
    if (bandwidth[0].indexOf('b=TIAS:') === 0) {
      bandwidth = parseInt(bandwidth[0].substr(7), 10);
    } else if (bandwidth[0].indexOf('b=AS:') === 0) {
      // use formula from JSEP to convert b=AS to TIAS value.
      bandwidth = parseInt(bandwidth[0].substr(5), 10) * 1000 * 0.95
          - (50 * 40 * 8);
    } else {
      bandwidth = undefined;
    }
    encodingParameters.forEach(function(params) {
      params.maxBitrate = bandwidth;
    });
  }
  return encodingParameters;
};

// parses http://draft.ortc.org/#rtcrtcpparameters*
SDPUtils.parseRtcpParameters = function(mediaSection) {
  var rtcpParameters = {};

  var cname;
  // Gets the first SSRC. Note that with RTX there might be multiple
  // SSRCs.
  var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
      .map(function(line) {
        return SDPUtils.parseSsrcMedia(line);
      })
      .filter(function(obj) {
        return obj.attribute === 'cname';
      })[0];
  if (remoteSsrc) {
    rtcpParameters.cname = remoteSsrc.value;
    rtcpParameters.ssrc = remoteSsrc.ssrc;
  }

  // Edge uses the compound attribute instead of reducedSize
  // compound is !reducedSize
  var rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
  rtcpParameters.reducedSize = rsize.length > 0;
  rtcpParameters.compound = rsize.length === 0;

  // parses the rtcp-mux attrіbute.
  // Note that Edge does not support unmuxed RTCP.
  var mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
  rtcpParameters.mux = mux.length > 0;

  return rtcpParameters;
};

// parses either a=msid: or a=ssrc:... msid lines and returns
// the id of the MediaStream and MediaStreamTrack.
SDPUtils.parseMsid = function(mediaSection) {
  var parts;
  var spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');
  if (spec.length === 1) {
    parts = spec[0].substr(7).split(' ');
    return {stream: parts[0], track: parts[1]};
  }
  var planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
  .map(function(line) {
    return SDPUtils.parseSsrcMedia(line);
  })
  .filter(function(parts) {
    return parts.attribute === 'msid';
  });
  if (planB.length > 0) {
    parts = planB[0].value.split(' ');
    return {stream: parts[0], track: parts[1]};
  }
};

// Generate a session ID for SDP.
// https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-20#section-5.2.1
// recommends using a cryptographically random +ve 64-bit value
// but right now this should be acceptable and within the right range
SDPUtils.generateSessionId = function() {
  return Math.random().toString().substr(2, 21);
};

// Write boilder plate for start of SDP
// sessId argument is optional - if not supplied it will
// be generated randomly
// sessVersion is optional and defaults to 2
SDPUtils.writeSessionBoilerplate = function(sessId, sessVer) {
  var sessionId;
  var version = sessVer !== undefined ? sessVer : 2;
  if (sessId) {
    sessionId = sessId;
  } else {
    sessionId = SDPUtils.generateSessionId();
  }
  // FIXME: sess-id should be an NTP timestamp.
  return 'v=0\r\n' +
      'o=thisisadapterortc ' + sessionId + ' ' + version + ' IN IP4 127.0.0.1\r\n' +
      's=-\r\n' +
      't=0 0\r\n';
};

SDPUtils.writeMediaSection = function(transceiver, caps, type, stream) {
  var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

  // Map ICE parameters (ufrag, pwd) to SDP.
  sdp += SDPUtils.writeIceParameters(
      transceiver.iceGatherer.getLocalParameters());

  // Map DTLS parameters to SDP.
  sdp += SDPUtils.writeDtlsParameters(
      transceiver.dtlsTransport.getLocalParameters(),
      type === 'offer' ? 'actpass' : 'active');

  sdp += 'a=mid:' + transceiver.mid + '\r\n';

  if (transceiver.direction) {
    sdp += 'a=' + transceiver.direction + '\r\n';
  } else if (transceiver.rtpSender && transceiver.rtpReceiver) {
    sdp += 'a=sendrecv\r\n';
  } else if (transceiver.rtpSender) {
    sdp += 'a=sendonly\r\n';
  } else if (transceiver.rtpReceiver) {
    sdp += 'a=recvonly\r\n';
  } else {
    sdp += 'a=inactive\r\n';
  }

  if (transceiver.rtpSender) {
    // spec.
    var msid = 'msid:' + stream.id + ' ' +
        transceiver.rtpSender.track.id + '\r\n';
    sdp += 'a=' + msid;

    // for Chrome.
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
        ' ' + msid;
    if (transceiver.sendEncodingParameters[0].rtx) {
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
          ' ' + msid;
      sdp += 'a=ssrc-group:FID ' +
          transceiver.sendEncodingParameters[0].ssrc + ' ' +
          transceiver.sendEncodingParameters[0].rtx.ssrc +
          '\r\n';
    }
  }
  // FIXME: this should be written by writeRtpDescription.
  sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
      ' cname:' + SDPUtils.localCName + '\r\n';
  if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
        ' cname:' + SDPUtils.localCName + '\r\n';
  }
  return sdp;
};

// Gets the direction from the mediaSection or the sessionpart.
SDPUtils.getDirection = function(mediaSection, sessionpart) {
  // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
  var lines = SDPUtils.splitLines(mediaSection);
  for (var i = 0; i < lines.length; i++) {
    switch (lines[i]) {
      case 'a=sendrecv':
      case 'a=sendonly':
      case 'a=recvonly':
      case 'a=inactive':
        return lines[i].substr(2);
      default:
        // FIXME: What should happen here?
    }
  }
  if (sessionpart) {
    return SDPUtils.getDirection(sessionpart);
  }
  return 'sendrecv';
};

SDPUtils.getKind = function(mediaSection) {
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');
  return mline[0].substr(2);
};

SDPUtils.isRejected = function(mediaSection) {
  return mediaSection.split(' ', 2)[1] === '0';
};

SDPUtils.parseMLine = function(mediaSection) {
  var lines = SDPUtils.splitLines(mediaSection);
  var parts = lines[0].substr(2).split(' ');
  return {
    kind: parts[0],
    port: parseInt(parts[1], 10),
    protocol: parts[2],
    fmt: parts.slice(3).join(' ')
  };
};

SDPUtils.parseOLine = function(mediaSection) {
  var line = SDPUtils.matchPrefix(mediaSection, 'o=')[0];
  var parts = line.substr(2).split(' ');
  return {
    username: parts[0],
    sessionId: parts[1],
    sessionVersion: parseInt(parts[2], 10),
    netType: parts[3],
    addressType: parts[4],
    address: parts[5],
  };
}

// Expose public methods.
if (typeof module === 'object') {
  module.exports = SDPUtils;
}

},{}],58:[function(require,module,exports){

/**
 * Module dependencies.
 */

var url = require('./url');
var parser = require('socket.io-parser');
var Manager = require('./manager');
var debug = require('debug')('socket.io-client');

/**
 * Module exports.
 */

module.exports = exports = lookup;

/**
 * Managers cache.
 */

var cache = exports.managers = {};

/**
 * Looks up an existing `Manager` for multiplexing.
 * If the user summons:
 *
 *   `io('http://localhost/a');`
 *   `io('http://localhost/b');`
 *
 * We reuse the existing instance based on same scheme/port/host,
 * and we initialize sockets for each namespace.
 *
 * @api public
 */

function lookup (uri, opts) {
  if (typeof uri === 'object') {
    opts = uri;
    uri = undefined;
  }

  opts = opts || {};

  var parsed = url(uri);
  var source = parsed.source;
  var id = parsed.id;
  var path = parsed.path;
  var sameNamespace = cache[id] && path in cache[id].nsps;
  var newConnection = opts.forceNew || opts['force new connection'] ||
                      false === opts.multiplex || sameNamespace;

  var io;

  if (newConnection) {
    debug('ignoring socket cache for %s', source);
    io = Manager(source, opts);
  } else {
    if (!cache[id]) {
      debug('new io instance for %s', source);
      cache[id] = Manager(source, opts);
    }
    io = cache[id];
  }
  if (parsed.query && !opts.query) {
    opts.query = parsed.query;
  }
  return io.socket(parsed.path, opts);
}

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = parser.protocol;

/**
 * `connect`.
 *
 * @param {String} uri
 * @api public
 */

exports.connect = lookup;

/**
 * Expose constructors for standalone build.
 *
 * @api public
 */

exports.Manager = require('./manager');
exports.Socket = require('./socket');

},{"./manager":59,"./socket":61,"./url":62,"debug":30,"socket.io-parser":64}],59:[function(require,module,exports){

/**
 * Module dependencies.
 */

var eio = require('engine.io-client');
var Socket = require('./socket');
var Emitter = require('component-emitter');
var parser = require('socket.io-parser');
var on = require('./on');
var bind = require('component-bind');
var debug = require('debug')('socket.io-client:manager');
var indexOf = require('indexof');
var Backoff = require('backo2');

/**
 * IE6+ hasOwnProperty
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Module exports
 */

module.exports = Manager;

/**
 * `Manager` constructor.
 *
 * @param {String} engine instance or engine uri/opts
 * @param {Object} options
 * @api public
 */

function Manager (uri, opts) {
  if (!(this instanceof Manager)) return new Manager(uri, opts);
  if (uri && ('object' === typeof uri)) {
    opts = uri;
    uri = undefined;
  }
  opts = opts || {};

  opts.path = opts.path || '/socket.io';
  this.nsps = {};
  this.subs = [];
  this.opts = opts;
  this.reconnection(opts.reconnection !== false);
  this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
  this.reconnectionDelay(opts.reconnectionDelay || 1000);
  this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
  this.randomizationFactor(opts.randomizationFactor || 0.5);
  this.backoff = new Backoff({
    min: this.reconnectionDelay(),
    max: this.reconnectionDelayMax(),
    jitter: this.randomizationFactor()
  });
  this.timeout(null == opts.timeout ? 20000 : opts.timeout);
  this.readyState = 'closed';
  this.uri = uri;
  this.connecting = [];
  this.lastPing = null;
  this.encoding = false;
  this.packetBuffer = [];
  var _parser = opts.parser || parser;
  this.encoder = new _parser.Encoder();
  this.decoder = new _parser.Decoder();
  this.autoConnect = opts.autoConnect !== false;
  if (this.autoConnect) this.open();
}

/**
 * Propagate given event to sockets and emit on `this`
 *
 * @api private
 */

Manager.prototype.emitAll = function () {
  this.emit.apply(this, arguments);
  for (var nsp in this.nsps) {
    if (has.call(this.nsps, nsp)) {
      this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
    }
  }
};

/**
 * Update `socket.id` of all sockets
 *
 * @api private
 */

Manager.prototype.updateSocketIds = function () {
  for (var nsp in this.nsps) {
    if (has.call(this.nsps, nsp)) {
      this.nsps[nsp].id = this.generateId(nsp);
    }
  }
};

/**
 * generate `socket.id` for the given `nsp`
 *
 * @param {String} nsp
 * @return {String}
 * @api private
 */

Manager.prototype.generateId = function (nsp) {
  return (nsp === '/' ? '' : (nsp + '#')) + this.engine.id;
};

/**
 * Mix in `Emitter`.
 */

Emitter(Manager.prototype);

/**
 * Sets the `reconnection` config.
 *
 * @param {Boolean} true/false if it should automatically reconnect
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnection = function (v) {
  if (!arguments.length) return this._reconnection;
  this._reconnection = !!v;
  return this;
};

/**
 * Sets the reconnection attempts config.
 *
 * @param {Number} max reconnection attempts before giving up
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionAttempts = function (v) {
  if (!arguments.length) return this._reconnectionAttempts;
  this._reconnectionAttempts = v;
  return this;
};

/**
 * Sets the delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelay = function (v) {
  if (!arguments.length) return this._reconnectionDelay;
  this._reconnectionDelay = v;
  this.backoff && this.backoff.setMin(v);
  return this;
};

Manager.prototype.randomizationFactor = function (v) {
  if (!arguments.length) return this._randomizationFactor;
  this._randomizationFactor = v;
  this.backoff && this.backoff.setJitter(v);
  return this;
};

/**
 * Sets the maximum delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelayMax = function (v) {
  if (!arguments.length) return this._reconnectionDelayMax;
  this._reconnectionDelayMax = v;
  this.backoff && this.backoff.setMax(v);
  return this;
};

/**
 * Sets the connection timeout. `false` to disable
 *
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.timeout = function (v) {
  if (!arguments.length) return this._timeout;
  this._timeout = v;
  return this;
};

/**
 * Starts trying to reconnect if reconnection is enabled and we have not
 * started reconnecting yet
 *
 * @api private
 */

Manager.prototype.maybeReconnectOnOpen = function () {
  // Only try to reconnect if it's the first time we're connecting
  if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
    // keeps reconnection from firing twice for the same reconnection loop
    this.reconnect();
  }
};

/**
 * Sets the current transport `socket`.
 *
 * @param {Function} optional, callback
 * @return {Manager} self
 * @api public
 */

Manager.prototype.open =
Manager.prototype.connect = function (fn, opts) {
  debug('readyState %s', this.readyState);
  if (~this.readyState.indexOf('open')) return this;

  debug('opening %s', this.uri);
  this.engine = eio(this.uri, this.opts);
  var socket = this.engine;
  var self = this;
  this.readyState = 'opening';
  this.skipReconnect = false;

  // emit `open`
  var openSub = on(socket, 'open', function () {
    self.onopen();
    fn && fn();
  });

  // emit `connect_error`
  var errorSub = on(socket, 'error', function (data) {
    debug('connect_error');
    self.cleanup();
    self.readyState = 'closed';
    self.emitAll('connect_error', data);
    if (fn) {
      var err = new Error('Connection error');
      err.data = data;
      fn(err);
    } else {
      // Only do this if there is no fn to handle the error
      self.maybeReconnectOnOpen();
    }
  });

  // emit `connect_timeout`
  if (false !== this._timeout) {
    var timeout = this._timeout;
    debug('connect attempt will timeout after %d', timeout);

    // set timer
    var timer = setTimeout(function () {
      debug('connect attempt timed out after %d', timeout);
      openSub.destroy();
      socket.close();
      socket.emit('error', 'timeout');
      self.emitAll('connect_timeout', timeout);
    }, timeout);

    this.subs.push({
      destroy: function () {
        clearTimeout(timer);
      }
    });
  }

  this.subs.push(openSub);
  this.subs.push(errorSub);

  return this;
};

/**
 * Called upon transport open.
 *
 * @api private
 */

Manager.prototype.onopen = function () {
  debug('open');

  // clear old subs
  this.cleanup();

  // mark as open
  this.readyState = 'open';
  this.emit('open');

  // add new subs
  var socket = this.engine;
  this.subs.push(on(socket, 'data', bind(this, 'ondata')));
  this.subs.push(on(socket, 'ping', bind(this, 'onping')));
  this.subs.push(on(socket, 'pong', bind(this, 'onpong')));
  this.subs.push(on(socket, 'error', bind(this, 'onerror')));
  this.subs.push(on(socket, 'close', bind(this, 'onclose')));
  this.subs.push(on(this.decoder, 'decoded', bind(this, 'ondecoded')));
};

/**
 * Called upon a ping.
 *
 * @api private
 */

Manager.prototype.onping = function () {
  this.lastPing = new Date();
  this.emitAll('ping');
};

/**
 * Called upon a packet.
 *
 * @api private
 */

Manager.prototype.onpong = function () {
  this.emitAll('pong', new Date() - this.lastPing);
};

/**
 * Called with data.
 *
 * @api private
 */

Manager.prototype.ondata = function (data) {
  this.decoder.add(data);
};

/**
 * Called when parser fully decodes a packet.
 *
 * @api private
 */

Manager.prototype.ondecoded = function (packet) {
  this.emit('packet', packet);
};

/**
 * Called upon socket error.
 *
 * @api private
 */

Manager.prototype.onerror = function (err) {
  debug('error', err);
  this.emitAll('error', err);
};

/**
 * Creates a new socket for the given `nsp`.
 *
 * @return {Socket}
 * @api public
 */

Manager.prototype.socket = function (nsp, opts) {
  var socket = this.nsps[nsp];
  if (!socket) {
    socket = new Socket(this, nsp, opts);
    this.nsps[nsp] = socket;
    var self = this;
    socket.on('connecting', onConnecting);
    socket.on('connect', function () {
      socket.id = self.generateId(nsp);
    });

    if (this.autoConnect) {
      // manually call here since connecting event is fired before listening
      onConnecting();
    }
  }

  function onConnecting () {
    if (!~indexOf(self.connecting, socket)) {
      self.connecting.push(socket);
    }
  }

  return socket;
};

/**
 * Called upon a socket close.
 *
 * @param {Socket} socket
 */

Manager.prototype.destroy = function (socket) {
  var index = indexOf(this.connecting, socket);
  if (~index) this.connecting.splice(index, 1);
  if (this.connecting.length) return;

  this.close();
};

/**
 * Writes a packet.
 *
 * @param {Object} packet
 * @api private
 */

Manager.prototype.packet = function (packet) {
  debug('writing packet %j', packet);
  var self = this;
  if (packet.query && packet.type === 0) packet.nsp += '?' + packet.query;

  if (!self.encoding) {
    // encode, then write to engine with result
    self.encoding = true;
    this.encoder.encode(packet, function (encodedPackets) {
      for (var i = 0; i < encodedPackets.length; i++) {
        self.engine.write(encodedPackets[i], packet.options);
      }
      self.encoding = false;
      self.processPacketQueue();
    });
  } else { // add packet to the queue
    self.packetBuffer.push(packet);
  }
};

/**
 * If packet buffer is non-empty, begins encoding the
 * next packet in line.
 *
 * @api private
 */

Manager.prototype.processPacketQueue = function () {
  if (this.packetBuffer.length > 0 && !this.encoding) {
    var pack = this.packetBuffer.shift();
    this.packet(pack);
  }
};

/**
 * Clean up transport subscriptions and packet buffer.
 *
 * @api private
 */

Manager.prototype.cleanup = function () {
  debug('cleanup');

  var subsLength = this.subs.length;
  for (var i = 0; i < subsLength; i++) {
    var sub = this.subs.shift();
    sub.destroy();
  }

  this.packetBuffer = [];
  this.encoding = false;
  this.lastPing = null;

  this.decoder.destroy();
};

/**
 * Close the current socket.
 *
 * @api private
 */

Manager.prototype.close =
Manager.prototype.disconnect = function () {
  debug('disconnect');
  this.skipReconnect = true;
  this.reconnecting = false;
  if ('opening' === this.readyState) {
    // `onclose` will not fire because
    // an open event never happened
    this.cleanup();
  }
  this.backoff.reset();
  this.readyState = 'closed';
  if (this.engine) this.engine.close();
};

/**
 * Called upon engine close.
 *
 * @api private
 */

Manager.prototype.onclose = function (reason) {
  debug('onclose');

  this.cleanup();
  this.backoff.reset();
  this.readyState = 'closed';
  this.emit('close', reason);

  if (this._reconnection && !this.skipReconnect) {
    this.reconnect();
  }
};

/**
 * Attempt a reconnection.
 *
 * @api private
 */

Manager.prototype.reconnect = function () {
  if (this.reconnecting || this.skipReconnect) return this;

  var self = this;

  if (this.backoff.attempts >= this._reconnectionAttempts) {
    debug('reconnect failed');
    this.backoff.reset();
    this.emitAll('reconnect_failed');
    this.reconnecting = false;
  } else {
    var delay = this.backoff.duration();
    debug('will wait %dms before reconnect attempt', delay);

    this.reconnecting = true;
    var timer = setTimeout(function () {
      if (self.skipReconnect) return;

      debug('attempting reconnect');
      self.emitAll('reconnect_attempt', self.backoff.attempts);
      self.emitAll('reconnecting', self.backoff.attempts);

      // check again for the case socket closed in above events
      if (self.skipReconnect) return;

      self.open(function (err) {
        if (err) {
          debug('reconnect attempt error');
          self.reconnecting = false;
          self.reconnect();
          self.emitAll('reconnect_error', err.data);
        } else {
          debug('reconnect success');
          self.onreconnect();
        }
      });
    }, delay);

    this.subs.push({
      destroy: function () {
        clearTimeout(timer);
      }
    });
  }
};

/**
 * Called upon successful reconnect.
 *
 * @api private
 */

Manager.prototype.onreconnect = function () {
  var attempt = this.backoff.attempts;
  this.reconnecting = false;
  this.backoff.reset();
  this.updateSocketIds();
  this.emitAll('reconnect', attempt);
};

},{"./on":60,"./socket":61,"backo2":23,"component-bind":27,"component-emitter":28,"debug":30,"engine.io-client":33,"indexof":48,"socket.io-parser":64}],60:[function(require,module,exports){

/**
 * Module exports.
 */

module.exports = on;

/**
 * Helper for subscriptions.
 *
 * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
 * @param {String} event name
 * @param {Function} callback
 * @api public
 */

function on (obj, ev, fn) {
  obj.on(ev, fn);
  return {
    destroy: function () {
      obj.removeListener(ev, fn);
    }
  };
}

},{}],61:[function(require,module,exports){

/**
 * Module dependencies.
 */

var parser = require('socket.io-parser');
var Emitter = require('component-emitter');
var toArray = require('to-array');
var on = require('./on');
var bind = require('component-bind');
var debug = require('debug')('socket.io-client:socket');
var parseqs = require('parseqs');

/**
 * Module exports.
 */

module.exports = exports = Socket;

/**
 * Internal events (blacklisted).
 * These events can't be emitted by the user.
 *
 * @api private
 */

var events = {
  connect: 1,
  connect_error: 1,
  connect_timeout: 1,
  connecting: 1,
  disconnect: 1,
  error: 1,
  reconnect: 1,
  reconnect_attempt: 1,
  reconnect_failed: 1,
  reconnect_error: 1,
  reconnecting: 1,
  ping: 1,
  pong: 1
};

/**
 * Shortcut to `Emitter#emit`.
 */

var emit = Emitter.prototype.emit;

/**
 * `Socket` constructor.
 *
 * @api public
 */

function Socket (io, nsp, opts) {
  this.io = io;
  this.nsp = nsp;
  this.json = this; // compat
  this.ids = 0;
  this.acks = {};
  this.receiveBuffer = [];
  this.sendBuffer = [];
  this.connected = false;
  this.disconnected = true;
  if (opts && opts.query) {
    this.query = opts.query;
  }
  if (this.io.autoConnect) this.open();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Subscribe to open, close and packet events
 *
 * @api private
 */

Socket.prototype.subEvents = function () {
  if (this.subs) return;

  var io = this.io;
  this.subs = [
    on(io, 'open', bind(this, 'onopen')),
    on(io, 'packet', bind(this, 'onpacket')),
    on(io, 'close', bind(this, 'onclose'))
  ];
};

/**
 * "Opens" the socket.
 *
 * @api public
 */

Socket.prototype.open =
Socket.prototype.connect = function () {
  if (this.connected) return this;

  this.subEvents();
  this.io.open(); // ensure open
  if ('open' === this.io.readyState) this.onopen();
  this.emit('connecting');
  return this;
};

/**
 * Sends a `message` event.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.send = function () {
  var args = toArray(arguments);
  args.unshift('message');
  this.emit.apply(this, args);
  return this;
};

/**
 * Override `emit`.
 * If the event is in `events`, it's emitted normally.
 *
 * @param {String} event name
 * @return {Socket} self
 * @api public
 */

Socket.prototype.emit = function (ev) {
  if (events.hasOwnProperty(ev)) {
    emit.apply(this, arguments);
    return this;
  }

  var args = toArray(arguments);
  var packet = { type: parser.EVENT, data: args };

  packet.options = {};
  packet.options.compress = !this.flags || false !== this.flags.compress;

  // event ack callback
  if ('function' === typeof args[args.length - 1]) {
    debug('emitting packet with ack id %d', this.ids);
    this.acks[this.ids] = args.pop();
    packet.id = this.ids++;
  }

  if (this.connected) {
    this.packet(packet);
  } else {
    this.sendBuffer.push(packet);
  }

  delete this.flags;

  return this;
};

/**
 * Sends a packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.packet = function (packet) {
  packet.nsp = this.nsp;
  this.io.packet(packet);
};

/**
 * Called upon engine `open`.
 *
 * @api private
 */

Socket.prototype.onopen = function () {
  debug('transport is open - connecting');

  // write connect packet if necessary
  if ('/' !== this.nsp) {
    if (this.query) {
      var query = typeof this.query === 'object' ? parseqs.encode(this.query) : this.query;
      debug('sending connect packet with query %s', query);
      this.packet({type: parser.CONNECT, query: query});
    } else {
      this.packet({type: parser.CONNECT});
    }
  }
};

/**
 * Called upon engine `close`.
 *
 * @param {String} reason
 * @api private
 */

Socket.prototype.onclose = function (reason) {
  debug('close (%s)', reason);
  this.connected = false;
  this.disconnected = true;
  delete this.id;
  this.emit('disconnect', reason);
};

/**
 * Called with socket packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onpacket = function (packet) {
  if (packet.nsp !== this.nsp) return;

  switch (packet.type) {
    case parser.CONNECT:
      this.onconnect();
      break;

    case parser.EVENT:
      this.onevent(packet);
      break;

    case parser.BINARY_EVENT:
      this.onevent(packet);
      break;

    case parser.ACK:
      this.onack(packet);
      break;

    case parser.BINARY_ACK:
      this.onack(packet);
      break;

    case parser.DISCONNECT:
      this.ondisconnect();
      break;

    case parser.ERROR:
      this.emit('error', packet.data);
      break;
  }
};

/**
 * Called upon a server event.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onevent = function (packet) {
  var args = packet.data || [];
  debug('emitting event %j', args);

  if (null != packet.id) {
    debug('attaching ack callback to event');
    args.push(this.ack(packet.id));
  }

  if (this.connected) {
    emit.apply(this, args);
  } else {
    this.receiveBuffer.push(args);
  }
};

/**
 * Produces an ack callback to emit with an event.
 *
 * @api private
 */

Socket.prototype.ack = function (id) {
  var self = this;
  var sent = false;
  return function () {
    // prevent double callbacks
    if (sent) return;
    sent = true;
    var args = toArray(arguments);
    debug('sending ack %j', args);

    self.packet({
      type: parser.ACK,
      id: id,
      data: args
    });
  };
};

/**
 * Called upon a server acknowlegement.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onack = function (packet) {
  var ack = this.acks[packet.id];
  if ('function' === typeof ack) {
    debug('calling ack %s with %j', packet.id, packet.data);
    ack.apply(this, packet.data);
    delete this.acks[packet.id];
  } else {
    debug('bad ack %s', packet.id);
  }
};

/**
 * Called upon server connect.
 *
 * @api private
 */

Socket.prototype.onconnect = function () {
  this.connected = true;
  this.disconnected = false;
  this.emit('connect');
  this.emitBuffered();
};

/**
 * Emit buffered events (received and emitted).
 *
 * @api private
 */

Socket.prototype.emitBuffered = function () {
  var i;
  for (i = 0; i < this.receiveBuffer.length; i++) {
    emit.apply(this, this.receiveBuffer[i]);
  }
  this.receiveBuffer = [];

  for (i = 0; i < this.sendBuffer.length; i++) {
    this.packet(this.sendBuffer[i]);
  }
  this.sendBuffer = [];
};

/**
 * Called upon server disconnect.
 *
 * @api private
 */

Socket.prototype.ondisconnect = function () {
  debug('server disconnect (%s)', this.nsp);
  this.destroy();
  this.onclose('io server disconnect');
};

/**
 * Called upon forced client/server side disconnections,
 * this method ensures the manager stops tracking us and
 * that reconnections don't get triggered for this.
 *
 * @api private.
 */

Socket.prototype.destroy = function () {
  if (this.subs) {
    // clean subscriptions to avoid reconnections
    for (var i = 0; i < this.subs.length; i++) {
      this.subs[i].destroy();
    }
    this.subs = null;
  }

  this.io.destroy(this);
};

/**
 * Disconnects the socket manually.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.close =
Socket.prototype.disconnect = function () {
  if (this.connected) {
    debug('performing disconnect (%s)', this.nsp);
    this.packet({ type: parser.DISCONNECT });
  }

  // remove socket from pool
  this.destroy();

  if (this.connected) {
    // fire events
    this.onclose('io client disconnect');
  }
  return this;
};

/**
 * Sets the compress flag.
 *
 * @param {Boolean} if `true`, compresses the sending data
 * @return {Socket} self
 * @api public
 */

Socket.prototype.compress = function (compress) {
  this.flags = this.flags || {};
  this.flags.compress = compress;
  return this;
};

},{"./on":60,"component-bind":27,"component-emitter":28,"debug":30,"parseqs":53,"socket.io-parser":64,"to-array":67}],62:[function(require,module,exports){
(function (global){

/**
 * Module dependencies.
 */

var parseuri = require('parseuri');
var debug = require('debug')('socket.io-client:url');

/**
 * Module exports.
 */

module.exports = url;

/**
 * URL parser.
 *
 * @param {String} url
 * @param {Object} An object meant to mimic window.location.
 *                 Defaults to window.location.
 * @api public
 */

function url (uri, loc) {
  var obj = uri;

  // default to window.location
  loc = loc || global.location;
  if (null == uri) uri = loc.protocol + '//' + loc.host;

  // relative path support
  if ('string' === typeof uri) {
    if ('/' === uri.charAt(0)) {
      if ('/' === uri.charAt(1)) {
        uri = loc.protocol + uri;
      } else {
        uri = loc.host + uri;
      }
    }

    if (!/^(https?|wss?):\/\//.test(uri)) {
      debug('protocol-less url %s', uri);
      if ('undefined' !== typeof loc) {
        uri = loc.protocol + '//' + uri;
      } else {
        uri = 'https://' + uri;
      }
    }

    // parse
    debug('parse %s', uri);
    obj = parseuri(uri);
  }

  // make sure we treat `localhost:80` and `localhost` equally
  if (!obj.port) {
    if (/^(http|ws)$/.test(obj.protocol)) {
      obj.port = '80';
    } else if (/^(http|ws)s$/.test(obj.protocol)) {
      obj.port = '443';
    }
  }

  obj.path = obj.path || '/';

  var ipv6 = obj.host.indexOf(':') !== -1;
  var host = ipv6 ? '[' + obj.host + ']' : obj.host;

  // define unique id
  obj.id = obj.protocol + '://' + host + ':' + obj.port;
  // define href
  obj.href = obj.protocol + '://' + host + (loc && loc.port === obj.port ? '' : (':' + obj.port));

  return obj;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"debug":30,"parseuri":54}],63:[function(require,module,exports){
(function (global){
/*global Blob,File*/

/**
 * Module requirements
 */

var isArray = require('isarray');
var isBuf = require('./is-buffer');
var toString = Object.prototype.toString;
var withNativeBlob = typeof global.Blob === 'function' || toString.call(global.Blob) === '[object BlobConstructor]';
var withNativeFile = typeof global.File === 'function' || toString.call(global.File) === '[object FileConstructor]';

/**
 * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
 * Anything with blobs or files should be fed through removeBlobs before coming
 * here.
 *
 * @param {Object} packet - socket.io event packet
 * @return {Object} with deconstructed packet and list of buffers
 * @api public
 */

exports.deconstructPacket = function(packet) {
  var buffers = [];
  var packetData = packet.data;
  var pack = packet;
  pack.data = _deconstructPacket(packetData, buffers);
  pack.attachments = buffers.length; // number of binary 'attachments'
  return {packet: pack, buffers: buffers};
};

function _deconstructPacket(data, buffers) {
  if (!data) return data;

  if (isBuf(data)) {
    var placeholder = { _placeholder: true, num: buffers.length };
    buffers.push(data);
    return placeholder;
  } else if (isArray(data)) {
    var newData = new Array(data.length);
    for (var i = 0; i < data.length; i++) {
      newData[i] = _deconstructPacket(data[i], buffers);
    }
    return newData;
  } else if (typeof data === 'object' && !(data instanceof Date)) {
    var newData = {};
    for (var key in data) {
      newData[key] = _deconstructPacket(data[key], buffers);
    }
    return newData;
  }
  return data;
}

/**
 * Reconstructs a binary packet from its placeholder packet and buffers
 *
 * @param {Object} packet - event packet with placeholders
 * @param {Array} buffers - binary buffers to put in placeholder positions
 * @return {Object} reconstructed packet
 * @api public
 */

exports.reconstructPacket = function(packet, buffers) {
  packet.data = _reconstructPacket(packet.data, buffers);
  packet.attachments = undefined; // no longer useful
  return packet;
};

function _reconstructPacket(data, buffers) {
  if (!data) return data;

  if (data && data._placeholder) {
    return buffers[data.num]; // appropriate buffer (should be natural order anyway)
  } else if (isArray(data)) {
    for (var i = 0; i < data.length; i++) {
      data[i] = _reconstructPacket(data[i], buffers);
    }
  } else if (typeof data === 'object') {
    for (var key in data) {
      data[key] = _reconstructPacket(data[key], buffers);
    }
  }

  return data;
}

/**
 * Asynchronously removes Blobs or Files from data via
 * FileReader's readAsArrayBuffer method. Used before encoding
 * data as msgpack. Calls callback with the blobless data.
 *
 * @param {Object} data
 * @param {Function} callback
 * @api private
 */

exports.removeBlobs = function(data, callback) {
  function _removeBlobs(obj, curKey, containingObject) {
    if (!obj) return obj;

    // convert any blob
    if ((withNativeBlob && obj instanceof Blob) ||
        (withNativeFile && obj instanceof File)) {
      pendingBlobs++;

      // async filereader
      var fileReader = new FileReader();
      fileReader.onload = function() { // this.result == arraybuffer
        if (containingObject) {
          containingObject[curKey] = this.result;
        }
        else {
          bloblessData = this.result;
        }

        // if nothing pending its callback time
        if(! --pendingBlobs) {
          callback(bloblessData);
        }
      };

      fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
    } else if (isArray(obj)) { // handle array
      for (var i = 0; i < obj.length; i++) {
        _removeBlobs(obj[i], i, obj);
      }
    } else if (typeof obj === 'object' && !isBuf(obj)) { // and object
      for (var key in obj) {
        _removeBlobs(obj[key], key, obj);
      }
    }
  }

  var pendingBlobs = 0;
  var bloblessData = data;
  _removeBlobs(bloblessData);
  if (!pendingBlobs) {
    callback(bloblessData);
  }
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./is-buffer":65,"isarray":66}],64:[function(require,module,exports){

/**
 * Module dependencies.
 */

var debug = require('debug')('socket.io-parser');
var Emitter = require('component-emitter');
var hasBin = require('has-binary2');
var binary = require('./binary');
var isBuf = require('./is-buffer');

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = 4;

/**
 * Packet types.
 *
 * @api public
 */

exports.types = [
  'CONNECT',
  'DISCONNECT',
  'EVENT',
  'ACK',
  'ERROR',
  'BINARY_EVENT',
  'BINARY_ACK'
];

/**
 * Packet type `connect`.
 *
 * @api public
 */

exports.CONNECT = 0;

/**
 * Packet type `disconnect`.
 *
 * @api public
 */

exports.DISCONNECT = 1;

/**
 * Packet type `event`.
 *
 * @api public
 */

exports.EVENT = 2;

/**
 * Packet type `ack`.
 *
 * @api public
 */

exports.ACK = 3;

/**
 * Packet type `error`.
 *
 * @api public
 */

exports.ERROR = 4;

/**
 * Packet type 'binary event'
 *
 * @api public
 */

exports.BINARY_EVENT = 5;

/**
 * Packet type `binary ack`. For acks with binary arguments.
 *
 * @api public
 */

exports.BINARY_ACK = 6;

/**
 * Encoder constructor.
 *
 * @api public
 */

exports.Encoder = Encoder;

/**
 * Decoder constructor.
 *
 * @api public
 */

exports.Decoder = Decoder;

/**
 * A socket.io Encoder instance
 *
 * @api public
 */

function Encoder() {}

/**
 * Encode a packet as a single string if non-binary, or as a
 * buffer sequence, depending on packet type.
 *
 * @param {Object} obj - packet object
 * @param {Function} callback - function to handle encodings (likely engine.write)
 * @return Calls callback with Array of encodings
 * @api public
 */

Encoder.prototype.encode = function(obj, callback){
  if ((obj.type === exports.EVENT || obj.type === exports.ACK) && hasBin(obj.data)) {
    obj.type = obj.type === exports.EVENT ? exports.BINARY_EVENT : exports.BINARY_ACK;
  }

  debug('encoding packet %j', obj);

  if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
    encodeAsBinary(obj, callback);
  }
  else {
    var encoding = encodeAsString(obj);
    callback([encoding]);
  }
};

/**
 * Encode packet as string.
 *
 * @param {Object} packet
 * @return {String} encoded
 * @api private
 */

function encodeAsString(obj) {

  // first is type
  var str = '' + obj.type;

  // attachments if we have them
  if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
    str += obj.attachments + '-';
  }

  // if we have a namespace other than `/`
  // we append it followed by a comma `,`
  if (obj.nsp && '/' !== obj.nsp) {
    str += obj.nsp + ',';
  }

  // immediately followed by the id
  if (null != obj.id) {
    str += obj.id;
  }

  // json data
  if (null != obj.data) {
    str += JSON.stringify(obj.data);
  }

  debug('encoded %j as %s', obj, str);
  return str;
}

/**
 * Encode packet as 'buffer sequence' by removing blobs, and
 * deconstructing packet into object with placeholders and
 * a list of buffers.
 *
 * @param {Object} packet
 * @return {Buffer} encoded
 * @api private
 */

function encodeAsBinary(obj, callback) {

  function writeEncoding(bloblessData) {
    var deconstruction = binary.deconstructPacket(bloblessData);
    var pack = encodeAsString(deconstruction.packet);
    var buffers = deconstruction.buffers;

    buffers.unshift(pack); // add packet info to beginning of data list
    callback(buffers); // write all the buffers
  }

  binary.removeBlobs(obj, writeEncoding);
}

/**
 * A socket.io Decoder instance
 *
 * @return {Object} decoder
 * @api public
 */

function Decoder() {
  this.reconstructor = null;
}

/**
 * Mix in `Emitter` with Decoder.
 */

Emitter(Decoder.prototype);

/**
 * Decodes an ecoded packet string into packet JSON.
 *
 * @param {String} obj - encoded packet
 * @return {Object} packet
 * @api public
 */

Decoder.prototype.add = function(obj) {
  var packet;
  if (typeof obj === 'string') {
    packet = decodeString(obj);
    if (exports.BINARY_EVENT === packet.type || exports.BINARY_ACK === packet.type) { // binary packet's json
      this.reconstructor = new BinaryReconstructor(packet);

      // no attachments, labeled binary but no binary data to follow
      if (this.reconstructor.reconPack.attachments === 0) {
        this.emit('decoded', packet);
      }
    } else { // non-binary full packet
      this.emit('decoded', packet);
    }
  }
  else if (isBuf(obj) || obj.base64) { // raw binary data
    if (!this.reconstructor) {
      throw new Error('got binary data when not reconstructing a packet');
    } else {
      packet = this.reconstructor.takeBinaryData(obj);
      if (packet) { // received final buffer
        this.reconstructor = null;
        this.emit('decoded', packet);
      }
    }
  }
  else {
    throw new Error('Unknown type: ' + obj);
  }
};

/**
 * Decode a packet String (JSON data)
 *
 * @param {String} str
 * @return {Object} packet
 * @api private
 */

function decodeString(str) {
  var i = 0;
  // look up type
  var p = {
    type: Number(str.charAt(0))
  };

  if (null == exports.types[p.type]) return error();

  // look up attachments if type binary
  if (exports.BINARY_EVENT === p.type || exports.BINARY_ACK === p.type) {
    var buf = '';
    while (str.charAt(++i) !== '-') {
      buf += str.charAt(i);
      if (i == str.length) break;
    }
    if (buf != Number(buf) || str.charAt(i) !== '-') {
      throw new Error('Illegal attachments');
    }
    p.attachments = Number(buf);
  }

  // look up namespace (if any)
  if ('/' === str.charAt(i + 1)) {
    p.nsp = '';
    while (++i) {
      var c = str.charAt(i);
      if (',' === c) break;
      p.nsp += c;
      if (i === str.length) break;
    }
  } else {
    p.nsp = '/';
  }

  // look up id
  var next = str.charAt(i + 1);
  if ('' !== next && Number(next) == next) {
    p.id = '';
    while (++i) {
      var c = str.charAt(i);
      if (null == c || Number(c) != c) {
        --i;
        break;
      }
      p.id += str.charAt(i);
      if (i === str.length) break;
    }
    p.id = Number(p.id);
  }

  // look up json data
  if (str.charAt(++i)) {
    p = tryParse(p, str.substr(i));
  }

  debug('decoded %s as %j', str, p);
  return p;
}

function tryParse(p, str) {
  try {
    p.data = JSON.parse(str);
  } catch(e){
    return error();
  }
  return p; 
}

/**
 * Deallocates a parser's resources
 *
 * @api public
 */

Decoder.prototype.destroy = function() {
  if (this.reconstructor) {
    this.reconstructor.finishedReconstruction();
  }
};

/**
 * A manager of a binary event's 'buffer sequence'. Should
 * be constructed whenever a packet of type BINARY_EVENT is
 * decoded.
 *
 * @param {Object} packet
 * @return {BinaryReconstructor} initialized reconstructor
 * @api private
 */

function BinaryReconstructor(packet) {
  this.reconPack = packet;
  this.buffers = [];
}

/**
 * Method to be called when binary data received from connection
 * after a BINARY_EVENT packet.
 *
 * @param {Buffer | ArrayBuffer} binData - the raw binary data received
 * @return {null | Object} returns null if more binary data is expected or
 *   a reconstructed packet object if all buffers have been received.
 * @api private
 */

BinaryReconstructor.prototype.takeBinaryData = function(binData) {
  this.buffers.push(binData);
  if (this.buffers.length === this.reconPack.attachments) { // done with buffer list
    var packet = binary.reconstructPacket(this.reconPack, this.buffers);
    this.finishedReconstruction();
    return packet;
  }
  return null;
};

/**
 * Cleans up binary packet reconstruction variables.
 *
 * @api private
 */

BinaryReconstructor.prototype.finishedReconstruction = function() {
  this.reconPack = null;
  this.buffers = [];
};

function error() {
  return {
    type: exports.ERROR,
    data: 'parser error'
  };
}

},{"./binary":63,"./is-buffer":65,"component-emitter":28,"debug":30,"has-binary2":45}],65:[function(require,module,exports){
(function (global){

module.exports = isBuf;

/**
 * Returns true if obj is a buffer or an arraybuffer.
 *
 * @api private
 */

function isBuf(obj) {
  return (global.Buffer && global.Buffer.isBuffer(obj)) ||
         (global.ArrayBuffer && obj instanceof ArrayBuffer);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],66:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],67:[function(require,module,exports){
module.exports = toArray

function toArray(list, index) {
    var array = []

    index = index || 0

    for (var i = index || 0; i < list.length; i++) {
        array[i - index] = list[i]
    }

    return array
}

},{}],68:[function(require,module,exports){
var v1 = require('./v1');
var v4 = require('./v4');

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;

},{"./v1":71,"./v4":72}],69:[function(require,module,exports){
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;

},{}],70:[function(require,module,exports){
// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && msCrypto.getRandomValues.bind(msCrypto));
if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

},{}],71:[function(require,module,exports){
var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;
var _clockseq;

// Previous uuid creation time
var _lastMSecs = 0;
var _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189
  if (node == null || clockseq == null) {
    var seedBytes = rng();
    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [
        seedBytes[0] | 0x01,
        seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
      ];
    }
    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  }

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;

},{"./lib/bytesToUuid":69,"./lib/rng":70}],72:[function(require,module,exports){
var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;

},{"./lib/bytesToUuid":69,"./lib/rng":70}],73:[function(require,module,exports){
(function (global){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */

'use strict';

var adapterFactory = require('./adapter_factory.js');
module.exports = adapterFactory({window: global.window});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./adapter_factory.js":74}],74:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */

'use strict';

var utils = require('./utils');
// Shimming starts here.
module.exports = function(dependencies, opts) {
  var window = dependencies && dependencies.window;

  var options = {
    shimChrome: true,
    shimFirefox: true,
    shimEdge: true,
    shimSafari: true,
  };

  for (var key in opts) {
    if (hasOwnProperty.call(opts, key)) {
      options[key] = opts[key];
    }
  }

  // Utils.
  var logging = utils.log;
  var browserDetails = utils.detectBrowser(window);

  // Uncomment the line below if you want logging to occur, including logging
  // for the switch statement below. Can also be turned on in the browser via
  // adapter.disableLog(false), but then logging from the switch statement below
  // will not appear.
  // require('./utils').disableLog(false);

  // Browser shims.
  var chromeShim = require('./chrome/chrome_shim') || null;
  var edgeShim = require('./edge/edge_shim') || null;
  var firefoxShim = require('./firefox/firefox_shim') || null;
  var safariShim = require('./safari/safari_shim') || null;
  var commonShim = require('./common_shim') || null;

  // Export to the adapter global object visible in the browser.
  var adapter = {
    browserDetails: browserDetails,
    commonShim: commonShim,
    extractVersion: utils.extractVersion,
    disableLog: utils.disableLog,
    disableWarnings: utils.disableWarnings
  };

  // Shim browser if found.
  switch (browserDetails.browser) {
    case 'chrome':
      if (!chromeShim || !chromeShim.shimPeerConnection ||
          !options.shimChrome) {
        logging('Chrome shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming chrome.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = chromeShim;
      commonShim.shimCreateObjectURL(window);

      chromeShim.shimGetUserMedia(window);
      chromeShim.shimMediaStream(window);
      chromeShim.shimSourceObject(window);
      chromeShim.shimPeerConnection(window);
      chromeShim.shimOnTrack(window);
      chromeShim.shimAddTrackRemoveTrack(window);
      chromeShim.shimGetSendersWithDtmf(window);

      commonShim.shimRTCIceCandidate(window);
      commonShim.shimMaxMessageSize(window);
      commonShim.shimSendThrowTypeError(window);
      break;
    case 'firefox':
      if (!firefoxShim || !firefoxShim.shimPeerConnection ||
          !options.shimFirefox) {
        logging('Firefox shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming firefox.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = firefoxShim;
      commonShim.shimCreateObjectURL(window);

      firefoxShim.shimGetUserMedia(window);
      firefoxShim.shimSourceObject(window);
      firefoxShim.shimPeerConnection(window);
      firefoxShim.shimOnTrack(window);
      firefoxShim.shimRemoveStream(window);

      commonShim.shimRTCIceCandidate(window);
      commonShim.shimMaxMessageSize(window);
      commonShim.shimSendThrowTypeError(window);
      break;
    case 'edge':
      if (!edgeShim || !edgeShim.shimPeerConnection || !options.shimEdge) {
        logging('MS edge shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming edge.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = edgeShim;
      commonShim.shimCreateObjectURL(window);

      edgeShim.shimGetUserMedia(window);
      edgeShim.shimPeerConnection(window);
      edgeShim.shimReplaceTrack(window);

      // the edge shim implements the full RTCIceCandidate object.

      commonShim.shimMaxMessageSize(window);
      commonShim.shimSendThrowTypeError(window);
      break;
    case 'safari':
      if (!safariShim || !options.shimSafari) {
        logging('Safari shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming safari.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = safariShim;
      commonShim.shimCreateObjectURL(window);

      safariShim.shimRTCIceServerUrls(window);
      safariShim.shimCallbacksAPI(window);
      safariShim.shimLocalStreamsAPI(window);
      safariShim.shimRemoteStreamsAPI(window);
      safariShim.shimTrackEventTransceiver(window);
      safariShim.shimGetUserMedia(window);
      safariShim.shimCreateOfferLegacy(window);

      commonShim.shimRTCIceCandidate(window);
      commonShim.shimMaxMessageSize(window);
      commonShim.shimSendThrowTypeError(window);
      break;
    default:
      logging('Unsupported browser!');
      break;
  }

  return adapter;
};

},{"./chrome/chrome_shim":75,"./common_shim":77,"./edge/edge_shim":78,"./firefox/firefox_shim":80,"./safari/safari_shim":82,"./utils":83}],75:[function(require,module,exports){

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */
'use strict';
var utils = require('../utils.js');
var logging = utils.log;

module.exports = {
  shimGetUserMedia: require('./getusermedia'),
  shimMediaStream: function(window) {
    window.MediaStream = window.MediaStream || window.webkitMediaStream;
  },

  shimOnTrack: function(window) {
    if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
        window.RTCPeerConnection.prototype)) {
      Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
        get: function() {
          return this._ontrack;
        },
        set: function(f) {
          if (this._ontrack) {
            this.removeEventListener('track', this._ontrack);
          }
          this.addEventListener('track', this._ontrack = f);
        }
      });
      var origSetRemoteDescription =
          window.RTCPeerConnection.prototype.setRemoteDescription;
      window.RTCPeerConnection.prototype.setRemoteDescription = function() {
        var pc = this;
        if (!pc._ontrackpoly) {
          pc._ontrackpoly = function(e) {
            // onaddstream does not fire when a track is added to an existing
            // stream. But stream.onaddtrack is implemented so we use that.
            e.stream.addEventListener('addtrack', function(te) {
              var receiver;
              if (window.RTCPeerConnection.prototype.getReceivers) {
                receiver = pc.getReceivers().find(function(r) {
                  return r.track && r.track.id === te.track.id;
                });
              } else {
                receiver = {track: te.track};
              }

              var event = new Event('track');
              event.track = te.track;
              event.receiver = receiver;
              event.transceiver = {receiver: receiver};
              event.streams = [e.stream];
              pc.dispatchEvent(event);
            });
            e.stream.getTracks().forEach(function(track) {
              var receiver;
              if (window.RTCPeerConnection.prototype.getReceivers) {
                receiver = pc.getReceivers().find(function(r) {
                  return r.track && r.track.id === track.id;
                });
              } else {
                receiver = {track: track};
              }
              var event = new Event('track');
              event.track = track;
              event.receiver = receiver;
              event.transceiver = {receiver: receiver};
              event.streams = [e.stream];
              pc.dispatchEvent(event);
            });
          };
          pc.addEventListener('addstream', pc._ontrackpoly);
        }
        return origSetRemoteDescription.apply(pc, arguments);
      };
    } else if (!('RTCRtpTransceiver' in window)) {
      utils.wrapPeerConnectionEvent(window, 'track', function(e) {
        if (!e.transceiver) {
          e.transceiver = {receiver: e.receiver};
        }
        return e;
      });
    }
  },

  shimGetSendersWithDtmf: function(window) {
    // Overrides addTrack/removeTrack, depends on shimAddTrackRemoveTrack.
    if (typeof window === 'object' && window.RTCPeerConnection &&
        !('getSenders' in window.RTCPeerConnection.prototype) &&
        'createDTMFSender' in window.RTCPeerConnection.prototype) {
      var shimSenderWithDtmf = function(pc, track) {
        return {
          track: track,
          get dtmf() {
            if (this._dtmf === undefined) {
              if (track.kind === 'audio') {
                this._dtmf = pc.createDTMFSender(track);
              } else {
                this._dtmf = null;
              }
            }
            return this._dtmf;
          },
          _pc: pc
        };
      };

      // augment addTrack when getSenders is not available.
      if (!window.RTCPeerConnection.prototype.getSenders) {
        window.RTCPeerConnection.prototype.getSenders = function() {
          this._senders = this._senders || [];
          return this._senders.slice(); // return a copy of the internal state.
        };
        var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
        window.RTCPeerConnection.prototype.addTrack = function(track, stream) {
          var pc = this;
          var sender = origAddTrack.apply(pc, arguments);
          if (!sender) {
            sender = shimSenderWithDtmf(pc, track);
            pc._senders.push(sender);
          }
          return sender;
        };

        var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
        window.RTCPeerConnection.prototype.removeTrack = function(sender) {
          var pc = this;
          origRemoveTrack.apply(pc, arguments);
          var idx = pc._senders.indexOf(sender);
          if (idx !== -1) {
            pc._senders.splice(idx, 1);
          }
        };
      }
      var origAddStream = window.RTCPeerConnection.prototype.addStream;
      window.RTCPeerConnection.prototype.addStream = function(stream) {
        var pc = this;
        pc._senders = pc._senders || [];
        origAddStream.apply(pc, [stream]);
        stream.getTracks().forEach(function(track) {
          pc._senders.push(shimSenderWithDtmf(pc, track));
        });
      };

      var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
      window.RTCPeerConnection.prototype.removeStream = function(stream) {
        var pc = this;
        pc._senders = pc._senders || [];
        origRemoveStream.apply(pc, [stream]);

        stream.getTracks().forEach(function(track) {
          var sender = pc._senders.find(function(s) {
            return s.track === track;
          });
          if (sender) {
            pc._senders.splice(pc._senders.indexOf(sender), 1); // remove sender
          }
        });
      };
    } else if (typeof window === 'object' && window.RTCPeerConnection &&
               'getSenders' in window.RTCPeerConnection.prototype &&
               'createDTMFSender' in window.RTCPeerConnection.prototype &&
               window.RTCRtpSender &&
               !('dtmf' in window.RTCRtpSender.prototype)) {
      var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
      window.RTCPeerConnection.prototype.getSenders = function() {
        var pc = this;
        var senders = origGetSenders.apply(pc, []);
        senders.forEach(function(sender) {
          sender._pc = pc;
        });
        return senders;
      };

      Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
        get: function() {
          if (this._dtmf === undefined) {
            if (this.track.kind === 'audio') {
              this._dtmf = this._pc.createDTMFSender(this.track);
            } else {
              this._dtmf = null;
            }
          }
          return this._dtmf;
        }
      });
    }
  },

  shimSourceObject: function(window) {
    var URL = window && window.URL;

    if (typeof window === 'object') {
      if (window.HTMLMediaElement &&
        !('srcObject' in window.HTMLMediaElement.prototype)) {
        // Shim the srcObject property, once, when HTMLMediaElement is found.
        Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
          get: function() {
            return this._srcObject;
          },
          set: function(stream) {
            var self = this;
            // Use _srcObject as a private property for this shim
            this._srcObject = stream;
            if (this.src) {
              URL.revokeObjectURL(this.src);
            }

            if (!stream) {
              this.src = '';
              return undefined;
            }
            this.src = URL.createObjectURL(stream);
            // We need to recreate the blob url when a track is added or
            // removed. Doing it manually since we want to avoid a recursion.
            stream.addEventListener('addtrack', function() {
              if (self.src) {
                URL.revokeObjectURL(self.src);
              }
              self.src = URL.createObjectURL(stream);
            });
            stream.addEventListener('removetrack', function() {
              if (self.src) {
                URL.revokeObjectURL(self.src);
              }
              self.src = URL.createObjectURL(stream);
            });
          }
        });
      }
    }
  },

  shimAddTrackRemoveTrackWithNative: function(window) {
    // shim addTrack/removeTrack with native variants in order to make
    // the interactions with legacy getLocalStreams behave as in other browsers.
    // Keeps a mapping stream.id => [stream, rtpsenders...]
    window.RTCPeerConnection.prototype.getLocalStreams = function() {
      var pc = this;
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      return Object.keys(this._shimmedLocalStreams).map(function(streamId) {
        return pc._shimmedLocalStreams[streamId][0];
      });
    };

    var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
    window.RTCPeerConnection.prototype.addTrack = function(track, stream) {
      if (!stream) {
        return origAddTrack.apply(this, arguments);
      }
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};

      var sender = origAddTrack.apply(this, arguments);
      if (!this._shimmedLocalStreams[stream.id]) {
        this._shimmedLocalStreams[stream.id] = [stream, sender];
      } else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) {
        this._shimmedLocalStreams[stream.id].push(sender);
      }
      return sender;
    };

    var origAddStream = window.RTCPeerConnection.prototype.addStream;
    window.RTCPeerConnection.prototype.addStream = function(stream) {
      var pc = this;
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};

      stream.getTracks().forEach(function(track) {
        var alreadyExists = pc.getSenders().find(function(s) {
          return s.track === track;
        });
        if (alreadyExists) {
          throw new DOMException('Track already exists.',
              'InvalidAccessError');
        }
      });
      var existingSenders = pc.getSenders();
      origAddStream.apply(this, arguments);
      var newSenders = pc.getSenders().filter(function(newSender) {
        return existingSenders.indexOf(newSender) === -1;
      });
      this._shimmedLocalStreams[stream.id] = [stream].concat(newSenders);
    };

    var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
    window.RTCPeerConnection.prototype.removeStream = function(stream) {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      delete this._shimmedLocalStreams[stream.id];
      return origRemoveStream.apply(this, arguments);
    };

    var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
    window.RTCPeerConnection.prototype.removeTrack = function(sender) {
      var pc = this;
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      if (sender) {
        Object.keys(this._shimmedLocalStreams).forEach(function(streamId) {
          var idx = pc._shimmedLocalStreams[streamId].indexOf(sender);
          if (idx !== -1) {
            pc._shimmedLocalStreams[streamId].splice(idx, 1);
          }
          if (pc._shimmedLocalStreams[streamId].length === 1) {
            delete pc._shimmedLocalStreams[streamId];
          }
        });
      }
      return origRemoveTrack.apply(this, arguments);
    };
  },

  shimAddTrackRemoveTrack: function(window) {
    var browserDetails = utils.detectBrowser(window);
    // shim addTrack and removeTrack.
    if (window.RTCPeerConnection.prototype.addTrack &&
        browserDetails.version >= 65) {
      return this.shimAddTrackRemoveTrackWithNative(window);
    }

    // also shim pc.getLocalStreams when addTrack is shimmed
    // to return the original streams.
    var origGetLocalStreams = window.RTCPeerConnection.prototype
        .getLocalStreams;
    window.RTCPeerConnection.prototype.getLocalStreams = function() {
      var pc = this;
      var nativeStreams = origGetLocalStreams.apply(this);
      pc._reverseStreams = pc._reverseStreams || {};
      return nativeStreams.map(function(stream) {
        return pc._reverseStreams[stream.id];
      });
    };

    var origAddStream = window.RTCPeerConnection.prototype.addStream;
    window.RTCPeerConnection.prototype.addStream = function(stream) {
      var pc = this;
      pc._streams = pc._streams || {};
      pc._reverseStreams = pc._reverseStreams || {};

      stream.getTracks().forEach(function(track) {
        var alreadyExists = pc.getSenders().find(function(s) {
          return s.track === track;
        });
        if (alreadyExists) {
          throw new DOMException('Track already exists.',
              'InvalidAccessError');
        }
      });
      // Add identity mapping for consistency with addTrack.
      // Unless this is being used with a stream from addTrack.
      if (!pc._reverseStreams[stream.id]) {
        var newStream = new window.MediaStream(stream.getTracks());
        pc._streams[stream.id] = newStream;
        pc._reverseStreams[newStream.id] = stream;
        stream = newStream;
      }
      origAddStream.apply(pc, [stream]);
    };

    var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
    window.RTCPeerConnection.prototype.removeStream = function(stream) {
      var pc = this;
      pc._streams = pc._streams || {};
      pc._reverseStreams = pc._reverseStreams || {};

      origRemoveStream.apply(pc, [(pc._streams[stream.id] || stream)]);
      delete pc._reverseStreams[(pc._streams[stream.id] ?
          pc._streams[stream.id].id : stream.id)];
      delete pc._streams[stream.id];
    };

    window.RTCPeerConnection.prototype.addTrack = function(track, stream) {
      var pc = this;
      if (pc.signalingState === 'closed') {
        throw new DOMException(
          'The RTCPeerConnection\'s signalingState is \'closed\'.',
          'InvalidStateError');
      }
      var streams = [].slice.call(arguments, 1);
      if (streams.length !== 1 ||
          !streams[0].getTracks().find(function(t) {
            return t === track;
          })) {
        // this is not fully correct but all we can manage without
        // [[associated MediaStreams]] internal slot.
        throw new DOMException(
          'The adapter.js addTrack polyfill only supports a single ' +
          ' stream which is associated with the specified track.',
          'NotSupportedError');
      }

      var alreadyExists = pc.getSenders().find(function(s) {
        return s.track === track;
      });
      if (alreadyExists) {
        throw new DOMException('Track already exists.',
            'InvalidAccessError');
      }

      pc._streams = pc._streams || {};
      pc._reverseStreams = pc._reverseStreams || {};
      var oldStream = pc._streams[stream.id];
      if (oldStream) {
        // this is using odd Chrome behaviour, use with caution:
        // https://bugs.chromium.org/p/webrtc/issues/detail?id=7815
        // Note: we rely on the high-level addTrack/dtmf shim to
        // create the sender with a dtmf sender.
        oldStream.addTrack(track);

        // Trigger ONN async.
        Promise.resolve().then(function() {
          pc.dispatchEvent(new Event('negotiationneeded'));
        });
      } else {
        var newStream = new window.MediaStream([track]);
        pc._streams[stream.id] = newStream;
        pc._reverseStreams[newStream.id] = stream;
        pc.addStream(newStream);
      }
      return pc.getSenders().find(function(s) {
        return s.track === track;
      });
    };

    // replace the internal stream id with the external one and
    // vice versa.
    function replaceInternalStreamId(pc, description) {
      var sdp = description.sdp;
      Object.keys(pc._reverseStreams || []).forEach(function(internalId) {
        var externalStream = pc._reverseStreams[internalId];
        var internalStream = pc._streams[externalStream.id];
        sdp = sdp.replace(new RegExp(internalStream.id, 'g'),
            externalStream.id);
      });
      return new RTCSessionDescription({
        type: description.type,
        sdp: sdp
      });
    }
    function replaceExternalStreamId(pc, description) {
      var sdp = description.sdp;
      Object.keys(pc._reverseStreams || []).forEach(function(internalId) {
        var externalStream = pc._reverseStreams[internalId];
        var internalStream = pc._streams[externalStream.id];
        sdp = sdp.replace(new RegExp(externalStream.id, 'g'),
            internalStream.id);
      });
      return new RTCSessionDescription({
        type: description.type,
        sdp: sdp
      });
    }
    ['createOffer', 'createAnswer'].forEach(function(method) {
      var nativeMethod = window.RTCPeerConnection.prototype[method];
      window.RTCPeerConnection.prototype[method] = function() {
        var pc = this;
        var args = arguments;
        var isLegacyCall = arguments.length &&
            typeof arguments[0] === 'function';
        if (isLegacyCall) {
          return nativeMethod.apply(pc, [
            function(description) {
              var desc = replaceInternalStreamId(pc, description);
              args[0].apply(null, [desc]);
            },
            function(err) {
              if (args[1]) {
                args[1].apply(null, err);
              }
            }, arguments[2]
          ]);
        }
        return nativeMethod.apply(pc, arguments)
        .then(function(description) {
          return replaceInternalStreamId(pc, description);
        });
      };
    });

    var origSetLocalDescription =
        window.RTCPeerConnection.prototype.setLocalDescription;
    window.RTCPeerConnection.prototype.setLocalDescription = function() {
      var pc = this;
      if (!arguments.length || !arguments[0].type) {
        return origSetLocalDescription.apply(pc, arguments);
      }
      arguments[0] = replaceExternalStreamId(pc, arguments[0]);
      return origSetLocalDescription.apply(pc, arguments);
    };

    // TODO: mangle getStats: https://w3c.github.io/webrtc-stats/#dom-rtcmediastreamstats-streamidentifier

    var origLocalDescription = Object.getOwnPropertyDescriptor(
        window.RTCPeerConnection.prototype, 'localDescription');
    Object.defineProperty(window.RTCPeerConnection.prototype,
        'localDescription', {
          get: function() {
            var pc = this;
            var description = origLocalDescription.get.apply(this);
            if (description.type === '') {
              return description;
            }
            return replaceInternalStreamId(pc, description);
          }
        });

    window.RTCPeerConnection.prototype.removeTrack = function(sender) {
      var pc = this;
      if (pc.signalingState === 'closed') {
        throw new DOMException(
          'The RTCPeerConnection\'s signalingState is \'closed\'.',
          'InvalidStateError');
      }
      // We can not yet check for sender instanceof RTCRtpSender
      // since we shim RTPSender. So we check if sender._pc is set.
      if (!sender._pc) {
        throw new DOMException('Argument 1 of RTCPeerConnection.removeTrack ' +
            'does not implement interface RTCRtpSender.', 'TypeError');
      }
      var isLocal = sender._pc === pc;
      if (!isLocal) {
        throw new DOMException('Sender was not created by this connection.',
            'InvalidAccessError');
      }

      // Search for the native stream the senders track belongs to.
      pc._streams = pc._streams || {};
      var stream;
      Object.keys(pc._streams).forEach(function(streamid) {
        var hasTrack = pc._streams[streamid].getTracks().find(function(track) {
          return sender.track === track;
        });
        if (hasTrack) {
          stream = pc._streams[streamid];
        }
      });

      if (stream) {
        if (stream.getTracks().length === 1) {
          // if this is the last track of the stream, remove the stream. This
          // takes care of any shimmed _senders.
          pc.removeStream(pc._reverseStreams[stream.id]);
        } else {
          // relying on the same odd chrome behaviour as above.
          stream.removeTrack(sender.track);
        }
        pc.dispatchEvent(new Event('negotiationneeded'));
      }
    };
  },

  shimPeerConnection: function(window) {
    var browserDetails = utils.detectBrowser(window);

    // The RTCPeerConnection object.
    if (!window.RTCPeerConnection && window.webkitRTCPeerConnection) {
      window.RTCPeerConnection = function(pcConfig, pcConstraints) {
        // Translate iceTransportPolicy to iceTransports,
        // see https://code.google.com/p/webrtc/issues/detail?id=4869
        // this was fixed in M56 along with unprefixing RTCPeerConnection.
        logging('PeerConnection');
        if (pcConfig && pcConfig.iceTransportPolicy) {
          pcConfig.iceTransports = pcConfig.iceTransportPolicy;
        }

        return new window.webkitRTCPeerConnection(pcConfig, pcConstraints);
      };
      window.RTCPeerConnection.prototype =
          window.webkitRTCPeerConnection.prototype;
      // wrap static methods. Currently just generateCertificate.
      if (window.webkitRTCPeerConnection.generateCertificate) {
        Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
          get: function() {
            return window.webkitRTCPeerConnection.generateCertificate;
          }
        });
      }
    } else {
      // migrate from non-spec RTCIceServer.url to RTCIceServer.urls
      var OrigPeerConnection = window.RTCPeerConnection;
      window.RTCPeerConnection = function(pcConfig, pcConstraints) {
        if (pcConfig && pcConfig.iceServers) {
          var newIceServers = [];
          for (var i = 0; i < pcConfig.iceServers.length; i++) {
            var server = pcConfig.iceServers[i];
            if (!server.hasOwnProperty('urls') &&
                server.hasOwnProperty('url')) {
              utils.deprecated('RTCIceServer.url', 'RTCIceServer.urls');
              server = JSON.parse(JSON.stringify(server));
              server.urls = server.url;
              newIceServers.push(server);
            } else {
              newIceServers.push(pcConfig.iceServers[i]);
            }
          }
          pcConfig.iceServers = newIceServers;
        }
        return new OrigPeerConnection(pcConfig, pcConstraints);
      };
      window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
      // wrap static methods. Currently just generateCertificate.
      Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
        get: function() {
          return OrigPeerConnection.generateCertificate;
        }
      });
    }

    var origGetStats = window.RTCPeerConnection.prototype.getStats;
    window.RTCPeerConnection.prototype.getStats = function(selector,
        successCallback, errorCallback) {
      var pc = this;
      var args = arguments;

      // If selector is a function then we are in the old style stats so just
      // pass back the original getStats format to avoid breaking old users.
      if (arguments.length > 0 && typeof selector === 'function') {
        return origGetStats.apply(this, arguments);
      }

      // When spec-style getStats is supported, return those when called with
      // either no arguments or the selector argument is null.
      if (origGetStats.length === 0 && (arguments.length === 0 ||
          typeof arguments[0] !== 'function')) {
        return origGetStats.apply(this, []);
      }

      var fixChromeStats_ = function(response) {
        var standardReport = {};
        var reports = response.result();
        reports.forEach(function(report) {
          var standardStats = {
            id: report.id,
            timestamp: report.timestamp,
            type: {
              localcandidate: 'local-candidate',
              remotecandidate: 'remote-candidate'
            }[report.type] || report.type
          };
          report.names().forEach(function(name) {
            standardStats[name] = report.stat(name);
          });
          standardReport[standardStats.id] = standardStats;
        });

        return standardReport;
      };

      // shim getStats with maplike support
      var makeMapStats = function(stats) {
        return new Map(Object.keys(stats).map(function(key) {
          return [key, stats[key]];
        }));
      };

      if (arguments.length >= 2) {
        var successCallbackWrapper_ = function(response) {
          args[1](makeMapStats(fixChromeStats_(response)));
        };

        return origGetStats.apply(this, [successCallbackWrapper_,
          arguments[0]]);
      }

      // promise-support
      return new Promise(function(resolve, reject) {
        origGetStats.apply(pc, [
          function(response) {
            resolve(makeMapStats(fixChromeStats_(response)));
          }, reject]);
      }).then(successCallback, errorCallback);
    };

    // add promise support -- natively available in Chrome 51
    if (browserDetails.version < 51) {
      ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
          .forEach(function(method) {
            var nativeMethod = window.RTCPeerConnection.prototype[method];
            window.RTCPeerConnection.prototype[method] = function() {
              var args = arguments;
              var pc = this;
              var promise = new Promise(function(resolve, reject) {
                nativeMethod.apply(pc, [args[0], resolve, reject]);
              });
              if (args.length < 2) {
                return promise;
              }
              return promise.then(function() {
                args[1].apply(null, []);
              },
              function(err) {
                if (args.length >= 3) {
                  args[2].apply(null, [err]);
                }
              });
            };
          });
    }

    // promise support for createOffer and createAnswer. Available (without
    // bugs) since M52: crbug/619289
    if (browserDetails.version < 52) {
      ['createOffer', 'createAnswer'].forEach(function(method) {
        var nativeMethod = window.RTCPeerConnection.prototype[method];
        window.RTCPeerConnection.prototype[method] = function() {
          var pc = this;
          if (arguments.length < 1 || (arguments.length === 1 &&
              typeof arguments[0] === 'object')) {
            var opts = arguments.length === 1 ? arguments[0] : undefined;
            return new Promise(function(resolve, reject) {
              nativeMethod.apply(pc, [resolve, reject, opts]);
            });
          }
          return nativeMethod.apply(this, arguments);
        };
      });
    }

    // shim implicit creation of RTCSessionDescription/RTCIceCandidate
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
        .forEach(function(method) {
          var nativeMethod = window.RTCPeerConnection.prototype[method];
          window.RTCPeerConnection.prototype[method] = function() {
            arguments[0] = new ((method === 'addIceCandidate') ?
                window.RTCIceCandidate :
                window.RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          };
        });

    // support for addIceCandidate(null or undefined)
    var nativeAddIceCandidate =
        window.RTCPeerConnection.prototype.addIceCandidate;
    window.RTCPeerConnection.prototype.addIceCandidate = function() {
      if (!arguments[0]) {
        if (arguments[1]) {
          arguments[1].apply(null);
        }
        return Promise.resolve();
      }
      return nativeAddIceCandidate.apply(this, arguments);
    };
  }
};

},{"../utils.js":83,"./getusermedia":76}],76:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */
'use strict';
var utils = require('../utils.js');
var logging = utils.log;

// Expose public methods.
module.exports = function(window) {
  var browserDetails = utils.detectBrowser(window);
  var navigator = window && window.navigator;

  var constraintsToChrome_ = function(c) {
    if (typeof c !== 'object' || c.mandatory || c.optional) {
      return c;
    }
    var cc = {};
    Object.keys(c).forEach(function(key) {
      if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
        return;
      }
      var r = (typeof c[key] === 'object') ? c[key] : {ideal: c[key]};
      if (r.exact !== undefined && typeof r.exact === 'number') {
        r.min = r.max = r.exact;
      }
      var oldname_ = function(prefix, name) {
        if (prefix) {
          return prefix + name.charAt(0).toUpperCase() + name.slice(1);
        }
        return (name === 'deviceId') ? 'sourceId' : name;
      };
      if (r.ideal !== undefined) {
        cc.optional = cc.optional || [];
        var oc = {};
        if (typeof r.ideal === 'number') {
          oc[oldname_('min', key)] = r.ideal;
          cc.optional.push(oc);
          oc = {};
          oc[oldname_('max', key)] = r.ideal;
          cc.optional.push(oc);
        } else {
          oc[oldname_('', key)] = r.ideal;
          cc.optional.push(oc);
        }
      }
      if (r.exact !== undefined && typeof r.exact !== 'number') {
        cc.mandatory = cc.mandatory || {};
        cc.mandatory[oldname_('', key)] = r.exact;
      } else {
        ['min', 'max'].forEach(function(mix) {
          if (r[mix] !== undefined) {
            cc.mandatory = cc.mandatory || {};
            cc.mandatory[oldname_(mix, key)] = r[mix];
          }
        });
      }
    });
    if (c.advanced) {
      cc.optional = (cc.optional || []).concat(c.advanced);
    }
    return cc;
  };

  var shimConstraints_ = function(constraints, func) {
    if (browserDetails.version >= 61) {
      return func(constraints);
    }
    constraints = JSON.parse(JSON.stringify(constraints));
    if (constraints && typeof constraints.audio === 'object') {
      var remap = function(obj, a, b) {
        if (a in obj && !(b in obj)) {
          obj[b] = obj[a];
          delete obj[a];
        }
      };
      constraints = JSON.parse(JSON.stringify(constraints));
      remap(constraints.audio, 'autoGainControl', 'googAutoGainControl');
      remap(constraints.audio, 'noiseSuppression', 'googNoiseSuppression');
      constraints.audio = constraintsToChrome_(constraints.audio);
    }
    if (constraints && typeof constraints.video === 'object') {
      // Shim facingMode for mobile & surface pro.
      var face = constraints.video.facingMode;
      face = face && ((typeof face === 'object') ? face : {ideal: face});
      var getSupportedFacingModeLies = browserDetails.version < 66;

      if ((face && (face.exact === 'user' || face.exact === 'environment' ||
                    face.ideal === 'user' || face.ideal === 'environment')) &&
          !(navigator.mediaDevices.getSupportedConstraints &&
            navigator.mediaDevices.getSupportedConstraints().facingMode &&
            !getSupportedFacingModeLies)) {
        delete constraints.video.facingMode;
        var matches;
        if (face.exact === 'environment' || face.ideal === 'environment') {
          matches = ['back', 'rear'];
        } else if (face.exact === 'user' || face.ideal === 'user') {
          matches = ['front'];
        }
        if (matches) {
          // Look for matches in label, or use last cam for back (typical).
          return navigator.mediaDevices.enumerateDevices()
          .then(function(devices) {
            devices = devices.filter(function(d) {
              return d.kind === 'videoinput';
            });
            var dev = devices.find(function(d) {
              return matches.some(function(match) {
                return d.label.toLowerCase().indexOf(match) !== -1;
              });
            });
            if (!dev && devices.length && matches.indexOf('back') !== -1) {
              dev = devices[devices.length - 1]; // more likely the back cam
            }
            if (dev) {
              constraints.video.deviceId = face.exact ? {exact: dev.deviceId} :
                                                        {ideal: dev.deviceId};
            }
            constraints.video = constraintsToChrome_(constraints.video);
            logging('chrome: ' + JSON.stringify(constraints));
            return func(constraints);
          });
        }
      }
      constraints.video = constraintsToChrome_(constraints.video);
    }
    logging('chrome: ' + JSON.stringify(constraints));
    return func(constraints);
  };

  var shimError_ = function(e) {
    return {
      name: {
        PermissionDeniedError: 'NotAllowedError',
        InvalidStateError: 'NotReadableError',
        DevicesNotFoundError: 'NotFoundError',
        ConstraintNotSatisfiedError: 'OverconstrainedError',
        TrackStartError: 'NotReadableError',
        MediaDeviceFailedDueToShutdown: 'NotReadableError',
        MediaDeviceKillSwitchOn: 'NotReadableError'
      }[e.name] || e.name,
      message: e.message,
      constraint: e.constraintName,
      toString: function() {
        return this.name + (this.message && ': ') + this.message;
      }
    };
  };

  var getUserMedia_ = function(constraints, onSuccess, onError) {
    shimConstraints_(constraints, function(c) {
      navigator.webkitGetUserMedia(c, onSuccess, function(e) {
        if (onError) {
          onError(shimError_(e));
        }
      });
    });
  };

  navigator.getUserMedia = getUserMedia_;

  // Returns the result of getUserMedia as a Promise.
  var getUserMediaPromise_ = function(constraints) {
    return new Promise(function(resolve, reject) {
      navigator.getUserMedia(constraints, resolve, reject);
    });
  };

  if (!navigator.mediaDevices) {
    navigator.mediaDevices = {
      getUserMedia: getUserMediaPromise_,
      enumerateDevices: function() {
        return new Promise(function(resolve) {
          var kinds = {audio: 'audioinput', video: 'videoinput'};
          return window.MediaStreamTrack.getSources(function(devices) {
            resolve(devices.map(function(device) {
              return {label: device.label,
                kind: kinds[device.kind],
                deviceId: device.id,
                groupId: ''};
            }));
          });
        });
      },
      getSupportedConstraints: function() {
        return {
          deviceId: true, echoCancellation: true, facingMode: true,
          frameRate: true, height: true, width: true
        };
      }
    };
  }

  // A shim for getUserMedia method on the mediaDevices object.
  // TODO(KaptenJansson) remove once implemented in Chrome stable.
  if (!navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      return getUserMediaPromise_(constraints);
    };
  } else {
    // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
    // function which returns a Promise, it does not accept spec-style
    // constraints.
    var origGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(cs) {
      return shimConstraints_(cs, function(c) {
        return origGetUserMedia(c).then(function(stream) {
          if (c.audio && !stream.getAudioTracks().length ||
              c.video && !stream.getVideoTracks().length) {
            stream.getTracks().forEach(function(track) {
              track.stop();
            });
            throw new DOMException('', 'NotFoundError');
          }
          return stream;
        }, function(e) {
          return Promise.reject(shimError_(e));
        });
      });
    };
  }

  // Dummy devicechange event methods.
  // TODO(KaptenJansson) remove once implemented in Chrome stable.
  if (typeof navigator.mediaDevices.addEventListener === 'undefined') {
    navigator.mediaDevices.addEventListener = function() {
      logging('Dummy mediaDevices.addEventListener called.');
    };
  }
  if (typeof navigator.mediaDevices.removeEventListener === 'undefined') {
    navigator.mediaDevices.removeEventListener = function() {
      logging('Dummy mediaDevices.removeEventListener called.');
    };
  }
};

},{"../utils.js":83}],77:[function(require,module,exports){
/*
 *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */
'use strict';

var SDPUtils = require('sdp');
var utils = require('./utils');

module.exports = {
  shimRTCIceCandidate: function(window) {
    // foundation is arbitrarily chosen as an indicator for full support for
    // https://w3c.github.io/webrtc-pc/#rtcicecandidate-interface
    if (window.RTCIceCandidate && 'foundation' in
        window.RTCIceCandidate.prototype) {
      return;
    }

    var NativeRTCIceCandidate = window.RTCIceCandidate;
    window.RTCIceCandidate = function(args) {
      // Remove the a= which shouldn't be part of the candidate string.
      if (typeof args === 'object' && args.candidate &&
          args.candidate.indexOf('a=') === 0) {
        args = JSON.parse(JSON.stringify(args));
        args.candidate = args.candidate.substr(2);
      }

      // Augment the native candidate with the parsed fields.
      var nativeCandidate = new NativeRTCIceCandidate(args);
      var parsedCandidate = SDPUtils.parseCandidate(args.candidate);
      var augmentedCandidate = Object.assign(nativeCandidate,
          parsedCandidate);

      // Add a serializer that does not serialize the extra attributes.
      augmentedCandidate.toJSON = function() {
        return {
          candidate: augmentedCandidate.candidate,
          sdpMid: augmentedCandidate.sdpMid,
          sdpMLineIndex: augmentedCandidate.sdpMLineIndex,
          usernameFragment: augmentedCandidate.usernameFragment,
        };
      };
      return augmentedCandidate;
    };

    // Hook up the augmented candidate in onicecandidate and
    // addEventListener('icecandidate', ...)
    utils.wrapPeerConnectionEvent(window, 'icecandidate', function(e) {
      if (e.candidate) {
        Object.defineProperty(e, 'candidate', {
          value: new window.RTCIceCandidate(e.candidate),
          writable: 'false'
        });
      }
      return e;
    });
  },

  // shimCreateObjectURL must be called before shimSourceObject to avoid loop.

  shimCreateObjectURL: function(window) {
    var URL = window && window.URL;

    if (!(typeof window === 'object' && window.HTMLMediaElement &&
          'srcObject' in window.HTMLMediaElement.prototype &&
        URL.createObjectURL && URL.revokeObjectURL)) {
      // Only shim CreateObjectURL using srcObject if srcObject exists.
      return undefined;
    }

    var nativeCreateObjectURL = URL.createObjectURL.bind(URL);
    var nativeRevokeObjectURL = URL.revokeObjectURL.bind(URL);
    var streams = new Map(), newId = 0;

    URL.createObjectURL = function(stream) {
      if ('getTracks' in stream) {
        var url = 'polyblob:' + (++newId);
        streams.set(url, stream);
        utils.deprecated('URL.createObjectURL(stream)',
            'elem.srcObject = stream');
        return url;
      }
      return nativeCreateObjectURL(stream);
    };
    URL.revokeObjectURL = function(url) {
      nativeRevokeObjectURL(url);
      streams.delete(url);
    };

    var dsc = Object.getOwnPropertyDescriptor(window.HTMLMediaElement.prototype,
                                              'src');
    Object.defineProperty(window.HTMLMediaElement.prototype, 'src', {
      get: function() {
        return dsc.get.apply(this);
      },
      set: function(url) {
        this.srcObject = streams.get(url) || null;
        return dsc.set.apply(this, [url]);
      }
    });

    var nativeSetAttribute = window.HTMLMediaElement.prototype.setAttribute;
    window.HTMLMediaElement.prototype.setAttribute = function() {
      if (arguments.length === 2 &&
          ('' + arguments[0]).toLowerCase() === 'src') {
        this.srcObject = streams.get(arguments[1]) || null;
      }
      return nativeSetAttribute.apply(this, arguments);
    };
  },

  shimMaxMessageSize: function(window) {
    if (window.RTCSctpTransport || !window.RTCPeerConnection) {
      return;
    }
    var browserDetails = utils.detectBrowser(window);

    if (!('sctp' in window.RTCPeerConnection.prototype)) {
      Object.defineProperty(window.RTCPeerConnection.prototype, 'sctp', {
        get: function() {
          return typeof this._sctp === 'undefined' ? null : this._sctp;
        }
      });
    }

    var sctpInDescription = function(description) {
      var sections = SDPUtils.splitSections(description.sdp);
      sections.shift();
      return sections.some(function(mediaSection) {
        var mLine = SDPUtils.parseMLine(mediaSection);
        return mLine && mLine.kind === 'application'
            && mLine.protocol.indexOf('SCTP') !== -1;
      });
    };

    var getRemoteFirefoxVersion = function(description) {
      // TODO: Is there a better solution for detecting Firefox?
      var match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
      if (match === null || match.length < 2) {
        return -1;
      }
      var version = parseInt(match[1], 10);
      // Test for NaN (yes, this is ugly)
      return version !== version ? -1 : version;
    };

    var getCanSendMaxMessageSize = function(remoteIsFirefox) {
      // Every implementation we know can send at least 64 KiB.
      // Note: Although Chrome is technically able to send up to 256 KiB, the
      //       data does not reach the other peer reliably.
      //       See: https://bugs.chromium.org/p/webrtc/issues/detail?id=8419
      var canSendMaxMessageSize = 65536;
      if (browserDetails.browser === 'firefox') {
        if (browserDetails.version < 57) {
          if (remoteIsFirefox === -1) {
            // FF < 57 will send in 16 KiB chunks using the deprecated PPID
            // fragmentation.
            canSendMaxMessageSize = 16384;
          } else {
            // However, other FF (and RAWRTC) can reassemble PPID-fragmented
            // messages. Thus, supporting ~2 GiB when sending.
            canSendMaxMessageSize = 2147483637;
          }
        } else {
          // Currently, all FF >= 57 will reset the remote maximum message size
          // to the default value when a data channel is created at a later
          // stage. :(
          // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
          canSendMaxMessageSize =
            browserDetails.version === 57 ? 65535 : 65536;
        }
      }
      return canSendMaxMessageSize;
    };

    var getMaxMessageSize = function(description, remoteIsFirefox) {
      // Note: 65536 bytes is the default value from the SDP spec. Also,
      //       every implementation we know supports receiving 65536 bytes.
      var maxMessageSize = 65536;

      // FF 57 has a slightly incorrect default remote max message size, so
      // we need to adjust it here to avoid a failure when sending.
      // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1425697
      if (browserDetails.browser === 'firefox'
           && browserDetails.version === 57) {
        maxMessageSize = 65535;
      }

      var match = SDPUtils.matchPrefix(description.sdp, 'a=max-message-size:');
      if (match.length > 0) {
        maxMessageSize = parseInt(match[0].substr(19), 10);
      } else if (browserDetails.browser === 'firefox' &&
                  remoteIsFirefox !== -1) {
        // If the maximum message size is not present in the remote SDP and
        // both local and remote are Firefox, the remote peer can receive
        // ~2 GiB.
        maxMessageSize = 2147483637;
      }
      return maxMessageSize;
    };

    var origSetRemoteDescription =
        window.RTCPeerConnection.prototype.setRemoteDescription;
    window.RTCPeerConnection.prototype.setRemoteDescription = function() {
      var pc = this;
      pc._sctp = null;

      if (sctpInDescription(arguments[0])) {
        // Check if the remote is FF.
        var isFirefox = getRemoteFirefoxVersion(arguments[0]);

        // Get the maximum message size the local peer is capable of sending
        var canSendMMS = getCanSendMaxMessageSize(isFirefox);

        // Get the maximum message size of the remote peer.
        var remoteMMS = getMaxMessageSize(arguments[0], isFirefox);

        // Determine final maximum message size
        var maxMessageSize;
        if (canSendMMS === 0 && remoteMMS === 0) {
          maxMessageSize = Number.POSITIVE_INFINITY;
        } else if (canSendMMS === 0 || remoteMMS === 0) {
          maxMessageSize = Math.max(canSendMMS, remoteMMS);
        } else {
          maxMessageSize = Math.min(canSendMMS, remoteMMS);
        }

        // Create a dummy RTCSctpTransport object and the 'maxMessageSize'
        // attribute.
        var sctp = {};
        Object.defineProperty(sctp, 'maxMessageSize', {
          get: function() {
            return maxMessageSize;
          }
        });
        pc._sctp = sctp;
      }

      return origSetRemoteDescription.apply(pc, arguments);
    };
  },

  shimSendThrowTypeError: function(window) {
    // Note: Although Firefox >= 57 has a native implementation, the maximum
    //       message size can be reset for all data channels at a later stage.
    //       See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831

    var origCreateDataChannel =
      window.RTCPeerConnection.prototype.createDataChannel;
    window.RTCPeerConnection.prototype.createDataChannel = function() {
      var pc = this;
      var dataChannel = origCreateDataChannel.apply(pc, arguments);
      var origDataChannelSend = dataChannel.send;

      // Patch 'send' method
      dataChannel.send = function() {
        var dc = this;
        var data = arguments[0];
        var length = data.length || data.size || data.byteLength;
        if (length > pc.sctp.maxMessageSize) {
          throw new DOMException('Message too large (can send a maximum of ' +
            pc.sctp.maxMessageSize + ' bytes)', 'TypeError');
        }
        return origDataChannelSend.apply(dc, arguments);
      };

      return dataChannel;
    };
  }
};

},{"./utils":83,"sdp":57}],78:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */
'use strict';

var utils = require('../utils');
var shimRTCPeerConnection = require('rtcpeerconnection-shim');

module.exports = {
  shimGetUserMedia: require('./getusermedia'),
  shimPeerConnection: function(window) {
    var browserDetails = utils.detectBrowser(window);

    if (window.RTCIceGatherer) {
      // ORTC defines an RTCIceCandidate object but no constructor.
      // Not implemented in Edge.
      if (!window.RTCIceCandidate) {
        window.RTCIceCandidate = function(args) {
          return args;
        };
      }
      // ORTC does not have a session description object but
      // other browsers (i.e. Chrome) that will support both PC and ORTC
      // in the future might have this defined already.
      if (!window.RTCSessionDescription) {
        window.RTCSessionDescription = function(args) {
          return args;
        };
      }
      // this adds an additional event listener to MediaStrackTrack that signals
      // when a tracks enabled property was changed. Workaround for a bug in
      // addStream, see below. No longer required in 15025+
      if (browserDetails.version < 15025) {
        var origMSTEnabled = Object.getOwnPropertyDescriptor(
            window.MediaStreamTrack.prototype, 'enabled');
        Object.defineProperty(window.MediaStreamTrack.prototype, 'enabled', {
          set: function(value) {
            origMSTEnabled.set.call(this, value);
            var ev = new Event('enabled');
            ev.enabled = value;
            this.dispatchEvent(ev);
          }
        });
      }
    }

    // ORTC defines the DTMF sender a bit different.
    // https://github.com/w3c/ortc/issues/714
    if (window.RTCRtpSender && !('dtmf' in window.RTCRtpSender.prototype)) {
      Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
        get: function() {
          if (this._dtmf === undefined) {
            if (this.track.kind === 'audio') {
              this._dtmf = new window.RTCDtmfSender(this);
            } else if (this.track.kind === 'video') {
              this._dtmf = null;
            }
          }
          return this._dtmf;
        }
      });
    }

    window.RTCPeerConnection =
        shimRTCPeerConnection(window, browserDetails.version);
  },
  shimReplaceTrack: function(window) {
    // ORTC has replaceTrack -- https://github.com/w3c/ortc/issues/614
    if (window.RTCRtpSender &&
        !('replaceTrack' in window.RTCRtpSender.prototype)) {
      window.RTCRtpSender.prototype.replaceTrack =
          window.RTCRtpSender.prototype.setTrack;
    }
  }
};

},{"../utils":83,"./getusermedia":79,"rtcpeerconnection-shim":56}],79:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */
'use strict';

// Expose public methods.
module.exports = function(window) {
  var navigator = window && window.navigator;

  var shimError_ = function(e) {
    return {
      name: {PermissionDeniedError: 'NotAllowedError'}[e.name] || e.name,
      message: e.message,
      constraint: e.constraint,
      toString: function() {
        return this.name;
      }
    };
  };

  // getUserMedia error shim.
  var origGetUserMedia = navigator.mediaDevices.getUserMedia.
      bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia = function(c) {
    return origGetUserMedia(c).catch(function(e) {
      return Promise.reject(shimError_(e));
    });
  };
};

},{}],80:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */
'use strict';

var utils = require('../utils');

module.exports = {
  shimGetUserMedia: require('./getusermedia'),
  shimOnTrack: function(window) {
    if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
        window.RTCPeerConnection.prototype)) {
      Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
        get: function() {
          return this._ontrack;
        },
        set: function(f) {
          if (this._ontrack) {
            this.removeEventListener('track', this._ontrack);
            this.removeEventListener('addstream', this._ontrackpoly);
          }
          this.addEventListener('track', this._ontrack = f);
          this.addEventListener('addstream', this._ontrackpoly = function(e) {
            e.stream.getTracks().forEach(function(track) {
              var event = new Event('track');
              event.track = track;
              event.receiver = {track: track};
              event.transceiver = {receiver: event.receiver};
              event.streams = [e.stream];
              this.dispatchEvent(event);
            }.bind(this));
          }.bind(this));
        }
      });
    }
    if (typeof window === 'object' && window.RTCTrackEvent &&
        ('receiver' in window.RTCTrackEvent.prototype) &&
        !('transceiver' in window.RTCTrackEvent.prototype)) {
      Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
        get: function() {
          return {receiver: this.receiver};
        }
      });
    }
  },

  shimSourceObject: function(window) {
    // Firefox has supported mozSrcObject since FF22, unprefixed in 42.
    if (typeof window === 'object') {
      if (window.HTMLMediaElement &&
        !('srcObject' in window.HTMLMediaElement.prototype)) {
        // Shim the srcObject property, once, when HTMLMediaElement is found.
        Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
          get: function() {
            return this.mozSrcObject;
          },
          set: function(stream) {
            this.mozSrcObject = stream;
          }
        });
      }
    }
  },

  shimPeerConnection: function(window) {
    var browserDetails = utils.detectBrowser(window);

    if (typeof window !== 'object' || !(window.RTCPeerConnection ||
        window.mozRTCPeerConnection)) {
      return; // probably media.peerconnection.enabled=false in about:config
    }
    // The RTCPeerConnection object.
    if (!window.RTCPeerConnection) {
      window.RTCPeerConnection = function(pcConfig, pcConstraints) {
        if (browserDetails.version < 38) {
          // .urls is not supported in FF < 38.
          // create RTCIceServers with a single url.
          if (pcConfig && pcConfig.iceServers) {
            var newIceServers = [];
            for (var i = 0; i < pcConfig.iceServers.length; i++) {
              var server = pcConfig.iceServers[i];
              if (server.hasOwnProperty('urls')) {
                for (var j = 0; j < server.urls.length; j++) {
                  var newServer = {
                    url: server.urls[j]
                  };
                  if (server.urls[j].indexOf('turn') === 0) {
                    newServer.username = server.username;
                    newServer.credential = server.credential;
                  }
                  newIceServers.push(newServer);
                }
              } else {
                newIceServers.push(pcConfig.iceServers[i]);
              }
            }
            pcConfig.iceServers = newIceServers;
          }
        }
        return new window.mozRTCPeerConnection(pcConfig, pcConstraints);
      };
      window.RTCPeerConnection.prototype =
          window.mozRTCPeerConnection.prototype;

      // wrap static methods. Currently just generateCertificate.
      if (window.mozRTCPeerConnection.generateCertificate) {
        Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
          get: function() {
            return window.mozRTCPeerConnection.generateCertificate;
          }
        });
      }

      window.RTCSessionDescription = window.mozRTCSessionDescription;
      window.RTCIceCandidate = window.mozRTCIceCandidate;
    }

    // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
        .forEach(function(method) {
          var nativeMethod = window.RTCPeerConnection.prototype[method];
          window.RTCPeerConnection.prototype[method] = function() {
            arguments[0] = new ((method === 'addIceCandidate') ?
                window.RTCIceCandidate :
                window.RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          };
        });

    // support for addIceCandidate(null or undefined)
    var nativeAddIceCandidate =
        window.RTCPeerConnection.prototype.addIceCandidate;
    window.RTCPeerConnection.prototype.addIceCandidate = function() {
      if (!arguments[0]) {
        if (arguments[1]) {
          arguments[1].apply(null);
        }
        return Promise.resolve();
      }
      return nativeAddIceCandidate.apply(this, arguments);
    };

    // shim getStats with maplike support
    var makeMapStats = function(stats) {
      var map = new Map();
      Object.keys(stats).forEach(function(key) {
        map.set(key, stats[key]);
        map[key] = stats[key];
      });
      return map;
    };

    var modernStatsTypes = {
      inboundrtp: 'inbound-rtp',
      outboundrtp: 'outbound-rtp',
      candidatepair: 'candidate-pair',
      localcandidate: 'local-candidate',
      remotecandidate: 'remote-candidate'
    };

    var nativeGetStats = window.RTCPeerConnection.prototype.getStats;
    window.RTCPeerConnection.prototype.getStats = function(
      selector,
      onSucc,
      onErr
    ) {
      return nativeGetStats.apply(this, [selector || null])
        .then(function(stats) {
          if (browserDetails.version < 48) {
            stats = makeMapStats(stats);
          }
          if (browserDetails.version < 53 && !onSucc) {
            // Shim only promise getStats with spec-hyphens in type names
            // Leave callback version alone; misc old uses of forEach before Map
            try {
              stats.forEach(function(stat) {
                stat.type = modernStatsTypes[stat.type] || stat.type;
              });
            } catch (e) {
              if (e.name !== 'TypeError') {
                throw e;
              }
              // Avoid TypeError: "type" is read-only, in old versions. 34-43ish
              stats.forEach(function(stat, i) {
                stats.set(i, Object.assign({}, stat, {
                  type: modernStatsTypes[stat.type] || stat.type
                }));
              });
            }
          }
          return stats;
        })
        .then(onSucc, onErr);
    };
  },

  shimRemoveStream: function(window) {
    if (!window.RTCPeerConnection ||
        'removeStream' in window.RTCPeerConnection.prototype) {
      return;
    }
    window.RTCPeerConnection.prototype.removeStream = function(stream) {
      var pc = this;
      utils.deprecated('removeStream', 'removeTrack');
      this.getSenders().forEach(function(sender) {
        if (sender.track && stream.getTracks().indexOf(sender.track) !== -1) {
          pc.removeTrack(sender);
        }
      });
    };
  }
};

},{"../utils":83,"./getusermedia":81}],81:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */
'use strict';

var utils = require('../utils');
var logging = utils.log;

// Expose public methods.
module.exports = function(window) {
  var browserDetails = utils.detectBrowser(window);
  var navigator = window && window.navigator;
  var MediaStreamTrack = window && window.MediaStreamTrack;

  var shimError_ = function(e) {
    return {
      name: {
        InternalError: 'NotReadableError',
        NotSupportedError: 'TypeError',
        PermissionDeniedError: 'NotAllowedError',
        SecurityError: 'NotAllowedError'
      }[e.name] || e.name,
      message: {
        'The operation is insecure.': 'The request is not allowed by the ' +
        'user agent or the platform in the current context.'
      }[e.message] || e.message,
      constraint: e.constraint,
      toString: function() {
        return this.name + (this.message && ': ') + this.message;
      }
    };
  };

  // getUserMedia constraints shim.
  var getUserMedia_ = function(constraints, onSuccess, onError) {
    var constraintsToFF37_ = function(c) {
      if (typeof c !== 'object' || c.require) {
        return c;
      }
      var require = [];
      Object.keys(c).forEach(function(key) {
        if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
          return;
        }
        var r = c[key] = (typeof c[key] === 'object') ?
            c[key] : {ideal: c[key]};
        if (r.min !== undefined ||
            r.max !== undefined || r.exact !== undefined) {
          require.push(key);
        }
        if (r.exact !== undefined) {
          if (typeof r.exact === 'number') {
            r. min = r.max = r.exact;
          } else {
            c[key] = r.exact;
          }
          delete r.exact;
        }
        if (r.ideal !== undefined) {
          c.advanced = c.advanced || [];
          var oc = {};
          if (typeof r.ideal === 'number') {
            oc[key] = {min: r.ideal, max: r.ideal};
          } else {
            oc[key] = r.ideal;
          }
          c.advanced.push(oc);
          delete r.ideal;
          if (!Object.keys(r).length) {
            delete c[key];
          }
        }
      });
      if (require.length) {
        c.require = require;
      }
      return c;
    };
    constraints = JSON.parse(JSON.stringify(constraints));
    if (browserDetails.version < 38) {
      logging('spec: ' + JSON.stringify(constraints));
      if (constraints.audio) {
        constraints.audio = constraintsToFF37_(constraints.audio);
      }
      if (constraints.video) {
        constraints.video = constraintsToFF37_(constraints.video);
      }
      logging('ff37: ' + JSON.stringify(constraints));
    }
    return navigator.mozGetUserMedia(constraints, onSuccess, function(e) {
      onError(shimError_(e));
    });
  };

  // Returns the result of getUserMedia as a Promise.
  var getUserMediaPromise_ = function(constraints) {
    return new Promise(function(resolve, reject) {
      getUserMedia_(constraints, resolve, reject);
    });
  };

  // Shim for mediaDevices on older versions.
  if (!navigator.mediaDevices) {
    navigator.mediaDevices = {getUserMedia: getUserMediaPromise_,
      addEventListener: function() { },
      removeEventListener: function() { }
    };
  }
  navigator.mediaDevices.enumerateDevices =
      navigator.mediaDevices.enumerateDevices || function() {
        return new Promise(function(resolve) {
          var infos = [
            {kind: 'audioinput', deviceId: 'default', label: '', groupId: ''},
            {kind: 'videoinput', deviceId: 'default', label: '', groupId: ''}
          ];
          resolve(infos);
        });
      };

  if (browserDetails.version < 41) {
    // Work around http://bugzil.la/1169665
    var orgEnumerateDevices =
        navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
    navigator.mediaDevices.enumerateDevices = function() {
      return orgEnumerateDevices().then(undefined, function(e) {
        if (e.name === 'NotFoundError') {
          return [];
        }
        throw e;
      });
    };
  }
  if (browserDetails.version < 49) {
    var origGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(c) {
      return origGetUserMedia(c).then(function(stream) {
        // Work around https://bugzil.la/802326
        if (c.audio && !stream.getAudioTracks().length ||
            c.video && !stream.getVideoTracks().length) {
          stream.getTracks().forEach(function(track) {
            track.stop();
          });
          throw new DOMException('The object can not be found here.',
                                 'NotFoundError');
        }
        return stream;
      }, function(e) {
        return Promise.reject(shimError_(e));
      });
    };
  }
  if (!(browserDetails.version > 55 &&
      'autoGainControl' in navigator.mediaDevices.getSupportedConstraints())) {
    var remap = function(obj, a, b) {
      if (a in obj && !(b in obj)) {
        obj[b] = obj[a];
        delete obj[a];
      }
    };

    var nativeGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(c) {
      if (typeof c === 'object' && typeof c.audio === 'object') {
        c = JSON.parse(JSON.stringify(c));
        remap(c.audio, 'autoGainControl', 'mozAutoGainControl');
        remap(c.audio, 'noiseSuppression', 'mozNoiseSuppression');
      }
      return nativeGetUserMedia(c);
    };

    if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
      var nativeGetSettings = MediaStreamTrack.prototype.getSettings;
      MediaStreamTrack.prototype.getSettings = function() {
        var obj = nativeGetSettings.apply(this, arguments);
        remap(obj, 'mozAutoGainControl', 'autoGainControl');
        remap(obj, 'mozNoiseSuppression', 'noiseSuppression');
        return obj;
      };
    }

    if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
      var nativeApplyConstraints = MediaStreamTrack.prototype.applyConstraints;
      MediaStreamTrack.prototype.applyConstraints = function(c) {
        if (this.kind === 'audio' && typeof c === 'object') {
          c = JSON.parse(JSON.stringify(c));
          remap(c, 'autoGainControl', 'mozAutoGainControl');
          remap(c, 'noiseSuppression', 'mozNoiseSuppression');
        }
        return nativeApplyConstraints.apply(this, [c]);
      };
    }
  }
  navigator.getUserMedia = function(constraints, onSuccess, onError) {
    if (browserDetails.version < 44) {
      return getUserMedia_(constraints, onSuccess, onError);
    }
    // Replace Firefox 44+'s deprecation warning with unprefixed version.
    utils.deprecated('navigator.getUserMedia',
        'navigator.mediaDevices.getUserMedia');
    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
  };
};

},{"../utils":83}],82:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
'use strict';
var utils = require('../utils');

module.exports = {
  shimLocalStreamsAPI: function(window) {
    if (typeof window !== 'object' || !window.RTCPeerConnection) {
      return;
    }
    if (!('getLocalStreams' in window.RTCPeerConnection.prototype)) {
      window.RTCPeerConnection.prototype.getLocalStreams = function() {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        return this._localStreams;
      };
    }
    if (!('getStreamById' in window.RTCPeerConnection.prototype)) {
      window.RTCPeerConnection.prototype.getStreamById = function(id) {
        var result = null;
        if (this._localStreams) {
          this._localStreams.forEach(function(stream) {
            if (stream.id === id) {
              result = stream;
            }
          });
        }
        if (this._remoteStreams) {
          this._remoteStreams.forEach(function(stream) {
            if (stream.id === id) {
              result = stream;
            }
          });
        }
        return result;
      };
    }
    if (!('addStream' in window.RTCPeerConnection.prototype)) {
      var _addTrack = window.RTCPeerConnection.prototype.addTrack;
      window.RTCPeerConnection.prototype.addStream = function(stream) {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        if (this._localStreams.indexOf(stream) === -1) {
          this._localStreams.push(stream);
        }
        var pc = this;
        stream.getTracks().forEach(function(track) {
          _addTrack.call(pc, track, stream);
        });
      };

      window.RTCPeerConnection.prototype.addTrack = function(track, stream) {
        if (stream) {
          if (!this._localStreams) {
            this._localStreams = [stream];
          } else if (this._localStreams.indexOf(stream) === -1) {
            this._localStreams.push(stream);
          }
        }
        return _addTrack.call(this, track, stream);
      };
    }
    if (!('removeStream' in window.RTCPeerConnection.prototype)) {
      window.RTCPeerConnection.prototype.removeStream = function(stream) {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        var index = this._localStreams.indexOf(stream);
        if (index === -1) {
          return;
        }
        this._localStreams.splice(index, 1);
        var pc = this;
        var tracks = stream.getTracks();
        this.getSenders().forEach(function(sender) {
          if (tracks.indexOf(sender.track) !== -1) {
            pc.removeTrack(sender);
          }
        });
      };
    }
  },
  shimRemoteStreamsAPI: function(window) {
    if (typeof window !== 'object' || !window.RTCPeerConnection) {
      return;
    }
    if (!('getRemoteStreams' in window.RTCPeerConnection.prototype)) {
      window.RTCPeerConnection.prototype.getRemoteStreams = function() {
        return this._remoteStreams ? this._remoteStreams : [];
      };
    }
    if (!('onaddstream' in window.RTCPeerConnection.prototype)) {
      Object.defineProperty(window.RTCPeerConnection.prototype, 'onaddstream', {
        get: function() {
          return this._onaddstream;
        },
        set: function(f) {
          var pc = this;
          if (this._onaddstream) {
            this.removeEventListener('addstream', this._onaddstream);
            this.removeEventListener('track', this._onaddstreampoly);
          }
          this.addEventListener('addstream', this._onaddstream = f);
          this.addEventListener('track', this._onaddstreampoly = function(e) {
            e.streams.forEach(function(stream) {
              if (!pc._remoteStreams) {
                pc._remoteStreams = [];
              }
              if (pc._remoteStreams.indexOf(stream) >= 0) {
                return;
              }
              pc._remoteStreams.push(stream);
              var event = new Event('addstream');
              event.stream = stream;
              pc.dispatchEvent(event);
            });
          });
        }
      });
    }
  },
  shimCallbacksAPI: function(window) {
    if (typeof window !== 'object' || !window.RTCPeerConnection) {
      return;
    }
    var prototype = window.RTCPeerConnection.prototype;
    var createOffer = prototype.createOffer;
    var createAnswer = prototype.createAnswer;
    var setLocalDescription = prototype.setLocalDescription;
    var setRemoteDescription = prototype.setRemoteDescription;
    var addIceCandidate = prototype.addIceCandidate;

    prototype.createOffer = function(successCallback, failureCallback) {
      var options = (arguments.length >= 2) ? arguments[2] : arguments[0];
      var promise = createOffer.apply(this, [options]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };

    prototype.createAnswer = function(successCallback, failureCallback) {
      var options = (arguments.length >= 2) ? arguments[2] : arguments[0];
      var promise = createAnswer.apply(this, [options]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };

    var withCallback = function(description, successCallback, failureCallback) {
      var promise = setLocalDescription.apply(this, [description]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    prototype.setLocalDescription = withCallback;

    withCallback = function(description, successCallback, failureCallback) {
      var promise = setRemoteDescription.apply(this, [description]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    prototype.setRemoteDescription = withCallback;

    withCallback = function(candidate, successCallback, failureCallback) {
      var promise = addIceCandidate.apply(this, [candidate]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    prototype.addIceCandidate = withCallback;
  },
  shimGetUserMedia: function(window) {
    var navigator = window && window.navigator;

    if (!navigator.getUserMedia) {
      if (navigator.webkitGetUserMedia) {
        navigator.getUserMedia = navigator.webkitGetUserMedia.bind(navigator);
      } else if (navigator.mediaDevices &&
          navigator.mediaDevices.getUserMedia) {
        navigator.getUserMedia = function(constraints, cb, errcb) {
          navigator.mediaDevices.getUserMedia(constraints)
          .then(cb, errcb);
        }.bind(navigator);
      }
    }
  },
  shimRTCIceServerUrls: function(window) {
    // migrate from non-spec RTCIceServer.url to RTCIceServer.urls
    var OrigPeerConnection = window.RTCPeerConnection;
    window.RTCPeerConnection = function(pcConfig, pcConstraints) {
      if (pcConfig && pcConfig.iceServers) {
        var newIceServers = [];
        for (var i = 0; i < pcConfig.iceServers.length; i++) {
          var server = pcConfig.iceServers[i];
          if (!server.hasOwnProperty('urls') &&
              server.hasOwnProperty('url')) {
            utils.deprecated('RTCIceServer.url', 'RTCIceServer.urls');
            server = JSON.parse(JSON.stringify(server));
            server.urls = server.url;
            delete server.url;
            newIceServers.push(server);
          } else {
            newIceServers.push(pcConfig.iceServers[i]);
          }
        }
        pcConfig.iceServers = newIceServers;
      }
      return new OrigPeerConnection(pcConfig, pcConstraints);
    };
    window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
    // wrap static methods. Currently just generateCertificate.
    if ('generateCertificate' in window.RTCPeerConnection) {
      Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
        get: function() {
          return OrigPeerConnection.generateCertificate;
        }
      });
    }
  },
  shimTrackEventTransceiver: function(window) {
    // Add event.transceiver member over deprecated event.receiver
    if (typeof window === 'object' && window.RTCPeerConnection &&
        ('receiver' in window.RTCTrackEvent.prototype) &&
        // can't check 'transceiver' in window.RTCTrackEvent.prototype, as it is
        // defined for some reason even when window.RTCTransceiver is not.
        !window.RTCTransceiver) {
      Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
        get: function() {
          return {receiver: this.receiver};
        }
      });
    }
  },

  shimCreateOfferLegacy: function(window) {
    var origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
    window.RTCPeerConnection.prototype.createOffer = function(offerOptions) {
      var pc = this;
      if (offerOptions) {
        var audioTransceiver = pc.getTransceivers().find(function(transceiver) {
          return transceiver.sender.track &&
              transceiver.sender.track.kind === 'audio';
        });
        if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
          if (audioTransceiver.direction === 'sendrecv') {
            if (audioTransceiver.setDirection) {
              audioTransceiver.setDirection('sendonly');
            } else {
              audioTransceiver.direction = 'sendonly';
            }
          } else if (audioTransceiver.direction === 'recvonly') {
            if (audioTransceiver.setDirection) {
              audioTransceiver.setDirection('inactive');
            } else {
              audioTransceiver.direction = 'inactive';
            }
          }
        } else if (offerOptions.offerToReceiveAudio === true &&
            !audioTransceiver) {
          pc.addTransceiver('audio');
        }

        var videoTransceiver = pc.getTransceivers().find(function(transceiver) {
          return transceiver.sender.track &&
              transceiver.sender.track.kind === 'video';
        });
        if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
          if (videoTransceiver.direction === 'sendrecv') {
            videoTransceiver.setDirection('sendonly');
          } else if (videoTransceiver.direction === 'recvonly') {
            videoTransceiver.setDirection('inactive');
          }
        } else if (offerOptions.offerToReceiveVideo === true &&
            !videoTransceiver) {
          pc.addTransceiver('video');
        }
      }
      return origCreateOffer.apply(pc, arguments);
    };
  }
};

},{"../utils":83}],83:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */
'use strict';

var logDisabled_ = true;
var deprecationWarnings_ = true;

/**
 * Extract browser version out of the provided user agent string.
 *
 * @param {!string} uastring userAgent string.
 * @param {!string} expr Regular expression used as match criteria.
 * @param {!number} pos position in the version string to be returned.
 * @return {!number} browser version.
 */
function extractVersion(uastring, expr, pos) {
  var match = uastring.match(expr);
  return match && match.length >= pos && parseInt(match[pos], 10);
}

// Wraps the peerconnection event eventNameToWrap in a function
// which returns the modified event object.
function wrapPeerConnectionEvent(window, eventNameToWrap, wrapper) {
  if (!window.RTCPeerConnection) {
    return;
  }
  var proto = window.RTCPeerConnection.prototype;
  var nativeAddEventListener = proto.addEventListener;
  proto.addEventListener = function(nativeEventName, cb) {
    if (nativeEventName !== eventNameToWrap) {
      return nativeAddEventListener.apply(this, arguments);
    }
    var wrappedCallback = function(e) {
      cb(wrapper(e));
    };
    this._eventMap = this._eventMap || {};
    this._eventMap[cb] = wrappedCallback;
    return nativeAddEventListener.apply(this, [nativeEventName,
      wrappedCallback]);
  };

  var nativeRemoveEventListener = proto.removeEventListener;
  proto.removeEventListener = function(nativeEventName, cb) {
    if (nativeEventName !== eventNameToWrap || !this._eventMap
        || !this._eventMap[cb]) {
      return nativeRemoveEventListener.apply(this, arguments);
    }
    var unwrappedCb = this._eventMap[cb];
    delete this._eventMap[cb];
    return nativeRemoveEventListener.apply(this, [nativeEventName,
      unwrappedCb]);
  };

  Object.defineProperty(proto, 'on' + eventNameToWrap, {
    get: function() {
      return this['_on' + eventNameToWrap];
    },
    set: function(cb) {
      if (this['_on' + eventNameToWrap]) {
        this.removeEventListener(eventNameToWrap,
            this['_on' + eventNameToWrap]);
        delete this['_on' + eventNameToWrap];
      }
      if (cb) {
        this.addEventListener(eventNameToWrap,
            this['_on' + eventNameToWrap] = cb);
      }
    }
  });
}

// Utility methods.
module.exports = {
  extractVersion: extractVersion,
  wrapPeerConnectionEvent: wrapPeerConnectionEvent,
  disableLog: function(bool) {
    if (typeof bool !== 'boolean') {
      return new Error('Argument type: ' + typeof bool +
          '. Please use a boolean.');
    }
    logDisabled_ = bool;
    return (bool) ? 'adapter.js logging disabled' :
        'adapter.js logging enabled';
  },

  /**
   * Disable or enable deprecation warnings
   * @param {!boolean} bool set to true to disable warnings.
   */
  disableWarnings: function(bool) {
    if (typeof bool !== 'boolean') {
      return new Error('Argument type: ' + typeof bool +
          '. Please use a boolean.');
    }
    deprecationWarnings_ = !bool;
    return 'adapter.js deprecation warnings ' + (bool ? 'disabled' : 'enabled');
  },

  log: function() {
    if (typeof window === 'object') {
      if (logDisabled_) {
        return;
      }
      if (typeof console !== 'undefined' && typeof console.log === 'function') {
        console.log.apply(console, arguments);
      }
    }
  },

  /**
   * Shows a deprecation warning suggesting the modern and spec-compatible API.
   */
  deprecated: function(oldMethod, newMethod) {
    if (!deprecationWarnings_) {
      return;
    }
    console.warn(oldMethod + ' is deprecated, please use ' + newMethod +
        ' instead.');
  },

  /**
   * Browser detector.
   *
   * @return {object} result containing browser and version
   *     properties.
   */
  detectBrowser: function(window) {
    var navigator = window && window.navigator;

    // Returned result object.
    var result = {};
    result.browser = null;
    result.version = null;

    // Fail early if it's not a browser
    if (typeof window === 'undefined' || !window.navigator) {
      result.browser = 'Not a browser.';
      return result;
    }

    if (navigator.mozGetUserMedia) { // Firefox.
      result.browser = 'firefox';
      result.version = extractVersion(navigator.userAgent,
          /Firefox\/(\d+)\./, 1);
    } else if (navigator.webkitGetUserMedia) {
      // Chrome, Chromium, Webview, Opera.
      // Version matches Chrome/WebRTC version.
      result.browser = 'chrome';
      result.version = extractVersion(navigator.userAgent,
          /Chrom(e|ium)\/(\d+)\./, 2);
    } else if (navigator.mediaDevices &&
        navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) { // Edge.
      result.browser = 'edge';
      result.version = extractVersion(navigator.userAgent,
          /Edge\/(\d+).(\d+)$/, 2);
    } else if (navigator.mediaDevices &&
        navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) { // Safari.
      result.browser = 'safari';
      result.version = extractVersion(navigator.userAgent,
          /AppleWebKit\/(\d+)\./, 1);
    } else { // Default fallthrough: not supported.
      result.browser = 'Not a supported browser.';
      return result;
    }

    return result;
  }
};

},{}],84:[function(require,module,exports){
/*
WildEmitter.js is a slim little event emitter by @henrikjoreteg largely based
on @visionmedia's Emitter from UI Kit.

Why? I wanted it standalone.

I also wanted support for wildcard emitters like this:

emitter.on('*', function (eventName, other, event, payloads) {

});

emitter.on('somenamespace*', function (eventName, payloads) {

});

Please note that callbacks triggered by wildcard registered events also get
the event name as the first argument.
*/

module.exports = WildEmitter;

function WildEmitter() { }

WildEmitter.mixin = function (constructor) {
    var prototype = constructor.prototype || constructor;

    prototype.isWildEmitter= true;

    // Listen on the given `event` with `fn`. Store a group name if present.
    prototype.on = function (event, groupName, fn) {
        this.callbacks = this.callbacks || {};
        var hasGroup = (arguments.length === 3),
            group = hasGroup ? arguments[1] : undefined,
            func = hasGroup ? arguments[2] : arguments[1];
        func._groupName = group;
        (this.callbacks[event] = this.callbacks[event] || []).push(func);
        return this;
    };

    // Adds an `event` listener that will be invoked a single
    // time then automatically removed.
    prototype.once = function (event, groupName, fn) {
        var self = this,
            hasGroup = (arguments.length === 3),
            group = hasGroup ? arguments[1] : undefined,
            func = hasGroup ? arguments[2] : arguments[1];
        function on() {
            self.off(event, on);
            func.apply(this, arguments);
        }
        this.on(event, group, on);
        return this;
    };

    // Unbinds an entire group
    prototype.releaseGroup = function (groupName) {
        this.callbacks = this.callbacks || {};
        var item, i, len, handlers;
        for (item in this.callbacks) {
            handlers = this.callbacks[item];
            for (i = 0, len = handlers.length; i < len; i++) {
                if (handlers[i]._groupName === groupName) {
                    //console.log('removing');
                    // remove it and shorten the array we're looping through
                    handlers.splice(i, 1);
                    i--;
                    len--;
                }
            }
        }
        return this;
    };

    // Remove the given callback for `event` or all
    // registered callbacks.
    prototype.off = function (event, fn) {
        this.callbacks = this.callbacks || {};
        var callbacks = this.callbacks[event],
            i;

        if (!callbacks) return this;

        // remove all handlers
        if (arguments.length === 1) {
            delete this.callbacks[event];
            return this;
        }

        // remove specific handler
        i = callbacks.indexOf(fn);
        callbacks.splice(i, 1);
        if (callbacks.length === 0) {
            delete this.callbacks[event];
        }
        return this;
    };

    /// Emit `event` with the given args.
    // also calls any `*` handlers
    prototype.emit = function (event) {
        this.callbacks = this.callbacks || {};
        var args = [].slice.call(arguments, 1),
            callbacks = this.callbacks[event],
            specialCallbacks = this.getWildcardCallbacks(event),
            i,
            len,
            item,
            listeners;

        if (callbacks) {
            listeners = callbacks.slice();
            for (i = 0, len = listeners.length; i < len; ++i) {
                if (!listeners[i]) {
                    break;
                }
                listeners[i].apply(this, args);
            }
        }

        if (specialCallbacks) {
            len = specialCallbacks.length;
            listeners = specialCallbacks.slice();
            for (i = 0, len = listeners.length; i < len; ++i) {
                if (!listeners[i]) {
                    break;
                }
                listeners[i].apply(this, [event].concat(args));
            }
        }

        return this;
    };

    // Helper for for finding special wildcard event handlers that match the event
    prototype.getWildcardCallbacks = function (eventName) {
        this.callbacks = this.callbacks || {};
        var item,
            split,
            result = [];

        for (item in this.callbacks) {
            split = item.split('*');
            if (item === '*' || (split.length === 2 && eventName.slice(0, split[0].length) === split[0])) {
                result = result.concat(this.callbacks[item]);
            }
        }
        return result;
    };

};

WildEmitter.mixin(WildEmitter);

},{}],85:[function(require,module,exports){
'use strict';

var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('')
  , length = 64
  , map = {}
  , seed = 0
  , i = 0
  , prev;

/**
 * Return a string representing the specified number.
 *
 * @param {Number} num The number to convert.
 * @returns {String} The string representation of the number.
 * @api public
 */
function encode(num) {
  var encoded = '';

  do {
    encoded = alphabet[num % length] + encoded;
    num = Math.floor(num / length);
  } while (num > 0);

  return encoded;
}

/**
 * Return the integer value specified by the given string.
 *
 * @param {String} str The string to convert.
 * @returns {Number} The integer value represented by the string.
 * @api public
 */
function decode(str) {
  var decoded = 0;

  for (i = 0; i < str.length; i++) {
    decoded = decoded * length + map[str.charAt(i)];
  }

  return decoded;
}

/**
 * Yeast: A tiny growing id generator.
 *
 * @returns {String} A unique id.
 * @api public
 */
function yeast() {
  var now = encode(+new Date());

  if (now !== prev) return seed = 0, prev = now;
  return now +'.'+ encode(seed++);
}

//
// Map each character to its index.
//
for (; i < length; i++) map[alphabet[i]] = i;

//
// Expose the `yeast`, `encode` and `decode` functions.
//
yeast.encode = encode;
yeast.decode = decode;
module.exports = yeast;

},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ })

/******/ });