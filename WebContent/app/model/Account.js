Ext.define('MaParoisse.model.Account', {
	extend: 'MaParoisse.model.util.DomainRecord',
	
	fields: [{name : 'coaId', type : 'int', defaultValue : 0},
	    	 {name : 'accId', type : 'int', defaultValue : 0}, //Master Account ID when this record is GOA Account
	    	 {name : 'parent'}, // AccBureau.Account
	    	 {name : 'attributes'},
	    	 {name : 'vatCode', type : 'string'},
	    	 {name : 'isCash', type : 'bool'},
	    	 {name : 'isBank', type : 'bool'},
	    	 {name : 'isSupply', type : 'bool'},
	    	 {name : 'isSale', type : 'bool'},
	    	 {name : 'vat'},
	    	 {name: 'accType'}],
	    	 
	 validate: function(options){
			var errors = this.callParent(arguments),
				name = this.get('name'),
				code = this.get('code'),
				parent = this.get('parent'),
				description = this.get('description');
			
			/**
			 * validate code against its pattern only if accounts parent is configured
			 * decide to leave it like that or always do the check
			 */
			var codeRegex = null;
			if(Ext.isDefined(parent) && Ext.isDefined(parent.code)){
				codeRegex = new RegExp(parent.code.replace(/[xX]/g, '\\d') + '$');
			}
			if(!Ext.isDefined(code) || code == null || code == ''){
				errors.add({
	                field: 'code',
	                message: 'Field is required!'
	            });
			} else if((!this.isView()) && codeRegex != null && !codeRegex.test(code)){
				errors.add({
					field: 'code',
					message: 'Pattern doesn\'t match'
				});
			}
			
			if(!Ext.isDefined(name) || name == null || name == ''){
				errors.add({
	                field: 'name',
	                message: 'Field is required!'
	            });
			}
			
			if(!Ext.isDefined(description) || description == null || description == ''){
				errors.add({
	                field: 'description',
	                message: 'Field is required!'
	            });
			};
			
			return errors;
		}
});