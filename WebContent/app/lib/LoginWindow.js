Ext.define('MaParoisse.lib.LoginWindow', {
	require: ['MaParoisse.lib.MessageBox'],
    extend: 'Ext.window.Window',
    alias : 'widget.loginwindow',
    
    loginWelcomeText: 'Welcome to MaParoisse',
    loginInstructionText: 'Please, enter username and password to log in!',
    
	header: false,
    border: 0,
	//bodyStyle: {background: '#1BA1E2'},
    
    onKeyEvent: function(field, e){
        if (e.getKey() == e.ENTER) {
        	this.loginSubmit();
        }
    },
	
	loginSubmit: function (btn, event) {
		var request = {
				url       : 'AccBureau',
				method    : 'POST',
				scope     : this,
		
				/**
				 * Functions that fire (success or failure) when the server
				 * responds. The one that executes is determined by the
				 * response that comes from url as seen below. The server
				 * would actually respond with valid JSON, something like:
				 * response.write "{ success: true}" or response.write
				 * "{success: false, errors: {reason: 'Login failed. Try
				 * again.' }}" depending on the logic contained within your
				 * server script. If a success occurs, the user is
				 * redirected to main application page.
				 */ 
				success : function(form, action) {
					var jsonText =  action.response.responseText;
					var json = JSON.parse(jsonText);
					
					//on successful login there must be a new token and the same username
					if (json.metoken !== AccBureau.Context.metoken && json.loggedName === AccBureau.Context.principal.get('name')) {
						AccBureau.Context.metoken = json.metoken;
						if (this.retry) {
							this.retry.call(this.rpc_scope);
						}
						
						this.close();
					} else {
						Ext.create('MaParoisse.lib.MessageBox', {
							   title:'Invalid login attempt',
							   message: 'Please, login as the same user!',
							   animEl: 'elId',
							   type: MaParoisse.lib.MessageBox.ERROR,
							   minWidth : 350
							});
						form.reset();
					}
					
					
				},
		
				/**
				  * Login Failure handler
				  */
				failure : function(form, action) {
					if (action.failureType == 'server') {
						obj = Ext.util.JSON.decode(action.response.responseText);
						Ext.create('MaParoisse.lib.MessageBox', {
						   title:'Échec de la connexion',
						   message: obj.errors.reason,
						   animEl: 'elId',
						   type: MaParoisse.lib.MessageBox.ERROR,
						   minWidth : 350
						});
					} else {
						Ext.create('MaParoisse.lib.MessageBox', {
						   title:'Échec de la connexion',
						   message: 'Serveur d\'authentification est inaccessible.',
						   animEl: 'elId',
						   type: MaParoisse.lib.MessageBox.ERROR,
						   minWidth : 350
						});
					}
					form.reset();
				}
			};
			
		this.down('form').submit(request);
	},
	
    initComponent: function() {
    	var config = {
		    layout: 'vbox',
		    autoShow: true,
			modal: true,
			resizable: false,
			closable: false,
			items: [/*{
				xtype: 'label',
				width: 450,
				text: this.loginWelcomeText,
				padding: '25 25 0 25',
				style: {background: '#1BA1E2', fontFamily: 'Tahoma, Geneva, sans-serif', fontSize: '12px', fontWeight: '700', color: '#fff', letterSpacing: '0.1em'}
			}, */{
				xtype: 'label',
				width: 450,
				defaultFocus: 'usernameEl',
				text: 'authentication',
				padding: '15 25 15 25',
				style: {background: 'transparent', fontFamily: 'Tahoma, Geneva, sans-serif', fontSize: '15px', fontWeight: '700', color: '#222', letterSpacing: '0.1em'}
			}, {
				xtype: 'panel',
				header: false,
				layout: 'column',
				height: 155,
				scope: this,
				width: 450,
				bodyStyle: {background: 'transparent', border: '0px'},
				border: 0,
				items: [{
					xtype: 'form',
					columnWidth: 1,
					scope: this,
					bodyStyle: {
//						border: '1 1 1 1',
//						borderColor: '#1BA1E2',
//						borderRadius: '5 5 5 5',
						background: 'transparent'
					},
					padding: 20,
					items: [{
						xtype: 'textfield',
						itemId: 'namefield',
						fieldLabel: 'Utilisateur',
						labelWidth: 135,
						labelAlign: 'right',
						name: 'loginUsername',
						height: 30,
						itemId: 'usernameEl',
						scope: this,
						labelStyle: 'font-family: Tahoma, Geneva, sans-serif; font-size: 12px; font-weight: 700; color: #fff; letter-spacing: 0.1em;',
						fieldStyle: 'font-size: 14px; color: #343434; letter-spacing: 0.1em; border-radius: 7 7 7 7; width: 200px;',
						listeners: {
							specialkey: this.onKeyEvent,
			                scope: this
			            }
					}, {
						xtype: 'textfield',
						itemId: 'passfield',
						fieldLabel: 'Mot de passe',
						labelWidth: 135,
						inputType: 'password',
						labelAlign: 'right',
						name: 'loginPassword',
						height: 30,
						scope: this,
						labelStyle: 'font-family: Tahoma, Geneva, sans-serif; font-size: 12px; font-weight: 700; color: #fff; letter-spacing: 0.1em;',
						fieldStyle: 'font-size: 14px; color: #343434; letter-spacing: 0.1em; border-radius: 7 7 7 7; width: 200px;',
						listeners: {
			                specialkey: this.onKeyEvent,
			                scope: this
			            }
					}],
					dockedItems: [{
					    xtype: 'toolbar',
					    dock: 'bottom',
					    scope: this,
					    width: 350,
					    style: {
					    	backgroundColor: 'transparent',
					    	width: '350px',
					    	paddingRight: '60px'
					    },
					    items: ['->', {
							xtype: 'button',
							text: 'Login',
							itemId: 'loginButton',
							scope: this,
							style: {
								backgroundColor: 'white'
							},
							handler: this.loginSubmit
						}]
					}]
				}]
			}]
    	};
		
    	Ext.apply(this, config);
        this.callParent(arguments);
    },
    
    /**
	 * Form onRender override
	 */
	onRender : function() {
		// Before parent code
		
		// REQUIRED: Call parent
		this.callParent(arguments);
	
		// After parent code
        var firstFieldItem = this.down('form').items.first();
        
        if(firstFieldItem){
            //delay the focus for 500ms to make sure the field is visible
            firstFieldItem.focus(true,500);
        }
        
        // load store here!

	} // eo function onRender
});