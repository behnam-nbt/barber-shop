function Hamburger({ menuHandler }) {
    return (
        <div className="cursor-pointer group" onClick={menuHandler}>
            <span className="h-[2px] w-[30px] block transition-all duration-300 bg-[var(--text-color)]"></span>
            <span className="h-[2px] w-[15px] block mt-2 transition-all duration-300 bg-[var(--text-color)] group-hover:w-[30px]"></span>
        </div>
    );
}

export default Hamburger;
