const Input = ({label, type, name, placeholder, error, id = name, disabled}) => {

    return (
        <div className={`input-box${disabled ? " disabled" : ""}`}>
            <label htmlFor={id}>
                {label}
            </label>
            <input id={id} type={type} name={name} placeholder={placeholder} autoComplete="off" disabled={disabled} />
            <p className="error">
                { error }
            </p>
        </div>
    )
}

export default Input