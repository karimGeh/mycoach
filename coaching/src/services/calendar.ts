import { google } from 'googleapis';

export class Calendar {
	async isValid(calendarId: string) {
		try {
			const calendar = google.calendar({
				version: 'v3',
				auth: process.env.GOOGLE_API_KEY,
			});

			let time = new Date();
			time.setDate(time.getDate() + 1);

			let timeMax = time.toISOString();
			await calendar.events.list({
				calendarId,
				timeMin: time.toISOString(),
				maxResults: 10,
				// timeMax,
				singleEvents: true,
				orderBy: 'startTime',
				timeZone: 'GMT+01',
			});

			// await calendar.freebusy.query({
			// 	requestBody: {
			// 		// Set times to ISO strings as such
			// 		timeMin: new Date().toISOString(),
			// 		timeMax,
			// 		timeZone: 'GMT+01',
			// 		items: [{ id: calendarId }],
			// 	},
			// });
			// console.log(events.data.items);
			return true;
		} catch (error) {
			// console.error(error);
			return false;
		}
	}
}

export const calendarObject = new Calendar();
// const cal = google.calendar({
// 	version: 'v3',
// 	auth: 'AIzaSyDPRpU23K91XTr-ogT3ixFkuXDNUI-11wA',
// });

// export { cal as calendarObject };
