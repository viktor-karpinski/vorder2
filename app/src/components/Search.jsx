const Search = ({placeholder}) => {
    return (
    <form className="search-box">
        <label className="search-input-box">
            <input type="text" name="search" id="search" placeholder={placeholder} autoComplete="off" />
            <button type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
        </label>
        <article className="filter-box">

        </article>
    </form>
    )
}

export default Search;