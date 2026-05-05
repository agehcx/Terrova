import { useCallback, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { TerrovaClient } from '@/lib/terrova/client';

export function useTerrova() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [client, setClient] = useState<TerrovaClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      setClient(null);
      setIsInitialized(false);
      return;
    }

    try {
      const programId = new PublicKey(
        process.env.NEXT_PUBLIC_PROGRAM_ID || '11111111111111111111111111111111'
      );

      const geoProofClient = new TerrovaClient(connection, wallet, programId);
      setClient(geoProofClient);
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      console.error('[useTerrova] Initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize Terrova client');
      setIsInitialized(false);
    }
  }, [wallet.publicKey, wallet.signTransaction, connection]);

  const registerNode = useCallback(
    async (name: string, latitude: number, longitude: number, region: string) => {
      if (!client) {
        setError('Terrova client not initialized');
        return { success: false, error: 'Client not initialized' };
      }

      try {
        const result = await client.registerNode(name, latitude, longitude, region);
        if (!result.success) {
          setError(result.error instanceof Error ? result.error.message : 'Registration failed');
        }
        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        return { success: false, error: err };
      }
    },
    [client]
  );

  const submitEvidence = useCallback(
    async (verificationRequestId: string, latitude: number, longitude: number, imageHash: string, timestamp: number) => {
      if (!client) {
        setError('Terrova client not initialized');
        return { success: false, error: 'Client not initialized' };
      }

      try {
        const result = await client.submitEvidence(
          verificationRequestId,
          latitude,
          longitude,
          imageHash,
          timestamp
        );
        if (!result.success) {
          setError(result.error instanceof Error ? result.error.message : 'Submission failed');
        }
        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        return { success: false, error: err };
      }
    },
    [client]
  );

  const createVerificationRequest = useCallback(
    async (claimId: string, targetLatitude: number, targetLongitude: number, requiredEvidence: number, timeoutSeconds: number) => {
      if (!client) {
        setError('Terrova client not initialized');
        return { success: false, error: 'Client not initialized' };
      }

      try {
        const result = await client.createVerificationRequest(
          claimId,
          targetLatitude,
          targetLongitude,
          requiredEvidence,
          timeoutSeconds
        );
        if (!result.success) {
          setError(result.error instanceof Error ? result.error.message : 'Request creation failed');
        }
        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        return { success: false, error: err };
      }
    },
    [client]
  );

  const verifyEvidence = useCallback(
    async (verificationRequestId: string, evidenceIndex: number, isValid: boolean) => {
      if (!client) {
        setError('Terrova client not initialized');
        return { success: false, error: 'Client not initialized' };
      }

      try {
        const result = await client.verifyEvidence(verificationRequestId, evidenceIndex, isValid);
        if (!result.success) {
          setError(result.error instanceof Error ? result.error.message : 'Verification failed');
        }
        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        return { success: false, error: err };
      }
    },
    [client]
  );

  const claimRewards = useCallback(async () => {
    if (!client) {
      setError('Terrova client not initialized');
      return { success: false, error: 'Client not initialized' };
    }

    try {
      const result = await client.claimRewards();
      if (!result.success) {
        setError(result.error instanceof Error ? result.error.message : 'Claim failed');
      }
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return { success: false, error: err };
    }
  }, [client]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    client,
    isInitialized,
    error,
    clearError,
    registerNode,
    submitEvidence,
    createVerificationRequest,
    verifyEvidence,
    claimRewards,
  };
}
