'use strict';

export default {
	'TOAST' (state, message, type) {
		state.showToast = true;
		state.toastMessage = message;
		if (type) {
			state.toastType = type;
		} else {
			state.toastType = 'warning';
		}
	},
	'HIDE_TOAST' (state) {
		state.showToast = false;
		state.toastMessage = '';
	},
	'SET_ORG_INFO' (state, orgInfo) {
		state.orgInfo = orgInfo;
	},
	'SET_GLOBAL' (state, config) {
		state.globalConfig = config;
	},
	'CHANGE_TAB' (state, view) {
		state.currentView = view || 'single';
	},
	'SET_CURRENT_PATH_TEXT' (state, text) {
		state.currentPathText = text;
	}
}