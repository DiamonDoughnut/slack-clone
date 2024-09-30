import { useMutation } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";

type ResponseType = string | null;

type Options = {
    onSuccess?: (data: ResponseType) => void;
    onError?: (error: Error) => void;
    onSettled?: () => void; 
    throwError?: boolean;
};

export const useGenerateUploadUrl = () => {
    const [data, setData] = useState<ResponseType>(null);
    const [error, setError] = useState<Error | null>(null);

    const [status, setStatus] = useState<'success' | 'pending' | 'error' | 'settled' | null>(null)

    const isPending = useMemo(() => status === 'pending', [status])
    const isSuccess = useMemo(() => status === 'success', [status])
    const isError = useMemo(() => status === 'error', [status])
    const isSettled = useMemo(() => status === 'settled', [status])

    const mutation = useMutation(api.upload.generateUploadUrl);

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    const mutate = useCallback(async (_values: {}, options?: Options) => {

        try{
            setData(null);
            setError(null);
            setStatus('pending');

            const response = await mutation();
            options?.onSuccess?.(response)
            setStatus('success')
            return response;
        } catch (error) {
            setStatus('error');
            options?.onError?.(error as Error);
            
            if(options?.throwError) {
                throw error;
            }
        } finally {
            options?.onSettled?.();
            setStatus('settled')
        }
    }, [mutation]);

    return {
        mutate,
        data,
        error,
        isPending,
        isError,
        isSuccess,
        isSettled
    }
}