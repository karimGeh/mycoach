const filterSession = (events: any, sessionInQueue: any) => {
	// const newSessionInQueue = sessionInQueue.map((date:string) => {

	// })
	return events.filter((date: string) => {
		return sessionInQueue.findIndex(
			(time: string) => new Date(time).getTime() === new Date(date).getTime(),
		);
	});
};

export { filterSession };
