import axios from 'axios';


export const getBusinesses = async (accountId: string) => {
  const response = await axios.get('/api/business?accountId=' + accountId + '');
  if (response.status === 200) {
    return response.data.businesses;
  } else {
    throw new Error('Failed to fetch businesses');
  }
};
