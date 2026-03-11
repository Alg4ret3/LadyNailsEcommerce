import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Select, Button, Text, toast } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { PencilSquare, XCircle, Tag, CubeSolid, HandTruck, ShieldCheck } from "@medusajs/icons"

type Option = {
  id: string
  name: string
}

const ProductAttributesWidget = (props: any) => {
  const product = props?.data

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const [brands, setBrands] = useState<Option[]>([])
  const [shippings, setShippings] = useState<Option[]>([])
  const [usages, setUsages] = useState<Option[]>([])
  const [warranties, setWarranties] = useState<Option[]>([])

  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null)
  const [selectedUsage, setSelectedUsage] = useState<string | null>(null)
  const [selectedWarranty, setSelectedWarranty] = useState<string | null>(null)

  useEffect(() => {
    loadAllOptions()
    if (product?.id) {
      loadProductAttributes()
    }
  }, [product?.id])

  const loadAllOptions = async () => {
    try {
      const [brandRes, shippingRes, usageRes, warrantyRes] = await Promise.all([
        fetch("/admin/brands"),
        fetch("/admin/shippings"),
        fetch("/admin/usages"),
        fetch("/admin/warranties")
      ])

      const [brandJson, shippingJson, usageJson, warrantyJson] = await Promise.all([
        brandRes.json(),
        shippingRes.json(),
        usageRes.json(),
        warrantyRes.json()
      ])

      setBrands(brandJson.brands || [])
      setShippings(shippingJson.shippings || [])
      setUsages(usageJson.usages || [])
      setWarranties(warrantyJson.warranties || [])
    } catch (error) {
      console.error("Error loading options", error)
    }
  }

  const loadProductAttributes = async () => {
    try {
      const [brandRes, shippingRes, usageRes, warrantyRes] = await Promise.all([
        fetch(`/admin/products/${product.id}/brand`),
        fetch(`/admin/products/${product.id}/shipping`),
        fetch(`/admin/products/${product.id}/usage`),
        fetch(`/admin/products/${product.id}/warranty`)
      ])

      const [brandJson, shippingJson, usageJson, warrantyJson] = await Promise.all([
        brandRes.json(),
        shippingRes.json(),
        usageRes.json(),
        warrantyRes.json()
      ])

      setSelectedBrand(brandJson.brand?.id || null)
      setSelectedShipping(shippingJson.shipping?.id || null)
      setSelectedUsage(usageJson.usage?.id || null)
      setSelectedWarranty(warrantyJson.warranty?.id || null)
    } catch (error) {
      console.error("Error loading product attributes", error)
    }
  }

  const handleUpdate = async (type: string, value: string) => {
    if (!product?.id) return
    
    setLoading(true)
    try {
      const body: any = {}
      body[`${type}_id`] = value

      const res = await fetch(`/admin/products/${product.id}/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        if (type === "brand") setSelectedBrand(value)
        if (type === "shipping") setSelectedShipping(value)
        if (type === "usage") setSelectedUsage(value)
        if (type === "warranty") setSelectedWarranty(value)
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} actualizado`)
      } else {
        toast.error(`Error al actualizar ${type}`)
      }
    } catch (error) {
      toast.error(`Error de red al actualizar ${type}`)
    } finally {
      setLoading(false)
    }
  }

  const getOptionName = (options: Option[], id: string | null) => {
    return options.find(o => o.id === id)?.name || "-"
  }

  const AttributeRow = ({ icon: Icon, label, value, options, selectedValue, onUpdate, type }: any) => (
    <div className="flex flex-col gap-2 p-3 rounded-lg hover:bg-ui-bg-subtle transition-colors">
      <div className="flex items-center gap-2">
        <Icon className="text-ui-fg-subtle" />
        <Text className="text-ui-fg-subtle text-small font-medium">{label}</Text>
      </div>
      {isEditing ? (
        <Select 
          value={selectedValue ?? ""} 
          onValueChange={(v) => onUpdate(type, v)}
          disabled={loading}
        >
          <Select.Trigger>
            <Select.Value placeholder={`Seleccionar ${label.toLowerCase()}`} />
          </Select.Trigger>
          <Select.Content>
            {options.map((o: any) => (
              <Select.Item key={o.id} value={o.id}>{o.name}</Select.Item>
            ))}
          </Select.Content>
        </Select>
      ) : (
        <Text className="text-ui-fg-base font-semibold pl-6">{value}</Text>
      )}
    </div>
  )

  return (
    <Container className="p-0 overflow-hidden shadow-elevation-card-rest">
      <div className="flex items-center justify-between px-6 py-4 border-b bg-ui-bg-base">
        <div className="flex flex-col">
          <Heading level="h2" className="text-ui-fg-base">Atributos del Producto</Heading>
          <Text className="text-ui-fg-subtle text-small">Relaciones personalizadas para Lady Nails</Text>
        </div>
        <Button 
          variant="secondary" 
          size="small" 
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <span className="flex items-center gap-2"><XCircle /> Cancelar</span>
          ) : (
            <span className="flex items-center gap-2"><PencilSquare /> Editar</span>
          )}
        </Button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <AttributeRow 
          type="brand"
          icon={Tag}
          label="Marca" 
          value={getOptionName(brands, selectedBrand)}
          options={brands}
          selectedValue={selectedBrand}
          onUpdate={handleUpdate}
        />
        <AttributeRow 
          type="usage"
          icon={CubeSolid}
          label="Modo de Uso" 
          value={getOptionName(usages, selectedUsage)}
          options={usages}
          selectedValue={selectedUsage}
          onUpdate={handleUpdate}
        />
        <AttributeRow 
          type="shipping"
          icon={HandTruck}
          label="Tipo de Envío" 
          value={getOptionName(shippings, selectedShipping)}
          options={shippings}
          selectedValue={selectedShipping}
          onUpdate={handleUpdate}
        />
        <AttributeRow 
          type="warranty"
          icon={ShieldCheck}
          label="Garantía" 
          value={getOptionName(warranties, selectedWarranty)}
          options={warranties}
          selectedValue={selectedWarranty}
          onUpdate={handleUpdate}
        />
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductAttributesWidget
