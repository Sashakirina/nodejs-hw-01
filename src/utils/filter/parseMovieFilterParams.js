import parseInteger from './parseInteger.js';

const parseMovieFilterParams = ({ minYear, maxYear }) => {
  const parsedMinYear = parseInteger(minYear);
  const parsedMaxYear = parseInteger(maxYear);

  return {
    minYear: parsedMinYear,
    maxYear: parsedMaxYear,
  };
};

export default parseMovieFilterParams;
