const Switch = ({ checked, onChange, labels = ["Off", "On"] }) => {
    return (
        <label className="switch-box">
            <span className={!checked ? "active" : ""}>{labels[0]}</span>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <span className={checked ? "active" : ""}>{labels[1]}</span>
        </label>
    );
};

export default Switch;