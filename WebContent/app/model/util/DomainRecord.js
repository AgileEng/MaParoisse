Ext.define('MaParoisse.model.util.DomainRecord', {
	extend: 'Ext.data.Model',
	fields: [{name : 'id', type : 'number'},
		{name : 'xType', type : 'string'},
		{name : 'sysId', type : 'int', defaultValue : 0},
		{name : 'code', type : 'string'},
		{name : 'option', type : 'string'},
		{name : 'name', type : 'string'},
		{name : 'description', type : 'string'},
		{name : 'abbreviation', type : 'string'},
		{name : 'note', type : 'string'},
		{name : 'properties', type : 'number', defaultValue : 0},
		{name : 'active', type : 'boolean', defaultValue : true},
		{name : 'system', type : 'boolean', defaultValue : true},
		{name : 'modifiable', type : 'boolean', defaultValue : true},
		{name : 'dbState', type : 'int', defaultValue : 1},
		{name : 'ownerId', type : 'int', defaultValue : 0},
		{name : 'sIndex', type : 'int', defaultValue : 0}],
		
		
	DB_ACTION_NONE   : 0,
	DB_ACTION_INSERT : 1,
	DB_ACTION_UPDATE : 2,
	DB_ACTION_DELETE : 3,
	
	getDataObject : function() {
		if(this.get('dbState') != this.DB_ACTION_DELETE) {
			if(this.phantom) {
				this.set('dbState', this.DB_ACTION_INSERT);
			} else if(this.dirty) {
				this.set('dbState', this.DB_ACTION_UPDATE);
			}
		}
		return this.data;
	}, 
	getDataObjectExt : function() {
		if(this.get('dbState') != this.DB_ACTION_DELETE) {
			if(this.phantom) {
				this.set('dbState', this.DB_ACTION_INSERT);
			} else if(this.dirty && (this.get('dbState') != this.DB_ACTION_INSERT)) {
				this.set('dbState', this.DB_ACTION_UPDATE);
			}
		}
		return this.data;
	}, 
	
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
		
		
		if(this.get('dbState') != this.DB_ACTION_DELETE) {
			if(this.phantom) {
				this.set('dbState', this.DB_ACTION_INSERT);
			} else if(this.dirty && (this.get('dbState') != this.DB_ACTION_INSERT)) {
				this.set('dbState', this.DB_ACTION_UPDATE);
			}
		}
	
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
	}, 
	
	setDeleted : function() {
		this.set('dbState', this.DB_ACTION_DELETE);
	},
	copyData : function(data) {
		// data is Literal
		Ext.apply(this.data, data);
		if(data.id && data.id > 0) {
			this.id = data.id;
			this.phantom = false;
		}
	}, 
	resetAsNew : function() {
		// generate a temporaly id
		var newId = (-1 * Ext.data.Record.AUTO_ID++);
		this.set('id', newId);
		this.id = newId;
		this.phantom = true;
	},
	isView : function() {
		return this.getDataObjectExt().dbState === this.DB_ACTION_NONE;
	}
});
