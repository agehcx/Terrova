export type Geoproof = {
  version: '0.1.0';
  name: 'geoproof';
  instructions: [
    {
      name: 'registerNode';
      accounts: [
        {
          name: 'node';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'authority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'name';
          type: 'string';
        },
        {
          name: 'latitude';
          type: 'f64';
        },
        {
          name: 'longitude';
          type: 'f64';
        },
        {
          name: 'region';
          type: 'string';
        }
      ];
    },
    {
      name: 'submitEvidence';
      accounts: [
        {
          name: 'evidence';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'submitter';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'verificationRequestId';
          type: 'string';
        },
        {
          name: 'latitude';
          type: 'f64';
        },
        {
          name: 'longitude';
          type: 'f64';
        },
        {
          name: 'imageHash';
          type: 'string';
        },
        {
          name: 'timestamp';
          type: 'i64';
        }
      ];
    },
    {
      name: 'createVerificationRequest';
      accounts: [
        {
          name: 'verification';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'requester';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'claimId';
          type: 'string';
        },
        {
          name: 'targetLatitude';
          type: 'f64';
        },
        {
          name: 'targetLongitude';
          type: 'f64';
        },
        {
          name: 'requiredEvidence';
          type: 'u32';
        },
        {
          name: 'timeoutSeconds';
          type: 'u32';
        }
      ];
    },
    {
      name: 'verifyEvidence';
      accounts: [
        {
          name: 'verification';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'evidence';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'verifier';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'verificationRequestId';
          type: 'string';
        },
        {
          name: 'evidenceIndex';
          type: 'u32';
        },
        {
          name: 'isValid';
          type: 'bool';
        }
      ];
    },
    {
      name: 'claimRewards';
      accounts: [
        {
          name: 'rewards';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'authority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: 'node';
      fields: [
        {
          name: 'authority';
          type: 'publicKey';
        },
        {
          name: 'name';
          type: 'string';
        },
        {
          name: 'latitude';
          type: 'f64';
        },
        {
          name: 'longitude';
          type: 'f64';
        },
        {
          name: 'region';
          type: 'string';
        },
        {
          name: 'verificationCount';
          type: 'u64';
        },
        {
          name: 'successRate';
          type: 'f64';
        },
        {
          name: 'totalRewards';
          type: 'u64';
        },
        {
          name: 'createdAt';
          type: 'i64';
        }
      ];
    },
    {
      name: 'evidence';
      fields: [
        {
          name: 'verificationRequestId';
          type: 'string';
        },
        {
          name: 'submitter';
          type: 'publicKey';
        },
        {
          name: 'latitude';
          type: 'f64';
        },
        {
          name: 'longitude';
          type: 'f64';
        },
        {
          name: 'imageHash';
          type: 'string';
        },
        {
          name: 'timestamp';
          type: 'i64';
        },
        {
          name: 'isVerified';
          type: 'bool';
        },
        {
          name: 'verificationVotes';
          type: 'u32';
        }
      ];
    },
    {
      name: 'verification';
      fields: [
        {
          name: 'claimId';
          type: 'string';
        },
        {
          name: 'requester';
          type: 'publicKey';
        },
        {
          name: 'targetLatitude';
          type: 'f64';
        },
        {
          name: 'targetLongitude';
          type: 'f64';
        },
        {
          name: 'requiredEvidence';
          type: 'u32';
        },
        {
          name: 'submittedEvidence';
          type: 'u32';
        },
        {
          name: 'verifiedEvidence';
          type: 'u32';
        },
        {
          name: 'status';
          type: {
            kind: 'enum';
            variants: [
              { name: 'Pending' },
              { name: 'InProgress' },
              { name: 'Approved' },
              { name: 'Rejected' },
              { name: 'TimedOut' }
            ];
          };
        },
        {
          name: 'createdAt';
          type: 'i64';
        },
        {
          name: 'deadline';
          type: 'i64';
        }
      ];
    },
    {
      name: 'rewards';
      fields: [
        {
          name: 'authority';
          type: 'publicKey';
        },
        {
          name: 'totalEarned';
          type: 'u64';
        },
        {
          name: 'totalClaimed';
          type: 'u64';
        },
        {
          name: 'availableBalance';
          type: 'u64';
        },
        {
          name: 'lastClaimTime';
          type: 'i64';
        }
      ];
    }
  ];
  events: [
    {
      name: 'NodeRegistered';
      fields: [
        {
          name: 'authority';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'name';
          type: 'string';
          index: false;
        },
        {
          name: 'latitude';
          type: 'f64';
          index: false;
        },
        {
          name: 'longitude';
          type: 'f64';
          index: false;
        }
      ];
    },
    {
      name: 'EvidenceSubmitted';
      fields: [
        {
          name: 'verificationRequestId';
          type: 'string';
          index: false;
        },
        {
          name: 'submitter';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'imageHash';
          type: 'string';
          index: false;
        }
      ];
    },
    {
      name: 'VerificationRequested';
      fields: [
        {
          name: 'claimId';
          type: 'string';
          index: false;
        },
        {
          name: 'requester';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'requiredEvidence';
          type: 'u32';
          index: false;
        }
      ];
    },
    {
      name: 'VerificationCompleted';
      fields: [
        {
          name: 'claimId';
          type: 'string';
          index: false;
        },
        {
          name: 'status';
          type: 'string';
          index: false;
        },
        {
          name: 'verifiedCount';
          type: 'u32';
          index: false;
        }
      ];
    },
    {
      name: 'RewardsClaimed';
      fields: [
        {
          name: 'authority';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'amount';
          type: 'u64';
          index: false;
        }
      ];
    }
  ];
  errors: [
    {
      code: 6000;
      name: 'Unauthorized';
      msg: 'You are not authorized to perform this action';
    },
    {
      code: 6001;
      name: 'InvalidCoordinates';
      msg: 'Latitude must be between -90 and 90, longitude between -180 and 180';
    },
    {
      code: 6002;
      name: 'VerificationNotFound';
      msg: 'Verification request not found';
    },
    {
      code: 6003;
      name: 'InvalidEvidenceIndex';
      msg: 'Evidence index out of bounds';
    },
    {
      code: 6004;
      name: 'NoRewardsAvailable';
      msg: 'No rewards available to claim';
    },
    {
      code: 6005;
      name: 'VerificationExpired';
      msg: 'Verification request has expired';
    },
    {
      code: 6006;
      name: 'InsufficientEvidence';
      msg: 'Not enough evidence submitted for verification';
    }
  ];
};
