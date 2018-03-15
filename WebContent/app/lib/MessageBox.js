Ext.define('MaParoisse.lib.MessageBox', {
	requires: ['Ext.window.MessageBox'],
	extend: 'Ext.window.Window',
	alias: 'widget.msgbox',
	formHeight: null,
	//pass header: false only when no header is needed
	header: true,
	/**
	 * Statics can be used either like this: 
	 * 	- this.self.STATIC_VAR (undocumented) or like this:
	 * 	- MaParoisse.lib.MessageBox.STATIC_VAR
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
		
		
		if (this.title == undefined) {
			this.title = this.typeSpecifics[type].title;
		}
		
		this.standardBtn = {
			text: 'OK',
			btnId: this.self.OK,
			scope: this,
			handler: this.onButtonClicked
		};
		this.typeSpecifics = [{
			title: 'Une erreur s’est produite',
			header: '<span style="display: inline-block; font-size: 16px;" ><i class="icon-cancel" style="color: #111111;"></i> '+this.title+'</span>',
			icon: Ext.Msg.ERROR,
			buttons: ['->', this.standardBtn]
		}, {
			title: 'Warning',
			header: '<span style="display: inline-block; font-size: 16px;" ><i class="icon-warning" style="color: #111111;"></i> '+this.title+'</span>',
			icon: Ext.Msg.WARNING,
			buttons: ['->', this.standardBtn]
		}, {
			title: 'Information',
			header: '<span style="display: inline-block; font-size: 16px;" ><i class="icon-info" style="color: #111111;"></i> '+this.title+'</span>',
			icon: Ext.Msg.INFO,
			buttons: ['->', this.standardBtn]
		}, {
			title: 'Question',
			header: '<span style="display: inline-block; font-size: 16px;" ><i class="icon-help-2" style="color: #111111;"></i> '+this.title+'</span>',
			icon: Ext.Msg.QUESTION,
			buttons: ['->', {
				text: Ext.Msg.buttonText.yes,
				btnId: this.self.YES,
				scope: this,
				handler: this.onButtonClicked
			}, {
				text: Ext.Msg.buttonText.no,
				btnId: this.self.NO,
				scope: this,
				handler: this.onButtonClicked
			}]
		}];
		
		
		//remove title so it won't be displayed on top of the header, since we ganarate it as a whole
		this.title = undefined;
		
		this.modal = true;
		this.resizable = false;
		this.closable = false;
		this.border = false;
		
		if(this.header){
			this.header = {
				html: this.typeSpecifics[type].header
			};
		}
		
		//this.bodyStyle = 'background-color: #CED9E7 !important;';
		this.defaults = {
			border: 0
			//bodyStyle: 'background-color: #CED9E7;' // 'padding: 16px 32px 16px 16px;'
		};
		this.width = 450,
		this.items = [{
			xtype: 'form',
			height: this.formHeight,
			autoScroll: true,
			defaultType: 'displayfield',
			defaults: {
				labelWidth: 60,
				fieldStyle: 'padding: 8px 0 0 0; margin: 0; font-weight: 300; color: #2f2f2f'
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
				value: this.message
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
		this.callback.fn.call(this.callback.scope, btn.btnId);
	}
});