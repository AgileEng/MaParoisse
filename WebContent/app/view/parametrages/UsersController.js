Ext.define('MaParoisse.view.parametrages.UsersController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.parametrages-users',
    
    onRender: function(){
    	this.loadInitialData();
    },
    
    onSaveClicked: function(){
    	var me = this,
    		view = me.getView(),
	    	centerPanel = view.getComponent('centerPanel'),
			form = centerPanel.getComponent('principalForm');
    	
    	if(form.isValid()){
	    	var principal = me.updateCurrentPrincipal();
	    	
	    	var req = Ext.create('MaParoisse.lib.JsonRPC', {
				url: '/AccBureau',
				service_type: 'AccBureauService',
				listeners: {
					success: function () {
						//show success and load the server data 
						MaParoisse.plugin.notification.showSuccess(' ','succès');
						
						var resp = arguments[0].BODY;
						me.releaseResources();
						me.addSavedPrincipalToList(resp);
						
					},
					error: function () {}
				}
			});
			
			req.request({
				method: 'savePrincipal',
				params: {
					principal: principal.getDataObjectExt()
				}
			});
    	} else {
    		MaParoisse.plugin.notification.showError(' ','Erreur de validation');
    	}
    },
    
    addSavedPrincipalToList: function(principal){
    	var me = this,
			view = me.getView(),
			ds = view.getComponent('principalList').getStore(),
			sm = view.getComponent('principalList').getSelectionModel();
    	
    	isExisting = false;
    	ds.each(function(existingPrincipal){
    		if(existingPrincipal.get('id') === principal.id){
    			isExisting = true;
    			me.updateEditedUserInGrid(new MaParoisse.model.AuthPrincipal(principal));
    			sm.deselectAll();
    			sm.select(existingPrincipal);
    			return false;
    		}
    	});
		
    	if(!isExisting){
    		var newPrincipal = Ext.create('MaParoisse.model.AuthPrincipal', principal);
    		ds.add(newPrincipal);
    		sm.select(newPrincipal);
    	}
    	
    	me.updatePrincipalListTitle();
    },
    
    onCheckBtn: function(btn, e){
    	var ds = btn.up('grid').getStore();
    	
    	if(btn.itemId === 'checkAllBtn'){
    		ds.each(function(r){
    			r.set('checked', true);
			});
    	} else if(btn.itemId === 'uncheckAllBtn'){
    		ds.each(function(r){
    			r.set('checked', false);
			});
    	}
    },
    
    onAddUserClicked: function(){
    	var me = this,
    		view = me.getView();
    		
    	view.getComponent('principalList').getSelectionModel().deselectAll();
    	
 /*   	me.releaseResources(); 	*/
    	newPrincipal = Ext.create('MaParoisse.model.AuthPrincipal', {companies:[], roles: []});
    	view.currentPrincipal = newPrincipal;
    	me.updatePrincipalInView(false);
    },
    
    onSearchFieldKeyUp: function(field, e, eOpts){
		var me = this,
			view = me.getView(),
			grid = view.getComponent('principalList');
		
		grid.getStore().filterBy(function (record) {
			var searchValue = field.getValue().toUpperCase();
			if (searchValue.length == 0) {
				return true;
			} else if (
				record.get('name').toUpperCase().indexOf(searchValue) > -1 ||
				record.get('lastName').toUpperCase().indexOf(searchValue) > -1
			) {
				return true;
			} else {
				return false;
			}
		});
	},
	
	onCustomersSearchFieldKeyUp: function(field, e, eOpts){
		var me = this,
			view = me.getView(),
			centerPanel = view.getComponent('centerPanel'),
			tabPanel = centerPanel.getComponent('principalTabs'),
			customersGrid = tabPanel.getComponent('customersGrid');
		
		customersGrid.getStore().filterBy(function (record) {
			var searchValue = field.getValue().toUpperCase();
			if (searchValue.length == 0) {
				return true;
			} else if (
				record.get('name').toUpperCase().indexOf(searchValue) > -1 ||
				record.get('code').toUpperCase().indexOf(searchValue) > -1
			) {
				return true;
			} else {
				return false;
			}
		});
	},
	
	onUnlockUserClicked: function(){
		var me = this,
			view = me.getView(),
			sm = view.getComponent('principalList').getSelectionModel();
		
		if(sm.hasSelection()){
			var principal = sm.getSelection()[0].getDataObjectExt();
			if(principal.dbState != 1){
				var req = Ext.create('MaParoisse.lib.JsonRPC', {
					url: '/AccBureau',
					service_type: 'AccBureauService',
					listeners: {
						success: function () {
							//show success
							MaParoisse.plugin.notification.showSuccess(' ','succès');
							var record = sm.getSelection()[0];
							record.set('locked', false);
							me.updateEditedUserInGrid(record);
						},
						error: function () {}
					}
				});
				
				req.request({
					method: 'unlock',
					params: {
						userId: principal.id
					}
				});
			}
		}
	},
	
	onDeactivateUserClicked: function(){
		var me = this,
			view = me.getView(),
			sm = view.getComponent('principalList').getSelectionModel();
		
		if(sm.hasSelection()){
			var principal = sm.getSelection()[0].getDataObjectExt();
			if(principal.dbState != 1){
				var req = Ext.create('MaParoisse.lib.JsonRPC', {
					url: '/AccBureau',
					service_type: 'AccBureauService',
					listeners: {
						success: function () {
							//show success
							MaParoisse.plugin.notification.showSuccess(' ','succès');
						},
						error: function () {}
					}
				});
				
				req.request({
					method: 'deactivate',
					params: {
						userId: principal.id
					}
				});
			}
		}
	},
	
	onPasswordChangeClicked: function(){
		var me = this,
			view = me.getView(),
			sm = view.getComponent('principalList').getSelectionModel();
		
		if(sm.hasSelection()){
			var principal = sm.getSelection()[0].getDataObjectExt();
			if(principal.dbState != 1){
				
				Ext.create('Ext.window.Window', {
					title:'Veuillez saisir un nouveau mot de passé. ',
					modal: true,
					autoShow: true,
					width: 360,
					defaults: {
						margin: '15px 15px 15px 15px'
					},
					items: [{
						xtype: 'fieldset',
						title: 'Exigence de mot de passe',
						width: 320,
						border: false,
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
    					allowBlank : false
    				}],
    				buttons: ['->', {
    					text: 'Qui',
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
    									userId: principal.id,
    									psswrd: psswrd
    								}
    							});
    						} else {
    							MaParoisse.plugin.notification.showError(' ','Erreur de validation');
    						}
    					}
    				}, {
    					text: 'Annuler',
    					handler: function(btn){
    						btn.up('window').close();
    					}
    				}]
				});
			}
		}
	},
    
    onUserSelChange: function(sm, selected, eOpts){
    	var me = this;
    	
    	if(sm.hasSelection()){
    		me.releaseResources();
    		me.loadSelectedPrincipal(selected[0]);
    	}
    },
    
    updateCurrentPrincipal: function(){
    	var me = this,
			view = me.getView(),
			centerPanel = view.getComponent('centerPanel'),
			form = centerPanel.getComponent('principalForm'),
			tabPanel = centerPanel.getComponent('principalTabs'),
			customersGrid = tabPanel.getComponent('customersGrid'),
			rolesGrid = tabPanel.getComponent('rolesGrid');
    	
    	/*
    	 * in order to get all selected records
    	 * the store filters must be cleared
    	 * otherwise only filtered and checked
    	 * records will be sent to the server
    	 */
    	customersGrid.getStore().clearFilter();
    	/*
    	 * to visually correspond to filter
    	 * clearing the searchfield value
    	 * should also be cleared silently
    	 */
    	customersGrid.getDockedComponent('topBar').getComponent('customerSearchField').reset();
    	
    	var currentCustomers = [];
    	customersGrid.getStore().each(function(customer){
    		if(customer.get('checked') === true){
    			currentCustomers.push(customer.getDataObjectOpt(options={persist: true}));
    		}
    	});
    	
    	var currentRoles = [];
    	rolesGrid.getStore().each(function(role){
    		if(role.get('checked') === true){
    			currentRoles.push(role.getDataObjectOpt(options={persist: true}));
    		}
    	});
    	
    	form.updateRecord(view.currentPrincipal);
    	
    	view.currentPrincipal.set('companies', currentCustomers);
    	view.currentPrincipal.set('roles', currentRoles);
    	
    	return view.currentPrincipal;
    },
    
    updatePrincipalInView: function(disablePassword){
    	var me = this,
    		view = me.getView(),
    		centerPanel = view.getComponent('centerPanel'),
    		form = centerPanel.getComponent('principalForm'),
    		tabPanel = centerPanel.getComponent('principalTabs'),
    		customersGrid = tabPanel.getComponent('customersGrid'),
    		rolesGrid = tabPanel.getComponent('rolesGrid');
    	
    	if(disablePassword){
    		form.getComponent('generalFieldset').getComponent('password').setDisabled(true);
    		form.getComponent('generalFieldset').getComponent('confirmPassword').setDisabled(true);
    	} else {
    		form.getComponent('generalFieldset').getComponent('password').setDisabled(false);
    		form.getComponent('generalFieldset').getComponent('confirmPassword').setDisabled(false);
    	}
    	
    	centerPanel.setDisabled(false);
    	if(view.currentPrincipal.get('name').length > 0 && view.currentPrincipal.get('lastName').length > 0){
    		centerPanel.setTitle(view.currentPrincipal.get('name') + ' - ' + view.currentPrincipal.get('lastName'));
    	} else {
    		centerPanel.setTitle('');
    	}
    	form.loadRecord(view.currentPrincipal);
    	customersGrid.getStore().loadData(view.customers);
    	rolesGrid.getStore().loadData(view.roles);
    	
		customersGrid.getStore().each(function(customer){
			customer.set('checked', false);
    		for(var  i = 0; i < view.currentPrincipal.get('companies').length; i++){
    			if(customer.get('id') == view.currentPrincipal.get('companies')[i].id){
    				customer.set('checked', true);
    			}
    		}
    	});
    	
    	rolesGrid.getStore().each(function(role){
    		role.set('checked', false);
    		for(var  i = 0; i < view.currentPrincipal.get('roles').length; i++){
    			if(role.get('id') == view.currentPrincipal.get('roles')[i].id){
    				role.set('checked', true);
    			}
    		}
    	});

    },
    
    loadSelectedPrincipal:function(principal){
    	var me = this,
    		view = me.getView();
    	var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/AccBureau',
			service_type: 'AccBureauService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					var resp = arguments[0].BODY;
					view.currentPrincipal = Ext.create('MaParoisse.model.AuthPrincipal', resp.principal);
					
					me.updatePrincipalInView(true);
					
				},
				error: function () {}
			}
		});
		
		req.request({
			method: 'loadPrincipal',
			params: {
				principal: principal.getDataObjectExt()
			}
		});
    	view.currentPrincipal = principal;
    },
    
    loadInitialData: function(){
    	var me = this;
    	var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/AccBureau',
			service_type: 'AccBureauService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					var resp = arguments[0].BODY;
					me.doLoadInitialData(resp);
					
				},
				error: function () {}
			}
		});
		
		req.request({
			method: 'loadPrincipalsInitialData',
			params: {
				ownerId: AccBureau.Context.principal.data.compId
			}
		});
    },
    
    doLoadInitialData: function(resp){
    	var me = this,
    		view = me.getView(),
    		principalList = view.getComponent('principalList');
    	
    	principalList.getStore().loadData(resp.principals);
    	me.updatePrincipalListTitle();
    	view.customers = resp.customers;
    	view.roles = resp.roles;
    },
    
    updatePrincipalListTitle: function() {
    	var me = this,
			view = me.getView(),
			principalList = view.getComponent('principalList'),
			principalStore = principalList.getStore();
    	
    	var totalCount = principalStore.getCount();
    	var countWithoutTest = 0;
    	
    	principalStore.each(function(principal) {
    		if(principal.get('name').toUpperCase().indexOf('TEST') == -1){
    			countWithoutTest++;
    		}
    	});
    	
    	principalList.setTitle('Utilisateurs (' + countWithoutTest + '/' + totalCount + ')');
    },
    
    releaseResources: function(){
    	var me = this,
			view = me.getView(),
			centerPanel = view.getComponent('centerPanel'),
			form = centerPanel.getComponent('principalForm'),
			tabPanel = centerPanel.getComponent('principalTabs'),
			customersGrid = tabPanel.getComponent('customersGrid'),
			rolesGrid = tabPanel.getComponent('rolesGrid');
    	
    	view.currentPrincipal = null;
    	form.reset();
    	customersGrid.getStore().removeAll();
    	rolesGrid.getStore().removeAll();
    	centerPanel.setTitle('');
    	centerPanel.setDisabled(true);
    },
    
    updateEditedUserInGrid: function(rec){
    	var me = this,
			view = me.getView(),
			principalList = view.getComponent('principalList');
    	
    	var found = principalList.getStore().getAt(principalList.getStore().find('id', rec.get('id')));
    	var props = Object.getOwnPropertyNames(rec.data);
    	
    	if(Ext.isDefined(found)){
    		for(var i = 0; i < props.length; i++){
    			found.set(props[i], rec.get(props[i]));
    		}
    		found.commit();
    	}
    }
});
