'use client'
import api from "@/api/api";
import AddBlogModal from "@/components/module/back/AddBlogModal";
import EditBlogModal from "@/components/module/back/EditBlogModal";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { digitsEnToFa } from "@persian-tools/persian-tools";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [blogToEdit, setBlogToEdit] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
  }
  const fetchData = async () => {
    try {
      const response = await api.get("/api/blogs");
      setBlogs(response.data);
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات!");
      throw new Error("خطا در دریافت پست ها!");
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  const addBlog = (newBlog) => {
    setBlogs(prevBlogs => [...prevBlogs, newBlog]);
  }

  const handleEdit = (id) => {
    const blog = blogs.find((b) => b._id === id);
    if (blog) {
      setBlogToEdit(blog);
      setIsEditModalOpen(true);
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/blogs/delete/${selectedBlogId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error from server:", errorData.message);
        throw new Error("Failed to delete the product");
      }

      setBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== selectedBlogId));

      toast.success('پست با موفقیت حذف شد!')
      closeConfirmModal();
    } catch (error) {
      toast.error('خطا در حذف پست!', error.message);
    }
  };

  const openConfirmModal = (blogId) => {
    setSelectedBlogId(blogId);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setSelectedBlogId(null);
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="px-6 py-4">
      <button
        onClick={openModal}
        className="bg-orange-500 py-2 px-4 rounded-lg font-bold hover:bg-orange-600 transition mb-4"
      >
        ایجاد پست جدید
      </button>
      {isModalOpen && <AddBlogModal setIsModalOpen={setIsModalOpen} addBlog={addBlog} />}
      <div>
        <h2 className="text-2xl font-bold mb-4">لیست وبلاگ‌ها</h2>
        <div className="overflow-auto rounded-lg shadow-lg">
          <table className="min-w-full border border-gray-200">
            <thead className="border">
              <tr>
                <th className="px-4 py-2 font-bold text-right">شناسه</th>
                <th className="px-4 py-2 font-bold text-right">عنوان</th>
                <th className="px-4 py-2 font-bold text-right">تصویر</th>
                <th className="px-4 py-2 font-bold text-right">نویسنده</th>
                <th className="px-4 py-2 font-bold text-right">تاریخ ایجاد</th>
                <th className="px-4 py-2 font-bold text-right">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, index) => (
                <tr key={blog._id} className="hover:bg-gray-800">
                  <td className="px-4 py-2 text-right border border-gray-300">{digitsEnToFa(index + 1)}</td>
                  <td className="px-4 py-2 text-right border border-gray-300">{blog.title}</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <img
                      src={`${blog.image}?t=${new Date().getTime()}`}
                      alt={blog.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-2 text-right border border-gray-300">{blog.author}</td>
                  <td className="px-4 py-2 text-right border border-gray-300">
                    {new Date(blog.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="px-4 py-2 text-right border border-gray-300">
                    <button className="text-green-500 hover:text-green-700 font-bold ml-2"
                      onClick={() => handleEdit(blog._id)}>
                      ویرایش
                    </button>
                    <EditBlogModal
                      isOpen={isEditModalOpen}
                      blogToEdit={blogToEdit}
                      setIsEditModalOpen={setIsEditModalOpen}
                      updateBlog={(updatedBlog) => {
                        setBlogs((prevBlogs) =>
                          prevBlogs.map((blog) =>
                            blog._id === updatedBlog._id ? updatedBlog : blog
                          )
                        );
                      }}
                    />
                    <button className="text-red-500 hover:text-red-700 font-bold"
                      onClick={() => openConfirmModal(blog._id)}>
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-bold mb-4">آیا مطمئن هستید که می‌خواهید این محصول را حذف کنید؟</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 py-2 px-4 rounded-lg font-bold hover:bg-red-600 transition"
              >
                بله، حذف کن
              </button>
              <button
                onClick={closeConfirmModal}
                className="bg-gray-500 py-2 px-4 rounded-lg font-bold hover:bg-gray-600 transition"
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default Blogs