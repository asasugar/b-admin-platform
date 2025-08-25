import { useLocation } from 'react-router-dom';

interface QueryParams {
  [key: string]: string | null;
}

/** 获取query的某个值，如果没传，则获取整个query */
export function useQuery(key?: string) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  if (key) {
    return searchParams.get(key);
  } else {
    const queryParams: QueryParams = {};

    for (const [key, value] of searchParams.entries()) {
      queryParams[key] = value;
    }

    return queryParams;
  }
}