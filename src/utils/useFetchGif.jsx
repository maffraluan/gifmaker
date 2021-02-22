import axios from 'axios';
import { useEffect, useState } from 'react';

export default function useFetchGifs(query, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [gifs, setGifs] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setGifs([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: 'GET',
      url: "https://api.giphy.com/v1/gifs/trending",
      params: { q: query, page: pageNumber, api_key: '2lTslAP6nER522Zfj38VfyVxByU2jbFK', limit: 100 },
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(res => {
      setGifs(prevGifs => {
        return [...prevGifs, ...res.data.data]
      })
      setHasMore(res.data.data.length > 0);
      setLoading(false);
    }).catch(err => {
      if (axios.isCancel(err)) return;
      setError(true);
    })
    return () => cancel();
  }, [query, pageNumber]);

  return { loading, error, hasMore, gifs }
}