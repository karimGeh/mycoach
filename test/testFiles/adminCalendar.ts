// import { google } from 'googleapis';
// import { SessionDoc } from '../../models/Session.model';

// class adminCalendar {
// 	static async createEventAndMeeting(session?: SessionDoc | undefined | null) {
// 		if (!session) return null;

// 		const oauth2Client = new google.auth.OAuth2(
// 			process.env.CLIENT_ID,
// 			process.env.CLIENT_SECRET,
// 			process.env.REDIRECT_URL,
// 		);

// 		const SCOPES = [
// 			'https://www.googleapis.com/auth/calendar',
// 			'https://www.googleapis.com/auth/calendar.events',
// 		];

// 		// const url = oauth2Client.generateAuthUrl({
// 		// 	access_type: 'offline',
// 		// 	scope: SCOPES,
// 		// });

// 		/**?
// 		 * 127.0.0.1:3000/oauthplayground?code=4%2F0AX4XfWhIXgjfRjE0eDD9Z1Ztfh4MYmHYByM54oHq9EQPgkY7xfTyw1GYjhqGR9UjWdYWiQ
// 		 * &scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.events
// 		 *
// 		 *
// 		 */

// 		// return url;
// 		const code =
// 			'4%2F0AX4XfWhIXgjfRjE0eDD9Z1Ztfh4MYmHYByM54oHq9EQPgkY7xfTyw1GYjhqGR9UjWdYWiQ';
// 		let refresh_token =
// 			'1//04YYdDJ2uc_k_CgYIARAAGAQSNwF-L9Ir-cEXHxwIzw4_30KjJKsC2UThBGLK-Ti5jUvU7YEeJCpUC2-dyiZl9KFymuwxdeRqtFQ';
// 		let access_token =
// 			'ya29.a0ARrdaM8bUAURCfVxyjf6CUO8D1cmG7rUNXRHW_sJDFEb11POXC_ezEaw7IasmW6kH6UMscmUO7kUpmb_4WmxxGEyo40KyrugLh6o9uXrr0hDQIP_idNIAGZ4TgWeLr_lI5IKEyPPDxs-qE71nF1gk_kHDRBV';
// 		oauth2Client.setCredentials({
// 			refresh_token,
// 			access_token,
// 		});

// 		// const { tokens } = await oauth2Client.getToken(code);
// 		// oauth2Client.setCredentials(tokens);

// 		oauth2Client.on('tokens', (tokens) => {
// 			if (tokens.refresh_token) {
// 				// store the refresh_token in my database!
// 				console.log(tokens.refresh_token);
// 			}
// 			console.log(tokens.access_token);
// 		});
// 		const calendar = google.calendar({
// 			version: 'v3',
// 			auth: oauth2Client,
// 		});

// 		var event = {
// 			summary: 'my coach',
// 			location: 'online',
// 			description: 'this is the meeting with your coach',
// 			start: {
// 				dateTime: '2021-07-10T04:00:00+01:00',
// 				timeZone: 'GMT+01',
// 			},
// 			end: {
// 				dateTime: '2021-07-10T05:00:00+01:00',
// 				timeZone: 'GMT+01',
// 			},
// 			// recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
// 			attendees: [
// 				{ email: 'soufiane1bouslim@gmail.com' },
// 				{ email: 'reda.thejoker@gmail.com' },
// 			],
// 			conferenceData: {
// 				createRequest: {
// 					requestId: 'asdfsadfsadg',
// 				},
// 			},
// 			reminders: {
// 				useDefault: false,
// 				overrides: [
// 					{ method: 'email', minutes: 12 * 60 },
// 					{ method: 'popup', minutes: 10 },
// 				],
// 			},
// 		};

// 		const res = await calendar.events.insert({
// 			calendarId: process.env.GOOGLE_CALENDAR,
// 			conferenceDataVersion: 1,
// 			maxAttendees: 3,
// 			sendNotifications: true,
// 			auth: oauth2Client,
// 			requestBody: event,
// 			// resource: event,
// 		});

// 		return res;
// 	}
// }

// export { adminCalendar };
