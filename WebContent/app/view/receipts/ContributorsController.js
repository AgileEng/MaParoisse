Ext.define('MaParoisse.view.receipts.ContributorsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.receipts-contributors',
    
    requires: ['MaParoisse.model.Contributor'],
    
    deletedContributors: [],
    
    onRender: function(){
    	var me = this;
    	me.loadInitialData();/*
    	var view = me.getView();
    	var grid = view.getComponent('contributorsGrid');
    	grid.getStore().setDefaultSort("employeeLastName", SortDir.ASC);
*/
    },
    
    onSaveContributorsClicked: function(){
    	var me = this;
    	
    	var contributors = me.getContributorsData();
    	
    	if(me.isValidContributorsSet(contributors)){
    		var req = Ext.create('MaParoisse.lib.JsonRPC', {
    			url: '/FinancialTransactionServlet',
    			service_type: 'FinancialTransactionService',
    			listeners: {
    				success: function () {
    					//show success and load the server data 
    					MaParoisse.plugin.notification.showSuccess(' ','succès');
    					
    					var resp = arguments[0].BODY;
    					me.loadContributorsInView(resp.contributors);
    				},
    				error: function () {}
    			}
    		});
    		
    		req.request({
    			method: 'saveContributors',
    			params: {
    				ownerId: AccBureau.Context.principal.data.compId,
    				contributors: contributors
    			}
    		});
    	} else {
    		MaParoisse.plugin.notification.showError('Tous les champs sont obligatoires. ','Erreur de validation');
    	}
    },
    
    onAddContributorClicked: function(){
    	var me = this,
			view = me.getView(),
			grid = view.getComponent('contributorsGrid');
    	
    	var newRecord = Ext.create('MaParoisse.model.Contributor', {});
    	
    	grid.getStore().add(newRecord);
    	
    	grid.getPlugin('contributorediting').startEdit(newRecord, 2);
    },
    
    loadInitialData: function(withYear){
    	var me = this;
    	
    	var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/FinancialTransactionServlet',
			service_type: 'FinancialTransactionService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					var resp = arguments[0].BODY;
					me.loadContributorsInView(resp.contributors, resp.year);
				},
				error: function () {}
			}
		});
    	
    	var params= {ownerId : AccBureau.Context.principal.data.compId};
    	if (withYear) {
    		params.year = me.getYearField().getValue();
    	}
		
		req.request({
			method: 'loadContributors',
			params: params
		});
    },
    
    loadContributorsInView: function(contributors, year){
    	var me = this,
    		view = me.getView(),
    		grid = view.getComponent('contributorsGrid'),
    		yearField = me.getYearField();
    		
    	grid.getStore().loadRawData(contributors);
    	yearField.setValue(year);
    },
    
    getContributorsData: function(){
    	var me = this,
			view = me.getView(),
			grid = view.getComponent('contributorsGrid');
    	
    	var contrbtrs = [];
    	grid.getStore().each(function(rec){
    		var contributor = rec.getDataObjectOpt({persist: true, serialize: true});
    		
    		var dirty = false;
    		
    		//identify changes
    		if(rec.phantom){
    			rec.set('employee', {
    				firstName: '',
    				lastname: '',
    				address: {
    					address: '',
    					postCode: '',
    					town: '',
    					id: -1
    				}
    			});
    		}
    		
    		if(rec.get('employeeFirstName') !== rec.get('employee').firstName){
    			dirty = true;
    		}
    		
    		if(rec.get('employeeLastName') !== rec.get('employee').lastName){
    			dirty = true;
    		}
    		
    		if(rec.get('employeeAddress') !== rec.get('employee').address.address){
    			dirty = true;
    		}
    		
    		if(rec.get('employeePostCode') !== rec.get('employee').address.postCode){
    			dirty = true;
    		}
    		
    		if(rec.get('employeeTown') !== rec.get('employee').address.town){
    			dirty = true;
    		}
    		
    		if(rec.get('employeeSalutationID') !== rec.get('employee').salutationID){
    			dirty = true;
    		}
    		
    		if(rec.phantom && dirty){
    			contributor.dbState = 1;
    		} else if(!rec.phantom && dirty){
    			contributor.dbState = 2;
    		} else {
    			contributor.dbState = 0;
    		}
    		
    		contributor.employee = {
    			firstName: rec.get('employeeFirstName'),
    			lastName: rec.get('employeeLastName'),
    			address: {
    				address: rec.get('employeeAddress') ,
    				postCode: rec.get('employeePostCode'),
    				town: rec.get('employeeTown'),
    				id: rec.get('employee').address.id
    			},
    			id: rec.get('employee').id,
    			person: rec.get('employee').person
    		};
    		contributor.employee.salutationID = rec.get("employeeSalutationID");
    		contrbtrs.push(contributor);
    	});
    	
    	return contrbtrs;
    },
    
    onSearchFieldKeyUp: function(field, e, eOpts){
		var me = this,
			view = me.getView(),
			grid = view.getComponent('contributorsGrid');
		
		grid.getStore().filterBy(function (record) {
			var searchValue = field.getValue().toUpperCase();
			if (searchValue.length == 0) {
				return true;
			} else if (
				record.get('employeeLastName').toUpperCase().indexOf(searchValue) > -1 ||
				record.get('employeeFirstName').toUpperCase().indexOf(searchValue) > -1 ||
				record.get('employeeAddress').toUpperCase().indexOf(searchValue) > -1 ||
				record.get('employeePostCode').toUpperCase().indexOf(searchValue) > -1 ||
				record.get('employeeTown').toUpperCase().indexOf(searchValue) > -1 
			) {
				return true;
			} else {
				return false;
			}
		});
	},
	
	onTextFieldSpKey: function(field, e, eOpts){
		if(e.event.keyCode === 9 && !e.shiftKey){
				var me = this,
					view = me.getView(),
					grid = view.getComponent('contributorsGrid'),
					sm = grid.getSelectionModel(),
					store = grid.getStore(),
					editor = grid.getPlugin('contributorediting');
				
				if(sm.hasSelection() && store.getCount()-1===store.indexOf(sm.getLastSelected())){
					e.stopEvent();
					editor.suspendEvents();
					me.onAddContributorClicked();
					editor.resumeEvents();
				}
		}
	},
	
	onDeleteContributorClicked: function(){
		var me = this,
			view = me.getView(),
			grid = view.getComponent('contributorsGrid'),
			sm = grid.getSelectionModel(),
			rec = sm.getSelection()[0];
		
		if(sm.hasSelection() && rec.phantom){
			grid.getStore().remove(rec);
		} else {
			Ext.create('MaParoisse.lib.MessageBox', {
    			title: 'Suppression feuille de travail',
    			formHeight: 130,
    			message: 'êtes vous sur de vouloir supprimer ce donateur?<br><br><b style="font-weight:900;">\t' + rec.get('employeeLastName') + '</b><b style="font-weight:900;">\t' + rec.get('employeeFirstName') + '</b>',
    			type: MaParoisse.lib.MessageBox.QUESTION,
    			callback: {
    				fn: function(btnId){
    					if(btnId === MaParoisse.lib.MessageBox.YES){
    						me.doDeleteContributor(rec);
    					}
    				}
    			}
			});
		}
	},
	
	doDeleteContributor: function(record){
		var me = this,
			view = me.getView(),
			grid = view.getComponent('contributorsGrid');
		
		
		var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/FinancialTransactionServlet',
			service_type: 'FinancialTransactionService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					var resp = arguments[0].BODY;
					var ds = grid.getStore(),
						deletedRec = ds.getById(resp.contributor.id);
					ds.remove(deletedRec);
				},
				error: function () {}
			}
		});
		
		req.request({
			method: 'deleteContributor',
			params: {
				ownerId: AccBureau.Context.principal.data.compId,
				id: record.get('id')
			}
		});
	},
	
	onGenerateFiscalDocument: function(){
		var me = this,
			view = me.getView(),
			grid = view.getComponent('contributorsGrid');
			
			var checkedContributors = [];
			grid.getStore().each(function(record){
				if(record.get('checked')){
					checkedContributors.push({
						id: record.get('id')
					});
				}
			});
			
			if(checkedContributors.length > 0){
				Ext.create('MaParoisse.view.receipts.DocGenWindow', {
					yearField: true,
					yearValue: me.getYearField().getValue(),
					toDateField: true,
					title: 'Générer CERFA N° 11580*03',
					submitFunction: function(btn){
				    	var view = btn.up('window'),
							yearField = view.getComponent('yearField'),
							toDateField = view.getComponent('toDateField');
						
						if(yearField.isValid() && toDateField.isValid()) {
							var req = Ext.create('MaParoisse.lib.JsonRPC', {
								url: '/CefraForm',
								service_type: 'CefraService',
				    			timeout: 1800000, // 30 min * 60 sec * 1000 millis
								listeners: {
									success: function () {
										//show success and load the server data 
										MaParoisse.plugin.notification.showSuccess(' ','succès');
										
										var resp = arguments[0].BODY;
										window.open(resp.downloadUrl, 'Download');
										
										view.close();
									},
									error: function () {}
								}
							});
							
							req.request({
								method: '11580-03',
								params: {
									ownerId: AccBureau.Context.principal.data.compId,
									year: yearField.getValue(),
									toDate: Ext.Date.format(toDateField.getValue(), 'Y-m-d'),
									contributors: checkedContributors
								}
							});
						}
				    }
				});
			}
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
	
	releaseResources: function(){
		var me = this,
			view = me.getView(),
			grid = view.getComponent('contributorsGrid');
		
		grid.getStore().removeAll();
	},
	
	onTenantChange: function(){
		var me = this,
			view = me.getView();
		
		view.isSafeToClose(function(){
				me.releaseResources();
				me.loadInitialData();
		});
	},
	
	isValidContributorsSet: function(contributors){
		var valid = true;
		
		try{
			for(var i = 0; i < contributors.length; i++){
				var c = contributors[i];
				if(c.employee.firstName === '' ||
						c.employee.lastName === '' ||
						c.employee.address.address === '' ||
						c.employee.address.postCode === '' ||
						c.employee.address.town === ''){
					valid = false;
				}
			}
		} catch(e){
			valid = false;
		}
		
		return valid;
	},
	
	getYearField: function() {
		var me = this,
			view = me.getView(),
			contributorsGrid = view.getComponent('contributorsGrid'),
			topToolbar = contributorsGrid.getDockedComponent('topToolbar');
		
		return topToolbar.getComponent('yearField');
	},
	
	onYearChange: function() {
		this.loadInitialData(true);
	},
	
	onUploadClicked: function(){
    	var me = this,
    		view = me.getView(),
    		grid = view.getComponent('contributorsGrid'),
    		tbar = grid.getDockedComponent('topToolbar'),
    		menu = tbar.getComponent('uploadBtn').getMenu(),
    		fileForm = menu.getComponent('fileForm');
    	
    	if(fileForm.getForm().isValid()){
    		fileForm.submit({
                url: '../FileUploadServlet',
                method: 'POST',
                success: function(form, action) {
                	me.importContributors(action);
                	menu.hide();
                }
            });
    	}
    },
    
    importContributors: function(action) {
    	if (action.result.success) {
    		var req = Ext.create('MaParoisse.lib.JsonRPC', {
    			url: '/FinancialTransactionServlet',
    			service_type: 'FinancialTransactionService',
    			listeners: {
    				success: function () {
    					//show success
    					MaParoisse.plugin.notification.showSuccess(' ','succès');
    					window.history.back();
    				},
    				error: function () {}
    			}
    		});
    		
    		req.request({
    			method: 'importContributors',
    			params: {
    				ownerId: AccBureau.Context.principal.data.compId,
    				remoteName: action.result.fileAttachment.remoteName
    			}
    		});
    	}
    },
    
    onPrintContributorsClicked: function() {
    	console.log('print!');
		var yearField = this.getYearField();
    	window.open(
				'../CefraForm?number=donors_report&ownerId=' + AccBureau.Context.principal.data.compId
				+ '&year=' + yearField.getValue(),
				'_Print');
    }
});
