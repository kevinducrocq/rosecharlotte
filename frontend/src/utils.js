import Moment from 'moment';

export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export const dateFr = (date) => {
  return Moment(date).format('DD/MM/YYYY');
};
