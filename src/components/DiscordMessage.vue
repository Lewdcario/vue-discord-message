<template>
	<div class="discord-message">
		<div class="discord-author-avatar">
			<img :src="profile.avatar" :alt="profile.author" />
		</div>
		<div class="discord-message-content">
			<div v-if="!compactMode">
				<author-info :bot="profile.bot" :role-color="profile.roleColor">
					{{ profile.author }}
				</author-info>
				<span class="discord-message-timestamp">
					{{ timestamp | formatDate | padZeroes }}
				</span>
			</div>
			<div :class="{ 'discord-highlight-mention': highlightMention }" class="discord-message-body">
				<template v-if="compactMode">
					<span class="discord-message-timestamp">
						{{ timestamp | formatDate | padZeroes }}
					</span>
					<author-info :bot="profile.bot" :role-color="profile.roleColor">
						{{ profile.author }}
					</author-info>
				</template>
				<slot></slot>
				<span v-if="edited" class="discord-message-edited">(edited)</span>
			</div>
			<slot name="embeds"></slot>
		</div>
	</div>
</template>

<script>
import AuthorInfo from './AuthorInfo.vue';
import filters from '../util/filters.js';
import validators from '../util/validators.js';

const now = new Date();

export default {
	name: 'DiscordMessage',

	components: { AuthorInfo },

	filters: filters.dates,

	props: {
		author: {
			type: String,
			'default': 'User',
		},
		avatar: String,
		bot: Boolean,
		edited: Boolean,
		roleColor: String,
		timestamp: {
			type: [Date, String],
			'default': () => now,
			validator: validators.dates.validator,
		},
		user: String,
	},

	data() {
		return {
			highlightMention: false,
		};
	},

	computed: {
		compactMode() {
			return this.$parent.layout['discord-compact-mode'];
		},

		profile() {
			const discord = this.$root.$discordMessage;
			const resolveAvatar = avatar => discord.avatars[avatar] || avatar || discord.avatars.default;
			const defaults = {
				author: this.author,
				bot: this.bot,
				roleColor: this.roleColor,
			};

			const profile = discord.profiles[this.user] || {};
			profile.avatar = resolveAvatar(profile.avatar || this.avatar);

			return Object.assign(defaults, profile);
		},
	},

	mounted() {
		this.highlightMention = this.$children.some(child => {
			return child.$options.name === 'Mention' && child.$props.highlight && child.$props.type !== 'channel';
		});
	},
};
</script>

<style>
.discord-message {
	display: flex;
	font-size: 0.9em;
	padding: 1em 0.5em;
	border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.discord-light-theme .discord-message {
	border-color: #eceeef;
}

.discord-message:last-of-type {
	border-bottom-width: 0;
}

.discord-message a {
	color: #0096cf;
	font-weight: normal;
	text-decoration: none;
}

.discord-message a:hover {
	text-decoration: underline;
}

.discord-light-theme .discord-message a {
	color: #00b0f4;
}

.discord-message a:hover {
	text-decoration: underline;
}

.discord-message .discord-author-avatar {
	margin-top: 1px;
	margin-right: 16px;
	min-width: 40px;
}

.discord-message .discord-author-avatar img {
	width: 40px;
	height: 40px;
	border-radius: 50%;
}

.discord-message .discord-message-timestamp {
	color: #fff3;
	font-size: 12px;
	margin-left: 3px;
}

.discord-message .discord-message-edited {
	color: #fff3;
	font-size: 10px;
}

.discord-message .discord-message-content {
	width: 100%;
	line-height: 160%;
	font-weight: normal;
}

.discord-message .discord-message-body {
	position: relative;
}

.discord-light-theme .discord-message .discord-message-timestamp,
.discord-compact-mode .discord-message:hover .discord-message-timestamp,
.discord-compact-mode.discord-light-theme .discord-message:hover .discord-message-timestamp {
	color: #99aab5;
}

.discord-compact-mode.discord-light-theme .discord-message .discord-message-timestamp {
	color: #d1d9de;
}

.discord-compact-mode .discord-message {
	padding-top: 0.5em;
	padding-bottom: 0.5em;
}

.discord-compact-mode .discord-author-avatar {
	display: none;
}

.discord-compact-mode .discord-message-body {
	margin-left: 0.25em;
}
</style>
