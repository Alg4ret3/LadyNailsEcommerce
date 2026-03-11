import {
    Container,
    Heading,
    Button,
    Table,
    Input
} from "@medusajs/ui"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { HandTruck } from "@medusajs/icons"
import { useEffect, useState } from "react"

type Shipping = {
    id: string
    name: string
    created_at?: string
    updated_at?: string
}

export default function ShippingsPage() {
    const [shippings, setShippings] = useState<Shipping[]>([])
    const [name, setName] = useState("")
    const [search, setSearch] = useState("")

    const loadShippings = async () => {
        const res = await fetch("/admin/shippings")
        const data = await res.json()
        setShippings(data.shippings || [])
    }

    useEffect(() => {
        loadShippings()
    }, [])

    const createShipping = async () => {
        if (!name) return

        await fetch("/admin/shippings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name }),
        })

        setName("")
        loadShippings()
    }

    const deleteShipping = async (id: string) => {
        await fetch(`/admin/shippings/${id}`, {
            method: "DELETE",
        })

        loadShippings()
    }

    const filtered = shippings.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <Container className="divide-y p-0">
            <div className="flex items-center justify-between px-6 py-4">
                <Heading level="h1">Envíos</Heading>

                <div className="flex gap-2">
                    <Input
                        placeholder="Nombre del envío"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Button onClick={createShipping}>
                        Crear
                    </Button>
                </div>
            </div>

            <div className="px-6 py-4">
                <Input
                    placeholder="Buscar"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

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
                    {filtered.map((shipping) => (
                        <Table.Row key={shipping.id}>
                            <Table.Cell>{shipping.name}</Table.Cell>

                            <Table.Cell>
                                {shipping.created_at
                                    ? new Date(shipping.created_at).toLocaleDateString()
                                    : "-"}
                            </Table.Cell>

                            <Table.Cell>
                                {shipping.updated_at
                                    ? new Date(shipping.updated_at).toLocaleDateString()
                                    : "-"}
                            </Table.Cell>

                            <Table.Cell className="text-right">
                                <Button
                                    size="small"
                                    variant="secondary"
                                    onClick={() => deleteShipping(shipping.id)}
                                >
                                    Eliminar
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
    label: "Envíos",
    icon: HandTruck,
})
