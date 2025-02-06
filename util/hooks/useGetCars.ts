import axios from '../../libs/axios'
import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';

const fetchCars = async () => {
  const { data } = await axios.get<any>('/cars');
  return data;
};

export function useCars() {
  return useQuery({
    queryKey: ['cars'],
    queryFn: fetchCars
  });
}