interface CHANNEL_SELECT_ACTION {
	channelId?: string | null;
	guildId: string | null;
	hoistedRoute: undefined;
	jumpType: undefined;
	messageId: string | null;
	type: 'CHANNEL_SELECT';
}
