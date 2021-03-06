import VueDiscordMessage from '../../src/index.js';

export default ({ Vue }) => {
	Vue.use(VueDiscordMessage, {
		profiles: {
			sanc: {
				author: 'Sanctuary',
				avatar: 'https://i.imgur.com/0TeacfY.png',
			},
			rinon: {
				author: 'Rinon',
				avatar: 'https://i.imgur.com/axQ9wJl.png',
				bot: true,
				roleColor: '#ee82ee',
			},
		},
	});
};
