import { useEffect, useState} from 'react'
import { api } from '../services/api'

function postAuthors(authorId) {
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuthorData() {
      try {
        const response = await api.get(`users/${authorId}`)
        setAuthor(response.data.user)

      } catch (error) {
        console.error('Erro ao buscar dados do autor', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAuthorData();
  }, [authorId]);

  return { author, loading };
}

export { postAuthors };