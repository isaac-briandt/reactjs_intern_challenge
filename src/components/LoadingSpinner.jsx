import { FaSpinner } from "react-icons/fa";
import PropTypes from 'prop-types';

export default function LoadingSpinner({ className }) {
  return <FaSpinner className={`animate-spin w-4 h-4 ${className}`} />;
}

LoadingSpinner.propTypes = {
  className: PropTypes.string,
};