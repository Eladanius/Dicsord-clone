import qs from 'query-string';
import { useInfiniteQuery } from '@tanstack/react-query';

import { useSocket } from '@/components/providers/socket-provider';

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
}

export const useChatQuery = ({ queryKey, apiUrl, paramKey, paramValue }: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMeesages = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: { cursor: pageParam, [paramKey]: paramValue },
      },
      { skipNull: true }
    );

    const response = await fetch(url);
    return response.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMeesages,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: isConnected ? false : 1000,
  });

  return { data, fetchNextPage, hasNextPage, isFetchingNextPage, status };
};
