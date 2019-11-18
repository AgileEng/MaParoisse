Ext.define('MaParoisse.lib.Globals', {
	singleton: true,
	
	config: {
		lastUsedJournal: null,
		saisieGuidee: {
			queteTypes: {
				type1: 10, // 4 records with amount
				type2: 20, // 1 record with fixed queteCode
				type3: 30  // 1 record with selectable queteCode
			},
			quetes: {
				DF: {
					type: '10',
					code: '' //should be empty
				},
				Celebrant: {
					type: '20',
					code: '' // should be empty
				},
				fromList: {
					type: '30',
					code: '' //selectable from list 
				}
			}
		},
		
		queteCodes: [{
			name: 'Sans choix',
			code: '',
			type: {type: '30',code: ''}
		}, {
			name: 'Missions d’Afrique',
			code: '07',
			type: {type: '30',code: ''}
		}, {
			name: 'Sainte Enfance',
			code: '11',
			type: {type: '30',code: ''}
		}, {
			name: 'Grande Quête Diocésaine',
			code: '01',
			type: {type: '30',code: ''}
		}, {
			name: 'Terre Sainte',
			code: '09',
			type: {type: '30',code: ''}
		}, {
			name: 'Denier de St Pierre',
			code: '08',
			type: {type: '30',code: ''}
		}, {
			name: 'Communication diocésaine – Alsace Media',
			code: '13',
			type: {type: '30',code: ''}
		}, {
			name: 'Apostolat des Laïcs et Catéchèse',
			code: '03',
			type: {type: '30',code: ''}
		}, {
			name: 'Dimanche des Missions',
			code: '06',
			type: {type: '30',code: ''}
		}, {
			name: 'Propagation de la Foi',
			code: '10',
			type: {type: '30',code: ''}
		}, {
			name: 'Saint Pierre Apôtre',
			code: '12',
			type: {type: '30',code: ''}
		}, {
			name: 'Liturgie, Musique et Art Sacrés',
			code: '24',
			type: {type: '30',code: ''}
		}, {
			name: 'Taxes mariages et enterrements, confirmations, dispenses…',
			code: '14',
			type: {type: '30',code: ''}
		}, {
			name: '% sur les revenus de la Fabrique d’église de l’année précédent',
			code: '15',
			type: {type: '30',code: ''}
		}, {
			name: '% sur quêtes de mariages et enterrements réalisés au cours de l’année courante',
			code: '16',
			type: {type: '30',code: ''}
		}, {
			name: 'Décorations (diocésaines ou romaines)',
			code: '18',
			type: {type: '30',code: ''}
		}, {
			name: 'Binages versés par la paroisse',
			code: '19',
			type: {type: '30',code: ''}
		}, {
			name: 'Prélèvements sur messes versés par la paroisse',
			code: '20',
			type: {type: '30',code: ''}
		}, {
			name: 'Honoraires de messes à faire célébrer',
			code: '22',
			type: {type: '30',code: ''}
		}, {
			name: 'PAX CHRISTI',
			code: '04',
			type: {type: '30',code: ''}
		}, {
			name: 'Pastorale des Jeunes, ...',
			code: '17',
			type: {type: '30',code: ''}
		}],
		
		queteCodesMense: [{
			name: 'Sans choix',
			code: '',
			type: {type: '30',code: ''}
		}, {
			name: 'Taxes mariages et enterrements, confirmations, dispenses…',
			code: '14',
			type: {type: '30',code: ''}
		}, {
			name: '% sur quêtes de mariages et enterrements réalisés au cours de l’année courante',
			code: '16',
			type: {type: '30',code: ''}
		}, {
			name: 'Prélèvements sur messes versés par la paroisse',
			code: '20',
			type: {type: '30',code: ''}
		}, {
			name: 'Honoraires de messes à faire célébrer',
			code: '22',
			type: {type: '30',code: ''}
		}],
		
		accIdentificationRules: {
			NA: 0,
			EXPENSE: 6,       
			REVENUE: 7,
			BANK_ACCOUNT: 51,
			CASH_ACCOUNT: 53,
			THIRD_ACCOUNT: 40,
			OTHER_RECEIVABLE_PAYABLE: 46, 
			DF: 50, 
			CELEBRANT: 60, 
			QUETE: 70,
			VIREMENTS_INTERNES: 58,
			
			/*
			 * case 180 combines 50, 60, 70
			 * and is used only in GUI
			 */
			COMBINED: 180
		},
		
		journalIdentificationRules: {
			NA: 0,
			AA: 10,     	  // A NOUVEAU
			CA: 20, 		  // CAISSE
			BQ: 30,           // BQ 1 à 9	BANQUE
			OD: 40,           // OPERATIONS DIVERSES
			SAL: 50,          // SALAIRES
			AC: 60,           // ACHATS
			PR: 70
		},
		
		paymentMethods: {
			CAISSE: 10,
			BANQUE: 20,
			DIVERSES: 30
		},
		
		contributorsModuleModes: {
			CRUDCONTRIBUTOR: 10,
			DOCGENERATION: 20
		},
		
		modules: [
		          	//Saisie Guidee Income Modules
		          	{moduleId: '670b4',titleComment: '', additionalComment: '**  Rajouter un commentaire qui rendra service : événement particulier, fête, date particulière etc…'},
					{moduleId: '680b4',titleComment: 'A utiliser ici si un autre établissement(menses) fait un virement à la Fabrique pour ce poste de recette', additionalComment: '**  Rajouter un commentaire qui rendra service : événement particulier, fête, date particulière etc…'},
					{moduleId: '690b4',titleComment: 'Selon plan du diocèse : quêtes chauffage, bancs….', additionalComment: '**  Rajouter un commentaire qui rendra service : événement particulier, N° Chèque, fête, date particulière etc…'},
					{moduleId: '700b4',titleComment: '', additionalComment: '**  Rajouter un commentaire qui rendra service : période , N° Chèque, etc…'},
					{moduleId: '710b4',titleComment: 'Comptabiliser ici les dons (en espèces) pour lesquels aucun reçu fiscal ne sera réalisé.', additionalComment: '**  Rajouter un commentaire qui rendra service : événement particulier, N° Chèque, etc…'},
					{moduleId: '720b4',titleComment: '', additionalComment: '**  Rajouter un commentaire qui rendra service : événement particulier, N° Chèque, etc…'},
					{moduleId: '723b4',titleComment: '', additionalComment: '**  Rajouter un commentaire qui rendra service : événement particulier, fête, date particulière etc…'},
                   	{moduleId: '727b4',titleComment: '', additionalComment: '**  Rajouter un commentaire qui rendra service : événement particulier, fête, date particulière etc…'},
					//Saisie Guidee Spending modules
                   	{moduleId: '730b4',titleComment: '', additionalComment: '**  Rajouter un commentaire qui rendra service : quantité, nature précise, événement etc…'},
                   	{moduleId: '740b4',titleComment: '', additionalComment: '**  Rajouter un commentaire qui rendra service : quantité, nature précise, événement etc…'},
                   	{moduleId: '750b4',titleComment: '', additionalComment: '**  Rajouter un commentaire qui rendra service : quantité, nature précise, événement etc…'},
                   	{moduleId: '760b4',titleComment: '', additionalComment: '**  Rajouter un commentaire qui rendra service : quantité, nature précise, événement etc…'},
                   	{moduleId: '770b4',titleComment: '', additionalComment: '**  Rajouter un commentaire qui rendra service : quantité, nature précise, événement etc…'},
                   	{moduleId: '780b4',titleComment: '', additionalComment: ''},
                   	{moduleId: '790b4',titleComment: '', additionalComment: '**  Rajouter un commentaire qui rendra service : quantité, nature précise, événement etc…'},
                   	{moduleId: '800b4',titleComment: '', additionalComment: '**  Rajouter un commentaire qui rendra service : quantité, nature précise, événement etc…'},
                   	{moduleId: '810b4',titleComment: '', additionalComment: '**  Rajouter un commentaire qui rendra service : quantité, nature précise, événement etc…'},
                   	{moduleId: '820b4',titleComment: '', additionalComment: '**  Rajouter un commentaire qui rendra service : quantité, nature précise, événement etc…'},
                   	{moduleId: '830b4',titleComment: '', additionalComment: '**  Rajouter un commentaire qui rendra service : quantité, nature précise, événement etc…'},
                   	{moduleId: '840b4',titleComment: '', additionalComment: '**  Rajouter un commentaire qui rendra service : quantité, nature précise, événement etc…'},
                   	{moduleId: '850b4',titleComment: '', additionalComment: '**  Rajouter un commentaire qui rendra service : quantité, nature précise, événement etc…'},
                   	{moduleId: '860b4',titleComment: '', additionalComment: '**  Rajouter un commentaire qui rendra service : quantité, nature précise, événement etc…'},
                   	{moduleId: '870b4',titleComment: '', additionalComment: '**  Rajouter un commentaire qui rendra service : quantité, nature précise, événement etc…'},
                   	{moduleId: '880b4',titleComment: '', additionalComment: '**  Rajouter un commentaire qui rendra service : quantité, nature précise, événement etc…'},
                   	{moduleId: '890b4',titleComment: 'Le montant est calculé : 2%  sur les revenus de la Fabrique de  l\'année N-1', additionalComment: ''},
                   	//Saisie Guidee Tresorier Modules
                   	{moduleId: '900b4',titleComment: '', additionalComment: '**  Rajouter un commentaire qui rendra service : événement particulier, fête, date particulière etc…'},
                   	{moduleId: '910b4',titleComment: 'Le montant du versement est issu du tableau "BORDERAU DES SOMMES REVERSEES A L\'ARCHEVECHE"', additionalComment: '**  Rajouter un commentaire qui rendra service : événement particulier, fête, date particulière etc…'},
                   	{moduleId: '920b4',titleComment: 'Le montant du versement est issu du tableau "BORDERAU DES SOMMES REVERSEES A L\'ARCHEVECHE"', additionalComment: '**  Rajouter un commentaire qui rendra service : événement particulier, fête, date particulière etc…'},
                   	{moduleId: '930b4',titleComment: 'Il s\'agit de la partie "intention de messe" versée au célébrant', additionalComment: '**  Rajouter un commentaire qui rendra service : période, événement particulier, fête, date particulière etc…'},
                   	{moduleId: '940b4',titleComment: 'Les montants sont issus d\'un récapitulatif (mensuel, hebdomadaire, trimestriel…) ', additionalComment: '**  Rajouter un commentaire qui rendra service : période, événement particulier, fête, date particulière etc…'},
                   	//Saisie Guidee Specifiques Modules
                   	{moduleId: '950b4',titleComment: 'Les montants sont issus d\'un récapitulatif (mensuel, hebdomadaire, trimestriel…) ', additionalComment: '**  Rajouter un commentaire qui rendra service : période, événement particulier, fête, date particulière etc…'},
                   	{moduleId: '960b4',titleComment: 'Les montants sont issus d\'un récapitulatif (mensuel, hebdomadaire, trimestriel…) ', additionalComment: '**  Rajouter un commentaire qui rendra service : période, événement particulier, fête, date particulière etc…'},
                   	{moduleId: '970b4',titleComment: '', additionalComment: '**  Rajouter un commentaire qui rendra service : événement particulier, fête, date particulière etc…'},
                   	{moduleId: '980b4',titleComment: 'Les montants sont issus d\'un récapitulatif (mensuel, hebdomadaire, trimestriel…) ', additionalComment: '**  Rajouter un commentaire qui rendra service : événement particulier, fête, date particulière etc…'},
                   	{moduleId: '990b4',titleComment: 'Les montants sont issus d\'un récapitulatif (mensuel, hebdomadaire, trimestriel…) ', additionalComment: '**  Rajouter un commentaire qui rendra service : événement particulier, fête, date particulière etc…'}
                   	]
	},
	
	/*
	 * TODO: Think about an universal method for such properties.
	 * No time to think about breaking something by merging methods
	 */
	getAdditionalCommentByModule: function(moduleId){
		for(var i = 0; i < this.getModules().length; i++){
			if(moduleId == this.getModules()[i].moduleId){
				return this.getModules()[i].additionalComment;
			}
		}
		return null;
	},
	
	getTitleCommentByModule: function(moduleId){
		for(var i = 0; i < this.getModules().length; i++){
			if(moduleId == this.getModules()[i].moduleId){
				return this.getModules()[i].titleComment;
			}
		}
		return null;
	},
	
	constructor: function(config) {
        this.initConfig(config);
        return this;
    }
});