/*
 * Notification Plugin
 */
(function () {
			var notification = (new(function (){
				
				var me = this;
				
				/**
				 * Shows notification. Acceptable properties are:
				 *  caption 	- string 	- Notify title
				 *	content 	- string 	- Notify message
				 *	shadow 		- boolean 	- Show or hide Notify shadow (default: true)
				 *	width 		- int 		- default 'auto', if value != auto min-width sets
				 *	height 		- int 		- default 'auto', if value != auto min-height sets
				 *	style 		- {
				 *					background: 'value', 
				 *					color: 'value'
				 *				} or false 	- default false, you can set background and font color
				 *
				 *	timeout 	- int 		- milliseconds to hide notify, default 3000, null to disable timeout
				 */
				me.show = function (config) {
					var props = $.extend({
						caption: '',
						content: '',
						timeout: 3000,
						shadow: true,
						style: {
							background: 'white',
							color: '#111111'
						}
					}, config);
					
					$.Notify(props);
				};
				
				me.showNotification = function (config, caption) {
					if (typeof(config) === "string") {
						config = {
								content: config
						};
						
						
					}
					
					if (typeof(caption) === "string") config.caption = caption;
					
					var props = $.extend({
						caption: '',
						content: '',
						timeout: 3000,
						shadow: true,
						style: {
							background: '#fff',
							color: '#222'//'#0050ef'
						}
					}, config);
					
					$.Notify(props);
				};
				
				me.showSuccess = function (config, caption) {
					if (typeof(config) === "string") {
						config = {
								content: config
						};
						
						
					}
					
					if (typeof(caption) === "string") config.caption = caption;
					
					var props = $.extend({
						caption: '',
						content: '',
						timeout: 3000,
						shadow: true,
						style: {
							background: '#fff',
							color: '#7ad61d'
						}
					}, config);
					
					$.Notify(props);
				};
				
				me.showError = function (config, caption) {
					if (typeof(config) === "string") {
						config = {
								content: config
						};
					}
					
					if (typeof(caption) === "string") config.caption = caption;
					
					var props = $.extend({
						caption: 'Erruer',
						content: '',
						timeout: 5000,
						shadow: true,
						style: {
							background: '#fff',
							color: '#e51400'
						}
					}, config);
					
					$.Notify(props);
				};
			})());
			
			if (typeof(MaParoisse) !== "object") {
				MaParoisse = {
						plugin: {}
				};
			} else if (typeof(MaParoisse.plugin) !== "object") {
				MaParoisse.plugin = {};
			}
			
			MaParoisse.plugin.notification = notification;
})();