import axios from 'axios';

export default async function fetchImg(querry, page) {
   
    const URL = "https://pixabay.com/api/";
    const KEY = "31529189-e658a57f43e24d6772cd1bf10";
    const options = `?key=${KEY}&q==${querry}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    return await axios.get(`${URL}${options}`).then(response =>response.data);
}

