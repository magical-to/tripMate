import "./Button.css";

const Button = ({ text, type = 'button', onClick, className = '' }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`button ${className}`}> 
            {text}
        </button>
    );
};

export default Button;
