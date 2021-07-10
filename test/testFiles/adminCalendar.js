"use strict";
exports.__esModule = true;
exports.adminCalendar = void 0;
// import { request } from 'supertest';
var adminCalendar = /** @class */ (function () {
    function adminCalendar() {
    }
    return adminCalendar;
}());
exports.adminCalendar = adminCalendar;
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis').google;
// If modifying these scopes, delete token.json.
var SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
var TOKEN_PATH = 'token.json';
// Load client secrets from a local file.
fs.readFile('credentials.json', function (err, content) {
    if (err)
        return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Calendar API.
    authorize(JSON.parse(content), listEvents);
});
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    var _a = credentials.web, client_secret = _a.client_secret, client_id = _a.client_id, redirect_uris = _a.redirect_uris;
    var oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function (err, token) {
        if (err)
            return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}
/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
    var authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function (code) {
        rl.close();
        oAuth2Client.getToken(code, function (err, token) {
            if (err)
                return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), function (err) {
                if (err)
                    return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}
/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
    var calendar = google.calendar({
        version: 'v3',
        auth: auth
    });
    var event = {
        summary: 'my coach',
        location: 'online',
        description: 'this is the meeting with your coach',
        start: {
            dateTime: '2021-07-09T04:00:00+01:00',
            timeZone: 'GMT+01'
        },
        end: {
            dateTime: '2021-07-09T05:00:00+01:00',
            timeZone: 'GMT+01'
        },
        // recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
        attendees: [
            { email: 'soufiane1bouslim@gmail.com' },
            { email: 'reda.thejoker@gmail.com' },
        ],
        conferenceData: {
            createRequest: {
                requestId: 'fjkadgskifggkig'
            }
        },
        reminders: {
            useDefault: false,
            overrides: [
                { method: 'email', minutes: 12 * 60 },
                { method: 'popup', minutes: 10 },
            ]
        }
    };
    calendar.events.insert({
        auth: auth,
        calendarId: 'k8sassdp3uac6ev93bguqf3m4c@group.calendar.google.com',
        resource: event,
        conferenceDataVersion: 1,
        sendNotifications: true,
        maxAttendees: 3
    }, function (err, event) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            return;
        }
        console.log('Event created: %s', event.htmlLink);
        console.log(event);
    });
    // calendar.events.list(
    // 	{
    // 		calendarId: 'k8sassdp3uac6ev93bguqf3m4c@group.calendar.google.com',
    // 		timeMin: new Date().toISOString(),
    // 		maxResults: 10,
    // 		singleEvents: true,
    // 		orderBy: 'startTime',
    // 	},
    // 	(err: any, res: any) => {
    // 		if (err) return console.log('The API returned an error: ' + err);
    // 		const events = res.data.items;
    // 		if (events.length) {
    // 			console.log('Upcoming 10 events:');
    // 			events.map((event: any, i: any) => {
    // 				const start = event.start.dateTime || event.start.date;
    // 				console.log(`${start} - ${event.summary}`);
    // 			});
    // 		} else {
    // 			console.log('No upcoming events found.');
    // 		}
    // 	},
    // );
}
