import styles from './button.module.css';
const Button = ({ children, onClick }) => {
	return (
		<button
			className={styles.button}
			onClick={(ev) => typeof onClick === 'function' && onClick(ev)}
		>
			{children}
		</button>
	);
};

export default Button;
