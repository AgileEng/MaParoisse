Ext.define('MaParoisse.view.library.FileExplorer',{
    extend: 'Ext.panel.Panel',
    requires: ['MaParoisse.view.library.FileExplorerController'],
    controller: 'library-fileexplorer',
    
    region: 'center',
    
    /*
     * these properties are added to make sure we don't break previous implementation that cannot be checked easily
     * default value is undefined and will be ignored - old implementation stays unchanged
     * true or false will be used to permit or disallow uploading and deleting documents for future reused components
     */
    allowUserUpload: undefined,
    allowUserDelete: undefined,
    
    appModuleCode: null,
    
    initComponent: function(){
    	var me = this;
    	
    	/*
    	 * Generate the top toolbar buttons
    	 * first add only the download button
    	 */
    	var topToolbarItems= [{
			icon: null,
			glyph: 'xe02c@iconFont',
			baseCls: 'ae-ext-button-small-icon',
	        scale: 'small',
	        iconAlign: 'top',
	        text: 'Télécharger',
	        handler: 'onDownloadClicked'
	    }];
    	
    	var currentPrincipalRoles = AccBureau.Context.principal.data.roles,
    		allowUpdate = true,
    		isAdmin;
    	
    	for(var i = 0; i < currentPrincipalRoles.length; i++) {
    		if(currentPrincipalRoles[i].sysId == 300){
    			allowUpdate = false;
    			isAdmin = false;
    		}
    	}
    	/*
    	 * conditionally add the upload
    	 * and delete buttons
    	 * 
    	 * For now only modules with code 170b3 and 195b3
    	 * doesn't allow uploading and deleting
    	 */
    	if(/*me.appModuleCode != '170b3' &&*/ me.appModuleCode != '195b3' && !(me.appModuleCode == '80a1' && !allowUpdate) && !(Ext.isDefined(me.allowUserDelete) && Ext.isDefined(me.allowUserUpload))) {
    		// Module 170b3 doesn't allow uploading, 175b3 doesn't allow deletion for non-admin users
    		if(me.appModuleCode != '170b3' && me.appModuleCode != '175b3') {
	    		topToolbarItems.push(' ', {
					icon: null,
					glyph: 'xe02d@iconFont',
					baseCls: 'ae-ext-button-small-icon',
			        scale: 'small',
			        iconAlign: 'top',
			        text: 'Importer',
			        itemId: 'uploadBtn',
			        menu: {
			        	floating: true,
			        	items: [{
			        		xtype: 'form',
			        		padding: '10 10 10 10',
			        		itemId: 'fileForm',
			        		frame: true,
			        		items: [{
						        xtype: 'filefield',
						        width: 400,
						        name: 'file',
						        allowBlank: false,
						        fieldLabel: 'Fichier',
						        labelWidth: 50,
						        msgTarget: 'side',
						        anchor: '100%'
						    }],
						    bbar: {
						    	style: {
						    		background: '#ffffff'
						    	},
						    	items: ['->', {
							    	text: 'Importer',
							    	icon: null,
							    	glyph: 'xe02d@iconFont',
									baseCls: 'ae-ext-button-small-icon',
									handler: 'onUploadClicked'
						    	}]
						    }
			        	}]
			        }
			    });
    		};
    		if(me.appModuleCode == '175b3' && !allowUpdate) {
    			// do nothing
    			// use this check to not mess with other modules reusing this class
    		} else {
    			topToolbarItems.push(' ', {
    		    	icon: null,
    				glyph: 'xe059@iconFont',
    				baseCls: 'ae-ext-button-small-icon',
    		        scale: 'small',
    		        iconAlign: 'top',
    		        text: 'Supprimer',
    		        handler: 'onDeleteFile'
    		    });
    		}
    	}
    	
    	// 21/05/2017 new implementation - code duplication here, let's be on the safe side
    	if ( Ext.isDefined(me.allowUserDelete) && Ext.isDefined(me.allowUserUpload)) {
    		if ( Ext.isDefined(isAdmin) && !isAdmin) {
    			if ( me.allowUserDelete ) {
        			topToolbarItems.push(' ', {
        		    	icon: null,
        				glyph: 'xe059@iconFont',
        				baseCls: 'ae-ext-button-small-icon',
        		        scale: 'small',
        		        iconAlign: 'top',
        		        text: 'Supprimer',
        		        handler: 'onDeleteFile'
        		    });
        		}
    			if ( me.allowUserUpload ) {
    				topToolbarItems.push(' ', {
    					icon: null,
    					glyph: 'xe02d@iconFont',
    					baseCls: 'ae-ext-button-small-icon',
    			        scale: 'small',
    			        iconAlign: 'top',
    			        text: 'Importer',
    			        itemId: 'uploadBtn',
    			        menu: {
    			        	floating: true,
    			        	items: [{
    			        		xtype: 'form',
    			        		padding: '10 10 10 10',
    			        		itemId: 'fileForm',
    			        		frame: true,
    			        		items: [{
    						        xtype: 'filefield',
    						        width: 400,
    						        name: 'file',
    						        allowBlank: false,
    						        fieldLabel: 'Fichier',
    						        labelWidth: 50,
    						        msgTarget: 'side',
    						        anchor: '100%'
    						    }],
    						    bbar: {
    						    	style: {
    						    		background: '#ffffff'
    						    	},
    						    	items: ['->', {
    							    	text: 'Importer',
    							    	icon: null,
    							    	glyph: 'xe02d@iconFont',
    									baseCls: 'ae-ext-button-small-icon',
    									handler: 'onUploadClicked'
    						    	}]
    						    }
    			        	}]
    			        }
    			    });
        		}
    		} else {
    			topToolbarItems.push(' ', {
    		    	icon: null,
    				glyph: 'xe059@iconFont',
    				baseCls: 'ae-ext-button-small-icon',
    		        scale: 'small',
    		        iconAlign: 'top',
    		        text: 'Supprimer',
    		        handler: 'onDeleteFile'
    		    });
    			topToolbarItems.push(' ', {
					icon: null,
					glyph: 'xe02d@iconFont',
					baseCls: 'ae-ext-button-small-icon',
			        scale: 'small',
			        iconAlign: 'top',
			        text: 'Importer',
			        itemId: 'uploadBtn',
			        menu: {
			        	floating: true,
			        	items: [{
			        		xtype: 'form',
			        		padding: '10 10 10 10',
			        		itemId: 'fileForm',
			        		frame: true,
			        		items: [{
						        xtype: 'filefield',
						        width: 400,
						        name: 'file',
						        allowBlank: false,
						        fieldLabel: 'Fichier',
						        labelWidth: 50,
						        msgTarget: 'side',
						        anchor: '100%'
						    }],
						    bbar: {
						    	style: {
						    		background: '#ffffff'
						    	},
						    	items: ['->', {
							    	text: 'Importer',
							    	icon: null,
							    	glyph: 'xe02d@iconFont',
									baseCls: 'ae-ext-button-small-icon',
									handler: 'onUploadClicked'
						    	}]
						    }
			        	}]
			        }
			    });
    		}
    		
    	}
    	
    	/*
    	 * Finally add the searchfield
    	 * which filters the records
    	 */
    	topToolbarItems.push('->', {
	    	xtype: 'textfield',
	    	emptyText: 'Rechercher',
	    	itemId: 'customerSearchField',
	    	enableKeyEvents: true,
	    	listeners: {
	    		keyup: 'onFileSearchFieldKeyUp'
	    	}
	    });
    	
    	var config = {
			title: me.title,
			layout: 'border',
			listeners: {
				scope: 'controller',
				render: 'onRender',
				tenantChange: 'onTenantChange'
			},
			tbar: {
				itemId: 'topToolbar',
				items: topToolbarItems
			},
			items: [{
				xtype: 'grid',
				header: false,
				itemId: 'filesGrid',
				region:'center',
				forceFit: true,
				reserveScrollbar: true,
				features: [{
					ftype:'grouping',
			        startCollapsed: false,
			        collapsible: false,
					groupHeaderTpl: Ext.create('Ext.XTemplate',"<tpl if='groupValue == true'>Partagé</tpl>", "<tpl if='groupValue == false'>Privé</tpl>")
				}],
				store: new Ext.data.Store({
					autoDestroy: true,
					model: 'MaParoisse.model.util.DomainRecord',
					groupField: 'system',
					sorters: [{
						property: 'system',
						direction: 'ASC'
					}]
				}),
				columns: [{
					header: 'Type',
					dataIndex: 'code',
					flex: 1,
					renderer: 'fileTypeRenderer',
					align: 'center'
				}, {
					header: 'Nom de fichier',
					dataIndex: 'name',
					flex: 5
				}, {
					header: 'Description',
					dataIndex: 'description',
					flex: 12
				}]
			}]
    	};
    	
    	Ext.apply(me, config);
    	me.callParent(arguments);
    },
    
    isSafeToClose: function(){
    	return true;
    }
});
