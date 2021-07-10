import { CoachDoc } from './../models/Coach.model';
import { SessionDoc } from './../models/Session.model';
import { google } from 'googleapis';
import { UserDoc } from '../models/User.model';
interface AuthenticatorArrgs {
	client_id: string;
	client_secret: string;
	redirect_url: string;
	refresh_token: string;
	access_token: string;
}

class GoogleCalendarWrapper {
	private _client_id?: string;
	private _client_secret?: string;
	private _redirect_url?: string;
	private _refresh_token?: string;
	private _access_token?: string;
	public oAuth2Client: any;

	async authenticate(authenticator: AuthenticatorArrgs) {
		this._client_id = authenticator.client_id;
		this._client_secret = authenticator.client_secret;
		this._redirect_url = authenticator.redirect_url;
		this._refresh_token = authenticator.refresh_token;
		this._access_token = authenticator.access_token;

		this.oAuth2Client = new google.auth.OAuth2(
			this._client_id,
			this._client_secret,
			this._redirect_url,
		);

		this.oAuth2Client.setCredentials({
			refresh_token: this._refresh_token,
			access_token: this._access_token,
		});
	}

	async createSessionInCalendar(
		session: SessionDoc,
		coach: CoachDoc,
		user: UserDoc,
	) {
		const calendar = google.calendar({
			version: 'v3',
			auth: this.oAuth2Client,
		});
		const startTime = new Date(session.time.toISOString());

		const endTime = new Date(session.time.toISOString());
		endTime.setHours(endTime.getHours() + 1);

		const event = {
			summary: 'MyCoach',
			location: 'online',
			description: `This meeting is scheduled automatically by MyCoach`,
			start: {
				dateTime: startTime.toISOString(),
			},
			end: {
				dateTime: endTime.toISOString(),
			},
			attendees: [{ email: coach.email }, { email: user.email }],
			conferenceData: {
				createRequest: {
					requestId: session._id.toString(),
				},
			},
			reminders: {
				useDefault: false,
				overrides: [
					{ method: 'email', minutes: 12 * 60 },
					{ method: 'popup', minutes: 15 },
				],
			},
		};

		const res = await calendar.events.insert({
			calendarId: process.env.GOOGLE_CALENDAR,
			conferenceDataVersion: 1,
			maxAttendees: 3,
			sendNotifications: true,
			auth: this.oAuth2Client,
			requestBody: event,
		});

		return res;
	}

	async listAvailableSessions(coach: CoachDoc) {
		try {
			const calendar = google.calendar({
				version: 'v3',
				auth: process.env.GOOGLE_API_KEY,
			});

			let time = new Date();

			time.setDate(time.getDate() + 1);
			let timeMin = time.toISOString();

			time.setDate(time.getDate() + 30);
			let timeMax = time.toISOString();

			const events = await calendar.events.list({
				calendarId: coach.calendar,
				timeMin,
				// maxResults: 10,
				timeMax,
				singleEvents: true,
				orderBy: 'startTime',
				timeZone: 'GMT+01',
			});

			return {
				events: events.data
					.items!.map((event) => event.start?.dateTime)
					.filter((event) => event),
			};
		} catch (error) {
			// console.error(error);
			return { errors: [error] };
		}
	}
}

export const googleCalendarWrapper = new GoogleCalendarWrapper();
