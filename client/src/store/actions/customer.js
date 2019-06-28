import {GET_CUSTOMERS} from './constants';

export const getCustomers = () => dispatch => {
  return fetch('/api/v1/users')
    .then(res => res.json())
    .then(customers => dispatch({type: GET_CUSTOMERS, payload: customers}))
}
