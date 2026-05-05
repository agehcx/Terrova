export type Terrova = {
  version: '0.1.0';
  name: 'terrova';
  instructions: [
    {
      name: 'initialize';
      accounts: [
        { name: 'protocol'; isMut: true; isSigner: false },
        { name: 'admin'; isMut: true; isSigner: true },
        { name: 'systemProgram'; isMut: false; isSigner: false }
      ];
      args: [{ name: 'config'; type: { defined: 'ProtocolConfig' } }];
    },
    {
      name: 'registerNode';
      accounts: [
        { name: 'node'; isMut: true; isSigner: false },
        { name: 'protocol'; isMut: true; isSigner: false },
        { name: 'stakeAccount'; isMut: false; isSigner: false },
        { name: 'owner'; isMut: true; isSigner: true },
        { name: 'systemProgram'; isMut: false; isSigner: false }
      ];
      args: [
        { name: 'location'; type: { defined: 'GeoLocation' } },
        { name: 'coverageRadiusKm'; type: 'u32' }
      ];
    },
    {
      name: 'createVerificationRequest';
      accounts: [
        { name: 'verificationRequest'; isMut: true; isSigner: false },
        { name: 'protocol'; isMut: true; isSigner: false },
        { name: 'requester'; isMut: true; isSigner: true },
        { name: 'systemProgram'; isMut: false; isSigner: false }
      ];
      args: [{ name: 'requestData'; type: { defined: 'VerificationRequestData' } }];
    },
    {
      name: 'submitEvidence';
      accounts: [
        { name: 'evidence'; isMut: true; isSigner: false },
        { name: 'verificationRequest'; isMut: true; isSigner: false },
        { name: 'node'; isMut: true; isSigner: false },
        { name: 'nodeOwner'; isMut: true; isSigner: true },
        { name: 'owner'; isMut: false; isSigner: false },
        { name: 'systemProgram'; isMut: false; isSigner: false }
      ];
      args: [{ name: 'evidenceData'; type: { defined: 'EvidenceData' } }];
    },
    {
      name: 'voteOnEvidence';
      accounts: [
        { name: 'evidenceVote'; isMut: true; isSigner: false },
        { name: 'evidence'; isMut: true; isSigner: false },
        { name: 'voterNode'; isMut: false; isSigner: false },
        { name: 'voter'; isMut: true; isSigner: true },
        { name: 'systemProgram'; isMut: false; isSigner: false }
      ];
      args: [{ name: 'vote'; type: 'bool' }];
    },
    {
      name: 'finalizeVerification';
      accounts: [
        { name: 'verificationRequest'; isMut: true; isSigner: false },
        { name: 'protocol'; isMut: false; isSigner: false },
        { name: 'admin'; isMut: false; isSigner: true }
      ];
      args: [];
    },
    {
      name: 'claimRewards';
      accounts: [
        { name: 'rewards'; isMut: true; isSigner: false },
        { name: 'authority'; isMut: true; isSigner: true },
        { name: 'systemProgram'; isMut: false; isSigner: false }
      ];
      args: [];
    },
    {
      name: 'slashNode';
      accounts: [
        { name: 'node'; isMut: true; isSigner: false },
        { name: 'protocol'; isMut: false; isSigner: false },
        { name: 'admin'; isMut: false; isSigner: true }
      ];
      args: [{ name: 'slashAmount'; type: 'u64' }];
    }
  ];
  accounts: [
    {
      name: 'protocol';
      type: {
        kind: 'struct';
        fields: [
          { name: 'admin'; type: 'publicKey' },
          { name: 'minStake'; type: 'u64' },
          { name: 'minEvidenceCount'; type: 'u8' },
          { name: 'consensusThreshold'; type: 'u8' },
          { name: 'totalNodes'; type: 'u64' },
          { name: 'totalVerifications'; type: 'u64' },
          { name: 'bump'; type: 'u8' }
        ];
      };
    },
    {
      name: 'node';
      type: {
        kind: 'struct';
        fields: [
          { name: 'owner'; type: 'publicKey' },
          { name: 'stakeAccount'; type: 'publicKey' },
          { name: 'location'; type: { defined: 'GeoLocation' } },
          { name: 'coverageRadiusKm'; type: 'u32' },
          { name: 'reputation'; type: 'u8' },
          { name: 'evidenceCount'; type: 'u64' },
          { name: 'status'; type: { defined: 'NodeStatus' } },
          { name: 'registeredAt'; type: 'i64' },
          { name: 'bump'; type: 'u8' }
        ];
      };
    },
    {
      name: 'verificationRequest';
      type: {
        kind: 'struct';
        fields: [
          { name: 'requester'; type: 'publicKey' },
          { name: 'location'; type: { defined: 'GeoLocation' } },
          { name: 'radiusKm'; type: 'u32' },
          { name: 'claimType'; type: { defined: 'ClaimType' } },
          { name: 'bounty'; type: 'u64' },
          { name: 'requiredEvidence'; type: 'u8' },
          { name: 'submittedEvidence'; type: 'u8' },
          { name: 'status'; type: { defined: 'VerificationStatus' } },
          { name: 'deadline'; type: 'i64' },
          { name: 'createdAt'; type: 'i64' },
          { name: 'bump'; type: 'u8' }
        ];
      };
    },
    {
      name: 'evidence';
      type: {
        kind: 'struct';
        fields: [
          { name: 'verificationRequest'; type: 'publicKey' },
          { name: 'node'; type: 'publicKey' },
          { name: 'photoHash'; type: 'string' },
          { name: 'location'; type: { defined: 'GeoLocation' } },
          { name: 'weatherData'; type: { defined: 'WeatherData' } },
          { name: 'timestamp'; type: 'i64' },
          { name: 'status'; type: { defined: 'EvidenceStatus' } },
          { name: 'approveVotes'; type: 'u8' },
          { name: 'rejectVotes'; type: 'u8' },
          { name: 'bump'; type: 'u8' }
        ];
      };
    },
    {
      name: 'rewards';
      type: {
        kind: 'struct';
        fields: [
          { name: 'authority'; type: 'publicKey' },
          { name: 'totalEarned'; type: 'u64' },
          { name: 'totalClaimed'; type: 'u64' },
          { name: 'availableBalance'; type: 'u64' },
          { name: 'lastClaimTime'; type: 'i64' },
          { name: 'bump'; type: 'u8' }
        ];
      };
    }
  ];
  types: [
    {
      name: 'GeoLocation';
      type: {
        kind: 'struct';
        fields: [
          { name: 'latitude'; type: 'i64' },
          { name: 'longitude'; type: 'i64' }
        ];
      };
    },
    {
      name: 'WeatherData';
      type: {
        kind: 'struct';
        fields: [
          { name: 'temperature'; type: 'i16' },
          { name: 'humidity'; type: 'u8' },
          { name: 'windSpeed'; type: 'u16' }
        ];
      };
    },
    {
      name: 'ProtocolConfig';
      type: {
        kind: 'struct';
        fields: [
          { name: 'minStake'; type: 'u64' },
          { name: 'minEvidenceCount'; type: 'u8' },
          { name: 'consensusThreshold'; type: 'u8' }
        ];
      };
    },
    {
      name: 'VerificationRequestData';
      type: {
        kind: 'struct';
        fields: [
          { name: 'location'; type: { defined: 'GeoLocation' } },
          { name: 'radiusKm'; type: 'u32' },
          { name: 'claimType'; type: { defined: 'ClaimType' } },
          { name: 'bounty'; type: 'u64' },
          { name: 'requiredEvidence'; type: 'u8' },
          { name: 'deadline'; type: 'i64' }
        ];
      };
    },
    {
      name: 'EvidenceData';
      type: {
        kind: 'struct';
        fields: [
          { name: 'photoHash'; type: 'string' },
          { name: 'location'; type: { defined: 'GeoLocation' } },
          { name: 'weatherData'; type: { defined: 'WeatherData' } }
        ];
      };
    },
    {
      name: 'NodeStatus';
      type: {
        kind: 'enum';
        variants: [{ name: 'Active' }, { name: 'Inactive' }, { name: 'Suspended' }];
      };
    },
    {
      name: 'VerificationStatus';
      type: {
        kind: 'enum';
        variants: [
          { name: 'Pending' },
          { name: 'InProgress' },
          { name: 'Completed' },
          { name: 'Rejected' },
          { name: 'Expired' }
        ];
      };
    },
    {
      name: 'ClaimType';
      type: {
        kind: 'enum';
        variants: [
          { name: 'CropDamage' },
          { name: 'FloodAssessment' },
          { name: 'HailDamage' },
          { name: 'DroughtVerification' },
          { name: 'FireDamage' },
          { name: 'PestInfestation' },
          { name: 'Other' }
        ];
      };
    },
    {
      name: 'EvidenceStatus';
      type: {
        kind: 'enum';
        variants: [{ name: 'Pending' }, { name: 'Approved' }, { name: 'Rejected' }];
      };
    }
  ];
  events: [
    {
      name: 'NodeRegistered';
      fields: [
        { name: 'node'; type: 'publicKey'; index: false },
        { name: 'owner'; type: 'publicKey'; index: false },
        { name: 'location'; type: { defined: 'GeoLocation' }; index: false }
      ];
    },
    {
      name: 'RewardsClaimed';
      fields: [
        { name: 'authority'; type: 'publicKey'; index: false },
        { name: 'amount'; type: 'u64'; index: false }
      ];
    }
  ];
  errors: [
    { code: 6000; name: 'InsufficientStake'; msg: 'Insufficient stake amount' },
    { code: 6001; name: 'NodeNotActive'; msg: 'Node is not active' },
    { code: 6002; name: 'NodeOutOfRange'; msg: 'Node is out of verification range' },
    { code: 6003; name: 'InsufficientEvidence'; msg: 'Insufficient evidence submitted' },
    { code: 6004; name: 'Unauthorized'; msg: 'Unauthorized action' },
    { code: 6005; name: 'DeadlinePassed'; msg: 'Verification deadline has passed' },
    { code: 6006; name: 'InvalidLocation'; msg: 'Invalid location coordinates' },
    { code: 6007; name: 'NoRewardsAvailable'; msg: 'No rewards available to claim' }
  ];
};
