import "./Button.css";

const Button = ({ text, type = 'button', onClick, customClass = '', imageSrc }) => {
    return (
        <button
        
            type={type}
            onClick={onClick}
            className={`button ${customClass}`}
        > 
            {imageSrc && <img src={imageSrc} alt="Button Icon" className="button-image" />} 
            {text}
        </button>
    );
};

export default Button;
