import { digitsEnToFa } from "@persian-tools/persian-tools";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <div style={{ backgroundColor: "var(--background-color)" }} className="pt-40">
      <div className="h-auto md:flex justify-evenly px-10 flex-col md:flex-row mb-8">
        {/* Newsletter Section */}
        <div className="text-center mb-6 md:mb-0">
          <h1 className="font-semibold text-2xl mb-6">خبرنامه</h1>
          <input
            style={{ backgroundColor: "var(--background-color)" }}
            className="w-52 mx-auto p-1 mb-2 rounded-md block border border-zinc-400"
            type="email"
            placeholder="آدرس ایمیل خود را وارد نمایید"
          />
          <button className="text-xl bg-orange-400 text-white px-10 py-1 rounded-md">ارسال</button>
          <div>
            <ul className="flex justify-center items-center mt-10">
              <li>
                <Link href="#">
                  <FaFacebook className="text-2xl" />
                </Link>
              </li>
              <li className="pr-4">
                <Link href="#">
                  <FaTwitter className="text-2xl" />
                </Link>
              </li>
              <li className="pr-4">
                <Link href="#">
                  <FaInstagram className="text-2xl" />
                </Link>
              </li>
              <li className="pr-4">
                <Link href="#">
                  <FaYoutube className="text-2xl" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Working Hours Section */}
        <div className="text-center mb-6 md:mb-0">
          <h1 className="font-semibold text-2xl mb-6">ساعت های کاری</h1>
          <ul>
            <li className="text-lg mb-3">
              شنبه - چهارشنبه : {digitsEnToFa(10)} صبح - {digitsEnToFa(8)} عصر
            </li>
            <li className="text-lg mb-3">
              شنبه : {digitsEnToFa(9)} صبح - {digitsEnToFa(5)} عصر
            </li>
            <li className="text-lg">
              جمعه : {digitsEnToFa(10)} صبح - {digitsEnToFa(4)} عصر
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="text-center mb-6 md:mb-0">
          <h1 className="font-semibold text-2xl mb-6">تماس با ما</h1>
          <ul>
            <li className="text-lg mb-3">{digitsEnToFa("98765432(026)")}</li>
            <li className="text-lg mb-3">contact.babershop@gmail.com</li>
            <li className="text-lg">کرج - مهرویلا - خیابان رودکی</li>
          </ul>
        </div>

        {/* Logo Section */}
        <div className="text-center md:text-left">
          <Image src="/images/logo.png" width={1200} height={900} alt="logo" className="w-44 mx-auto h-auto" />
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="bg-black flex justify-around p-6 text-center md:text-left">
        <Link href="#" className="text-xl text-white block md:inline-block mb-4 md:mb-0">
          حریم خصوصی
        </Link>
        <Link href="#" className="max-sm:text-lg text-xl text-white block md:inline-block mb-4 md:mb-0">
          &copy; تمامی حقوق محفوظ می باشد.
        </Link>
      </div>
    </div>
  );
}

export default Footer;
