'use client'
import React, { useEffect, useState } from 'react'

import AddProductModal from '@/components/module/back/AddProductModal';
import EditProductModal from '@/components/module/back/EditProductModal';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import api from '@/api/api';
import { digitsEnToFa } from '@persian-tools/persian-tools';

function products() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
  }
  const fetchData = async () => {
    try {
      const response = await api.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      toast.error("خطا در دریافت محصولات!");
      throw new Error("خطا در دریافت محصولات!");
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  const addProduct = (newProduct) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
  }

  const handleEdit = (id) => {
    const product = products.find((b) => b._id === id);
    if (product) {
      setProductToEdit(product);
      setIsEditModalOpen(true);
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/products/delete/${selectedProductId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error from server:", errorData.message);
        throw new Error("Failed to delete the product");
      }

      setProducts(prevProducts => prevProducts.filter(product => product._id !== selectedProductId));

      toast.success('محصول با موفقیت حذف شد!')
      closeConfirmModal();
    } catch (error) {
      toast.error('خطا در حذف محصول!', error.message);
    }
  };

  const openConfirmModal = (productId) => {
    setSelectedProductId(productId);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setSelectedProductId(null);
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="px-6 py-4">
      <button
        onClick={openModal}
        className="bg-orange-500 py-2 px-4 rounded-lg font-bold hover:bg-orange-600 transition mb-4"
      >
        ایجاد محصول جدید
      </button>
      {isModalOpen && <AddProductModal setIsModalOpen={setIsModalOpen} addProduct={addProduct} />}
      <div>
        <h2 className="text-2xl font-bold mb-4">لیست محصولات</h2>
        <div className="overflow-auto rounded-lg shadow-lg">
          <table className="min-w-full border border-gray-200">
            <thead className="border">
              <tr>
                <th className="px-4 py-2 font-bold text-right">شناسه</th>
                <th className="px-4 py-2 font-bold text-right">عنوان</th>
                <th className="px-4 py-2 font-bold text-right">تصویر</th>
                <th className="px-4 py-2 font-bold text-right">موجودی</th>
                <th className="px-4 py-2 font-bold text-right">قیمت</th>
                <th className="px-4 py-2 font-bold text-right">تاریخ ایجاد</th>
                <th className="px-4 py-2 font-bold text-right">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product._id} className="hover:bg-gray-800">
                  <td className="px-4 py-2 text-right border border-gray-300">{digitsEnToFa(index + 1)}</td>
                  <td className="px-4 py-2 text-right border border-gray-300">{product.title}</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <img
                      src={`${product.image}?t=${new Date().getTime()}`}
                      alt={product.title}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-2 text-right border border-gray-300">{digitsEnToFa(product.quantity)}</td>
                  <td className="px-4 py-2 text-right border border-gray-300">{digitsEnToFa(product.price)}</td>
                  <td className="px-4 py-2 text-right border border-gray-300">
                    {new Date(product.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="px-4 py-2 text-right border border-gray-300">
                    <button className="text-green-500 hover:text-green-700 font-bold ml-2"
                      onClick={() => handleEdit(product._id)}>
                      ویرایش
                    </button>
                    <EditProductModal
                      isOpen={isEditModalOpen}
                      productToEdit={productToEdit}
                      setIsEditModalOpen={setIsEditModalOpen}
                      updateProduct={(updatedProduct) => {
                        setProducts((prevProducts) =>
                          prevProducts.map((product) =>
                            product._id === updatedProduct._id ? updatedProduct : product
                          )
                        );
                      }}
                    />
                    <button className="text-red-500 hover:text-red-700 font-bold"
                      onClick={() => openConfirmModal(product._id)}>
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

export default products