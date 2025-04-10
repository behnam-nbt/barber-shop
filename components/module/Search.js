import Image from "next/image";
import Link from "next/link";
import { IoMdClose, IoIosSearch } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";

function Search({ setIsSearchOpen, search, setSearch, products }) {
    const filteredProducts = products.filter(product => product.title.toLowerCase().includes(search.toLowerCase()));
    return (
        <div className='relative' style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}>
            <IoMdClose
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-1 right-1 lg:top-2 lg:right-2 text-xl lg:text-3xl cursor-pointer" />
            <div className="min-h-1/2 lg:h-auto py-8 lg:py-0 lg:p-10 shadow-md">
                <form>
                    <div className="grid grid-cols-[2fr_2fr_1fr] lg:grid-cols-[2fr_4fr_1fr] border-b-2 lg:p-4 mb-4">
                        <div className="ml-8 flex justify-center items-center">
                            <span>دسته بندی ها</span>
                            <MdKeyboardArrowDown />
                        </div>
                        <input
                            style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
                            type="text"
                            placeholder="جستجوی محصول"
                            name="search"
                            className="w-full border-none outline-0"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div>
                            <IoIosSearch className="mr-auto text-2xl cursor-pointer text-left" />
                        </div>
                    </div>
                    {search.trim() && (
                        <div className="mt-8">
                            <h1 className="font-bold text-xl mb-4">نتایج جستجو برای: "{search}"</h1>
                            {filteredProducts.length > 0 ? (
                                <ul className="space-y-4 flex items-center flex-wrap">
                                    {filteredProducts.map(product => (
                                        <li key={product._id}>
                                            <Link
                                                href={`/shop/${product.slug}`}
                                                className="hover:underline text-lg block"
                                            >
                                                <div className="flex items-center">
                                                    <Image src={product.image} width={1920} height={1080} alt={product.title} className="w-24 h-auto" />
                                                    {product.title}
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-zinc-500">محصولی با این عنوان پیدا نشد.</p>
                            )}
                        </div>
                    )}
                    <div className="mb-12">
                        <span className="text-lg">جستجوی سریع: </span>
                        <span>بزودی...</span>
                    </div>
                    <div> 
                        <h1 className="font-bold text-2xl mb-6">شاید بپسندید</h1>
                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {products.slice(-4).reverse().map(product => (
                                    <Link
                                        key={product._id}
                                        href={`/shop/${product.slug}`}
                                        className="hover:shadow-lg transition rounded-lg p-2 w-64 mx-auto"
                                    >
                                        <Image
                                            src={product.image}
                                            width={1920}
                                            height={1080}
                                            alt={product.title}
                                            className="w-full h-auto object-cover rounded-md mb-2"
                                        />
                                        <p className="text-sm text-center">{product.title}</p>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div>درحال حاضر محصولی وجود ندارد</div>
                        )}
                    </div>
                </form>
            </div>
        </div >
    )
}

export default Search