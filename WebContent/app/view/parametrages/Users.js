Ext.define("MaParoisse.view.parametrages.Users",{
    extend: "Ext.panel.Panel",
    requires:['MaParoisse.view.parametrages.UsersController', 'MaParoisse.model.AuthPrincipal', 'MaParoisse.model.util.DRChecked'],
    controller: "parametrages-users",
    region: 'center',
    
    currentPrincipal: null,
    
    initComponent: function(){
    	var me = this;
    	var config = {
    		title: 'Gestion des utilisateurs',
    		layout: 'border',
    		items: [{
    			xtype: 'grid',
    			itemId: 'principalList',
    			title: 'Utilisateurs',
    			region: 'west',
    			split: true,
    			width: 450,
    			tbar: [{
			    	icon: null,
					glyph: 'xe08c@iconFont',
					baseCls: 'ae-ext-button-small-icon',
			        scale: 'small',
			        iconAlign: 'top',
			        text: 'Nouveau',
			        handler: 'onAddUserClicked'
			    }, '->',{
			    	xtype: 'textfield',
			    	emptyText: 'Rechercher',
			    	enableKeyEvents: true,
			    	listeners: {
			    		keyup: 'onSearchFieldKeyUp'
			    	}
			    }],
    			forceFit: true,
    			collapsible: true,
    			listeners: {
    				selectionchange: 'onUserSelChange'
    			},
    			columns: [{
    				xtype: 'rownumberer',
    				flex: .95
				}, {
    				header: 'Nom de l’utilisateur',
    				flex: 3,
    				dataIndex: 'name'
    			}, {
    				header: 'Nom de famille',
    				flex: 3,
    				dataIndex: 'lastName'
    			}, {
    				header: 'Fermé',
    				dataIndex: 'locked',
    				align: 'center',
    				flex: 1.5,
    				renderer: function(value, metaData){
    					if(value){
    						return '<i class="icon-locked" style="font-size:16px;align:center;"></i>';
    					} else {
    						return '';
    					}
    				}
    			}],
    			store: Ext.create('Ext.data.Store', {
    				model: 'MaParoisse.model.AuthPrincipal',
    				autoDestroy: true
    			})
    		}, {
    			xtype: 'panel',
    			itemId: 'centerPanel',
    			region: 'center',
    			disabled: true,
    			items: [{
        			xtype: 'form',
        			itemId: 'principalForm',
        			region: 'center',
        			header: false,
        			tbar: [{
        				icon: null,
        				glyph: 'xe170@iconFont',
        				baseCls: 'ae-ext-button-small-icon',
        		        scale: 'small',
        		        iconAlign: 'top',
        		        text: 'Enregistrer',
        		        handler: 'onSaveClicked'
        		    },'->', {
    			    	icon: null,
    					glyph: 'xe047@iconFont',
    					baseCls: 'ae-ext-button-small-icon',
    			        scale: 'small',
    			        iconAlign: 'top',
    			        text: 'Ouvrir',
    			        handler: 'onUnlockUserClicked'
    			    }, {
    			    	icon: null,
    					glyph: 'xe089@iconFont',
    					baseCls: 'ae-ext-button-small-icon',
    			        scale: 'small',
    			        iconAlign: 'top',
    			        text: 'Désactiver',
    			        handler: 'onDeactivateUserClicked'
    			    }, {
    			    	icon: null,
    					glyph: 'xe044@iconFont',
    					baseCls: 'ae-ext-button-small-icon',
    			        scale: 'small',
    			        iconAlign: 'top',
    			        text: 'Changer le mot de passe',
    			        handler: 'onPasswordChangeClicked'
    			    }],
        			layout: {
        				type: 'hbox',
        				align: 'stretch'
        			},
        			items: [{
        				xtype: 'fieldset',
        				title: 'Général',
        				margin: '15px 15px 15px 15px',
        				itemId: 'generalFieldset',
        				flex: 1,
        				defaults: {
        					xtype : 'textfield', 
        					anchor	: '90%',
        					labelWidth: 160
        				},
        				items: [{
        					fieldLabel	: 'Nom de l’utilisateur',
        					itemId		: 'name',
        					name: 'name',
        					allowBlank : false
        				}, {
        					fieldLabel	: 'Mot de passe',
        					itemId		: 'password',
        					name: 'password',
        					inputType	: 'password',
        					vtype: 'passComplexity',
        					allowBlank : false
        				}, {
        					fieldLabel	: 'Confirmez le mot de passe',
        					itemId		: 'confirmPassword',
        					inputType	: 'password',
        					vtype: 'passConfirm',
        					confFldItemId: 'password',
        					allowBlank : false
        				}, {
        					fieldLabel	: 'Prénom',
        					itemId		: 'firstName',
        					name: 'firstName',
        					allowBlank : false
        				}, {
        					fieldLabel	: 'Nom',
        					itemId		: 'lastName',
        					name: 'lastName',
        					allowBlank : false
        				}, {
        					fieldLabel	: 'E-mail',
        					name: 'eMail',
        					itemId		: 'email'
        				}, {
        					fieldLabel	: 'Téléphone',
        					name: 'phone',
        					itemId		: 'phone'
        				},{
        					xtype: 'combo',
        					fieldLabel: 'Type',
        					allowBlank: false,
        					itemId: 'appType',
        					store: Ext.create(Ext.data.Store,{
        						fields : [
        						          'value', 
        						          'text'
        						],
        						data : [{
        							"value": "fabrique",
        							"text": "Fabrique"
        							},{
        							"value": "mense", 
        							"text": "Mense"
        						}]
        					}),
        					valueField : 'value',
        					displayField : 'text',
        					listeners: {
        						select: 'onAppTypeSelect'
        					}
        				}]
        			}, {
						xtype: 'fieldset',
						margin: '15px 15px 15px 15px',
						title: 'Exigence de mot de passe',
						flex: 1,
						//width: 320,
						html: '<div style="color: #666666; font-family: helvetica,arial,verdana,sans-serif;font-size: 13px;font-weight: 200;line-height: 17px;">'+
							'<p> Minimum six (6) symboles et minimum trois (3) des quatre (4) categories</p>'+
							'<ul>'+
							'<li>Lettres en majuscules.</li>'+
							'<li>Lettres en minuscules.</li>'+
							'<li>Chiffres (0 de 9).</li>'+
							'<li>Symboles quelconque  </li>'+
							'</ul></div>'
					}]
        		}, {
        			xtype: 'tabpanel',
        			region: 'south',
        			itemId: 'principalTabs',
        			height: 300,
        			items: [{
        				xtype: 'grid',
        				title: 'Rôles',
        				itemId: 'rolesGrid',
        				forceFit: true,
        				columns: [{
        					xtype: 'checkcolumn',
        					flex: .1,
        					dataIndex: 'checked'
        				}, {
        					dataIndex: 'name',
        					flex: .9,
        					header: 'Nom'
        				}],
        				store: Ext.create('Ext.data.Store', {
        					model: 'MaParoisse.model.util.DRChecked',
        					autoDestroy: true
        				})
        			}, {
        				xtype: 'grid',
        				title: 'Etablissement',
        				itemId: 'customersGrid',
        				tbar: {
        					itemId: 'topBar',
        					items: [{
        				    	icon: null,
        				    	itemId: 'checkAllBtn',
        						glyph: 'xe0a6@iconFont',
        						iconAlign: 'left',
        						text: 'Cochez toutes',
        						baseCls: 'ae-ext-button-small-icon',
        				        scale: 'small',
        				        handler: 'onCheckBtn'
        				    }, '-', {
        				    	icon: null,
        				    	itemId: 'uncheckAllBtn',
        						glyph: 'xe0a7@iconFont',
        						iconAlign: 'left',
        						text: 'Décocher tout',
        						baseCls: 'ae-ext-button-small-icon',
        				        scale: 'small',
        				        handler: 'onCheckBtn'
        				    }, '->', {
            			    	xtype: 'textfield',
            			    	emptyText: 'Rechercher',
            			    	itemId: 'customerSearchField',
            			    	enableKeyEvents: true,
            			    	listeners: {
            			    		keyup: 'onCustomersSearchFieldKeyUp'
            			    	}
            			    }]
        				},
        				forceFit: true,
        				columns: [{
        					xtype: 'checkcolumn',
        					flex: .1,
        					dataIndex: 'checked'
        				}, {
        					dataIndex: 'code',
        					flex: .1,
        					header: 'Code de la paroisse'
        				}, {
        					dataIndex: 'name',
        					flex: .8,
        					header: 'Nom'
        				}],
        				store: Ext.create('Ext.data.Store', {
        					model: 'MaParoisse.model.util.DRChecked',
        					autoDestroy: true
        				})
        			}]
        		}]
    		}],
    		listeners: {
    			scope: 'controller',
    			render: 'onRender'
    		}
    	};
    	
    	Ext.apply(me, config);
    	me.callParent(arguments);
    },
    
    isSafeToClose: function(){
    	return true;
    }
});
