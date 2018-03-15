/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('MaParoisse.view.main.Main', {
	requires: ['Ext.util.Base64'],
    extend: 'Ext.container.Container',
    itemId: 'mainContainer',
    id: 'ae-viewport',
    xtype: 'app-main',
    
    controller: 'main',
    viewModel: {
        type: 'main'
    },

    layout: {
        type: 'border'
    },
    
    listeners: {
    	afterrender: function(){
    		var threeLineMenu = document.getElementById('threeLineMenu');
    		
    		threeLineMenu.addEventListener("click", function(event){
        		Ext.create('Ext.menu.Menu', {
        		    width: 210,
        		    alwaysOnTop: true,
        		    floating: true,
        		    autoShow: false,
        		    items: [{
        		        text: 'Changer la Paroisse actuelle',
        				handler: function(){
        					Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
        						mode:10,
        						callback:function(customer){
        							Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(function(safe){
        								if(safe){
        									MaParoisse.app.getController('Root').setTenant(customer);
        								}
        							})
        						}
        					}).show();
        				}
        		    }, '-', {
        		        text: 'Changer le mot de passe',
        		        icon: null,
    					glyph: 'xe044@iconFont',
        				handler: function(){
        					Ext.create('Ext.window.Window', {
        						title:'Veuillez saisir un nouveau mot de passé. ',
        						modal: true,
        						closable: true,
        						autoShow: true,
        						width: 380,
        						defaultFocus: 'passwordNew',
        						defaults: {
        							margin: '15px 15px 15px 15px'
        						},
        						items: [{
        							xtype: 'fieldset',
        							width: 320,
        							border: false,
        							collapsed: true,
        							collapsible: true,
        							title: 'Exigence de mot de passe',
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
        								confPassField = window.getComponent('passwordNewConfirm'),
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
        		    }]
        		}).showAt(event.clientX, event.clientY);
        	});
    	}
    },
    
    initComponent: function(){
    	var me = this;
    	var config = {
    			items:[{
    		    	xtype: 'panel',
    		    	header: false,
    		    	itemId: 'mainInnerPanel',
    		    	id: 'mainInnerPanel',
    		    	region: 'center',
    		    	layout: 'border',
    		    	lbar:{
    		    		itemId: 'leftBar',
    		    		hidden: true,
    		    		width: 63,
    		    		style: {
    		                paddingTop: '40px',
    		                backgroundColor: '#F0F0F0'
    		            },
    		    		items: [{
    		                xtype: 'button',
    		                width: 50,
    		                height: 50,
    		                tooltip: 'Retour',
    		                glyph: 'xe09f@iconFont',
    		                scale: 'large',
    		                iconCls: 'ae-ext-button-large-icon',
    		                cls: 'ae-ext-button-large',
    		                handler: 'onBackButtonClick'
    		            }]
    		    	},
    		        listeners: {
    		        	render: 'onRender'
    		        },
    		    	items: [{
    		            xtype: 'panel',
    		            bind: {
    		                title: '{name}'
    		            },
    		            region: 'north',
    		            html: '<div class="metro"><div class="grid fluid"><div class="row"><div class="span6" style="padding-left: 10px;"><img src="/resources/images/logo_w200.png" alt="Zachée" style="width: 50px; float: left; margin-right: 10px" /><h5 class="item-title-secondary">Zachée <span style="font-size: 13px;">&nbsp; Ma Paroisse : Gestion - Comptabilité</span></h5><h2 id="paroisseTitle" class="subheader fg-lightBlue">&nbsp;</h2></div><div class="span1"></div><div style="padding-left: 20px; text-align: right" class="span3"><div style="display: inline-block;"><h3 class="subheader-secondary" id="principalName">sa</h3><h5 class="item-title-secondary" id="principalPosition">Administrateur Cabinet</h5></div></div><div class="span1" style="border-right: 2px solid #555555; padding-top: 15px; margin-left: 0; text-align: right;"><i id="threeLineMenu" class="icon-lines" title="Menu"  style="margin-bottom: 20px; cursor: pointer; font-size: 50px; margin-right: 20%"></i></div><div class="span1"><i class="icon-cancel-2 fg-gray bg-white" style=" margin-top: 23px; cursor: pointer; font-size: 29px;" onclick="Ext.getCmp(\'ae-viewport\').getController().onLogout()" title="Déconnexion"></i></div></div></div></div>',
    		            header: false,
    		            height: 100
    		        }, {
    		        	xtype: 'panel',
    		        	layout: 'border',
    		        	id: 'moduleHolder',
    		        	region:'center',
    		        	items:[{
    		                region: 'center',
    		                itemId: 'centerPanel',
    		                id: 'aeTilesPanel',
    		                xtype: 'panel',
    		                autoDestroy: false,
    		                autoScroll: true,
    		                loader: {
    		                	scope: this,
    		                	url: 'partials/menu.jsp',
    		                	autoLoad: false,
    		                	listeners: {
    		                		scope: this,
    		                		load: function(loader, response, options, eOpts){
    		                			//register click event listeners for dom elements of class tile-content
    		                	    	var tiles = Ext.getBody().query("div[class~=tile]");
    		                	    	for(var i in tiles){
    		                	    		tiles[i].addEventListener('click', function(e){
    		                	    			if (Ext.isDefined(this.getAttribute('data-ae-xtype')) && this.getAttribute('data-ae-xtype') != null && this.getAttribute('data-ae-xtype') != ''){
    		                	    				if(this.getAttribute('data-ae-xtype') === 'docgenwindow') {
    		                	    					var dataAeModule = this.getAttribute('data-ae-module');
    		                	    					if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
    		                	    						Ext.create('MaParoisse.lib.MessageBox', {
    		                	    			    			//header: false,
    		                	    			    			title: 'Zachée',
    		                	    			    			formHeight: 120,
    		                	    			    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
    		                	    			    			type: MaParoisse.lib.MessageBox.OK,
    		                	    			    			callback: {
    		                	    			    				fn: function(){
    		                	    			    					Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
    		                	    					    				mode:10, 
    		                	    					    				callback: function(customer){
    		                	    					    					MaParoisse.app.getController('Root').setTenant(customer);
    		                	    					    					me.createDocGenWindow(dataAeModule);
    		                	    					    				}}).show();
    		                	    				    			}
    		                	    			    			}
    		                	    						});
    		                	    					}  else {
    		                	    						me.createDocGenWindow(dataAeModule);
    		                	    					}
    		            	    					}
    		                	    			} else if(Ext.isDefined(this.getAttribute('data-ae-submenu')) && this.getAttribute('data-ae-submenu') != null && this.getAttribute('data-ae-submenu') != '') {
    		                    	    			MaParoisse.app.getController('ApplicationRouter').redirectTo('component/'+Ext.util.Base64.encode(this.getAttribute('data-ae-submenu')));
    		                	    			} else if(Ext.isDefined(this.getAttribute('data-ae-module')) && this.getAttribute('data-ae-module') != null && this.getAttribute('data-ae-submenu') != '') {
    		                    	    			MaParoisse.app.getController('ApplicationRouter').redirectTo('module/'+this.getAttribute('data-ae-module'));
    		                	    			} else if(Ext.isDefined(this.getAttribute('data-ae-link')) && this.getAttribute('data-ae-link') != null && this.getAttribute('data-ae-link') != ''){
    		                	    				window.open(this.getAttribute('data-ae-link'));
    		                	    			}
    		                	    			e.stopPropagation();
    		                	    		});
    		                	    	}
    		                		}
    		                	}
    		                }
    		            }]
    		        }]
    		    }]
    	};
    	
    	Ext.apply(me, config);
    	me.callParent(arguments);
    },
    
    createDocGenWindow: function(dataAeModule){
    	switch(dataAeModule){
			/*case '220b3': {
				Ext.create('MaParoisse.view.receipts.DocGenWindow', {
					appModuleCode: dataAeModule,
					title: 'Bordereau des Sommes reversees a l’Archeveche au Titre',
					yearField: true,
					toDateField: false,
					submitFunction: function(btn){
						var view = btn.up('window'),
							yearField = view.getComponent('yearField');
							
						if(yearField.isValid()){
							window.open(
									'../CefraForm?number=bordereau_paroisses&ownerId=' + AccBureau.Context.principal.data.compId
									+ '&year=' + yearField.getValue(),
									'_Print');
					    	
					    	view.close();
						}
					}
				});
				break;
			};*/
			case '10b3': {
				Ext.create('MaParoisse.view.receipts.DocGenWindow', {
					appModuleCode: dataAeModule,
					title: 'Compte de résultat',
					period: true,
					submitFunction: function(btn){
						var view = btn.up('window'),
							toDateField = view.getComponent('periodeContainer').getComponent('toDateField'),
							fromDateField = view.getComponent('periodeContainer').getComponent('fromDateField');
							
						if(toDateField.isValid() && fromDateField.isValid()){
							window.open(
									'../CefraForm?number=compte_de_resultat&ownerId=' + AccBureau.Context.principal.data.compId
									+ '&fromDate=' + Ext.Date.format(fromDateField.getValue(), 'Y-m-d')
									+ '&toDate=' + Ext.Date.format(toDateField.getValue(), 'Y-m-d'),
									'_Print');
					    	
					    	view.close();
						}
					}
				});
				break;
			};
			case '20b3': {
				Ext.create('MaParoisse.view.receipts.DocGenWindow', {
					appModuleCode: dataAeModule,
					title: 'Bilan',
					period: true,
					submitFunction: function(btn){
						var view = btn.up('window'),
							toDateField = view.getComponent('periodeContainer').getComponent('toDateField'),
							fromDateField = view.getComponent('periodeContainer').getComponent('fromDateField');
							
						if(toDateField.isValid() && fromDateField.isValid()){
							window.open(
									'../CefraForm?number=bilan&ownerId=' + AccBureau.Context.principal.data.compId
									+ '&fromDate=' + Ext.Date.format(fromDateField.getValue(), 'Y-m-d')
									+ '&toDate=' + Ext.Date.format(toDateField.getValue(), 'Y-m-d'),
									'_Print');
					    	
					    	view.close();
						}
					}
				});
				break;
			};
			case '30b3': {
				Ext.create('MaParoisse.view.receipts.DocGenWindow', {
					appModuleCode: dataAeModule,
					title: 'Balance',
					period: true,
					accountSpan: true,
					submitFunction: function(btn){
						var view = btn.up('window'),
							periodContainer = view.getComponent('periodeContainer'),
							accContainer = view.getComponent('accountSpanContainer'),
							toDateField = periodContainer.getComponent('toDateField'),
							fromDateField = periodContainer.getComponent('fromDateField'),
							fromAccCode = accContainer.getComponent('fromAccCode'),
							toAccCode = accContainer.getComponent('toAccCode');
							
							
						if(toDateField.isValid() && fromDateField.isValid() && 
								fromAccCode.isValid() && toAccCode.isValid()){
							window.open(
									'../CefraForm?number=balance&ownerId=' + AccBureau.Context.principal.data.compId
									+ '&fromDate=' + Ext.Date.format(fromDateField.getValue(), 'Y-m-d')
									+ '&toDate=' + Ext.Date.format(toDateField.getValue(), 'Y-m-d')
									+ '&fromAccCode=' + fromAccCode.getValue()
									+ '&toAccCode=' + toAccCode.getValue(),
									'_Print');
					    	
					    	view.close();
						}
					}
				});
				break;
			};
			case '40b3': {
				Ext.create('MaParoisse.view.receipts.DocGenWindow', {
					appModuleCode: dataAeModule,
					title: 'Compte grand livre',
					period: true,
					accountSpan: true,
					submitFunction: function(btn){
						var view = btn.up('window'),
							periodContainer = view.getComponent('periodeContainer'),
							accContainer = view.getComponent('accountSpanContainer'),
							toDateField = periodContainer.getComponent('toDateField'),
							fromDateField = periodContainer.getComponent('fromDateField'),
							fromAccCode = accContainer.getComponent('fromAccCode'),
							toAccCode = accContainer.getComponent('toAccCode');
							
						if(toDateField.isValid() && fromDateField.isValid() && 
								fromAccCode.isValid() && toAccCode.isValid()){
							window.open(
									'../CefraForm?number=grand_livre&ownerId=' + AccBureau.Context.principal.data.compId
									+ '&fromDate=' + Ext.Date.format(fromDateField.getValue(), 'Y-m-d')
									+ '&toDate=' + Ext.Date.format(toDateField.getValue(), 'Y-m-d')
									+ '&fromAccCode=' + fromAccCode.getValue()
									+ '&toAccCode=' + toAccCode.getValue(),
									'_Print');
					    	
					    	view.close();
						}
					}
				});
				break;
			};
			case '50b3': {
				Ext.create('MaParoisse.view.receipts.DocGenWindow', {
					appModuleCode: dataAeModule,
					title: 'Journaux',
					period: true,
					journal: true,
					submitFunction: function(btn){
						var view = btn.up('window'),
							periodContainer = view.getComponent('periodeContainer'),
							toDateField = periodContainer.getComponent('toDateField'),
							fromDateField = periodContainer.getComponent('fromDateField'),
							journalField = view.getComponent('journalField');
							
						if(toDateField.isValid() && fromDateField.isValid() && journalField.isValid()){
							window.open(
									'../CefraForm?number=journaux&ownerId=' + AccBureau.Context.principal.data.compId
									+ '&fromDate=' + Ext.Date.format(fromDateField.getValue(), 'Y-m-d')
									+ '&toDate=' + Ext.Date.format(toDateField.getValue(), 'Y-m-d')
									+ '&journal=' + journalField.getValue(),
									'_Print');
					    	
					    	view.close();
						}
					}
				});
				break;
			};
		}
    }
});


