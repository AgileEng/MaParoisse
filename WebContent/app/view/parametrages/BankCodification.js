Ext.define('MaParoisse.view.parametrages.BankCodification', {
	extend: 'Ext.panel.Panel',
	requires: ['MaParoisse.model.Account', 'MaParoisse.model.BankAccount', 'MaParoisse.model.BankAccountRecognitionRule'],
	
	controller: 'bankcodification',
		
	region: 'center',
	layout: 'border',
	
	libelleText	: "Libellé",
	nomDeLaBanqueText	: "Nom de la banque",
	nomDeCompteText	: "N° de compte",
	codeText	: "Code journal comptable",
	ribText	: "RIB",
	ibanText	: "IBAN",
	nomEtAdresseText	: "Nom et adresse de l’établissement",
	nomDuContactText	: "Nom du contact",
	telText	: "Tel",
	faxText	: "Fax",
	mailText	: "E-Mail",
	siteText	: "Site web",
	etebacText	: "Libelle ETEBAC du prelevement mosaic",
	entryTypeLabel : 'Mode de saisie',
	entryTypeManualText : 'Manuel',
	entryTypeETEBACText : 'ETEBAC',
	entryTypeLabel : 'Mode de saisie',
	
	accounts: [],
	accAccounts: [],
	currentBankAccount: null,
	
	initComponent: function(){
		var config = {
				//title: 'Codification Banque',
				header: false,
				listeners: {
					scope: 'controller',
					render: 'onRender',
					tenantChange: 'onTenantChange'
				},
				items: [{
					itemId: 'bankAccountGrid',
					xtype: 'gridpanel',
					region: 'west',
					width: '25%',
					title: 'Compte bancaires',
					listeners: {
						selectionchange: 'onBankAccGridSelChange'
					},
					tbar: [{
				    	icon: null,
						glyph: 'xe08c@iconFont',
						baseCls: 'ae-ext-button-small-icon',
				        scale: 'small',
				        iconAlign: 'top',
				        text: 'Ajouter compte',
				        handler: 'onAddAccountClicked'
				    }],
					forceFit: true,
					split: true,
					columns : [{
					    header : 'Libellé',
					    dataIndex: 'name',
					    width: 0.3
					}, {
					    header : 'IBAN',
					    dataIndex: 'iban',
					    width: 0.7
					}],
					store: Ext.create('Ext.data.Store', {
						autoDestroy: true,
						model: 'MaParoisse.model.BankAccount',
						storeId: 'bankAccStore'
					})
				}, {
					itemId:'bankCentralPanel',
					title: 'Banque',
					xtype:'panel',
					region: 'center',
					layout: 'border',
					disabled: true,
					tbar: [{
						icon: null,
						glyph: 'xe170@iconFont',
						baseCls: 'ae-ext-button-small-icon',
				        scale: 'small',
				        iconAlign: 'top',
				        text: 'Enregistrer compte',
				        handler: 'onSaveAccountClicked'
				    }],
					items: [{
						itemId: 'bankAccForm',
						xtype: 'form',
						trackResetOnLoad: true,
						header: false,
						region: 'center',
						anchor: '100% 100%',
						layout: 'form',
						autoScroll: true,
						frame: true,
						border: false,
						defaultType: 'textfield',
						defaults: {
							anchor: '80%'
						},
						labelWidth: 200,
						disabled: false,
						bodyStyle: 'padding: 10px',
						items: [{
							fieldLabel: this.libelleText,
							name: 'name',
							allowBlank: false,
							maxLength: 12,
							selectOnFocus: true
						}, {
							fieldLabel: this.nomDeLaBanqueText,
							name: 'bankName',
							//maxLength: 12,
							allowBlank: false,
							selectOnFocus: true
						}, {
							fieldLabel: this.nomDeCompteText,
							xtype: 'combo',
							name: 'accId',
							allowBlank: false,
							itemId: 'accCombo',
							selectOnFocus: true,
							store: new MaParoisse.store.AccountArr({
								autoDestroy: true,
			    				storeId: 'accountsStore'
			    			}),
							typeAhead: true,
						    triggerAction: 'all',
						    forceSelection: true,
						    queryMode: 'local',
							displayField: 'code',
							valueField: 'id',
							displayTpl: '<tpl for=".">'+
								'<tpl if="code != 0 ">' +
								'{code}' + ' - ' + '{name}' + 
								'</tpl>'+
								'</tpl>',
							tpl: '<tpl for="."><div class="x-boundlist-item">' + '{code}' + ' - ' + '{name}' + '</div></tpl>'
						}, {
							fieldLabel: this.codeText,
							allowBlank: false,
							name: 'journalCode',
							maxLength: 3
						}, {
							fieldLabel: this.ribText,
							name: 'rib',
							selectOnFocus: true
						}, {
							fieldLabel: this.ibanText,
							name: 'iban',
							allowBlank: false,
							selectOnFocus: true
						}, {
							xtype: 'textareafield',
							height: 25,
							fieldLabel: this.nomEtAdresseText,
							name: 'address'
						}, {
							fieldLabel: this.nomDuContactText,
							name: 'contactName',
							selectOnFocus: true
						}, {
							fieldLabel: this.telText,
							name: 'contactPhone',
							selectOnFocus: true
						}, {
							fieldLabel: this.faxText,
							name: 'fax',
							selectOnFocus: true,
							hidden: true
						}, {
							fieldLabel: this.mailText,
							name: 'contactEMail',
							selectOnFocus: true
						}, {
							fieldLabel: this.siteText,
							name: 'webSite',
							selectOnFocus: true
						}]
					}]
				}]
		};
		
		Ext.apply(this, config);
		this.callParent(arguments);
	},
	
	isSafeToClose: function(callback){
		var bankCentralPanel = this.getComponent('bankCentralPanel'),
			bankAccForm = bankCentralPanel.getComponent('bankAccForm'),
			bankAccStore = Ext.data.StoreManager.lookup('bankAccStore');
		
		var safeToClose = true;
		
		if(bankAccForm.isDirty()){
			safeToClose = false;
		}
		
		bankAccStore.each(function(bankAccount){
			var data = bankAccount.getDataObjectExt();
			if(data.dbState != 0 || bankAccount.dirty){
				safeToClose = false;
				return safeToClose;
			}
		});
		
		if(callback){
			callback();
		}	
		
		return safeToClose;
	}
});