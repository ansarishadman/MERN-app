import React, { useState } from 'react'

const Category = ({ category, deleteCategory, addCategory, editCategory }) => {
    const [expand, setExpand] = useState(true)

    const getDropdownIcon = () => {
        if (expand) return 'v ';
        if (!expand) return '> '
    }

    return (
        <div className='text-black'>
            <div className='text-base font-semibold cursor-pointer break-words'
                onClick={() => setExpand(!expand)} key={category.id}>
                <span className='text-green-800 text-2xl text-bold'>{category.subCategory.length > 0 ? getDropdownIcon() : ''}</span>
                <span className='text-blue-800 text-md'>{category.name}</span>
                <span className='pl-4 text-xs' data-testid='add' onClick={e => addCategory(e, category._id)}>➕</span>
                <span className='pl-4 text-xs' data-testid='edit'
                    onClick={e => editCategory(e, category._id, category.parent)}>🖊</span>
                <span className='pl-4 text-xs' data-testid='delete' onClick={e => deleteCategory(e, category)}>❌</span>
            </div>
            <div style={{ display: expand ? 'block' : 'none' }}>
                {category.subCategory.map(subCategory => (
                    <div key={subCategory._id}>
                        <div className='pl-8'>
                            <Category
                                addCategory={addCategory}
                                deleteCategory={deleteCategory}
                                key={subCategory._id}
                                category={subCategory}
                                editCategory={editCategory} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Category