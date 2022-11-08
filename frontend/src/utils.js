export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export const dateFr = (date) => {
  return new Date(date).toLocaleDateString('fr-FR');
};
