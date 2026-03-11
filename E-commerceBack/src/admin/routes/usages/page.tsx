import {
    Container,
    Heading,
    Button,
    Table,
    Input
} from "@medusajs/ui"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ListBullet } from "@medusajs/icons"
import { useEffect, useState } from "react"

type Usage = {
    id: string
    name: string
    created_at?: string
    updated_at?: string
}

export default function UsagesPage() {
    const [usages, setUsages] = useState<Usage[]>([])
    const [name, setName] = useState("")
    const [search, setSearch] = useState("")

    const loadUsages = async () => {
        const res = await fetch("/admin/usages")
        const data = await res.json()
        setUsages(data.usages || [])
    }

    useEffect(() => {
        loadUsages()
    }, [])

    const createUsage = async () => {
        if (!name) return

        await fetch("/admin/usages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name }),
        })

        setName("")
        loadUsages()
    }

    const deleteUsage = async (id: string) => {
        await fetch(`/admin/usages/${id}`, {
            method: "DELETE",
        })

        loadUsages()
    }

    const filtered = usages.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <Container className="divide-y p-0">
            <div className="flex items-center justify-between px-6 py-4">
                <Heading level="h1">Usages</Heading>

                <div className="flex gap-2">
                    <Input
                        placeholder="Modo de uso"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Button onClick={createUsage}>
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
                    {filtered.map((usage) => (
                        <Table.Row key={usage.id}>
                            <Table.Cell>{usage.name}</Table.Cell>

                            <Table.Cell>
                                {usage.created_at
                                    ? new Date(usage.created_at).toLocaleDateString()
                                    : "-"}
                            </Table.Cell>

                            <Table.Cell>
                                {usage.updated_at
                                    ? new Date(usage.updated_at).toLocaleDateString()
                                    : "-"}
                            </Table.Cell>

                            <Table.Cell className="text-right">
                                <Button
                                    size="small"
                                    variant="secondary"
                                    onClick={() => deleteUsage(usage.id)}
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
    label: "Usages",
    icon: ListBullet,
})
