import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Category from './Category'

const mockCategory = {
    id: '1',
    _id: '1',
    name: 'Category 1',
    subCategory: [
        {
            id: '2',
            _id: '2',
            name: 'SubCategory 1-1',
            subCategory: []
        }
    ]
}

const mockDeleteCategory = jest.fn()
const mockAddCategory = jest.fn()
const mockEditCategory = jest.fn()

describe('Category Component', () => {
    test('renders the category name', () => {
        render(
            <Category 
                category={mockCategory}
                deleteCategory={mockDeleteCategory}
                addCategory={mockAddCategory}
                editCategory={mockEditCategory}
            />
        )
        
        expect(screen.getByText('Category 1')).toBeInTheDocument()
    })

    test('renders the subcategory name', () => {
        render(
            <Category 
                category={mockCategory}
                deleteCategory={mockDeleteCategory}
                addCategory={mockAddCategory}
                editCategory={mockEditCategory}
            />
        )
        
        expect(screen.getByText('SubCategory 1-1')).toBeInTheDocument()
    })

    test('expand and collapse functionality', () => {
        render(
            <Category 
                category={mockCategory}
                deleteCategory={mockDeleteCategory}
                addCategory={mockAddCategory}
                editCategory={mockEditCategory}
            />
        )
        
        const categoryName = screen.getByText('Category 1')
        
        expect(screen.getByText('SubCategory 1-1')).toBeVisible()

        fireEvent.click(categoryName)
        expect(screen.queryByText('SubCategory 1-1')).not.toBeVisible()

        fireEvent.click(categoryName)
        expect(screen.getByText('SubCategory 1-1')).toBeVisible()
    })

    test('add category callback', () => {
        render(
            <Category 
                category={mockCategory}
                deleteCategory={mockDeleteCategory}
                addCategory={mockAddCategory}
                editCategory={mockEditCategory}
            />
        )
        
        const addButton = screen.getAllByTestId('add')
        fireEvent.click(addButton[0])

        expect(mockAddCategory).toHaveBeenCalledWith(expect.anything(), '1')
    })

    test('edit category callback', () => {
        render(
            <Category 
                category={mockCategory}
                deleteCategory={mockDeleteCategory}
                addCategory={mockAddCategory}
                editCategory={mockEditCategory}
            />
        )
        
        const editButton = screen.getAllByTestId('edit')
        fireEvent.click(editButton[0])

        expect(mockEditCategory).toHaveBeenCalledWith(expect.anything(), '1', undefined)
    })

    test('delete category callback', () => {
        render(
            <Category 
                category={mockCategory}
                deleteCategory={mockDeleteCategory}
                addCategory={mockAddCategory}
                editCategory={mockEditCategory}
            />
        )
        
        const deleteButton = screen.getAllByTestId('delete')
        fireEvent.click(deleteButton[0])

        expect(mockDeleteCategory).toHaveBeenCalledWith(expect.anything(), mockCategory)
    })
})
