import { useMemo, useState } from 'react'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'
import './ProductList.css'

export default function ProductList() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const categories = useMemo(
    () => ['All', ...new Set(products.map((p) => p.category))],
    [],
  )

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = category === 'All' || p.category === category
      return matchesQuery && matchesCategory
    })
  }, [query, category])

  return (
    <main className="product-list-page">
      <div className="product-list-page__controls">
        <input
          type="search"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="product-list-page__search"
          aria-label="Search products"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="product-list-page__category"
          aria-label="Filter by category"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="product-list-page__empty">No products found.</p>
      ) : (
        <div className="product-list-page__grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}
