import { 
  Container, 
  Heading, 
  Button, 
  Table, 
  Text,
  StatusBadge,
  toast,
  Prompt,
  Input,
  Label
} from "@medusajs/ui"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ArrowDownTray, ArrowUpTray, CircleStack, Spinner, ArrowPath } from "@medusajs/icons"
import { useEffect, useState, useRef } from "react"

type Backup = {
  name: string
  url: string
  created_at: string
  size: number
}

export default function BackupsPage() {
  const [backups, setBackups] = useState<Backup[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [confirmRestore, setConfirmRestore] = useState<{
    show: boolean,
    type: "file" | "url",
    data?: any
  }>({ show: false, type: "file" })
  const [password, setPassword] = useState("")
  const [verifying, setVerifying] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadBackups = async () => {
    setRefreshing(true)
    try {
      const res = await fetch("/admin/backups")
      const data = await res.json()
      if (data.backups) {
        setBackups(data.backups.sort((a: Backup, b: Backup) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ))
      }
    } catch (error: any) {
      toast.error("Error", {
        description: "No se pudieron cargar los backups"
      })
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadBackups()
  }, [])

  const triggerBackup = async () => {
    setLoading(true)
    try {
      const res = await fetch("/admin/backups", { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        toast.success("Éxito", {
          description: `Backup generado: ${data.backup?.filename || 'Completado'}`
        })
        loadBackups()
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      toast.error("Error", {
        description: "Falló la generación del backup: " + error.message
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setConfirmRestore({
      show: true,
      type: "file",
      data: file
    })
  }

  const executeFileRestore = async (file: File) => {
    setRestoring(true)
    return new Promise<void>((resolve, reject) => {
      try {
        const reader = new FileReader()
        reader.onload = async () => {
          try {
            const base64 = (reader.result as string).split(",")[1]
            const res = await fetch("/admin/backups/import", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ file: base64, filename: file.name })
            })
            const data = await res.json()
            if (res.ok) {
              toast.success("Éxito", {
                description: "Base de datos restaurada correctamente"
              })
              resolve()
            } else {
              throw new Error(data.message)
            }
          } catch (error: any) {
            toast.error("Error", {
              description: "Error al restaurar: " + error.message
            })
            reject(error)
          } finally {
            setRestoring(false)
            if (fileInputRef.current) fileInputRef.current.value = ""
            setConfirmRestore(prev => ({ ...prev, show: false }))
          }
        }
        reader.onerror = () => {
          setRestoring(false)
          reject(new Error("Error al leer el archivo"))
        }
        reader.readAsDataURL(file)
      } catch (error: any) {
        setRestoring(false)
        reject(error)
      }
    })
  }

  const handleRestoreFromUrl = (url: string, name: string) => {
    setConfirmRestore({
      show: true,
      type: "url",
      data: { url, name }
    })
  }

  const executeUrlRestore = async (url: string, name: string) => {
    setRestoring(true)
    try {
      const res = await fetch("/admin/backups/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, filename: name })
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("Éxito", {
          description: "Base de datos restaurada correctamente desde la nube"
        })
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      toast.error("Error", {
        description: "Error al restaurar: " + error.message
      })
    } finally {
      setRestoring(false)
      setConfirmRestore(prev => ({ ...prev, show: false }))
    }
  }

  const handleConfirmRestore = async () => {
    if (!password) {
      toast.error("Error", {
        description: "Por favor, ingresa tu contraseña para continuar"
      })
      return
    }

    setVerifying(true)
    try {
      const res = await fetch("/admin/auth/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Contraseña incorrecta")
      }

      // If password is correct, proceed with restore
      if (confirmRestore.type === "file") {
        await executeFileRestore(confirmRestore.data)
      } else {
        await executeUrlRestore(confirmRestore.data.url, confirmRestore.data.name)
      }
      
      setPassword("") // Clear password on success
    } catch (error: any) {
      toast.error("Error de verificación", {
        description: error.message
      })
    } finally {
      setVerifying(false)
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex flex-col gap-y-4 md:flex-row md:items-center md:justify-between px-6 py-4">
        <div>
          <Heading level="h1">Backups de Base de Datos</Heading>
          <Text className="text-ui-fg-subtle">
            Gestiona las copias de seguridad de toda tu tienda Lady Nails.
          </Text>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-auto md:flex-row">
          <input 
            type="file" 
            accept=".sql" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload}
          />
          <Button 
            variant="secondary" 
            onClick={() => fileInputRef.current?.click()}
            disabled={restoring}
          >
            {restoring ? <Spinner className="animate-spin" /> : <ArrowUpTray />}
            Importar SQL
          </Button>
          
          <Button onClick={triggerBackup} disabled={loading}>
            {loading ? <Spinner className="animate-spin" /> : <CircleStack />}
            Generar Backup Ahora
          </Button>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex flex-col gap-y-2 md:flex-row md:items-center md:justify-between mb-4">
          <Heading level="h2">Historial de Backups (Cloudinary)</Heading>
          <Button variant="transparent" onClick={loadBackups} disabled={refreshing}>
            {refreshing ? "Cargando..." : "Refrescar"}
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Nombre del Archivo</Table.HeaderCell>
                <Table.HeaderCell>Fecha</Table.HeaderCell>
                <Table.HeaderCell>Tamaño</Table.HeaderCell>
                <Table.HeaderCell>Estado</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {backups.map((backup) => (
                <Table.Row key={backup.name}>
                  <Table.Cell className="font-mono text-xs whitespace-nowrap">{backup.name}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{new Date(backup.created_at).toLocaleString()}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap">{formatSize(backup.size)}</Table.Cell>
                  <Table.Cell>
                    <StatusBadge color="green">Almacenado</StatusBadge>
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button 
                        variant="secondary" 
                        size="small"
                        onClick={() => handleRestoreFromUrl(backup.url, backup.name)}
                        disabled={restoring}
                      >
                        {restoring ? <Spinner className="animate-spin" /> : <ArrowPath />}
                        <span className="hidden sm:inline">Restaurar</span>
                      </Button>
                      <a href={backup.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="secondary" size="small">
                          <ArrowDownTray />
                          <span className="hidden sm:inline">Descargar</span>
                        </Button>
                      </a>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
              {backups.length === 0 && !refreshing && (
                <Table.Row>
                  <Table.Cell {...({ colSpan: 5 } as any)} className="text-center py-8">
                    <Text className="text-ui-fg-muted">No se encontraron backups en la nube.</Text>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
      </div>

      <div className="px-6 py-4 bg-ui-bg-subtle">
        <Heading level="h3" className="mb-2">Información del Sistema</Heading>
        <Text className="text-sm">
          Los backups automáticos se realizan cada domingo a las 00:00 y se guardan en la carpeta 
          <strong> backups</strong> de Cloudinary. El proceso incluye toda la base de datos PostgreSQL.
        </Text>
      </div>

      <Prompt 
        open={confirmRestore.show} 
        onOpenChange={(open) => {
          if (!open) {
            setConfirmRestore(p => ({ ...p, show: false }))
            setPassword("")
          }
        }}
      >
        <Prompt.Content>
          <Prompt.Header>
            <Prompt.Title>Confirmar Restauración</Prompt.Title>
            <Prompt.Description>
              {confirmRestore.type === "file" 
                ? "¿Estás seguro de que deseas restaurar la base de datos desde este archivo? Esto sobrescribirá todos los datos actuales."
                : `¿Estás seguro de que deseas restaurar la base de datos usando el backup "${confirmRestore.data?.name}"? Esto sobrescribirá todos los datos actuales.`
              }
            </Prompt.Description>
          </Prompt.Header>
          
          <div className="flex flex-col gap-y-2 px-6 py-4 border-y">
            <Label htmlFor="password">Verificar Contraseña</Label>
            <Input 
              id="password"
              type="password" 
              placeholder="Ingresa tu contraseña de administrador" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !verifying && !restoring) {
                  handleConfirmRestore()
                }
              }}
            />
            <Text className="text-xs text-ui-fg-subtle">
              Esta es una acción crítica. Por favor, confirma tu identidad.
            </Text>
          </div>

          <Prompt.Footer>
            <Prompt.Cancel onClick={() => {
              if (fileInputRef.current) fileInputRef.current.value = ""
              setPassword("")
            }}>
              Cancelar
            </Prompt.Cancel>
            <Prompt.Action 
              onClick={handleConfirmRestore}
              disabled={verifying || restoring || !password}
            >
              {verifying || restoring ? "Procesando..." : "Restaurar Ahora"}
            </Prompt.Action>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Backups",
  icon: CircleStack,
})
