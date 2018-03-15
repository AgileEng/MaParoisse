/**

 *	Window class for displaying errors, warnings, infos or questions. Intended to work in a manner similar to Ext.Msg.show() function.
 * 		@example from JsonRPC
 *		Ext.create('MedCom.lib.ErrorWindow', {
 *			type: MedCom.lib.ErrorWindow.ERROR,
 *			error: err,
 *			callback: {
 *				fn: this.showLoginWindow,
 *				scope: this
 *			}
 *		});
 */

Ext.define('MaParoisse.lib.ErrorWindow', {
	requires: ['Ext.window.MessageBox'],
	extend: 'Ext.window.Window',
	alias: 'widget.errorwindow',
	
	/**
	 * Statics can be used either like this: 
	 * 	- this.self.STATIC_VAR (undocumented) or like this:
	 * 	- MedCom.lib.ErrorWindow.STATIC_VAR
	 */
	statics: {
		/**
		 * Window config
		 * @type Number
		 */
		ERROR: 0,
		WARNING: 1,
		INFO: 2,
		QUESTION: 3,
		
		/**
		 * Button config
		 * @type Number
		 */
		OK: 2,
		YES: 1,
		NO: 0
	},
	
	standardBtn: {},
	
	typeSpecifics: [],
	
	/**
	 * Type of the window [this.ERROR]
	 * @type 
	 */
	type: this.ERROR,
	
	/**
	 * The callback function to be executed with its corresponding context/scope of execution.
	 * @type Object
	 */
	callback: {
		fn: function(){},
		scope: this
	},
	
	error: {
		code: -1,
		message: '',
		data: ''
	},
	
	//title: 'Error',
	autoShow: true,
	layout: {
        type: 'hbox',
        align: 'stretch'
    },
	initComponent: function() {
		//private variables, cannot be overriden (at least I couldn't)
		
		//this.self == MedCom.lib.ErrorWindow (a class, not an instance)
		var type = this.self.ERROR;
		if ('0123'.indexOf(''+this.type) != -1) {
			type = this.type;
		}
		this.standardBtn = {
			text: 'OK',
			btnId: this.self.OK,
			scope: this,
			handler: this.onButtonClicked
		};
		this.typeSpecifics = [{
			title: 'Une erreur s’est produite',
			icon: Ext.Msg.ERROR,
			buttons: ['->', this.standardBtn]
		}, {
			title: 'Warning',
			icon: Ext.Msg.WARNING,
			buttons: [this.standardBtn]
		}, {
			title: 'Information',
			icon: Ext.Msg.INFO,
			buttons: [this.standardBtn]
		}, {
			title: 'Question',
			icon: Ext.Msg.QUESTION,
			buttons: [{
				text: 'YES',
				btnId: this.self.YES,
				scope: this,
				handler: this.onButtonClicked
			}, {
				text: 'NO',
				btnId: this.self.NO,
				scope: this,
				handler: this.onButtonClicked
			}]
		}];
		
		if (this.title == undefined) {
			//this.title = this.typeSpecifics[type].title;
		}
		
		this.modal = true;
		this.resizable = false;
		this.closable = false;
		this.border = false;
		this.header = {
			html: '<span style="display: inline-block; font-size: 16px;" ><i class="icon-cancel" style="color: #111111;"></i> Une erreur s’est produite</span>'	
		};
		
		//this.bodyStyle = 'background-color: #CED9E7 !important;';
		this.defaults = {
			border: 0
			//bodyStyle: 'background-color: #CED9E7;' // 'padding: 16px 32px 16px 16px;'
		};
		this.width = 450,
		this.height = 160;
		this.items = [{
			xtype: 'form',
			autoScroll: true,
			defaultType: 'displayfield',
			defaults: {
				labelWidth: 60,
				fieldStyle: 'padding: 8px 0 0 0; margin: 0; font-weight: 900; color: #2f2f2f'
			},
			bodyStyle: 'padding: 10px; border-top: none; border-left: none; border-right: none;',
			width: '100%',
			border: '0 0 0 0',
			items: [/*{
				fieldLabel: this.title,
				labelSeparator: '',
				value: '',
				labelStyle: 'font-size: 18px; color: #cc0000; font-weight: 900;'
			}, */{
				fieldLabel: '',
				value: this.error.message
			}],
			dockedItems: [{
			    xtype: 'toolbar',
			    dock: 'bottom',
			    style: {
			    	backgroundColor: 'transparent'
			    },
			    items: this.typeSpecifics[type].buttons
			}]
		}];
		this.callParent(arguments);
	},
	
	onButtonClicked: function(btn, e) {
		this.close();
		this.callback.fn.call(this.callback.scope, btn.buttonId);
	}
});