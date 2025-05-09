const TableInput = ({inputs}) => {
    const chunkArray = (arr, size) => {
        const chunks = [];

        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    };
    
    const inputChunks = chunkArray(inputs, 2);

    return (
        <article className="table-inputs">
            {inputChunks.map((group, index) => (
                <div key={index}>
                {group.map((input) => (
                    <label key={input.id || input.name}>
                    <p>{input.label}</p>
                    <input
                        type="text"
                        name={input.name}
                        id={input.id}
                        placeholder={input.placeholder}
                    />
                    </label>
                ))}
                </div>
            ))}
        </article>
    )
}

export default TableInput;