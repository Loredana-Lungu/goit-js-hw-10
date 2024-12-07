import axios from 'axios';

axios.defaults.headers.common['x-api-key'] = 'live_OzeQ9OqaHt0qcWqnxpy5UNHdSAMJJCTwTMSIlZUxEE2MQe15B3p59sqMmKWSKLNN';

export function fetchBreeds() {
  return axios.get('https://api.thecatapi.com/v1/breeds')
    .then(response => {
      console.log('Response from API:', response.data);
      return response.data;
    })
    .catch(error => {
      console.error('Error fetching breeds:', error);
      throw error;
    });
}

export function fetchCatByBreed(breedId) {
  return axios.get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then(response => {
      console.log('Response from API:', response.data);
      if (response.data.length > 0) {
        return response.data[0];
      } else {
        throw new Error('No cat data found for this breed');
      }
    })
    .catch(error => {
      console.error('Error fetching cat by breed:', error);
      throw error;
    });
}
