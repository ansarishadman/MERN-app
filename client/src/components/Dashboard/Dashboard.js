import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import jwt from 'jsonwebtoken'
import Category from '../Category/Category.js';
import { categoryAPI } from '../../constants/constants.js';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([])
    const navigate = useNavigate();
    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const user = jwt.decode(token);
                    console.log(user)
                    if (!user) {
                        localStorage.removeItem('token');
                        navigate('/login', { replace: true });
                    } else {
                        await fetchCategories();
                    }
                } catch (error) {
                    console.error('Invalid token:', error);
                    localStorage.removeItem('token');
                    navigate('/login', { replace: true });
                }
            } else {
                navigate('/login', { replace: true });
            }
            setLoading(false);
        };

        checkUser();
    }, [])

    async function fetchCategories() {
        try {
            const response = await fetch(`${categoryAPI}`);
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
            const response = await fetch(`${categoryAPI}/${categoryId}`, {
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

    const deleteCategory = async (e, category) => {
        e.stopPropagation();
        const { _id: categoryId, name } = category

        let confirmDelete = window.confirm(`Delete ${name} Category and its Sub-Category?`)
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${categoryAPI}/${categoryId}`, {
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

    const addCategory = async (e, parentId) => {
        e.stopPropagation();
        let newCategoryName = window.prompt(`Enter ${!parentId ? 'parent' : ''} category name!`);
        if (!newCategoryName) return;

        let newCategory = { name: newCategoryName, parent: parentId }
        try {
            const response = await fetch(`${categoryAPI}`, {
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

    const logout = () => {
        localStorage.removeItem('token')
        navigate('/login', { replace: true })
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
                            <button className='ml-4 text-green-700 text-sm hover:text-blue-500 border border-green-700 p-1 rounded' onClick={e => addCategory(e, null)}>Add Parent</button>
                        </div></div>
                    <div className='pl-4 pb-20'>
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
                    <div className='min-h-screen flex flex-col'>
                        <div className='flex justify-end p-4'>
                            <button className='text-red-700 text-sm hover:text-blue-500 border border-red-700 p-1 rounded' onClick={logout}>
                                Logout
                            </button>
                        </div>
                        <div className='flex-grow flex items-center justify-center'>
                            <div className='text-2xl'>
                                Category Application to Add/Delete/Edit categories!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard