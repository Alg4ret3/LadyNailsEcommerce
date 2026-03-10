import { 
  Container, 
  Heading, 
  Button, 
  Table, 
  Input 
} from "@medusajs/ui"

import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Tag } from "@medusajs/icons"

import { useEffect, useState } from "react"

type Brand = {
  id: string
  name: string
  created_at?: string
  updated_at?: string
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [name, setName] = useState("")
  const [search, setSearch] = useState("")

  const loadBrands = async () => {
    const res = await fetch("/admin/brands")
    const data = await res.json()
    setBrands(data.brands)
  }

  useEffect(() => {
    loadBrands()
  }, [])

  const createBrand = async () => {
    if (!name) return

    await fetch("/admin/brands", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    })

    setName("")
    loadBrands()
  }

  const deleteBrand = async (id: string) => {
    await fetch(`/admin/brands/${id}`, {
      method: "DELETE",
    })

    loadBrands()
  }

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Container className="divide-y p-0">

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h1">Brands</Heading>

        <div className="flex gap-2">
          <Input
            placeholder="Brand name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Button onClick={createBrand}>
            Create
          </Button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="flex items-center justify-between px-6 py-4">
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Created</Table.HeaderCell>
            <Table.HeaderCell>Updated</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {filtered.map((brand) => (
            <Table.Row key={brand.id}>
              <Table.Cell>{brand.name}</Table.Cell>

              <Table.Cell>
                {brand.created_at
                  ? new Date(brand.created_at).toLocaleDateString()
                  : "-"}
              </Table.Cell>

              <Table.Cell>
                {brand.updated_at
                  ? new Date(brand.updated_at).toLocaleDateString()
                  : "-"}
              </Table.Cell>

              <Table.Cell className="text-right">
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => deleteBrand(brand.id)}
                >
                  Delete
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Brands",
  icon: Tag,
})