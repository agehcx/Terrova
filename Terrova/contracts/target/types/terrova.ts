/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/terrova.json`.
 */
export type Terrova = {
  "address": "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS",
  "metadata": {
    "name": "terrova",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Terrova - Decentralized Agricultural Insurance Verification"
  },
  "instructions": [
    {
      "name": "claimRewards",
      "docs": [
        "Claim earned rewards"
      ],
      "discriminator": [
        4,
        144,
        132,
        71,
        116,
        23,
        151,
        80
      ],
      "accounts": [
        {
          "name": "rewards",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  119,
                  97,
                  114,
                  100,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "createVerificationRequest",
      "docs": [
        "Create a new verification request"
      ],
      "discriminator": [
        208,
        212,
        48,
        124,
        147,
        163,
        191,
        233
      ],
      "accounts": [
        {
          "name": "verificationRequest",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  101,
                  114,
                  105,
                  102,
                  105,
                  99,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "requester"
              },
              {
                "kind": "account",
                "path": "protocol.total_verifications",
                "account": "protocol"
              }
            ]
          }
        },
        {
          "name": "protocol",
          "writable": true
        },
        {
          "name": "requester",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "requestData",
          "type": {
            "defined": {
              "name": "verificationRequestData"
            }
          }
        }
      ]
    },
    {
      "name": "finalizeVerification",
      "docs": [
        "Finalize verification"
      ],
      "discriminator": [
        17,
        156,
        245,
        109,
        209,
        118,
        72,
        240
      ],
      "accounts": [
        {
          "name": "verificationRequest",
          "writable": true
        },
        {
          "name": "protocol"
        },
        {
          "name": "admin",
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "docs": [
        "Initialize the Terrova protocol with admin settings"
      ],
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "protocol",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "config",
          "type": {
            "defined": {
              "name": "protocolConfig"
            }
          }
        }
      ]
    },
    {
      "name": "registerNode",
      "docs": [
        "Register a new node operator"
      ],
      "discriminator": [
        102,
        85,
        117,
        114,
        194,
        188,
        211,
        168
      ],
      "accounts": [
        {
          "name": "node",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  110,
                  111,
                  100,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "protocol",
          "writable": true
        },
        {
          "name": "stakeAccount"
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "location",
          "type": {
            "defined": {
              "name": "geoLocation"
            }
          }
        },
        {
          "name": "coverageRadiusKm",
          "type": "u32"
        }
      ]
    },
    {
      "name": "slashNode",
      "docs": [
        "Slash a node"
      ],
      "discriminator": [
        165,
        178,
        153,
        22,
        241,
        166,
        114,
        236
      ],
      "accounts": [
        {
          "name": "node",
          "writable": true
        },
        {
          "name": "protocol"
        },
        {
          "name": "admin",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "slashAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "submitEvidence",
      "docs": [
        "Submit evidence for a verification request"
      ],
      "discriminator": [
        12,
        169,
        228,
        194,
        229,
        31,
        44,
        39
      ],
      "accounts": [
        {
          "name": "evidence",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  118,
                  105,
                  100,
                  101,
                  110,
                  99,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "verificationRequest"
              },
              {
                "kind": "account",
                "path": "node"
              }
            ]
          }
        },
        {
          "name": "verificationRequest",
          "writable": true
        },
        {
          "name": "node",
          "writable": true
        },
        {
          "name": "nodeOwner",
          "writable": true,
          "signer": true
        },
        {
          "name": "owner",
          "relations": [
            "node"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "evidenceData",
          "type": {
            "defined": {
              "name": "evidenceData"
            }
          }
        }
      ]
    },
    {
      "name": "voteOnEvidence",
      "docs": [
        "Vote on submitted evidence"
      ],
      "discriminator": [
        36,
        244,
        105,
        1,
        44,
        120,
        76,
        24
      ],
      "accounts": [
        {
          "name": "evidenceVote",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  111,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "evidence"
              },
              {
                "kind": "account",
                "path": "voterNode"
              }
            ]
          }
        },
        {
          "name": "evidence",
          "writable": true
        },
        {
          "name": "voterNode"
        },
        {
          "name": "voter",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "vote",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "evidence",
      "discriminator": [
        160,
        73,
        93,
        206,
        99,
        242,
        62,
        92
      ]
    },
    {
      "name": "evidenceVote",
      "discriminator": [
        63,
        55,
        13,
        134,
        115,
        90,
        48,
        239
      ]
    },
    {
      "name": "node",
      "discriminator": [
        208,
        53,
        1,
        3,
        49,
        122,
        180,
        49
      ]
    },
    {
      "name": "protocol",
      "discriminator": [
        45,
        39,
        101,
        43,
        115,
        72,
        131,
        40
      ]
    },
    {
      "name": "rewards",
      "discriminator": [
        12,
        223,
        68,
        101,
        63,
        33,
        38,
        101
      ]
    },
    {
      "name": "verificationRequest",
      "discriminator": [
        66,
        147,
        154,
        149,
        184,
        5,
        129,
        4
      ]
    }
  ],
  "events": [
    {
      "name": "evidenceSubmitted",
      "discriminator": [
        13,
        123,
        197,
        44,
        231,
        117,
        168,
        53
      ]
    },
    {
      "name": "evidenceVoted",
      "discriminator": [
        107,
        162,
        236,
        2,
        52,
        197,
        99,
        120
      ]
    },
    {
      "name": "nodeRegistered",
      "discriminator": [
        15,
        57,
        183,
        59,
        93,
        55,
        157,
        195
      ]
    },
    {
      "name": "nodeSlashed",
      "discriminator": [
        195,
        114,
        214,
        16,
        173,
        73,
        177,
        87
      ]
    },
    {
      "name": "rewardsClaimed",
      "discriminator": [
        75,
        98,
        88,
        18,
        219,
        112,
        88,
        121
      ]
    },
    {
      "name": "verificationFinalized",
      "discriminator": [
        86,
        204,
        238,
        243,
        86,
        75,
        243,
        13
      ]
    },
    {
      "name": "verificationRequestCreated",
      "discriminator": [
        174,
        235,
        220,
        16,
        54,
        42,
        30,
        0
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "insufficientStake",
      "msg": "Insufficient stake amount"
    },
    {
      "code": 6001,
      "name": "nodeNotActive",
      "msg": "Node is not active"
    },
    {
      "code": 6002,
      "name": "nodeOutOfRange",
      "msg": "Node is out of verification range"
    },
    {
      "code": 6003,
      "name": "insufficientEvidence",
      "msg": "Insufficient evidence submitted"
    },
    {
      "code": 6004,
      "name": "unauthorized",
      "msg": "Unauthorized action"
    },
    {
      "code": 6005,
      "name": "deadlinePassed",
      "msg": "Verification deadline has passed"
    },
    {
      "code": 6006,
      "name": "invalidLocation",
      "msg": "Invalid location coordinates"
    },
    {
      "code": 6007,
      "name": "noRewardsAvailable",
      "msg": "No rewards available to claim"
    }
  ],
  "types": [
    {
      "name": "claimType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "cropDamage"
          },
          {
            "name": "floodAssessment"
          },
          {
            "name": "hailDamage"
          },
          {
            "name": "droughtVerification"
          },
          {
            "name": "fireDamage"
          },
          {
            "name": "pestInfestation"
          },
          {
            "name": "other"
          }
        ]
      }
    },
    {
      "name": "evidence",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "verificationRequest",
            "type": "pubkey"
          },
          {
            "name": "node",
            "type": "pubkey"
          },
          {
            "name": "photoHash",
            "type": "string"
          },
          {
            "name": "location",
            "type": {
              "defined": {
                "name": "geoLocation"
              }
            }
          },
          {
            "name": "weatherData",
            "type": {
              "defined": {
                "name": "weatherData"
              }
            }
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "evidenceStatus"
              }
            }
          },
          {
            "name": "approveVotes",
            "type": "u8"
          },
          {
            "name": "rejectVotes",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "evidenceData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "photoHash",
            "type": "string"
          },
          {
            "name": "location",
            "type": {
              "defined": {
                "name": "geoLocation"
              }
            }
          },
          {
            "name": "weatherData",
            "type": {
              "defined": {
                "name": "weatherData"
              }
            }
          }
        ]
      }
    },
    {
      "name": "evidenceStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "pending"
          },
          {
            "name": "approved"
          },
          {
            "name": "rejected"
          }
        ]
      }
    },
    {
      "name": "evidenceSubmitted",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "evidence",
            "type": "pubkey"
          },
          {
            "name": "request",
            "type": "pubkey"
          },
          {
            "name": "node",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "evidenceVote",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "voter",
            "type": "pubkey"
          },
          {
            "name": "evidence",
            "type": "pubkey"
          },
          {
            "name": "vote",
            "type": "bool"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "evidenceVoted",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "evidence",
            "type": "pubkey"
          },
          {
            "name": "voter",
            "type": "pubkey"
          },
          {
            "name": "vote",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "geoLocation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "latitude",
            "type": "i64"
          },
          {
            "name": "longitude",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "node",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "stakeAccount",
            "type": "pubkey"
          },
          {
            "name": "location",
            "type": {
              "defined": {
                "name": "geoLocation"
              }
            }
          },
          {
            "name": "coverageRadiusKm",
            "type": "u32"
          },
          {
            "name": "reputation",
            "type": "u8"
          },
          {
            "name": "evidenceCount",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "nodeStatus"
              }
            }
          },
          {
            "name": "registeredAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "nodeRegistered",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "node",
            "type": "pubkey"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "location",
            "type": {
              "defined": {
                "name": "geoLocation"
              }
            }
          }
        ]
      }
    },
    {
      "name": "nodeSlashed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "node",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "newReputation",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "nodeStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "active"
          },
          {
            "name": "inactive"
          },
          {
            "name": "suspended"
          }
        ]
      }
    },
    {
      "name": "protocol",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "minStake",
            "type": "u64"
          },
          {
            "name": "minEvidenceCount",
            "type": "u8"
          },
          {
            "name": "consensusThreshold",
            "type": "u8"
          },
          {
            "name": "totalNodes",
            "type": "u64"
          },
          {
            "name": "totalVerifications",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "protocolConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minStake",
            "type": "u64"
          },
          {
            "name": "minEvidenceCount",
            "type": "u8"
          },
          {
            "name": "consensusThreshold",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "rewards",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "totalEarned",
            "type": "u64"
          },
          {
            "name": "totalClaimed",
            "type": "u64"
          },
          {
            "name": "availableBalance",
            "type": "u64"
          },
          {
            "name": "lastClaimTime",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "rewardsClaimed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "verificationFinalized",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "request",
            "type": "pubkey"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "verificationStatus"
              }
            }
          }
        ]
      }
    },
    {
      "name": "verificationRequest",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "requester",
            "type": "pubkey"
          },
          {
            "name": "location",
            "type": {
              "defined": {
                "name": "geoLocation"
              }
            }
          },
          {
            "name": "radiusKm",
            "type": "u32"
          },
          {
            "name": "claimType",
            "type": {
              "defined": {
                "name": "claimType"
              }
            }
          },
          {
            "name": "bounty",
            "type": "u64"
          },
          {
            "name": "requiredEvidence",
            "type": "u8"
          },
          {
            "name": "submittedEvidence",
            "type": "u8"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "verificationStatus"
              }
            }
          },
          {
            "name": "deadline",
            "type": "i64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "verificationRequestCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "request",
            "type": "pubkey"
          },
          {
            "name": "requester",
            "type": "pubkey"
          },
          {
            "name": "bounty",
            "type": "u64"
          },
          {
            "name": "location",
            "type": {
              "defined": {
                "name": "geoLocation"
              }
            }
          }
        ]
      }
    },
    {
      "name": "verificationRequestData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "location",
            "type": {
              "defined": {
                "name": "geoLocation"
              }
            }
          },
          {
            "name": "radiusKm",
            "type": "u32"
          },
          {
            "name": "claimType",
            "type": {
              "defined": {
                "name": "claimType"
              }
            }
          },
          {
            "name": "bounty",
            "type": "u64"
          },
          {
            "name": "requiredEvidence",
            "type": "u8"
          },
          {
            "name": "deadline",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "verificationStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "pending"
          },
          {
            "name": "inProgress"
          },
          {
            "name": "completed"
          },
          {
            "name": "rejected"
          },
          {
            "name": "expired"
          }
        ]
      }
    },
    {
      "name": "weatherData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "temperature",
            "type": "i16"
          },
          {
            "name": "humidity",
            "type": "u8"
          },
          {
            "name": "windSpeed",
            "type": "u16"
          }
        ]
      }
    }
  ]
};
