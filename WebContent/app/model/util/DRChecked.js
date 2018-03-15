/*
 * A utility model which extends the domain
 * with a checked field which will be usefull
 * e.g. in grids with checkcolums
 */
Ext.define('MaParoisse.model.util.DRChecked', {
	extend: 'MaParoisse.model.util.DomainRecord',
	fields: [{
		name: 'checked',
		type: 'boolean',
		persist: false,
		defaultValue: false
	}]
});