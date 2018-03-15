Ext.define('MaParoisse.model.AccEntryAttachment', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'entryId',
		type: 'string'
	}, {
		name: 'name',
		type: 'string'
	}, {
		name: 'remoteName',
		type: 'string'
	}, {
		name: 'deleteOld',
		type: 'boolean'
	}, {
		name: 'attId',
		type: 'int'
	}],
	
	getDataObjectOpt : function(options) {
		var me = this,
	        ret = {},
	        opts = (options === true) ? me._getAssociatedOptions : (options || ret), //cheat
	        data = me.data,
	        associated = opts.associated,
	        changes = opts.changes,
	        critical = changes && opts.critical,
	        content = changes ? me.modified : data,
	        fieldsMap = me.fieldsMap,
	        persist = opts.persist,
	        serialize = opts.serialize,
	        criticalFields, field, n, name, value;
	
	    // DON'T use "opts" from here on...
	
	    // Keep in mind the two legacy use cases:
	    //  - getData() ==> Ext.apply({}, me.data)
	    //  - getData(true) ==> Ext.apply(Ext.apply({}, me.data), me.getAssociatedData())
	
	    if (content) { // when processing only changes, me.modified could be null
	        for (name in content) {
	            value = data[name];
	
	            field = fieldsMap[name];
	            if (field) {
	                if (persist && !field.persist) {
	                    continue;
	                }
	                if (serialize && field.serialize) {
	                    value = field.serialize(value, me);
	                }
	            }
	
	            ret[name] = value;
	        }
	    }
	
	    if (critical) {
	        criticalFields = me.self.criticalFields || me.getCriticalFields();
	        for (n = criticalFields.length; n-- > 0; ) {
	            name = (field = criticalFields[n]).name;
	
	            if (!(name in ret)) {
	                value = data[name];
	                if (serialize && field.serialize) {
	                    value = field.serialize(value, me);
	                }
	                ret[name] = value;
	            }
	        }
	    }
	
	    if (associated) {
	        me.getAssociatedData(ret); // pass ret so new data is added to our object
	    }
	
		return ret;
	}
});