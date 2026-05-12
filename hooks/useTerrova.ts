import { useCallback, useEffect, useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { TerrovaClient } from '@/lib/terrova/client';
import { useTerrovaWallet } from './useTerrovaWallet';

export function useTerrova() {
  const { connection } = useConnection();
  const wallet = useTerrovaWallet();
  const [client, setClient] = useState<TerrovaClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const walletPublicKeyStr = wallet.publicKey?.toBase58();

  useEffect(() => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      setClient(null);
      setIsInitialized(false);
      return;
    }

    try {
      const programIdStr =
        process.env.NEXT_PUBLIC_PROGRAM_ID || 'B3j3WKTsuHuBVeNbqcKX5wTyiPtnUGJ7ZpuCHctYPxwH';
      const programId = new PublicKey(programIdStr);
      const terrovaClient = new TerrovaClient(connection, wallet, programId);
      setClient(terrovaClient);
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      console.error('[useTerrova] Initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize Terrova client');
      setIsInitialized(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletPublicKeyStr, connection]);

  const registerNode = useCallback(
    async (latitude: number, longitude: number, coverageRadiusKm: number) => {
      if (!client) return { success: false, error: 'Client not initialized' };
      try {
        const result = await client.registerNode(latitude, longitude, coverageRadiusKm);
        if (!result.success) {
          setError(result.error instanceof Error ? result.error.message : 'Registration failed');
        }
        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        setError(msg);
        return { success: false, error: err };
      }
    },
    [client]
  );

  const submitEvidence = useCallback(
    async (
      verificationRequestAddress: PublicKey,
      nodeAddress: PublicKey,
      photoHash: string,
      latitude: number,
      longitude: number,
      weather: { temp: number; humidity: number; wind: number }
    ) => {
      if (!client) return { success: false, error: 'Client not initialized' };
      try {
        const result = await client.submitEvidence(
          verificationRequestAddress,
          nodeAddress,
          photoHash,
          latitude,
          longitude,
          weather
        );
        if (!result.success) {
          setError(result.error instanceof Error ? result.error.message : 'Submission failed');
        }
        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        setError(msg);
        return { success: false, error: err };
      }
    },
    [client]
  );

  const createVerificationRequest = useCallback(
    async (
      latitude: number,
      longitude: number,
      radiusKm: number,
      claimType: any,
      bounty: number,
      requiredEvidence: number,
      deadlineSeconds: number
    ) => {
      if (!client) return { success: false, error: 'Client not initialized' };
      try {
        const result = await client.createVerificationRequest(
          latitude,
          longitude,
          radiusKm,
          claimType,
          bounty,
          requiredEvidence,
          deadlineSeconds
        );
        if (!result.success) {
          setError(
            result.error instanceof Error ? result.error.message : 'Request creation failed'
          );
        }
        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        setError(msg);
        return { success: false, error: err };
      }
    },
    [client]
  );

  const voteOnEvidence = useCallback(
    async (evidencePda: PublicKey, voterNodePda: PublicKey, vote: boolean) => {
      if (!client) return { success: false, error: 'Client not initialized' };
      try {
        const result = await client.voteOnEvidence(evidencePda, voterNodePda, vote);
        if (!result.success) {
          setError(result.error instanceof Error ? result.error.message : 'Vote failed');
        }
        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        setError(msg);
        return { success: false, error: err };
      }
    },
    [client]
  );

  const claimRewards = useCallback(async () => {
    if (!client) return { success: false, error: 'Client not initialized' };
    try {
      const result = await client.claimRewards();
      if (!result.success) {
        setError(result.error instanceof Error ? result.error.message : 'Claim failed');
      }
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return { success: false, error: err };
    }
  }, [client]);

  const clearError = useCallback(() => setError(null), []);

  return {
    client,
    isInitialized,
    error,
    clearError,
    registerNode,
    submitEvidence,
    createVerificationRequest,
    voteOnEvidence,
    claimRewards,
  };
}
