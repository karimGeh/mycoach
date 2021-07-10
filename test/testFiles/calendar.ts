// import { google } from 'googleapis';
// import { startSession } from 'mongoose';

// class Calendar {
// 	static async availableEvents(calendarId: string) {
// 		try {
// 			const calendar = google.calendar({
// 				version: 'v3',
// 				auth: process.env.GOOGLE_API_KEY,
// 			});

// 			let time = new Date();
// 			time.setDate(time.getDate() + 1);

// 			let timeMin = time.toISOString();
// 			time.setDate(time.getDate() + 32);
// 			let timeMax = time.toISOString();

// 			const events = await calendar.events.list({
// 				calendarId,
// 				timeMin,
// 				// maxResults: 10,
// 				timeMax,
// 				singleEvents: true,
// 				orderBy: 'startTime',
// 				timeZone: 'GMT+01',
// 			});

// 			return {
// 				events: events.data
// 					.items!.map((event) => event.start?.dateTime)
// 					.filter((event) => event),
// 			};
// 		} catch (error) {
// 			// console.error(error);
// 			return { errors: [error] };
// 		}
// 	}
// }

// // export const calendarObject = new Calendar();
// export { Calendar };
