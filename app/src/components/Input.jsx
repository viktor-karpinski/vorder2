const Input = ({label, type, name, placeholder, error, id = name}) => {

    return (
        <div  className="input-box">
            <label htmlFor={id}>
                {label}
            </label>
            <input id={id} type={type} name={name} placeholder={placeholder} autoComplete="off" />
            <p className="error">
                { error }
            </p>
        </div>
    )
}

export default Input