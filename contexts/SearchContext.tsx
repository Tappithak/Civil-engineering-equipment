// contexts/SearchContext.tsx
'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'

interface SearchContextType {
  searchValue: string
  setSearchValue: (value: string) => void
  filteredResults: any[]
  setFilteredResults: (results: any[]) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchValue, setSearchValue] = useState('')
  const [filteredResults, setFilteredResults] = useState<any[]>([])

  return (
    <SearchContext.Provider 
      value={{ 
        searchValue, 
        setSearchValue, 
        filteredResults, 
        setFilteredResults 
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}