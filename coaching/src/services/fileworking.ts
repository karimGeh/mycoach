import { google } from 'googleapis';

const cal = google.calendar({
	version: 'v3',
	auth: 'AIzaSyDPRpU23K91XTr-ogT3ixFkuXDNUI-11wA',
});

// const calendar = '201siimv1mci911v5odk7g12j0@group.calendar.google.com';
const calendar = 's7bjuqm7a5frbg0a9ck8nigcr4@group.calendar.google.com';

const tomorrow3pm = new Date();
tomorrow3pm.setDate(tomorrow3pm.getDate() + 1);
tomorrow3pm.setHours(0, 0, 0);

const tomorrow4pm = new Date();
tomorrow4pm.setDate(tomorrow4pm.getDate() + 7);
tomorrow4pm.setHours(23, 0, 0);

cal.freebusy
	.query({
		requestBody: {
			// Set times to ISO strings as such
			timeMin: new Date(tomorrow3pm).toISOString(),
			timeMax: new Date(tomorrow4pm).toISOString(),
			timeZone: 'GMT+01',
			items: [{ id: calendar }],
		},
	})
	.then((result) => {
		const busy = result.data.calendars![calendar].busy;
		const errors = result.data.calendars![calendar].errors;
		if (undefined !== errors) {
			console.error('Check this this calendar has public free busy visibility');
		} else if (busy!.length !== 0) {
			console.log(busy);

			console.log('Busy');
		} else {
			console.log('Free');
		}
	})
	.catch((e) => {
		console.error(e);
	});
