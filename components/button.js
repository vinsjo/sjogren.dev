import styles from './button.module.css';
const Button = ({ children, onClick, ...props }) => {
	return (
		<button
			className={styles.button}
			onClick={(ev) => typeof onClick === 'function' && onClick(ev)}
			{...props}
		>
			{children}
		</button>
	);
};

export default Button;
