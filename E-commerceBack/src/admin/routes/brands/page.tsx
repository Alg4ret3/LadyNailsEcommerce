import {
  Container,
  Heading,
  Button,
  Table,
  Input,
  Prompt
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
      <div className="flex flex-col gap-y-4 md:flex-row md:items-center md:justify-between px-6 py-4">
        <Heading level="h1">Marcas</Heading>

        <div className="flex flex-col gap-2 w-full md:w-auto md:flex-row">
          <Input
            placeholder="Nombre de la marca"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Button onClick={createBrand}>
            Crear
          </Button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="flex flex-col gap-y-4 md:flex-row md:items-center md:justify-between px-6 py-4">
        <Input
          placeholder="Buscar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Nombre</Table.HeaderCell>
              <Table.HeaderCell>Creado</Table.HeaderCell>
              <Table.HeaderCell>Actualizado</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filtered.map((brand) => (
              <Table.Row key={brand.id}>
                <Table.Cell className="whitespace-nowrap">{brand.name}</Table.Cell>

                <Table.Cell className="whitespace-nowrap">
                  {brand.created_at
                    ? new Date(brand.created_at).toLocaleDateString()
                    : "-"}
                </Table.Cell>

                <Table.Cell className="whitespace-nowrap">
                  {brand.updated_at
                    ? new Date(brand.updated_at).toLocaleDateString()
                    : "-"}
                </Table.Cell>

                <Table.Cell className="text-right">
                  <Prompt>
                    <Prompt.Trigger asChild>
                      <Button
                        size="small"
                        variant="secondary"
                      >
                        Eliminar
                      </Button>
                    </Prompt.Trigger>
                    <Prompt.Content>
                      <Prompt.Header>
                        <Prompt.Title>Confirmar Eliminación</Prompt.Title>
                        <Prompt.Description>
                          ¿Estás seguro de que deseas eliminar la marca <strong>{brand.name}</strong>? Esta acción no se puede deshacer.
                        </Prompt.Description>
                      </Prompt.Header>
                      <Prompt.Footer>
                        <Prompt.Cancel>Cancelar</Prompt.Cancel>
                        <Prompt.Action onClick={() => deleteBrand(brand.id)}>
                          Eliminar
                        </Prompt.Action>
                      </Prompt.Footer>
                    </Prompt.Content>
                  </Prompt>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Marcas",
  icon: Tag,
})