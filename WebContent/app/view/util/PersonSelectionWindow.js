Ext.define('MaParoisse.view.util.PersonSelectionWindow', {
	extend: 'Ext.window.Window',
	requires: ['MaParoisse.model.Contributor'],
	
	controller: 'personwincontroller',
	
	title: null,
	callback: null,
	allowCreate: null,
	
	defaultFocus: 'searchfield',
	
	initComponent: function(){
		var me = this;
		
		var createForm = {
			xtype: 'form',
			region: 'north',
			itemId: 'createContributorForm',
			height: 110,
			width: 700,
			layout: 'column',
			/*header: {
				xtype: 'header',
				title: {
					xtype: 'title',
					margin: '3 2 0 5',
					text: 'Ajouter donateur',
					style: {
						color: '#666666'
					}
				},
				height: 20,
				style: {
					backgroundColor: '#ffffff',
					padding: '0px !important'
				}
			},*/
			style: {
				borderTop: '1px solid #cccccc',
				borderBottom: '1px solid #cccccc'
			},
			items: [{
				itemId: 'col1',
				layout: 'form',
				defaults: {
					layout: 'hbox',
					margin: '3 0 5 0'
				},
				items: [{
					itemId: 'col1row1',
					items: [{
						xtype: 'textfield',
						name: 'employeeLastName',
						fieldLabel: 'Nom',
						enableKeyEvents: true,
						allowBlank: false,
						width: 190,
						margin: '0 18 0 0',
						labelWidth: 60,
						listeners: {
							keyup: 'onNameFieldKeyUp'
						}
					}, {
						xtype: 'textfield',
						name: 'employeeFirstName',
						fieldLabel: 'Prénom',
						enableKeyEvents: true,
						allowBlank: false,
						width: 190,
						margin: '0 18 0 0',
						labelWidth: 60,
						listeners: {
							keyup: 'onNameFieldKeyUp'
						}
					}, {
						xtype: 'combo',
						queryMode: 'local',
						allowBlank: true,
						displayField: 'name',
						fieldLabel: 'Salutation',
						width: 190,
						margin: '0 18 0 0',
						labelWidth: 60,
						name: 'employeeSalutationID',
						valueField: 'employeeSalutationID',
						store: new Ext.data.Store({
							fields: ['name', 'employeeSalutationID'],
							data: [{
								'name': ' ',
								'employeeSalutationID': 0
							}, {
								'name': 'Monsieur',
								'employeeSalutationID': 10
							}, {
								'name': 'Madame',
								'employeeSalutationID': 20
							}]
						})
					}]
				}, {
					itemId: 'col1row2',
					items: [{
						xtype: 'textfield',
						name: 'employeeAddress',
						fieldLabel: 'Adresse',
						allowBlank: false,
						width: 190,
						margin: '0 18 0 0',
						labelWidth: 60
					}, {
						xtype: 'textfield',
						name: 'employeePostCode',
						fieldLabel: 'CP',
						allowBlank: false,
						minLength: 5,
						maxLength: 5,
						maskRe: /[0-9]/,
						width: 190,
						margin: '0 18 0 0',
						labelWidth: 60
					}, {
						xtype: 'textfield',
						name: 'employeeTown',
						fieldLabel: 'Commune',
						allowBlank: false,
						width: 190,
						margin: '0 18 0 0',
						labelWidth: 60
					}]
				}]
			}],
			dockedItems: [{
			    xtype: 'toolbar',
			    dock: 'bottom',
			    items: ['->', {
					text: 'Enregistrer',
					handler: 'saveContributor',
					icon: false,
					glyph: 'xe170@iconFont'
				}, {
					text: 'Annuler',
					handler: 'clearContributorForm',
					icon: false,
					glyph: 'xe087@iconFont'
				}]
			}]
		};
		
		var config = {
			title: this.title,
			autoDestroy: true,
			autoShow: true,
			modal: true,
			layout: 'border',
			width: 700,
			height: me.allowCreate ? 491 : 391,
			listeners: {
				scope: 'controller',
				render: 'onRender'
			},
			tbar: ['->',{
				xtype: 'textfield',
				enableKeyEvents: true,
				emptyText: 'Rechercher',
				itemId: 'searchfield',
				listeners: {
					//scope: 'controller',
					keyup: 'onSearchFieldKeyUp'
				}
			}],
			items:[{
				xtype: 'grid',
				forceFit: true,
				region: 'center',
				hideHeaders: true,
				rowLines: false,
				allowDeselect: true,
				store: Ext.create('Ext.data.Store', {
					autoDestroy: true,
					model: 'MaParoisse.model.Contributor'
				}),
				listeners: {
					rowdblclick: 'onRowDblClick'
				},
				viewConfig: {
					stripeRows: false
				},
				columns: [{
					dataIndex: 'employeeSalutationID',
					flex: 1.5,
					renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
						var renderedText = '';
						switch (value) {
						case 0:
							renderedText = '';
							break;
						case 10:
							renderedText = 'Monsieur';
							break;
						case 20:
							renderedText = 'Madame';
							break;
						}
						return '<p style="font-size: 10px; color: #4390DF; margin: 1px 2px 2px 2px;">Salutation</p><p style="margin: 0px 2px 1px 2px;">' + renderedText + '</p>';
					}
				}, {
					dataIndex: 'employeeLastName',
					flex: .75,
					renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
						return '<p style="font-size: 10px; color: #4390DF; margin: 1px 2px 2px 2px;">Nom</p><p style="margin: 0px 2px 1px 2px;">' + value + '</p>';
					}
				}, {
					dataIndex: 'employeeFirstName',
					flex: 1.5,
					renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
						return '<p style="font-size: 10px; color: #4390DF; margin: 1px 2px 2px 2px;">Prénom</p><p style="margin: 0px 2px 1px 2px;">' + value + '</p>';
					}
				}, {
					dataIndex: 'employeeAddress',
					flex: 1.5,
					renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
						return '<p style="font-size: 10px; color: #4390DF; margin: 1px 2px 2px 2px;">Adresse</p><p style="margin: 0px 2px 1px 2px;">' + value + '</p>';
					}
				}, {
					dataIndex: 'employeePostCode',
					flex: 0.5,
					renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
						return '<p style="font-size: 10px; color: #4390DF; margin: 1px 2px 2px 2px;">CP</p><p style="margin: 0px 2px 1px 2px;">' + value + '</p>';
					}
				}, {
					dataIndex: 'employeeTown',
					flex: 1.5,
					renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
						return '<p style="font-size: 10px; color: #4390DF; margin: 1px 2px 2px 2px;">Commune</p><p style="margin: 0px 2px 1px 2px;">' + value + '</p>';
					}
				}],
				bbar: ['->', {
					text: 'Ok',
					handler: 'onOkBtnClick'
				}]
			}]
		};
		
		if(me.allowCreate){
			config.items.splice(0, 0, createForm);	
		}
		
		Ext.apply(this, config);
		this.callParent(arguments);
	}
	
});