Ext.define('MaParoisse.view.util.PersonWinController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.personwincontroller',
	
	onRender: function(){
		var me = this,
			view = me.getView(),
			grid = view.down('grid');
		/*
		 * load the needed implementations of a person
		 * from the server and load them in the grid
		 */
		var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/FinancialTransactionServlet',
			service_type: 'FinancialTransactionService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					var resp = arguments[0].BODY;
					grid.getStore().loadRawData(resp.contributors);
				},
				error: function () {}
			}
		});
		
		req.request({
			method: 'loadContributors',
			params: {
				ownerId: AccBureau.Context.principal.data.compId
			}
		});
	},
	
	/*
	 * on KeyUp event of the field
	 * filter the grid's store
	 * to show only the records with fields
	 * one or more of which contain 
	 * the search value entered in the field
	 */
	onSearchFieldKeyUp: function(field, e, eOpts){
		field.up('window').down('grid').getStore().filterBy(function (record) {
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
	
	onNameFieldKeyUp: function(field, e, eOpts){
		field.up('window').down('grid').getStore().filterBy(function (record) {
			var searchValue = field.getValue().toUpperCase();
			if (searchValue.length == 0) {
				return true;
			} else if (
				record.get('employeeLastName').toUpperCase().indexOf(searchValue) > -1 ||
				record.get('employeeFirstName').toUpperCase().indexOf(searchValue) > -1
			) {
				return true;
			} else {
				return false;
			}
		});
	},
	
	/*
	 * Get the selected record and
	 * pass it to the function which
	 * executes the callback function
	 * with this record
	 */
	onOkBtnClick: function(btn){
		var me = this,
			view = me.getView(),
			grid = view.down('grid');
		
		var selectedRecord = grid.getSelectionModel().getSelection()[0];
		
		me.onPersonChosen(selectedRecord);
	},
	
	/*
	 * Row Double Click event handler
	 * provides functionality equivalent 
	 * to selecting a record and clicking
	 * the 'OK' button 
	 */
	onRowDblClick: function(table, record, tr, rowIndex, e, eOpts){
		if(Ext.isDefined(record)){
			this.onPersonChosen(record);
		}
	},
	
	/*
	 * paranoic check if the
	 * passed record and a callback
	 * function are defined
	 * 
	 * then proceed with executing
	 * the callback
	 */
	onPersonChosen: function(record){
		var wincontr = this,
			view = wincontr.getView(),
			callback = view.callback;
		
		if(Ext.isDefined(record) && Ext.isDefined(callback)){
			callback(record);
			view.close();
		}
	},
	
	/*
	 * Check validity of entered contributor/s
	 */
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
	
	saveContributor: function(){
		var me = this,
			view = me.getView();
		
		if(view.allowCreate){
			var form = view.getComponent('createContributorForm');
			if (form.isValid()){
				var contributors = [];
				var newContributorRecord = new MaParoisse.model.Contributor();
				form.updateRecord(newContributorRecord);
				var newContributor = newContributorRecord.getDataObjectOpt({persist: true, serialize: true});
				
				//put only the required data in the object
				newContributor.employee = {
		    			firstName: newContributorRecord.get('employeeFirstName'),
		    			lastName: newContributorRecord.get('employeeLastName'),
		    			address: {
		    				address: newContributorRecord.get('employeeAddress') ,
		    				postCode: newContributorRecord.get('employeePostCode'),
		    				town: newContributorRecord.get('employeeTown')
		    			}
	    		};
				contributors.push(newContributor);
				
				var req = Ext.create('MaParoisse.lib.JsonRPC', {
	    			url: '/FinancialTransactionServlet',
	    			service_type: 'FinancialTransactionService',
	    			listeners: {
	    				success: function () {
	    					//show success and load the server data 
	    					MaParoisse.plugin.notification.showSuccess(' ','succès');
	    					
	    					var resp = arguments[0].BODY;
	    					me.loadContributorInView(resp.contributors);
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
		}
	},
	
	loadContributorInView: function(contributors){
		var me = this,
			view = me.getView(),
			grid = view.down('grid'),
			sm = grid.getSelectionModel(),
			ds = grid.getStore();
		
		me.clearContributorForm();
		sm.deselectAll();
		
		/*
		 * Load the new contributor as raw data to utilize the data reader
		 * It is important for the data mapping in the record.
		 * The true parameter indicates to append the new record to the existing ones
		 * instead of replasing the whole set of the store
		 */
		if(ds.loadRawData(contributors[0], true)){
			var newRec = ds.find('id', contributors[0].id);
			sm.select(newRec);
		}
	},
	
	clearContributorForm: function(){
		var me = this,
			view = me.getView(),
			form = view.getComponent('createContributorForm');
		form.reset();
		
		view.down('grid').getStore().clearFilter();
	}
});