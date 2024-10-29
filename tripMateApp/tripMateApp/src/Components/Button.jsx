import "./Button.css";

const Button = ({ text, type = 'button', onClick, customClass = '' }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`button ${customClass}`}
        > 
            {text}
        </button>
    );
};

export default Button;
