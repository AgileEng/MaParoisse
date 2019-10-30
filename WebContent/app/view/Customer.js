Ext.define('MaParoisse.view.Customer', {
	extend: 'Ext.form.Panel',
	
	region: 'center',
	id: 'customerForm',
	closable: false,
	autoScroll: true,
	layout: 'vbox',
	title: "IDENTITE de l'ENTITE",
	frame: true,
	
	currentCustomer: null,
	
	initComponent: function(){
		var isClientCabinet = this.isClientCabinet();
		var me = this;
		var config = {
				tbar: {
					xtype: 'toolbar',
					itemId: 'topToolbar',
					items: [{
						icon: null,
						glyph: 'xe170@iconFont',
						baseCls: 'ae-ext-button-small-icon',
				        scale: 'small',
				        iconAlign: 'top',
				        text: 'Enregistrer',
				        itemId: 'saveButton',
	//			        style: {
	//			        	backgroundColor: '#FFFFFF',
	//			        	border: 'none'
	//			        },
				        handler: function(btn, e){
				        	var form = btn.up('form');
				        	if(form.isValid()){
				        		form.getForm().updateRecord(form.currentCustomer);
				        		//explicitly convert name and town strings to uppercase
				        		//before sending the record's data to the server
				        		//since this is the way to do it with least impact on other functionalities
				        		var dataForServer = form.currentCustomer.getDataObjectOpt(options={persist:true});
				        		dataForServer.name = dataForServer.name.toUpperCase();
				        		dataForServer.town = dataForServer.town.toUpperCase();
				        		//important: a fix to work for now, a correct solution is needed
				        		dataForServer.startDate = '';
				        		dataForServer.finYearStartDate = '';
								var req = Ext.create('MaParoisse.lib.JsonRPC', {
									url: '/PartyServlet',
									service_type: 'PartyService',
									listeners: {
										success: function () {
											//show success and load the server data in the form
											MaParoisse.plugin.notification.showSuccess(' ','succès');
											var customer = arguments[0].BODY.customer;
											form.loadCustomerToForm(form, customer);
											//add the saved customer to the AccBureau.Context
											form.updateCustomers(customer);
										},
										error: function () {}
									}
								});
								
								req.request({
									method: 'saveCustomer',
									params: {customer: dataForServer}
								});
				        	} else {
				        		MaParoisse.plugin.notification.showError('la validation du formulaire échoué', 'Erreur');
				        	}
				        }
					}, '->', {
				        icon: null,
						glyph: 'xe083@iconFont',
						baseCls: 'ae-ext-button-small-icon',
				        scale: 'small',
				        iconAlign: 'top',
				        text: 'Nouveau',
				        hidden: isClientCabinet,
				        style: {
				        	backgroundColor: '#FFFFFF',
				        	border: 'none'
				        },
				        handler: function(btn, e){
				        	var form = btn.up('form');
				        	form.isSafeToClose(function(){
				        		delete form.currentCustomer;
				        		form.currentCustomer = new MaParoisse.model.util.Customer();
				        		form.currentCustomer.set('active', false);
				        		form.getForm().loadRecord(form.currentCustomer);
				        		Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				        			mode: 20,
				        			callback: function(record){
				        				record.set('description', record.get('nature'));
				        				record.set('nature', '');
				        				record.set('paroisseStatut', record.get('statut'));
				        				record.set('statut', '');
				        				form.getForm().loadRecord(record);
				        			}
				        		}).show();
			        		});
				        }
					}, {
				        icon: null,
						glyph: 'xe046@iconFont',
						baseCls: 'ae-ext-button-small-icon',
				        scale: 'small',
				        iconAlign: 'top',
				        text: 'Activate',
				        itemId: 'activateButton',
				        hidden: true,
				        style: {
				        	backgroundColor: '#FFFFFF',
				        	border: 'none'
				        },
				        handler: function(btn, e){
				        	me.changeActivationStatus(btn);
				        }
					}, {
				        icon: null,
						glyph: 'xe047@iconFont',
						baseCls: 'ae-ext-button-small-icon',
				        scale: 'small',
				        iconAlign: 'top',
				        text: 'Deactivate',
				        itemId: 'deactivateButton',
				        hidden: true,
				        style: {
				        	backgroundColor: '#FFFFFF',
				        	border: 'none'
				        },
				        handler: function(btn, e){
				        	me.changeActivationStatus(btn);
				        }
					}]
				},
				
				items: [{
					xtype: 'fieldset',
					defaults: {
						width: 650
					},
					fieldDefaults: {
				        labelAlign: 'left',
				        labelWidth: 300
				    },
					style: {
						margin: '30px',
						padding: '20px'
					},
					items: [{
						xtype: 'textfield',
					    maskRe: /[0-9.]/,
						maxLength: 4,
						minLength: 4,
						fieldStyle:{
							fontWeight: '700',
							textTransform: 'uppercase'
						},
						fieldLabel: 'Code', //label changed from "Code de la paroisse" to "Code" Update 11.2019
						name: 'code',
						msgTarget: 'qtip',
						disabled: isClientCabinet,
						allowBlank: false
					}, {
						xtype: 'textfield',
						maxLength: 30,
						fieldStyle:{
							fontWeight: '700',
							textTransform: 'uppercase'
						},
						fieldLabel: 'Nom', //label changed from "Nom de la Paroisse (nom du saint, de la sainte)" to "Nom" Update 11.2019
						name: 'name',
						msgTarget: 'qtip',
						disabled: isClientCabinet,
						allowBlank: false,
						style: {						//Style moved from description field Update 11.2019
							paddingBottom: '20px',
							marginBottom: '10px',
							borderBottom: '1px solid #cccccc'
						}
					}, /*{
						xtype: 'textfield',
						maxLength: 32,
						fieldLabel: 'Nature entité',
						name: 'description',
						msgTarget: 'qtip',
						allowBlank: false,
						style: {
							paddingBottom: '20px',
							marginBottom: '10px',
							borderBottom: '1px solid #cccccc'
						}
					}*/, {
						xtype: 'label',
						text: 'Adresse - Commune'
					}, {
						xtype: 'textfield',
						allowBlank: false,
						fieldLabel: 'Adresse 1',
						name: 'address'
					}, {
						xtype: 'textfield',
						allowBlank: true,
						fieldLabel: 'Adresse 2',
						name: 'secondaryAddress'
					}, {
						xtype: 'textfield',
					    maskRe: /[0-9]/,
						maxLength: 5,
						minLength: 5,
						fieldStyle:{
							fontWeight: '700',
							textTransform: 'uppercase'
						},
						fieldLabel: 'CP',
						allowBlank: false,
						name: 'postCode',
						msgTarget: 'qtip'
					}, {
						xtype: 'textfield',
						maxLength: 25,
						fieldStyle:{
							fontWeight: '700',
							textTransform: 'uppercase'
						},
						fieldLabel: 'Commune',
						allowBlank: false,
						msgTarget: 'qtip',
						name: 'town',
						/*style: { //removed Update 11.2019
							paddingBottom: '20px',
							marginBottom: '20px',
							borderBottom: '1px solid #cccccc'
						}*/
					},/* {
						xtype: 'textfield',		//removed Update 11.2019
						maxLength: 20,
						fieldLabel: 'Statut',
						name: 'paroisseStatut',
						msgTarget: 'qtip',
						allowBlank: false
					}, {
						xtype: 'textfield',
						fieldLabel: 'S\'il s\'agit d\'une annexe : Nom de paroisse de rattachement',
						name: 'note'
					}, {
						xtype: 'textfield',
						fieldLabel: 'Nom Doyenné',
						name: 'paroisseDoyenne'
					}, {
						xtype: 'textfield',
						fieldLabel: 'Nom Communauté de Paroisses',
						name: 'paroisseContactPerson'
					}*/]
				}],
				listeners: {
					scope: this,
					afterrender: this.loadInitialData
				}
				// possible way to show form errors
				// still in research 
//				bbar: [
//			       Ext.create('Ext.ux.StatusBar', {
//	               dock: 'bottom',
//	               id: 'form-statusbar',
//	               defaultText: ' ',
//	               plugins: Ext.create('Ext.ux.statusbar.ValidationStatus', {form:'customerForm'})
//	            })]
		};
		Ext.apply(this, config);

		this.on('tenantChange', this.onTenantChanged, this);
		
		this.callParent(arguments);
		
	},
	
	loadInitialData: function(cmp){
		if(Ext.isDefined(AccBureau.Context.ownerId)){
			this.loadCurrentCustomerData(this);
		} else if (Ext.isDefined(cmp)){
			var form = cmp.getForm();
			//create empty model for the current customer
			this.currentCustomer = new MaParoisse.model.util.Customer();
			//load the current customer in the form
			//in this case should be an empty Customer model
			form.loadRecord(this.currentCustomer);
			//validate the form to highlight required fields
			form.isValid();
			this.updateButtons();
		}
	},
	
	onTenantChanged: function(customer){
		//console.log(customer);
//		delete this.currentCustomer;
//		this.currentCustomer = new MaParoisse.model.util.Customer(customer);
//		this.getForm().loadRecord(this.currentCustomer);
		this.getForm().reset();
		this.loadInitialData();
	},
	
	updateCustomers: function(customer){
		var customers = AccBureau.Context.principal.data.companies;
		var found = false;
		for(var i = 0; i < customers.length; i ++){
			if(customer.id == customers[i].id){
				customers[i] = customer;
				found = true;
				break;
			}
		}
		if(!found){
			AccBureau.Context.principal.data.companies.push(customer);
		}
	},
	
	loadCurrentCustomerData: function(cmp){
		var customerId = AccBureau.Context.ownerId;
		//get details about current customer
		var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/PartyServlet',
			service_type: 'PartyService',
			listeners: {
				success: function () {
					//show success
					//but how???
					//collect server data
					var customer = arguments[0].BODY.customer;
					//load the data into the form
					cmp.loadCustomerToForm(cmp, customer);
				},
				error: function () {}
			}
		});
		req.request({
			method: 'loadCustomer',
			params: {
				customerId: customerId,
				doNotLoadCAO: true,
				doNotLoadSocialInfo: true
			}
		});
	},
	
	loadCustomerToForm: function(cmp, customer){
		if(cmp.currentCustomer == null){
			cmp.currentCustomer = new MaParoisse.model.util.Customer(customer);
		} else {
			delete cmp.currentCustomer;
			cmp.currentCustomer = new MaParoisse.model.util.Customer(customer);
		}
		var form = cmp.getForm();
		form.loadRecord(cmp.currentCustomer);
		this.updateButtons();
		//validate form in order to show empty required fields or fields that are not valid
		form.isValid();
	},
	
	//TODO: implement this function according to module specifics
	isSafeToClose: function(callback){
		var safeToClose = false;
		//update currentCustomer with the form data to have them both synchronized
		this.getForm().updateRecord(this.currentCustomer);
		if(this.currentCustomer.getDataObjectExt().dbState == 0){
			safeToClose = true;
		}
		if(callback){
			callback();
		}
		return safeToClose;
	},
	
	updateButtons: function(){
		var toolbar = this.getDockedComponent('topToolbar');
		var activateBtn = toolbar.getComponent('activateButton');
		var deactivateBtn = toolbar.getComponent('deactivateButton');
		if (!this.isClientCabinet() && this.currentCustomer.get('dbState') != 1){
			if (this.currentCustomer.get('active') == true){
				deactivateBtn.show();
				activateBtn.hide();
			} else {
				activateBtn.show();
				deactivateBtn.hide();
			}
		}
	},
	
	isClientCabinet: function() {
		var isClientCabinet = false;
		
		if(Ext.isDefined(AccBureau.Context.principal)){
			var currentPrincipalRoles = AccBureau.Context.principal.data.roles;
			for(var i = 0; i < currentPrincipalRoles.length; i++){
				if(currentPrincipalRoles[i].sysId === 300){
					isClientCabinet = true;
					break;
				}
			}
		}
		return isClientCabinet;
	},
	
	changeActivationStatus: function(btn){
		var me = this,
			action;
		if (btn.getItemId() == 'deactivateButton') {
			action = 'deactivateCompany';
		} else if (btn.getItemId() == 'activateButton') {
			action = 'activateCompany';
		}
		
		var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/PartyServlet',
			service_type: 'PartyService',
			listeners: {
				success: function () {
					me.loadInitialData();
				},
				error: function () {}
			}
		});
		req.request({
			method: action,
			params: {}
		});		
	}
});