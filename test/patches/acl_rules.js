module.exports = {
  aclRules: [
    //administrator
    {
      roles: 'administrator',
      allows: [{
        resources: [
          'role',
          'role_to_user',
          'user',
        ],
        permissions: '*'
      }]
    },

    // model permissions
    {
      roles: 'editor',
      allows: [{
        resources: [
                  'accession',
                  'acl_validations',
                  'aminoacidsequence',
                  'arr',
                  'capital',
                  'country',
                  'country_to_river',
                  'cultivar',
                  'dog',
                  'field_plot',
                  'individual',
                  'location',
                  'mM1',
                  'mM1_to_MM2',
                  'mM2',
                  'measurement',
                  'microbiome_asv',
                  'oM1',
                  'oM2',
                  'parrot',
                  'person',
                  'plant_measurement',
                  'pot',
                  'river',
                  'sample',
                  'sample_measurement',
                  'sequencingExperiment',
                  'taxon',
                  'transcript_count',
                  'with_validations',
                ],
        permissions: ['create', 'update', 'delete']
      }]
    },

    {
      roles: 'reader',
      allows: [{
        resources: [
                  'accession',
                  'acl_validations',
                  'aminoacidsequence',
                  'arr',
                  'capital',
                  'country',
                  'country_to_river',
                  'cultivar',
                  'dog',
                  'field_plot',
                  'individual',
                  'location',
                  'mM1',
                  'mM1_to_MM2',
                  'mM2',
                  'measurement',
                  'microbiome_asv',
                  'oM1',
                  'oM2',
                  'parrot',
                  'person',
                  'plant_measurement',
                  'pot',
                  'river',
                  'sample',
                  'sample_measurement',
                  'sequencingExperiment',
                  'taxon',
                  'transcript_count',
                  'with_validations',
                ],
        permissions: ['read']
      }]
    }
  ]
}