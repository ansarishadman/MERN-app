import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import jwt from 'jsonwebtoken'
import Category from '../Category/Category.js';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([])
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            const user = jwt.decode(token)
            if (!user) {
                localStorage.removeItem('token')
                navigate('/login', { replace: true })
            }

            fetchCategories()
        }
    }, [])

    async function fetchCategories() {
        try {
            const response = await fetch('http://127.0.0.1:1337/api/categories');
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            console.log(data)
            setCategories(data);
        } catch (err) {
            console.log(err.message);
        } finally {
            setLoading(false);
        }
    }

    const editCategory = async (e, categoryId, parentId) => {
        e.stopPropagation();
        const updatedName = window.prompt('Edit name');
        if (!updatedName) return;

        let updatedCategory = { name: updatedName, parent: parentId }
        try {
            const response = await fetch(`http://127.0.0.1:1337/api/categories/${categoryId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(updatedCategory)
            });
            
            if (!response.ok) {
              throw new Error('Failed to add category');
            }
        
            const data = await response.json();
            fetchCategories()
            console.log('Category added successfully:', data);
            return data;
          } catch (error) {
            console.error('Error adding category:', error);
            throw error;
          }
    }

    const deleteCategory = async (e, categoryId) => {
        e.stopPropagation();
        try {
            const response = await fetch(`http://127.0.0.1:1337/api/categories/${categoryId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                console.log('Category deleted successfully');
                fetchCategories()
            } else {
                console.error('Error deleting category:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    }

    const addParentCategory = async (e) => {
        e.stopPropagation();
        const parentName = window.prompt('Enter parent name');
        if (!parentName) return;

        let newCategory = { name: parentName, parent: null }
        try {
            const response = await fetch('http://127.0.0.1:1337/api/categories', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(newCategory)
            });
            
            if (!response.ok) {
              throw new Error('Failed to add category');
            }
        
            const data = await response.json();
            fetchCategories()
            console.log('Category added successfully:', data);
            return data;
          } catch (error) {
            console.error('Error adding category:', error);
            throw error;
          }
    }

    const addCategory = async (e, parentId) => {
        e.stopPropagation();
        let newCategoryName = window.prompt('Enter category name!');
        if (!newCategoryName) return;

        let newCategory = { name: newCategoryName, parent: parentId }
        try {
            const response = await fetch('http://127.0.0.1:1337/api/categories', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(newCategory)
            });
            
            if (!response.ok) {
              throw new Error('Failed to add category');
            }
        
            const data = await response.json();
            fetchCategories()
            console.log('Category added successfully:', data);
            return data;
          } catch (error) {
            console.error('Error adding category:', error);
            throw error;
          }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='h-screen'>
            <div className='grid grid-cols-10 h-full'>
                <div className='col-span-3 bg-white-500'>
                    <div className='text-black text-center p-4'>
                        <div className='text-xl font-semibold'>Tree Catalogue!
                    <button className='ml-4 text-green-700 text-sm hover:text-white border border-green-700 p-1 rounded' onClick={addParentCategory}>Add Parent</button>
                    </div></div>
                    <div className='pl-4 pb-10'>
                        {categories.map(category => {
                            return <Category
                                editCategory={editCategory}
                                addCategory={addCategory}
                                deleteCategory={deleteCategory}
                                key={category._id} category={category} /> 
                        })}
                    </div>
                </div>
                <div className='col-span-7 bg-green-100'>
                    <div className='min-h-screen flex items-center justify-center '>
                        <div className='col-span-7 text-2xl flex items-center justify-center'>
                            Category Application to Add/ Delete/ Edit categories!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard