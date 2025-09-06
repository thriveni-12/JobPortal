import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App.jsx'
import { describe, it, expect } from 'vitest'

describe('App smoke', () => {
  it('renders brand', () => {
    render(<MemoryRouter><App/></MemoryRouter>)
    expect(screen.getByText(/Colorful Job Portal/i)).toBeInTheDocument()
  })
})
