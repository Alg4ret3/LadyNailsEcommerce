import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Select } from "@medusajs/ui"
import { useEffect, useState } from "react"

type Brand = {
  id: string
  name: string
}

const ProductBrandWidget = (props: any) => {
  const product = props?.data

  const [brands, setBrands] = useState<Brand[]>([])
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    loadBrands()

    if (product?.id) {
      loadProductBrand()
    }
  }, [product?.id])

  const loadProductBrand = async () => {
    const res = await fetch(`/admin/products/${product.id}/brand`)
    const json = await res.json()

    if (json.brand) {
      setSelected(json.brand.id)
    }
  }

  const loadBrands = async () => {
    const res = await fetch("/admin/brands")
    const json = await res.json()
    setBrands(json.brands)
  }

  const setBrand = async (brandId: string) => {
    if (!product?.id) return

    setSelected(brandId)

    await fetch(`/admin/products/${product.id}/brand`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        brand_id: brandId,
      }),
    })
  }

  return (
    <Container>
      <Heading level="h2">Brand</Heading>

      <Select
        disabled={!product?.id}
        value={selected ?? ""}
        onValueChange={(v) => setBrand(v)}
      >
        <Select.Trigger>
          <Select.Value placeholder="Select brand" />
        </Select.Trigger>

        <Select.Content>
          {brands.map((brand) => (
            <Select.Item key={brand.id} value={brand.id}>
              {brand.name}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductBrandWidget