import {
    Container,
    Heading,
    Button,
    Table,
    Input,
    Prompt
} from "@medusajs/ui"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ShieldCheck } from "@medusajs/icons"
import { useEffect, useState } from "react"

type Warranty = {
    id: string
    name: string
    created_at?: string
    updated_at?: string
}

export default function WarrantiesPage() {
    const [warranties, setWarranties] = useState<Warranty[]>([])
    const [name, setName] = useState("")
    const [search, setSearch] = useState("")

    const loadWarranties = async () => {
        const res = await fetch("/admin/warranties")
        const data = await res.json()
        setWarranties(data.warranties || [])
    }

    useEffect(() => {
        loadWarranties()
    }, [])

    const createWarranty = async () => {
        if (!name) return

        await fetch("/admin/warranties", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name }),
        })

        setName("")
        loadWarranties()
    }

    const deleteWarranty = async (id: string) => {
        await fetch(`/admin/warranties/${id}`, {
            method: "DELETE",
        })

        loadWarranties()
    }

    const filtered = warranties.filter((w) =>
        w.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <Container className="divide-y p-0">
            <div className="flex flex-col gap-y-4 md:flex-row md:items-center md:justify-between px-6 py-4">
                <Heading level="h1">Garantías</Heading>

                <div className="flex flex-col gap-2 w-full md:w-auto md:flex-row">
                    <Input
                        placeholder="Nombre de la garantía"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Button onClick={createWarranty}>
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
                        {filtered.map((warranty) => (
                            <Table.Row key={warranty.id}>
                                <Table.Cell className="whitespace-nowrap">{warranty.name}</Table.Cell>

                                <Table.Cell className="whitespace-nowrap">
                                    {warranty.created_at
                                        ? new Date(warranty.created_at).toLocaleDateString()
                                        : "-"}
                                </Table.Cell>

                                <Table.Cell className="whitespace-nowrap">
                                    {warranty.updated_at
                                        ? new Date(warranty.updated_at).toLocaleDateString()
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
                                                    ¿Estás seguro de que deseas eliminar la garantía <strong>{warranty.name}</strong>? Esta acción no se puede deshacer.
                                                </Prompt.Description>
                                            </Prompt.Header>
                                            <Prompt.Footer>
                                                <Prompt.Cancel>Cancelar</Prompt.Cancel>
                                                <Prompt.Action onClick={() => deleteWarranty(warranty.id)}>
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
    label: "Garantías",
    icon: ShieldCheck,
})
