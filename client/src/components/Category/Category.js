import React, { useState } from 'react'

const Category = ({ category, deleteCategory, addCategory, editCategory }) => {
    const [expand, setExpand] = useState(true)

    return (
        <div className='text-black'>
            <div className='text-base font-semibold cursor-pointer'
                onClick={() => setExpand(!expand)} key={category.id}>
                {category.subCategory.length > 0 ? '>  ' : ''}{category.name}
                <span className='pl-4 text-xs' onClick={e => deleteCategory(e, category._id)}>❌</span>
                <span className='pl-4 text-xs' onClick={e => addCategory(e, category._id)}>➕</span>
                <span className='pl-4 text-xs'
                    onClick={e => editCategory(e, category._id, category.parent)}>🖊</span>
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