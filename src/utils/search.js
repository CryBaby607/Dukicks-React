export const searchProductsWithRelevance = (products, query) => {
  if (!Array.isArray(products) || !query?.trim()) return products

  const normalizedQuery = query.toLowerCase().trim()
  const queryWords = normalizedQuery.split(/\s+/)

  return products
    .map(p => {
      let score = 0
      const fields = [
        { value: (p.brand || '').toLowerCase(), weight: 10 },
        { value: (p.model || '').toLowerCase(), weight: 10 },
        { value: (p.name || '').toLowerCase(), weight: 8 },
        { value: (p.category || '').toLowerCase(), weight: 6 },
        { value: (p.description || '').toLowerCase(), weight: 3 },
        { value: (p.type || '').toLowerCase(), weight: 3 }
      ]

      fields.forEach(f => {
        if (f.value === normalizedQuery) score += f.weight * 5
        if (f.value.startsWith(normalizedQuery)) score += f.weight * 3
        if (f.value.includes(normalizedQuery)) score += f.weight * 2
        queryWords.forEach(w => {
          if (f.value.includes(w)) score += f.weight * 0.5
        })
      })

      return { ...p, relevanceScore: score }
    })
    .filter(p => p.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .map(({ relevanceScore, ...p }) => p)
}