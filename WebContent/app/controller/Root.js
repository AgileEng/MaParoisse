/**
 * The main application controller. This is a good place to handle things like routes.
 */
Ext.define('MaParoisse.controller.Root', {
	requires: ['Ext.util.Cookies', 'Ext.dom.Element', 'MaParoisse.model.util.AuthPrincipal'],
    extend: 'Ext.app.Controller',
    init: function(){
    	this.on('tenantChange', this.onTenantChanged, this);
    },
    
    onTenantChanged: function(company){
    	Ext.getCmp('moduleHolder').items.items[0].fireEvent('tenantChange', company);
    },
    
    onInitialDataLoaded: function(jsonData){
    	AccBureau.Context = {};
    	AccBureau.Context.metoken = jsonData.metoken;
    	AccBureau.Context.principal = Ext.create('MaParoisse.model.util.AuthPrincipal', jsonData.principal);
    	this.updateHeader(false);
    	//this.setOwner(id);
    	/*
    	 * Here it is a good place to detect if this is the first login for this user
    	 * and force the user to change the default password
    	 */
    	if(Ext.isDefined(jsonData.principal.mustChangePassword) && jsonData.principal.mustChangePassword === true){
    		Ext.create('Ext.window.Window', {
				title:'Veuillez saisir un nouveau mot de passé. ',
				modal: true,
				autoShow: true,
				width: 380,
				closable: false,
				defaultFocus: 'passwordNew',
				defaults: {
					margin: '15px 15px 15px 15px'
				},
				items: [{
					xtype: 'fieldset',
					width: 320,
					border: false,
					title: 'Exigence de mot de passe',
					collapsed: true,
					collapsible: true,
					html: '<div style="color: #666666; font-family: helvetica,arial,verdana,sans-serif;font-size: 13px;font-weight: 200;line-height: 14px;">'+
						'<p> Minimum six (6) symboles et minimum trois (3) des quatre (4) categories</p>'+
						'<ul>'+
						'<li>Lettres en majuscules.</li>'+
						'<li>Lettres en minuscules.</li>'+
						'<li>Chiffres (0 de 9).</li>'+
						'<li>Symboles quelconque  </li>'+
						'</ul></div>'
				}, {
    				xtype: 'textfield',
    				labelWidth: 170,
    				width: 320,
					fieldLabel	: 'Nouveau mot de passe ',
					itemId		: 'passwordNew',
					vtype: 'passComplexity',
					inputType	: 'password',
					allowBlank : false
				}, {
    				xtype: 'textfield',
    				labelWidth: 170,
    				width: 320,
					fieldLabel	: 'Confirmez le mot de passe ',
					itemId		: 'passwordNewConfirm',
					vtype: 'passConfirm',
					confFldItemId: 'passwordNew',
					inputType	: 'password',
					allowBlank : false,
					listeners: {
						specialkey: function(field, e){
							if (e.getKey() == e.ENTER) {
		                        var window = field.up('window'),
		                        button = window.getDockedItems('toolbar[dock="bottom"]')[0].getComponent('okBtn');
		                        
		                        button.handler(button);
		                    }
						}
					}
				}],
				buttons: ['->', {
					text: 'Qui',
					itemId: 'okBtn',
					handler: function(btn){
						var window = btn.up('window'),
						passwordField = window.getComponent('passwordNew'),
						confPassField = window.getComponent('passwordNewConfirm');
						psswrd = passwordField.getValue();
						
						if(passwordField.isValid() && confPassField.isValid()){
							var req = Ext.create('MaParoisse.lib.JsonRPC', {
								url: '/AccBureau',
								service_type: 'AccBureauService',
								listeners: {
									success: function () {
										//show success
										MaParoisse.plugin.notification.showSuccess(' ','succès');
										window.close();
									},
									error: function () {}
								}
							});
							
							req.request({
								method: 'resetPassword',
								params: {
									userId: AccBureau.Context.principal.get('id'),
									psswrd: psswrd
								}
							});
						} else {
							MaParoisse.plugin.notification.showError(' ','Erreur de validation');
						}
					}
				}]
			});
    	}
    	
    	MaParoisse.app.getController('ApplicationRouter').redirectTo('home');
    },
    
    updateHeader: function(company){
    	if(company){
    		Ext.getElementById('paroisseTitle').textContent = (AccBureau.Context.principal.data.appType === 'mense' ? '' : 'Paroisse de ') + company.get('name');
    	} else if (AccBureau.Context.principal.data.companies.length == 1){
    		Ext.getElementById('paroisseTitle').textContent = (AccBureau.Context.principal.data.appType === 'mense' ? '' : 'Paroisse de ') + AccBureau.Context.principal.data.companies[0].name;
    		var company = new MaParoisse.model.util.Customer(AccBureau.Context.principal.data.companies[0]);
    		this.setTenant(company);
    	}
		Ext.getElementById('principalName').textContent = AccBureau.Context.principal.data.fullName != '' ? AccBureau.Context.principal.data.fullName : AccBureau.Context.principal.data.name;
		Ext.getElementById('principalPosition').textContent = AccBureau.Context.principal.getMaxRoleName();
	},
	
	destroyAll: function(){
		Ext.getCmp('ae-viewport').removeAll(true);
	},
	
	setTenant: function(company){
		AccBureau.Context.principal.data.compId = company.get('id');
		AccBureau.Context.ownerId = company.get('id');
		this.updateHeader(company);
		this.fireEvent('tenantChange', company.getDataObject());
	}
});
